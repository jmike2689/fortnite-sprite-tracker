// What the Black Market sells for the Sprite Pet: accessories (worn on the head) and room themes (the stage's backdrop).
// Both are for show only: nothing here touches a stat. Pure: no React.
//
// The owner's items live on their user document (`petItems`, a list of ids) and what is on right now in `petLook`
// ({ accessory, room }, each an id or null). They belong to the player, not to one Sprite, so a new pet keeps them.
// firestore.rules lists the same ids (petCosmeticsOk), so a new item has to be added there too.
//
// `w` is how wide a hat is compared with the Sprite, `h` the SVG's height for a width of 100, and `sink` how far the hat
// sits down into the head (a negative number floats it above, like the halo).

export const PET_ACCESSORIES = [
  { id: 'acc_party_hat', kind: 'accessory', name: 'Party Hat', blurb: 'Every day is a birthday.', price: 500, w: 0.46, h: 100, sink: 0.1 },
  { id: 'acc_flower_crown', kind: 'accessory', name: 'Flower Crown', blurb: 'Fresh daisies and roses.', price: 750, w: 0.62, h: 34, sink: 0.5 },
  { id: 'acc_cowboy_hat', kind: 'accessory', name: 'Cowboy Hat', blurb: 'Howdy, partner.', price: 900, w: 0.8, h: 52, sink: 0.35 },
  { id: 'acc_wizard_hat', kind: 'accessory', name: 'Wizard Hat', blurb: 'Starry and a little bent.', price: 1200, w: 0.66, h: 110, sink: 0.12 },
  { id: 'acc_halo', kind: 'accessory', name: 'Halo', blurb: 'Floats and glows.', price: 1500, w: 0.5, h: 26, sink: -0.3, bob: true },
  { id: 'acc_royal_crown', kind: 'accessory', name: 'Royal Crown', blurb: 'Gold with jewels.', price: 2000, w: 0.56, h: 64, sink: 0.2 },
  { id: 'acc_sparkle_orbit', kind: 'accessory', name: 'Sparkle Orbit', blurb: 'Little stars circle your Sprite.', price: 2500, orbit: true },
];

// A Sprite's room starts as the Cozy Room (free). Each theme replaces the wall and floor; the window, lamp, rug and
// time of day carry on. The class names are written out in full so Tailwind can find them.
export const PET_ROOMS = [
  { id: 'room_meadow', kind: 'room', name: 'Sunny Meadow', blurb: 'Hills, grass and open sky.', price: 1000, wall: 'from-sky-400/70 via-sky-300/45 to-emerald-300/40', floor: 'from-emerald-500/50 to-emerald-900/80', deco: 'hills' },
  { id: 'room_beach', kind: 'room', name: 'Beach Cove', blurb: 'Sand underfoot and waves behind.', price: 1000, wall: 'from-cyan-300/70 via-sky-400/45 to-amber-100/30', floor: 'from-amber-200/60 to-amber-500/55', deco: 'waves' },
  { id: 'room_candy', kind: 'room', name: 'Candy Land', blurb: 'Pink stripes everywhere.', price: 1500, wall: 'from-pink-400/60 via-fuchsia-400/40 to-violet-500/40', floor: 'from-pink-300/40 to-pink-700/55', deco: 'stripes' },
  { id: 'room_cabin', kind: 'room', name: 'Autumn Cabin', blurb: 'Warm wooden walls.', price: 1500, wall: 'from-amber-900/75 via-orange-950/70 to-stone-950', floor: 'from-amber-800/50 to-stone-950/85', deco: 'planks' },
  { id: 'room_starlit', kind: 'room', name: 'Starlit Space', blurb: 'A sky full of twinkling stars.', price: 2000, wall: 'from-indigo-950 via-violet-950 to-slate-950', floor: 'from-violet-900/40 to-black/75', deco: 'stars' },
  { id: 'room_arcade', kind: 'room', name: 'Neon Arcade', blurb: 'Glowing grid, no quarters needed.', price: 2500, wall: 'from-slate-950 via-fuchsia-950 to-slate-950', floor: 'from-fuchsia-900/30 to-black/80', deco: 'grid' },
];

export const PET_ITEMS = [...PET_ACCESSORIES, ...PET_ROOMS];
export const PET_ITEM_IDS = PET_ITEMS.map((item) => item.id);
const BY_ID = Object.fromEntries(PET_ITEMS.map((item) => [item.id, item]));

export const petItemById = (id) => BY_ID[id] || null;

// The item to show for a slot ('accessory' or 'room'): only one the player really owns, otherwise nothing.
export function equippedItem(kind, petLook, petItems) {
  const id = petLook?.[kind];
  const item = id ? BY_ID[id] : null;
  return item && item.kind === kind && Array.isArray(petItems) && petItems.includes(id) ? item : null;
}

// Phase of the day tints a theme's wall, since a theme has one wall instead of one per hour.
export const THEME_TINT = {
  morning: 'bg-amber-300/10',
  day: 'bg-transparent',
  evening: 'bg-orange-500/15',
  night: 'bg-indigo-950/55',
};

// Twinkling stars for the Starlit Space: [left %, top %, size px, delay s]
export const SPACE_STARS = [
  [8, 8, 2, 0], [20, 22, 3, 0.7], [34, 10, 2, 1.4], [46, 28, 2, 0.3], [58, 6, 3, 1.1], [70, 24, 2, 1.9], [84, 12, 3, 0.5],
  [92, 34, 2, 1.6], [14, 44, 2, 1.0], [30, 52, 3, 0.2], [52, 46, 2, 1.7], [66, 40, 3, 0.9], [80, 54, 2, 1.3], [40, 18, 2, 2.1],
];
