// Pure helpers for how the pet looks and acts on screen. No React, no Firebase, no clock.
// Anything random takes an rng, so it can be tested.

// ---------------- needs shown as pips and words, never as numbers ----------------
export const PIPS = 5;

// Each pip is a fifth of the bar and a partly used pip still counts. So a need that is not empty always shows
// at least one pip, and it keeps all five until it falls to 80% or less.
export const pipsFilled = (level) => (level > 0 ? Math.max(1, Math.min(PIPS, Math.ceil(level * PIPS - 1e-9))) : 0);

// "Low" matches the red styling, which starts below `lowBelow` (PET_CONFIG.warn.low).
export function needWord(level, remainingMs = 1, lowBelow = 0.25) {
  if (!(level > 0) || remainingMs <= 0) return 'Empty';
  if (level < lowBelow) return 'Low';
  if (level < 0.6) return 'Okay';
  if (level < 0.9) return 'Good';
  return 'Full';
}

// Health shares the app's "critical" line (below 50), which is also when the red warning appears.
export function healthTier(health, criticalBelow = 50, weakBelow = 60) {
  if (health < criticalBelow) return 'critical';
  if (health < weakBelow) return 'weak';
  return 'healthy';
}
export const HEALTH_WORD = { healthy: 'Healthy', weak: 'Weak', critical: 'Critical' };

// The line under the mood. It says what needs attention without giving away how long anything has left.
// `urgent` is the need that is already low ({label, empty}), `lowest` the one with the fewest pips ({label, level}).
// Health only drops while a need is empty or the Sprite is sick, so low health with neither means it is recovering.
export function careHint({ sleeping, wakesIn, sick, allEmpty, urgent, critical, lowest }) {
  if (sleeping) return `Sleeping. Wakes in ${wakesIn}.`;
  if (sick) return 'Needs medicine.';
  if (allEmpty) return 'Every need is empty. Act now!';
  if (urgent) return urgent.empty ? `${urgent.label} is empty!` : `${urgent.label} is low.`;
  if (critical) return 'Health is recovering.';
  if (lowest && lowest.level < 0.5) return `${lowest.label} is getting low.`;
  return 'Everything is looking good.';
}

// The Sprite shows how it feels with movement, hearts, a mood icon and Zzz. It never says anything in words.
const pick = (list, rng) => list[Math.min(list.length - 1, Math.floor(rng() * list.length))];

// ---------------- when things happen, in milliseconds ----------------
export const TIMING = {
  wanderFirst: [2500, 5000], wander: [5500, 10500],
  moveFirst: [3500, 7000], move: [9000, 16000],
  tapGap: 350,
  wanderGlide: 1600,
};
export const between = ([lo, hi], rng = Math.random) => Math.round(lo + rng() * (hi - lo));

// ---------------- wandering ----------------
// How far each mood strays from the middle, in px. A mood that is not listed (sick, sleeping, gone) stays put.
export const WANDER_RANGE = { happy: 44, ok: 44, bored: 26, hungry: 18, dirty: 18, tired: 10 };
export const canWander = (mood) => Boolean(WANDER_RANGE[mood]);

// The next spot to stroll to: always a real step, and `left` says which way it turned.
export function nextWander({ mood, x, rng = Math.random }) {
  const range = WANDER_RANGE[mood] ?? 0;
  const afterMs = between(TIMING.wander, rng);
  if (!range) return { x: 0, left: false, afterMs };
  const minStep = range * 0.4;
  let target = x;
  for (let i = 0; i < 6 && Math.abs(target - x) < minStep; i++) target = Math.round((rng() * 2 - 1) * range);
  if (Math.abs(target - x) < minStep) target = x > 0 ? -range : range;
  return { x: target, left: target < x, afterMs };
}

// ---------------- little idle moves ----------------
export const IDLE_MOVES = {
  happy: ['hop', 'wiggle', 'tilt'],
  ok: ['tilt', 'wiggle', 'stretch', 'hop'],
  bored: ['slump', 'tilt', 'stretch'],
  hungry: ['slump', 'tilt'],
  dirty: ['shake', 'tilt'],
  tired: ['yawn', 'slump'],
};
export const canIdle = (mood) => Boolean(IDLE_MOVES[mood]);

export function nextIdleMove({ mood, last = null, rng = Math.random }) {
  const list = IDLE_MOVES[mood];
  if (!list || list.length === 0) return null;
  return { move: pick(list.length > 1 ? list.filter((m) => m !== last) : list, rng), afterMs: between(TIMING.move, rng) };
}

