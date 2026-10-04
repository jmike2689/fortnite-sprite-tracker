"use strict";

// Sprite Pet "longest life" badge.
//
// pets/{uid} is private because it holds the pet's vitals. This keeps a small public copy in
// petBadges/{uid} that other players can read. Only this code writes it, so nobody can edit their
// own best life. A life is credited from server timestamps, and a pet that was left alone for
// MAX_GAP_MS counts as dead however late the app gets around to recording it.
const { Timestamp, FieldValue } = require("firebase-admin/firestore");

// Keep in step with PET_CONFIG.maxGapMs in src/pet/petLogic.js and the 76 hours in firestore.rules.
// The longest a pet can honestly survive with nobody caring for it is about 73.4 hours.
const MAX_GAP_MS = 76 * 60 * 60 * 1000;
// A death or release may be stamped a little ahead of the server clock.
const CLOCK_SLACK_MS = 2 * 60 * 1000;

const TIME_KEYS = ["bornAt", "lastActiveAt", "endedAt", "bestEndedAt"];

const isNum = (value) => typeof value === "number" && Number.isFinite(value);

// A Firestore Timestamp (or a plain number) as epoch milliseconds.
const toMs = (value) => {
    if (value == null) return null;
    if (isNum(value)) return value;
    if (typeof value.toMillis === "function") return value.toMillis();
    return null;
};

function plainPet(data) {
    if (!data) return null;
    return {
        spriteId: data.spriteId,
        variant: data.variant,
        bornAt: toMs(data.bornAt),
        healthAt: toMs(data.healthAt),
        endedAt: toMs(data.endedAt),
    };
}

function plainBadge(data) {
    if (!data) return null;
    return {
        spriteId: data.spriteId ?? null,
        variant: data.variant ?? null,
        bornAt: toMs(data.bornAt),
        lastActiveAt: toMs(data.lastActiveAt),
        endedAt: toMs(data.endedAt),
        bestMs: isNum(data.bestMs) ? data.bestMs : 0,
        bestSpriteId: data.bestSpriteId ?? null,
        bestVariant: data.bestVariant ?? null,
        bestEndedAt: toMs(data.bestEndedAt),
        lives: isNum(data.lives) ? data.lives : 0,
        eventMs: isNum(data.eventMs) ? data.eventMs : 0,
    };
}

// Pure. Works out what the public badge should be after one change to pets/{uid}.
// before / after are the pet before and after the change (null if it did not exist), prev is the
// current badge (null if none), eventMs is when Firestore says the change happened.
// Returns { remove: true }, { skip: reason } or { badge }.
function nextBadge({ prev, before, after, eventMs }) {
    // Events can arrive twice or out of order. Anything not newer than what was applied is dropped.
    if (prev && prev.eventMs >= eventMs) return { skip: "already applied" };
    // The pet document is gone (account deleted), so the badge goes too.
    if (!after) return { remove: true };
    if (!after.spriteId || !after.variant || !isNum(after.bornAt) || !isNum(after.healthAt)) {
        return { skip: "incomplete pet" };
    }

    const badge = {
        spriteId: after.spriteId,
        variant: after.variant,
        bornAt: after.bornAt,
        lastActiveAt: after.healthAt,
        endedAt: null,
        bestMs: prev ? prev.bestMs : 0,
        bestSpriteId: prev ? prev.bestSpriteId : null,
        bestVariant: prev ? prev.bestVariant : null,
        bestEndedAt: prev ? prev.bestEndedAt : null,
        lives: prev ? prev.lives : 0,
        eventMs,
    };

    // The cause of death is deliberately not copied here: this record is public, the pet's vitals are not.
    if (after.endedAt != null) {
        badge.endedAt = after.endedAt;

        // Credit the life only at the moment its end is first recorded.
        const justEnded = before && before.endedAt == null && isNum(before.healthAt) && isNum(before.bornAt);
        if (justEnded) {
            // The end write stamps a fresh healthAt, so the last real activity is the one before it.
            const lastActive = before.healthAt;
            const latest = Math.min(lastActive + MAX_GAP_MS, eventMs + CLOCK_SLACK_MS);
            const endedAt = Math.min(Math.max(after.endedAt, lastActive), latest);
            const lived = Math.max(0, endedAt - before.bornAt);

            badge.lastActiveAt = lastActive;
            badge.endedAt = endedAt;
            badge.lives += 1;
            if (lived > badge.bestMs) {
                badge.bestMs = lived;
                badge.bestSpriteId = before.spriteId;
                badge.bestVariant = before.variant;
                badge.bestEndedAt = endedAt;
            }
        }
    }
    return { badge };
}

function badgeToFirestore(badge) {
    const out = { ...badge };
    for (const key of TIME_KEYS) {
        out[key] = badge[key] == null ? null : Timestamp.fromMillis(Math.round(badge[key]));
    }
    out.updatedAt = FieldValue.serverTimestamp();
    return out;
}

// Reads the current badge inside a transaction, so two quick pet writes cannot trample each other.
async function syncPetBadge(db, uid, change, eventMs) {
    const before = plainPet(change.before.exists ? change.before.data() : null);
    const after = plainPet(change.after.exists ? change.after.data() : null);
    const ref = db.collection("petBadges").doc(uid);

    await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        const decision = nextBadge({ prev: snap.exists ? plainBadge(snap.data()) : null, before, after, eventMs });
        if (decision.remove) {
            if (snap.exists) tx.delete(ref);
            return;
        }
        if (decision.skip) {
            console.log(`petBadge ${uid}: skipped (${decision.skip})`);
            return;
        }
        tx.set(ref, badgeToFirestore(decision.badge));
    });
}

module.exports = { MAX_GAP_MS, CLOCK_SLACK_MS, nextBadge, plainPet, plainBadge, badgeToFirestore, syncPetBadge };
