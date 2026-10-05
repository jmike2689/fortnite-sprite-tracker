// The room the Sprite lives in. It follows the time of day on the phone, and it is for show only: nothing here
// touches a stat. Pure: no React, no clock of its own (the caller passes the time).
//
// The class names are written out in full so Tailwind can find them.

export const PHASES = ['morning', 'day', 'evening', 'night'];

// Local time on the phone. Night 21:00-04:59, morning 05:00-09:59, day 10:00-16:59, evening 17:00-20:59.
export function timeOfDay(time) {
  const hour = new Date(time).getHours();
  if (hour >= 5 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

// The lamp is on in the evening and at night, unless the lights are out.
export const lampLit = (phase, dim) => !dim && (phase === 'evening' || phase === 'night');

// Walls stay moody so a Sprite always stands out; the window carries the bright sky.
export const WALL = {
  morning: 'from-amber-400/55 via-rose-500/30 to-slate-900',
  day: 'from-sky-400/60 via-cyan-600/35 to-slate-900',
  evening: 'from-orange-500/55 via-fuchsia-700/35 to-slate-950',
  night: 'from-indigo-600/50 via-slate-800/45 to-slate-950',
};
export const SKY = {
  morning: 'from-orange-300 via-rose-300 to-sky-300',
  day: 'from-sky-400 to-sky-200',
  evening: 'from-indigo-500 via-fuchsia-500 to-orange-400',
  night: 'from-slate-950 via-indigo-950 to-indigo-900',
};

// Where the sun and the moon sit in the window (px from its top-left corner; the pane is 50 by 66).
// The sun climbs from the left, crosses the top, sets on the right and is below the sill at night.
export const WINDOW = { width: 50, height: 66 };
export const SUN = { morning: [3, 40], day: [15, 4], evening: [27, 40], night: [15, 78] };
export const MOON = { morning: [28, -26], day: [28, -26], evening: [28, -26], night: [28, 8] };
// [left, top, delay in seconds] of each star
export const STARS = [[8, 6, 0], [36, 10, 0.8], [22, 22, 1.6], [40, 34, 0.4], [10, 38, 1.2]];

// Rarity shows in the rug, the soft light behind the Sprite and the edge of the stage.
export const RARITY_RUG = {
  Mythic: 'bg-yellow-500/30 border-yellow-300/40',
  Legendary: 'bg-orange-500/30 border-orange-300/40',
  Epic: 'bg-purple-500/30 border-purple-300/40',
  Rare: 'bg-blue-500/30 border-blue-300/40',
};
export const FALLBACK_RUG = 'bg-slate-500/30 border-slate-300/30';
export const RARITY_AURA = {
  Mythic: 'bg-[radial-gradient(closest-side,rgba(234,179,8,0.26),transparent)]',
  Legendary: 'bg-[radial-gradient(closest-side,rgba(249,115,22,0.26),transparent)]',
  Epic: 'bg-[radial-gradient(closest-side,rgba(168,85,247,0.26),transparent)]',
  Rare: 'bg-[radial-gradient(closest-side,rgba(59,130,246,0.26),transparent)]',
};
export const FALLBACK_AURA = 'bg-[radial-gradient(closest-side,rgba(148,163,184,0.2),transparent)]';
export const RARITY_EDGE = {
  Mythic: 'border-yellow-300/30',
  Legendary: 'border-orange-300/30',
  Epic: 'border-purple-300/30',
  Rare: 'border-blue-300/30',
};
export const FALLBACK_EDGE = 'border-white/10';