// ---------------- how each move looks ----------------
// Keyframes for the Web Animations API. Every frame of a move uses the same list of transform functions, so
// it interpolates cleanly (a spin really spins), and each move ends exactly where it began.
export const MOVES = {
  hop: { duration: 800, easing: 'ease-out', frames: [
    { transform: 'translateY(0px) scale(1, 1)' },
    { transform: 'translateY(-18px) scale(0.96, 1.06)', offset: 0.4 },
    { transform: 'translateY(0px) scale(1.06, 0.94)', offset: 0.75 },
    { transform: 'translateY(0px) scale(1, 1)' },
  ] },
  wiggle: { duration: 700, easing: 'ease-in-out', frames: [
    { transform: 'rotate(0deg)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(0deg)' },
  ] },
  tilt: { duration: 1300, easing: 'ease-in-out', frames: [
    { transform: 'rotate(0deg) translateY(0px)' },
    { transform: 'rotate(-9deg) translateY(2px)', offset: 0.35 },
    { transform: 'rotate(-9deg) translateY(2px)', offset: 0.7 },
    { transform: 'rotate(0deg) translateY(0px)' },
  ] },
  stretch: { duration: 1100, easing: 'ease-in-out', frames: [
    { transform: 'scale(1, 1)' },
    { transform: 'scale(0.95, 1.12)', offset: 0.45 },
    { transform: 'scale(1.03, 0.98)', offset: 0.75 },
    { transform: 'scale(1, 1)' },
  ] },
  slump: { duration: 1500, easing: 'ease-in-out', frames: [
    { transform: 'translateY(0px) scale(1, 1)' },
    { transform: 'translateY(6px) scale(1.04, 0.93)', offset: 0.4 },
    { transform: 'translateY(6px) scale(1.04, 0.93)', offset: 0.7 },
    { transform: 'translateY(0px) scale(1, 1)' },
  ] },
  shake: { duration: 600, easing: 'linear', frames: [
    { transform: 'translateX(0px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' },
    { transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'translateX(0px)' },
  ] },
  yawn: { duration: 1600, easing: 'ease-in-out', frames: [
    { transform: 'scale(1, 1)' },
    { transform: 'scale(0.97, 1.1)', offset: 0.4 },
    { transform: 'scale(1.02, 0.97)', offset: 0.8 },
    { transform: 'scale(1, 1)' },
  ] },
  // care actions
  chomp: { duration: 900, easing: 'ease-in-out', frames: [
    { transform: 'scale(1, 1)' },
    { transform: 'scale(1.08, 0.88)', offset: 0.15 }, { transform: 'scale(0.96, 1.06)', offset: 0.3 },
    { transform: 'scale(1.08, 0.88)', offset: 0.45 }, { transform: 'scale(0.96, 1.06)', offset: 0.6 },
    { transform: 'scale(1.06, 0.9)', offset: 0.75 },
    { transform: 'scale(1, 1)' },
  ] },
  spin: { duration: 1000, easing: 'ease-in-out', frames: [
    { transform: 'translateY(0px) rotate(0deg)' },
    { transform: 'translateY(-22px) rotate(180deg)', offset: 0.5 },
    { transform: 'translateY(0px) rotate(360deg)' },
  ] },
  scrub: { duration: 900, easing: 'linear', frames: [
    { transform: 'rotate(0deg)' }, { transform: 'rotate(-7deg)' }, { transform: 'rotate(7deg)' },
    { transform: 'rotate(-7deg)' }, { transform: 'rotate(7deg)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(0deg)' },
  ] },
  glow: { duration: 1100, easing: 'ease-in-out', frames: [
    { transform: 'scale(1)', filter: 'brightness(1) drop-shadow(0 0 0px rgba(190, 242, 100, 0))' },
    { transform: 'scale(1.06)', filter: 'brightness(1.5) drop-shadow(0 0 14px rgba(190, 242, 100, 0.9))', offset: 0.4 },
    { transform: 'scale(1)', filter: 'brightness(1) drop-shadow(0 0 0px rgba(190, 242, 100, 0))' },
  ] },
};

// Which move each care action plays, and which move a tap plays in each mood.
export const ACTION_MOVE = { feed: 'chomp', play: 'spin', bathe: 'scrub', medicine: 'glow', sleep: 'slump', wake: 'stretch' };
export const TAP_MOVE = { happy: 'hop', ok: 'hop', hungry: 'wiggle', dirty: 'shake', bored: 'hop', tired: 'yawn', sick: 'shake', sleeping: 'tilt' };

// How many hearts float up on a tap, and the soft sound it makes ([pitch, wave, seconds], or none).
export const TAP_HEARTS = { happy: 3, ok: 2, bored: 2, hungry: 1, dirty: 0, tired: 1, sick: 0, sleeping: 0 };
export const TAP_BEEP = {
  happy: [988, 'sine', 0.06], ok: [784, 'sine', 0.05], bored: [523, 'sine', 0.06], hungry: [440, 'sine', 0.07],
  dirty: [392, 'sine', 0.07], tired: [330, 'sine', 0.09], sick: [247, 'sine', 0.1], sleeping: null,
};
