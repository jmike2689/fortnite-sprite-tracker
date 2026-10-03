// Pure pet logic: no React, no Firebase. Every time value is epoch milliseconds.
// The pet is never simulated in the background. Everything is derived from a few
// stored timestamps whenever it is looked at, so closed-app neglect still counts.

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const SERVER = '__server_time__';

// Flip PET_PUBLIC_RELEASE to true to show the Pet tab to everyone.
export const PET_PUBLIC_RELEASE = false;
export const PET_PREVIEW_UIDS = ['G7MQ2w1jijYhXEqXk6DiwMAo2AB3'];
export const isPetEnabledFor = (uid) => Boolean(uid) && (PET_PUBLIC_RELEASE || PET_PREVIEW_UIDS.includes(uid));

// Testing tools (skip ahead, test reminder). Only this account sees them, even after a public release.
export const PET_TOOLS_UIDS = ['G7MQ2w1jijYhXEqXk6DiwMAo2AB3'];
export const petToolsEnabledFor = (uid) => Boolean(uid) && PET_TOOLS_UIDS.includes(uid);

export const NEEDS = ['hunger', 'happiness', 'cleanliness', 'energy'];

export const PET_CONFIG = {
  // How long a completely full need lasts before it hits zero.
  full: { hunger: 12 * HOUR, happiness: 16 * HOUR, cleanliness: 24 * HOUR, energy: 20 * HOUR },
  refill: { feed: 8 * HOUR, play: 8 * HOUR, bathe: 24 * HOUR },
  quickPlayQuality: 0.5,
  playEnergyCost: HOUR,
  cooldown: { feed: 2 * HOUR, play: HOUR, bathe: 6 * HOUR, medicine: 30 * MINUTE },
  notHungryAbove: 0.85,
  alreadyCleanAbove: 0.9,
  sleep: { maxMs: 8 * HOUR, restoreRate: 2, tiredBelow: 0.85 },
  health: {
    drainPerHour: 0.8,
    regenPerHour: 2.8,
    weights: { hunger: 1, happiness: 0.5, energy: 0.5, cleanliness: 0.25 },
  },
  sickness: {
    graceMs: DAY,
    dirtyAfterMs: 6 * HOUR,
    deathMs: 48 * HOUR,
    immuneAfterCureMs: 12 * HOUR,
    dailyChance: 0.12,
  },
  warn: { low: 0.25, criticalHealth: 50, lastChanceMs: 12 * HOUR },
  projectionMs: 14 * DAY,
};

const SIM_STEP = 2 * MINUTE;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const emptyAtKey = (need) => `${need}EmptyAt`;

