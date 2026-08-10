const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const { GoogleGenAI } = require("@google/genai"); // <-- Updated to the new SDK

admin.initializeApp();
const db = admin.firestore();

// IMPORTANT: Replace this with your actual key!
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
            // 1. Fetch raw user data
            const usersSnap = await db.collection("users").get();
            const totalUsers = usersSnap.size;

            if (totalUsers === 0) return null;

            const spriteCounts = {};
            const targetCounts = {};

            // 2. Aggregate stats across ALL users dynamically
            usersSnap.forEach(doc => {
                const data = doc.data();

                // Aggregate collected sprites
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

                // Aggregate extraction targets
                if (Array.isArray(data.extractionTargets)) {
                    data.extractionTargets.forEach(target => {
                        const formattedTarget = target.replace("_", " ").replace("-", " ");
                        targetCounts[formattedTarget] = (targetCounts[formattedTarget] || 0) + 1;
                    });
                }
            });

            // 3. Randomly pick a sample of dynamic stats for today's prompt
            const selectedHighlights = [];

            // Pick 2 random sprite collection stats
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

            // Pick 1 random extraction target stat
            const availableTargets = Object.keys(targetCounts);
            if (availableTargets.length > 0) {
                const randomTarget = availableTargets[Math.floor(Math.random() * availableTargets.length)];
                selectedHighlights.push(`${targetCounts[randomTarget]} collectors currently have "${randomTarget}" set as an active target`);
            }

            // 4. Send the randomized, structured stats to Gemini
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

            // Clean up the text and split into an array
            const intelArray = text.split('\n').filter(line => line.trim().length > 0);

            // 5. Save the AI-generated array to Firestore
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