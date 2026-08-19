const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const { GoogleGenAI } = require("@google/genai");
const https = require('https');

admin.initializeApp();
const db = admin.firestore();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// --- 1. SQUAD PUSH NOTIFICATION TRIGGER ---
exports.notifySquadOnExtraction = functions.firestore
    .document("users/{userId}")
    .onUpdate(async (change, context) => {
        const beforeData = change.before.data();
        const afterData = change.after.data();
        const userId = context.params.userId;

        const beforeSprites = beforeData.sprites || {};
        const afterSprites = afterData.sprites || {};

        let newlyCollected = null;

        for (const [spriteId, variants] of Object.entries(afterSprites)) {
            for (const [variantName, isCollected] of Object.entries(variants)) {
                if (isCollected && !(beforeSprites[spriteId] && beforeSprites[spriteId][variantName])) {
                    newlyCollected = { spriteId, variantName };
                    break;
                }
            }
            if (newlyCollected) break;
        }

        if (!newlyCollected) return null;

        const targetKey = `${newlyCollected.spriteId}_${newlyCollected.variantName}`;
        const userSpriteId = afterData.spriteId || "A squad member";
        const friendsList = afterData.friends || [];

        if (friendsList.length === 0) return null;

        const notifications = [];

        for (const friend of friendsList) {
            if (!friend.uid) continue;

            const friendDoc = await db.collection("users").doc(friend.uid).get();
            if (!friendDoc.exists) continue;

            const friendData = friendDoc.data();
            const friendTargets = friendData.extractionTargets || [];
            const friendDeviceToken = friendData.fcmToken;

            if (friendTargets.includes(targetKey) && friendDeviceToken) {
                const formattedVariant = newlyCollected.variantName.charAt(0).toUpperCase() + newlyCollected.variantName.slice(1);

                const payload = {
                    token: friendDeviceToken,
                    notification: {
                        title: "🎯 Target Acquired!",
                        body: `@${userSpriteId} just secured a ${formattedVariant} ${newlyCollected.spriteId.replace("-", " ")}. Squad up!`,
                    },
                    data: { route: "friends", matchedSprite: newlyCollected.spriteId }
                };
                notifications.push(admin.messaging().send(payload));
            }
        }

        if (notifications.length > 0) {
            try {
                await Promise.all(notifications);
                console.log(`Successfully sent ${notifications.length} match notifications.`);
            } catch (error) {
                console.error("Error sending push notifications:", error);
            }
        }
        return null;
    });

