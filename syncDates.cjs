const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = require('./service-account.json');

// Connect to your project using the local key
initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();
const auth = getAuth();

async function syncSignupDates() {
    console.log("Starting sync... this will take a few seconds.");
    let pageToken;
    let count = 0;

    do {
        // Fetch users from Firebase Authentication
        const listUsersResult = await auth.listUsers(1000, pageToken);
        pageToken = listUsersResult.pageToken;

        for (const userRecord of listUsersResult.users) {
            const uid = userRecord.uid;
            const creationTime = userRecord.metadata.creationTime;

            if (creationTime) {
                // Push the Auth creation date into the Firestore user document
                await db.collection('users').doc(uid).set({
                    signupDate: new Date(creationTime).toISOString()
                }, { merge: true });

                count++;
                console.log(`Updated user ${count}: ${uid}`);
            }
        }
    } while (pageToken);

    console.log(`Success! Pushed ${count} real signup dates to Firestore!`);
}

syncSignupDates().catch(console.error);