// murmur3-style mixer so neighbouring days give unrelated numbers
function seeded(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

export function formatDuration(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}

export function describeCause(cause) {
  if (cause === 'starvation') return 'starvation';
  if (cause === 'illness') return 'untreated illness';
  if (cause === 'released') return 'released';
  return 'neglect';
}

// While asleep, energy refills faster than real time. The stored energyEmptyAt is
// the value from when sleep began; this resolves what it becomes when sleep ends.
function sleepWindow(pet) {
  if (pet.sleepingSince == null) return null;
  const { full, sleep } = PET_CONFIG;
  const startMs = pet.sleepingSince;
  const startRemaining = clamp(pet.energyEmptyAt - startMs, 0, full.energy);
  const msToFull = (full.energy - startRemaining) / sleep.restoreRate;
  const endMs = startMs + Math.min(sleep.maxMs, msToFull);
  const remainingAtEnd = clamp(startRemaining + sleep.restoreRate * (endMs - startMs), 0, full.energy);
  return { startMs, endMs, startRemaining, energyEmptyAfter: endMs + remainingAtEnd };
}

// Illness is "random" but fully determined by the pet's identity and the calendar
// day, so it needs no server job and cannot be re-rolled by reopening the app.
function illnessEventAfter(pet, afterMs, limitMs) {
  const seed = `${pet.ownerId}:${pet.bornAt}`;
  const lastDay = Math.floor(limitMs / DAY);
  for (let day = Math.floor(afterMs / DAY); day <= lastDay; day++) {
    if (seeded(`${seed}:d${day}`) < PET_CONFIG.sickness.dailyChance) {
      const at = day * DAY + Math.floor(seeded(`${seed}:t${day}`) * DAY);
      if (at >= afterMs && at <= limitMs) return at;
    }
  }
  return null;
}

function computeSickStart(pet, limitMs) {
  if (pet.sickSince != null) return pet.sickSince;
  const cfg = PET_CONFIG.sickness;
  const immuneUntil = Math.max(pet.sickImmuneUntil || 0, pet.bornAt + cfg.graceMs);
  const candidates = [Math.max(pet.cleanlinessEmptyAt + cfg.dirtyAfterMs, immuneUntil)];
  const event = illnessEventAfter(pet, immuneUntil, limitMs);
  if (event != null) candidates.push(event);
  return Math.min(...candidates);
}

// Walks health forward in 2-minute steps. Returns the health at endMs, or the
// moment (and cause) the pet died if it did not make it that far. If watchBelow
// is given, belowAtMs is the first moment health falls under that value.
function runSim(pet, startMs, startHealth, endMs, watchBelow = null) {
  const { needs, health: hcfg, sickness } = { needs: NEEDS, ...PET_CONFIG };
  const win = sleepWindow(pet);
  const emptyAt = {
    hunger: pet.hungerEmptyAt,
    happiness: pet.happinessEmptyAt,
    cleanliness: pet.cleanlinessEmptyAt,
    energy: win ? win.energyEmptyAfter : pet.energyEmptyAt,
  };
  const sickStart = computeSickStart(pet, endMs + DAY);
  const sickDeadline = sickStart + sickness.deathMs;

  let t = startMs;
  let health = startHealth;
  let belowAtMs = null;
  while (t < endMs) {
    const dt = Math.min(SIM_STEP, endMs - t);
    const mid = t + dt / 2;

    let drain = 0;
    let hungerEmpty = false;
    for (const need of needs) {
      const asleepNow = need === 'energy' && win && mid < win.endMs;
      if (!asleepNow && mid >= emptyAt[need]) {
        drain += hcfg.weights[need];
        if (need === 'hunger') hungerEmpty = true;
      }
    }
    const sick = mid >= sickStart;

    let ratePerMs = 0;
    if (drain > 0) ratePerMs = -(drain * hcfg.drainPerHour) / HOUR;
    else if (!sick) ratePerMs = hcfg.regenPerHour / HOUR;

    if (watchBelow != null && belowAtMs == null && ratePerMs < 0 && health >= watchBelow && health + ratePerMs * dt < watchBelow) {
      belowAtMs = t + (health - watchBelow) / -ratePerMs;
    }

    let deathAtMs = null;
    let cause = null;
    if (ratePerMs < 0 && health + ratePerMs * dt <= 0) {
      deathAtMs = t + health / -ratePerMs;
      cause = hungerEmpty ? 'starvation' : sick ? 'illness' : 'neglect';
    }
    if (sickDeadline <= t + dt) {
      const sickDeath = Math.max(t, sickDeadline);
      if (deathAtMs == null || sickDeath < deathAtMs) {
        deathAtMs = sickDeath;
        cause = 'illness';
      }
    }
    if (deathAtMs != null) return { health: 0, deathAtMs, cause, belowAtMs };

    health = clamp(health + ratePerMs * dt, 0, 100);
    t += dt;
  }
  return { health, deathAtMs: null, cause: null, belowAtMs };
}

// Everything that is going to happen to a living pet if nobody cares for it from
// now on. Reminders are scheduled from this, so they fire even if the app stays closed.
export function projectEvents(pet, nowMs) {
  const cfg = PET_CONFIG;
  const ev = evaluatePet(pet, nowMs);
  if (!ev.alive) return null;

  const now = Math.max(nowMs, pet.healthAt);
  const win = sleepWindow(pet);
  const lowAt = {};
  for (const need of NEEDS) {
    const emptyAt = need === 'energy' && win ? win.energyEmptyAfter : pet[emptyAtKey(need)];
    const at = emptyAt - cfg.warn.low * cfg.full[need];
    lowAt[need] = at > now ? at : null;
  }

  const sickStart = computeSickStart(pet, now + cfg.projectionMs);
  const watch = ev.health >= cfg.warn.criticalHealth ? cfg.warn.criticalHealth : null;
  const projection = runSim(pet, now, ev.health, now + cfg.projectionMs, watch);

  return {
    ev,
    lowAt,
    sickAtMs: !ev.sick && sickStart > now ? sickStart : null,
    sickDeadlineMs: ev.sick ? ev.sickDeadlineMs : sickStart + cfg.sickness.deathMs,
    criticalAtMs: projection.belowAtMs,
    deathAtMs: projection.deathAtMs,
    cause: projection.cause,
  };
}

export function evaluatePet(pet, nowMs) {
  const cfg = PET_CONFIG;

  if (pet.endedAt != null) {
    const died = pet.endReason !== 'released';
    return {
      alive: false,
      ended: true,
      released: !died,
      deathAtMs: pet.endedAt,
      cause: pet.endReason,
      health: died ? 0 : pet.health,
      ageMs: pet.endedAt - pet.bornAt,
      needs: null,
      sick: false,
      sleeping: false,
      mood: 'dead',
    };
  }

  const now = Math.max(nowMs, pet.healthAt);
  const past = runSim(pet, pet.healthAt, pet.health, now);
  if (past.deathAtMs != null) {
    return {
      alive: false,
      ended: false,
      released: false,
      deathAtMs: past.deathAtMs,
      cause: past.cause,
      health: 0,
      ageMs: past.deathAtMs - pet.bornAt,
      needs: null,
      sick: false,
      sleeping: false,
      mood: 'dead',
    };
  }

  const projection = runSim(pet, now, past.health, now + cfg.projectionMs);
  const win = sleepWindow(pet);
  const sleeping = Boolean(win) && now < win.endMs;

  const needs = {};
  for (const need of NEEDS) {
    let remaining;
    if (need === 'energy' && win) {
      remaining = sleeping
        ? clamp(win.startRemaining + cfg.sleep.restoreRate * (now - win.startMs), 0, cfg.full.energy)
        : Math.max(0, win.energyEmptyAfter - now);
    } else {
      remaining = Math.max(0, pet[emptyAtKey(need)] - now);
    }
    remaining = Math.min(remaining, cfg.full[need]);
    needs[need] = { level: clamp(remaining / cfg.full[need], 0, 1), remainingMs: remaining };
  }

  const sickStart = computeSickStart(pet, now + cfg.projectionMs);
  const sick = sickStart <= now;

  let urgent = null;
  let nextEmpty = null;
  for (const need of NEEDS) {
    if (need === 'energy' && sleeping) continue;
    if (needs[need].level < cfg.warn.low && (!urgent || needs[need].level < needs[urgent].level)) urgent = need;
    if (needs[need].remainingMs > 0 && (!nextEmpty || needs[need].remainingMs < needs[nextEmpty].remainingMs)) nextEmpty = need;
  }

  const allGood = NEEDS.every((n) => needs[n].level >= 0.6);
  let mood = 'ok';
  if (sleeping) mood = 'sleeping';
  else if (sick) mood = 'sick';
  else if (urgent) mood = { hunger: 'hungry', cleanliness: 'dirty', happiness: 'bored', energy: 'tired' }[urgent];
  else if (allGood && past.health >= 80) mood = 'happy';

  const projectedDeathAtMs = projection.deathAtMs;
  return {
    alive: true,
    ended: false,
    released: false,
    health: past.health,
    ageMs: now - pet.bornAt,
    needs,
    sick,
    sickSinceMs: sick ? sickStart : null,
    sickDeadlineMs: sick ? sickStart + cfg.sickness.deathMs : null,
    sleeping,
    sleepEndMs: sleeping ? win.endMs : null,
    mood,
    urgent,
    nextEmpty,
    projectedDeathAtMs,
    projectedCause: projection.cause,
    critical: past.health < cfg.warn.criticalHealth,
    lastChance: projectedDeathAtMs != null && projectedDeathAtMs - now <= cfg.warn.lastChanceMs,
  };
}

const fail = (reason, short = '', retryInMs = 0) => ({ ok: false, reason, short, retryInMs });

// Dry-run or real: works out the exact fields a care action would write.
// Pass options.evaluation to reuse an evaluation you already computed.
export function planAction(pet, action, nowMs, options = {}) {
  const cfg = PET_CONFIG;
  const ev = options.evaluation || evaluatePet(pet, nowMs);
  if (!ev.alive) return fail('Your Sprite has passed away.', 'Gone');

  const now = Math.max(nowMs, pet.healthAt);
  const state = {
    hungerEmptyAt: pet.hungerEmptyAt,
    happinessEmptyAt: pet.happinessEmptyAt,
    cleanlinessEmptyAt: pet.cleanlinessEmptyAt,
    energyEmptyAt: pet.energyEmptyAt,
    sleepingSince: pet.sleepingSince,
    sickSince: pet.sickSince,
    sickImmuneUntil: pet.sickImmuneUntil,
  };

  const win = sleepWindow(pet);
  if (win) {
    if (now < win.endMs) {
      if (action !== 'wake') return fail('Your Sprite is asleep. Wake it up first.', 'Asleep');
      const remaining = clamp(win.startRemaining + cfg.sleep.restoreRate * (now - win.startMs), 0, cfg.full.energy);
      state.energyEmptyAt = now + remaining;
    } else {
      state.energyEmptyAt = win.energyEmptyAfter;
    }
    state.sleepingSince = null;
  } else if (action === 'wake') {
    return fail('Your Sprite is already awake.', 'Awake');
  }
  if (ev.sick && state.sickSince == null) state.sickSince = ev.sickSinceMs;

  const cooldownLeft = (key, ms) => (pet[key] == null ? 0 : Math.max(0, pet[key] + ms - now));
  const fraction = (emptyAt, full) => clamp((emptyAt - now) / full, 0, 1);
  const extra = {};
  const gain = {};

  switch (action) {
    case 'feed': {
      const wait = cooldownLeft('lastFedAt', cfg.cooldown.feed);
      if (wait > 0) return fail('Fed too recently.', 'Wait', wait);
      if (fraction(state.hungerEmptyAt, cfg.full.hunger) > cfg.notHungryAbove) return fail('Not hungry yet.', 'Not hungry');
      state.hungerEmptyAt = Math.min(Math.max(state.hungerEmptyAt, now) + cfg.refill.feed, now + cfg.full.hunger);
      extra.lastFedAt = SERVER;
      break;
    }
    case 'play': {
      if (ev.sick) return fail('Too sick to play. Give medicine first.', 'Too sick');
      const wait = cooldownLeft('lastPlayedAt', cfg.cooldown.play);
      if (wait > 0) return fail('Played too recently.', 'Wait', wait);
      if (state.energyEmptyAt - now <= 0) return fail('Too tired to play. Try Lights Out.', 'Too tired');
      const quality = clamp(options.quality ?? cfg.quickPlayQuality, 0.25, 1);
      const from = Math.max(state.happinessEmptyAt, now);
      state.happinessEmptyAt = Math.min(from + cfg.refill.play * quality, now + cfg.full.happiness);
      gain.happinessMs = state.happinessEmptyAt - from;
      state.energyEmptyAt = Math.max(now, state.energyEmptyAt - cfg.playEnergyCost);
      extra.lastPlayedAt = SERVER;
      break;
    }
    case 'bathe': {
      const wait = cooldownLeft('lastBathedAt', cfg.cooldown.bathe);
      if (wait > 0) return fail('Bathed too recently.', 'Wait', wait);
      if (fraction(state.cleanlinessEmptyAt, cfg.full.cleanliness) > cfg.alreadyCleanAbove) return fail('Already squeaky clean.', 'Clean');
      state.cleanlinessEmptyAt = Math.min(Math.max(state.cleanlinessEmptyAt, now) + cfg.refill.bathe, now + cfg.full.cleanliness);
      extra.lastBathedAt = SERVER;
      break;
    }
    case 'sleep': {
      if (fraction(state.energyEmptyAt, cfg.full.energy) > cfg.sleep.tiredBelow) return fail('Not tired yet.', 'Not tired');
      state.sleepingSince = now;
      break;
    }
    case 'wake':
      break;
    case 'medicine': {
      if (!ev.sick) return fail('Your Sprite is not sick.', 'Not sick');
      const wait = cooldownLeft('lastMedicineAt', cfg.cooldown.medicine);
      if (wait > 0) return fail('Medicine needs a moment to work.', 'Wait', wait);
      state.sickSince = null;
      state.sickImmuneUntil = now + cfg.sickness.immuneAfterCureMs;
      extra.lastMedicineAt = SERVER;
      break;
    }
    default:
      return fail('Unknown action.');
  }

  return { ok: true, fields: { ...state, ...extra, health: ev.health, healthAt: SERVER }, gain };
}

export function planRelease(pet, nowMs) {
  const ev = evaluatePet(pet, nowMs);
  return { endedAt: Math.max(nowMs, pet.healthAt), endReason: 'released', health: ev.health, healthAt: SERVER, sleepingSince: null };
}

// Testing aid: moves every timestamp back, so the pet behaves as if that much time had passed
// with nobody around (needs run down, cooldowns finish, illness days come into range).
export function planSkipAhead(pet, ms) {
  const back = (value) => (value == null ? null : value - ms);
  return {
    bornAt: pet.bornAt - ms,
    healthAt: pet.healthAt - ms,
    hungerEmptyAt: pet.hungerEmptyAt - ms,
    happinessEmptyAt: pet.happinessEmptyAt - ms,
    cleanlinessEmptyAt: pet.cleanlinessEmptyAt - ms,
    energyEmptyAt: pet.energyEmptyAt - ms,
    sleepingSince: back(pet.sleepingSince),
    sickSince: back(pet.sickSince),
    sickImmuneUntil: pet.sickImmuneUntil - ms,
    lastFedAt: back(pet.lastFedAt),
    lastPlayedAt: back(pet.lastPlayedAt),
    lastBathedAt: back(pet.lastBathedAt),
    lastMedicineAt: back(pet.lastMedicineAt),
  };
}

// When the pet has died but the death has not been written yet, these are the fields to save.
export function planDeathRecord(ev) {
  return { endedAt: Math.round(ev.deathAtMs), endReason: ev.cause, health: 0, healthAt: SERVER, sleepingSince: null };
}

export function historyEntryFor(pet, ev) {
  return {
    spriteId: pet.spriteId,
    variant: pet.variant,
    bornAt: pet.bornAt,
    diedAt: Math.round(pet.endedAt ?? ev.deathAtMs),
    cause: pet.endReason ?? ev.cause,
  };
}

export function newPetFields(ownerId, spriteId, variant, nowMs, history = []) {
  const cfg = PET_CONFIG;
  return {
    ownerId,
    spriteId,
    variant,
    bornAt: SERVER,
    health: 100,
    healthAt: SERVER,
    hungerEmptyAt: nowMs + cfg.full.hunger,
    happinessEmptyAt: nowMs + cfg.full.happiness,
    cleanlinessEmptyAt: nowMs + cfg.full.cleanliness,
    energyEmptyAt: nowMs + cfg.full.energy,
    sleepingSince: null,
    sickSince: null,
    sickImmuneUntil: nowMs + cfg.sickness.graceMs,
    lastFedAt: null,
    lastPlayedAt: null,
    lastBathedAt: null,
    lastMedicineAt: null,
    endedAt: null,
    endReason: null,
    history,
  };
}