// --- 2. AI-GENERATED DAILY INTEL CRON JOB ---
exports.generateDailyIntel = functions.pubsub.schedule("0 0 * * *")
    .timeZone("America/Chicago")
    .onRun(async (context) => {

        try {
            const usersSnap = await db.collection("users").get();
            const totalUsers = usersSnap.size;

            if (totalUsers === 0) return null;

            const spriteCounts = {};
            const targetCounts = {};

            usersSnap.forEach(doc => {
                const data = doc.data();

                if (data.sprites) {
                    Object.entries(data.sprites).forEach(([spriteId, variants]) => {
                        if (typeof variants === "object") {
                            Object.entries(variants).forEach(([variantName, isCollected]) => {
                                if (isCollected) {
                                    const formattedName = `${variantName.toUpperCase()} ${spriteId.replace("-", " ")}`;
                                    spriteCounts[formattedName] = (spriteCounts[formattedName] || 0) + 1;
                                }
                            });
                        }
                    });
                }

                if (Array.isArray(data.extractionTargets)) {
                    data.extractionTargets.forEach(target => {
                        const formattedTarget = target.replace("_", " ").replace("-", " ");
                        targetCounts[formattedTarget] = (targetCounts[formattedTarget] || 0) + 1;
                    });
                }
            });

            const selectedHighlights = [];

            const availableSprites = Object.keys(spriteCounts);
            if (availableSprites.length > 0) {
                const shuffledSprites = availableSprites.sort(() => 0.5 - Math.random());
                const chosenSprites = shuffledSprites.slice(0, 2);
                chosenSprites.forEach(sprite => {
                    const count = spriteCounts[sprite];
                    const percentage = ((count / totalUsers) * 100).toFixed(1);
                    selectedHighlights.push(`${count} players (${percentage}% of total users) have collected ${sprite}`);
                });
            }

            const availableTargets = Object.keys(targetCounts);
            if (availableTargets.length > 0) {
                const randomTarget = availableTargets[Math.floor(Math.random() * availableTargets.length)];
                selectedHighlights.push(`${targetCounts[randomTarget]} collectors currently have "${randomTarget}" set as an active target`);
            }

            const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

            const prompt = `
        You are a clean, modern analytics copywriter for an app called Spritedex. 
        Here are today's randomized global highlights:
        - Total Registered Users: ${totalUsers}
        ${selectedHighlights.map(h => `- ${h}`).join("\n")}

        Write exactly 5 short, punchy, exciting 1-sentence community facts to show players the app is active. 

        Structure them precisely as follows (one sentence per line, exactly 5 lines total):
        - Line 1: A community growth stat using the total user count.
        - Line 2: A collection highlight based on one of the provided sprite stats.
        - Line 3: A rarity percentage highlight based on one of the provided stats.
        - Line 4: A spotlight on the extraction target stat provided.
        - Line 5: A helpful gameplay or app feature tip for using Spritedex.

        Strict Rules:
        1. Keep them extremely concise and direct (under 15 words each).
        2. Do NOT use sci-fi, military, or tactical jargon (avoid words like "operatives", "agents", "grid", "combat", "transmission", "alert", or "network").
        3. Do not use bullet points or numbers. Just return the 5 sentences separated by a new line.
      `;

            const response = await ai.models.generateContent({
                model: 'gemini-3.6-flash',
                contents: prompt
            });

            const text = response.text;
            const intelArray = text.split('\n').filter(line => line.trim().length > 0);

            await db.collection("system").doc("daily_intel").set({
                facts: intelArray,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log("Dynamic mixed-format AI Daily Intel generated successfully!");

        } catch (error) {
            console.error("Failed to generate AI Intel:", error);
        }

        return null;
    });

// --- 3. 7-DAY INACTIVITY REACTIVATION ---
exports.inactivityReactivation = functions.pubsub.schedule("0 12 * * *")
    .timeZone("America/Chicago")
    .onRun(async (context) => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - 7);
        const targetDayString = targetDate.toISOString().split('T')[0];

        const usersSnap = await db.collection("users")
            .where("lastActive", ">=", targetDayString + "T00:00:00.000Z")
            .where("lastActive", "<=", targetDayString + "T23:59:59.999Z")
            .get();

        if (usersSnap.empty) return null;

        const notifications = [];

        for (const doc of usersSnap.docs) {
            const data = doc.data();
            const friendsList = data.friends || [];
            const deviceToken = data.fcmToken;

            if (!deviceToken || friendsList.length === 0) continue;

            let friendsTotalSprites = 0;
            for (const friend of friendsList) {
                const fDoc = await db.collection("users").doc(friend.uid).get();
                if (fDoc.exists) {
                    const fData = fDoc.data();
                    if (fData.sprites) {
                        for (const variants of Object.values(fData.sprites)) {
                            for (const isCollected of Object.values(variants)) {
                                if (isCollected) friendsTotalSprites++;
                            }
                        }
                    }
                }
            }

            const payload = {
                token: deviceToken,
                notification: {
                    title: "👋 Your Squad is pulling ahead!",
                    body: `Your friends have collected ${friendsTotalSprites} total Sprites! Jump back in to see their progress and claim your Daily Radar.`,
                },
                data: { route: "friends" }
            };
            notifications.push(admin.messaging().send(payload));
        }

        if (notifications.length > 0) await Promise.allSettled(notifications);
        return null;
    });

