import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { SERVER, NEEDS, newPetFields } from './petLogic';
import { cleanNickname } from './petName';
import { normalizeBadge } from './petBadge';

// Stored as Firestore Timestamps so security rules can compare them to request.time.
const TIME_FIELDS = [
  'bornAt', 'healthAt', 'hungerEmptyAt', 'happinessEmptyAt', 'cleanlinessEmptyAt', 'energyEmptyAt',
  'sleepingSince', 'sickSince', 'sickImmuneUntil', 'lastFedAt', 'lastPlayedAt', 'lastBathedAt',
  'lastMedicineAt', 'endedAt',
];

const toMs = (value) => {
  if (value == null) return null;
  if (typeof value === 'number') return value;
  if (typeof value.toMillis === 'function') return value.toMillis();
  return null;
};

export function normalizePet(data) {
  const pet = { ...data };
  for (const key of TIME_FIELDS) pet[key] = toMs(data[key]);
  pet.bornAt = pet.bornAt ?? Date.now();
  pet.healthAt = pet.healthAt ?? pet.bornAt;
  pet.health = typeof data.health === 'number' ? data.health : 100;
  pet.sickImmuneUntil = pet.sickImmuneUntil ?? 0;
  pet.endReason = data.endReason ?? null;
  pet.history = Array.isArray(data.history) ? data.history : [];
  pet.nickname = cleanNickname(data.nickname) || null;
  for (const need of NEEDS) {
    const key = `${need}EmptyAt`;
    if (pet[key] == null) pet[key] = pet.healthAt;
  }
  return pet;
}

function encode(fields) {
  const out = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value === SERVER) out[key] = serverTimestamp();
    else if (TIME_FIELDS.includes(key) && typeof value === 'number') out[key] = Timestamp.fromMillis(Math.round(value));
    else out[key] = value;
  }
  return out;
}

const NO_USER = { pet: null, loading: false, error: null };
const LOADING = { pet: null, loading: true, error: null };

export function usePet(uid) {
  const [state, setState] = useState({ uid: null, pet: null, error: null });

  useEffect(() => {
    if (!uid) return undefined;
    return onSnapshot(
      doc(db, 'pets', uid),
      (snap) => setState({
        uid,
        pet: snap.exists() ? normalizePet(snap.data({ serverTimestamps: 'estimate' })) : null,
        error: null,
      }),
      (error) => setState({ uid, pet: null, error }),
    );
  }, [uid]);

  if (!uid) return NO_USER;
  if (state.uid !== uid) return LOADING;
  return { pet: state.pet, loading: false, error: state.error };
}

const NO_BADGE = { badge: null };

// The public side of someone's pet (sprite, age, best life). Readable for any signed-in player.
// If it cannot be read (rules not published yet, offline), it simply shows nothing.
export function usePetBadge(uid) {
  const [state, setState] = useState({ uid: null, badge: null });

  useEffect(() => {
    if (!uid) return undefined;
    return onSnapshot(
      doc(db, 'petBadges', uid),
      (snap) => setState({ uid, badge: snap.exists() ? normalizeBadge(snap.data()) : null }),
      () => setState({ uid, badge: null }),
    );
  }, [uid]);

  if (!uid || state.uid !== uid) return NO_BADGE;
  return { badge: state.badge };
}

// `nickname` is the one chance to name the Sprite: the rules refuse any later change or addition.
export function adoptPet(uid, spriteId, variant, history = [], nickname = '') {
  return setDoc(doc(db, 'pets', uid), encode(newPetFields(uid, spriteId, variant, Date.now(), history, nickname)));
}

export function savePetFields(uid, fields) {
  return updateDoc(doc(db, 'pets', uid), encode(fields));
}
