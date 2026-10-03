// Pure rules for the Play mini-games. No React, no Firebase, no clock.

export const GAMES = ['chest', 'leftright', 'memory'];

const DAY = 24 * 60 * 60 * 1000;
const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));

// A lost game still pays what a quick play does, so trying never costs anything.
export const qualityFromScore = (score) => Math.round((0.5 + 0.5 * clamp(score, 0, 1)) * 1000) / 1000;

// 0 for a pet under a day old, 1 under three days, 2 beyond. Older pets get harder games.
export const difficultyTier = (ageMs) => (ageMs < DAY ? 0 : ageMs < 3 * DAY ? 1 : 2);

// Random, but never the game that was just played.
export function pickNextGame(last, rng = Math.random) {
  const options = GAMES.filter((game) => game !== last);
  return options[Math.min(options.length - 1, Math.floor(rng() * options.length))];
}

export function shuffle(list, rng = Math.random) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ---- Which Chest? ----
export const CHEST = { rounds: 3, swaps: [5, 7, 9], stepMs: [580, 440, 330] };
const SWAP_PAIRS = [[0, 1], [1, 2], [0, 2]];

// One round: which chest hides the pet, and the swaps that follow. Never the same swap twice
// in a row, because that would simply undo itself.
export function makeChestRound(tier, rng = Math.random) {
  const target = Math.floor(rng() * 3);
  const swaps = [];
  let last = -1;
  while (swaps.length < CHEST.swaps[tier]) {
    let pick = Math.floor(rng() * 3);
    if (pick === last) pick = (pick + 1 + Math.floor(rng() * 2)) % 3;
    last = pick;
    swaps.push(SWAP_PAIRS[pick]);
  }
  return { target, swaps };
}

// Which chest sits in each slot after the first `step` swaps. slots[slot] = chest id.
export function slotsAfter(swaps, step) {
  const slots = [0, 1, 2];
  for (let i = 0; i < step; i++) {
    const [a, b] = swaps[i];
    [slots[a], slots[b]] = [slots[b], slots[a]];
  }
  return slots;
}

// ---- Left or Right ----
export const LEFT_RIGHT_ROUNDS = 5;
export const makeLeftRightAnswers = (rng = Math.random) => Array.from({ length: LEFT_RIGHT_ROUNDS }, () => (rng() < 0.5 ? 'L' : 'R'));

// ---- Memory Match ----
export const MEMORY_PAIRS = [4, 6, 8];

// Perfect is 1. Missing 1.5 times as often as there are pairs is 0.
export const memoryScore = (mistakes, pairs) => clamp(1 - mistakes / (1.5 * pairs), 0, 1);

// The pet always plays. The rest come from Sprites the player owns (one random owned
// variant each), then from the whole roster for players who own few.
export function buildMemoryDeck({ spritesDatabase, collection, pet, pairs, rng = Math.random }) {
  const usedSprites = new Set();
  const usedImages = new Set();
  const chosen = [];

  const add = (sprite, variant) => {
    const image = sprite.images?.[variant];
    if (!image || usedSprites.has(sprite.id) || usedImages.has(image)) return false;
    usedSprites.add(sprite.id);
    usedImages.add(image);
    chosen.push({ key: sprite.id, name: sprite.name, image });
    return true;
  };

  const own = spritesDatabase.find((s) => s.id === pet.spriteId);
  if (own && !add(own, pet.variant)) add(own, 'base');

  const owned = [];
  for (const sprite of spritesDatabase) {
    if (usedSprites.has(sprite.id)) continue;
    const variants = (sprite.variants || []).filter((v) => collection?.[sprite.id]?.[v] && sprite.images?.[v]);
    if (variants.length > 0) owned.push({ sprite, variant: variants[Math.floor(rng() * variants.length)] });
  }
  for (const { sprite, variant } of shuffle(owned, rng)) {
    if (chosen.length >= pairs) break;
    add(sprite, variant);
  }

  if (chosen.length < pairs) {
    for (const sprite of shuffle(spritesDatabase.filter((s) => !usedSprites.has(s.id)), rng)) {
      if (chosen.length >= pairs) break;
      add(sprite, 'base');
    }
  }

  const deck = [];
  for (const card of chosen) deck.push({ id: `${card.key}-a`, ...card }, { id: `${card.key}-b`, ...card });
  return shuffle(deck, rng);
}