// --- 4. SQUAD NEEDS YOU ALERT ---
exports.squadNeedsYouAlert = functions.pubsub.schedule("0 15 * * 5")
    .timeZone("America/Chicago")
    .onRun(async (context) => {
        const usersSnap = await db.collection("users").get();
        if (usersSnap.empty) return null;

        const notifications = [];

        for (const doc of usersSnap.docs) {
            const userData = doc.data();
            const deviceToken = userData.fcmToken;
            const friendsList = userData.friends || [];
            const userSprites = userData.sprites || {};

            if (!deviceToken || friendsList.length === 0) continue;

            let matchFound = false;

            for (const friend of friendsList) {
                if (matchFound) break;

                const friendDoc = await db.collection("users").doc(friend.uid).get();
                if (!friendDoc.exists) continue;

                const friendData = friendDoc.data();
                const friendTargets = friendData.extractionTargets || [];
                const friendName = friendData.spriteId || "A friend";

                for (const target of friendTargets) {
                    if (!target) continue;
                    const [spriteId, variantName] = target.split("_");

                    if (userSprites[spriteId] && userSprites[spriteId][variantName]) {
                        const formattedVariant = variantName.charAt(0).toUpperCase() + variantName.slice(1);
                        const formattedSprite = spriteId.replace("-", " ");

                        const payload = {
                            token: deviceToken,
                            notification: {
                                title: "🤝 Squad Assist!",
                                body: `@${friendName} is hunting the ${formattedVariant} ${formattedSprite} you currently own. Reach out to coordinate!`,
                            },
                            data: { route: "friends" }
                        };
                        notifications.push(admin.messaging().send(payload));
                        matchFound = true;
                        break;
                    }
                }
            }
        }

        if (notifications.length > 0) await Promise.allSettled(notifications);
        return null;
    });

// --- 5. OFFICIAL FORTNITE API NEWS AGGREGATOR ---
exports.fetchFortniteNews = functions.pubsub.schedule("*/5 * * * *") // Runs every 5 minutes
    .timeZone("America/Chicago")
    .onRun(async (context) => {
        try {
            const fetchJson = (url) => new Promise((resolve, reject) => {
                https.get(url, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        try { resolve(JSON.parse(data)); }
                        catch (e) { reject(e); }
                    });
                }).on('error', reject);
            });

            const json = await fetchJson("https://fortnite-api.com/v2/news/br");
            const motds = json?.data?.motds;

            if (!motds || !Array.isArray(motds)) {
                console.log("No MOTDs found in the response.");
                return null;
            }

            const batch = db.batch();
            const newsRef = db.collection("news_feed");

            for (const item of motds) {
                const rawId = item.id || item.title || "unknown_tile";
                const docId = Buffer.from(rawId).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);

                const docRef = newsRef.doc(docId);
                batch.set(docRef, {
                    title: item.title || "Fortnite Update",
                    text: item.body || "",
                    imageUrl: item.image || item.tileImage || "",
                    author: "Epic Games",
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    sortTime: Date.now() // Instant numeric timestamp for reliable sorting
                }, { merge: true });
            }

            await batch.commit();
            console.log("Successfully fetched and updated official Fortnite API news!");
        } catch (err) {
            console.error("Failed fetching Fortnite API:", err);
        }

        return null;
    });

// --- 6. AUTO-CLEANUP OLD NEWS FEED POSTS ---
exports.cleanupOldNews = functions.pubsub.schedule("0 3 * * *") // Runs daily at 3:00 AM
    .timeZone("America/Chicago")
    .onRun(async (context) => {
        try {
            // Calculate the timestamp for exactly 7 days ago
            const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

            const newsRef = db.collection("news_feed");

            // Find all posts where sortTime is older than 7 days
            const snapshot = await newsRef.where("sortTime", "<", sevenDaysAgo).get();

            if (snapshot.empty) {
                console.log("No old news to clean up today.");
                return null;
            }

            // Delete them in a batch
            const batch = db.batch();
            let deletedCount = 0;

            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
                deletedCount++;
            });

            await batch.commit();
            console.log(`Successfully deleted ${deletedCount} old news posts.`);
        } catch (error) {
            console.error("Error cleaning up old news:", error);
        }

        return null;
    });