// Pure helpers for the public Sprite Pet badge (petBadges/{uid}), written by the syncPetBadge Cloud Function.
// No React, no Firebase. Every time value is epoch milliseconds.
import { PET_CONFIG } from './petLogic';

const toMs = (value) => {
  if (value == null) return null;
  if (typeof value === 'number') return value;
  if (typeof value.toMillis === 'function') return value.toMillis();
  return null;
};

export function normalizeBadge(data) {
  if (!data) return null;
  return {
    spriteId: data.spriteId ?? null,
    variant: data.variant ?? 'base',
    bornAt: toMs(data.bornAt),
    lastActiveAt: toMs(data.lastActiveAt),
    endedAt: toMs(data.endedAt),
    bestMs: typeof data.bestMs === 'number' ? data.bestMs : 0,
    bestSpriteId: data.bestSpriteId ?? null,
    bestVariant: data.bestVariant ?? null,
    lives: typeof data.lives === 'number' ? data.lives : 0,
  };
}

// What a profile shows for this badge right now, or null when there is nothing worth showing.
// A pet nobody has cared for in maxGapMs has died, so a badge that has not been touched for that long
// is shown as "no pet right now" even before the death is recorded.
export function describeBadge(badge, nowMs) {
  if (!badge) return null;
  const hasLife = badge.bornAt != null && badge.lastActiveAt != null;
  const alive = hasLife && badge.endedAt == null && nowMs - badge.lastActiveAt <= PET_CONFIG.maxGapMs;
  const currentMs = alive ? Math.max(0, nowMs - badge.bornAt) : null;
  const bestMs = Math.max(badge.bestMs, currentMs ?? 0);
  if (!alive && bestMs <= 0) return null;

  return {
    alive,
    currentMs,
    bestMs,
    // The living pet is on track for (or already holds) the record.
    bestIsCurrent: alive && currentMs > 0 && currentMs >= badge.bestMs,
    // Show the living pet, otherwise the Sprite that lived longest.
    spriteId: alive ? badge.spriteId : (badge.bestSpriteId ?? badge.spriteId),
    variant: alive ? badge.variant : (badge.bestVariant ?? badge.variant),
  };
}
