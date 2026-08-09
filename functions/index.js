const functions = require("firebase-functions/v1"); // <-- Updated to explicitly use v1
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

admin.initializeApp();
const db = admin.firestore();

// IMPORTANT: Replace this with your actual key!
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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

        // 1. Fetch raw data
        const usersSnap = await db.collection("users").get();
        const totalUsers = usersSnap.size;

        let ironMouseMastered = 0;
        let holofoilPeelyHunters = 0;
        let gemWaterCount = 0;

        usersSnap.forEach(doc => {
            const data = doc.data();
            if (data.mastery?.["iron-mouse"]?.["base"]) ironMouseMastered++;
            if (data.extractionTargets?.includes("peely_holofoil")) holofoilPeelyHunters++;
            if (data.sprites?.["water"]?.["gem"]) gemWaterCount++;
        });

        // 2. Prompt Gemini to write the Intel
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
        You are the tactical AI announcer for an app called Spritedex. 
        Here are the global stats for today:
        - Total Users: ${totalUsers}
        - Players who mastered Iron Mouse: ${ironMouseMastered}
        - Players hunting Holofoil Peely: ${holofoilPeelyHunters}
        - Players who found Gem Water: ${gemWaterCount}

        Write exactly 5 short, punchy, exciting 1-sentence intel broadcasts to show players the app is alive. Make them sound like a futuristic radio transmission. Do not use bullet points or numbers. Just return 5 sentences separated by a new line.
      `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean up the text and split into an array
            const intelArray = text.split('\n').filter(line => line.trim().length > 0);

            // 3. Save the AI-generated array to the database
            await db.collection("system").doc("daily_intel").set({
                facts: intelArray,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log("AI Daily Intel generated successfully!");

        } catch (error) {
            console.error("Failed to generate AI Intel:", error);
        }

        return null;
    });