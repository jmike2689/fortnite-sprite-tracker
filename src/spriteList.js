// Pure helpers for the Sprites and Mastery lists. No React, no Firebase.

// The two tabs have different status chips but share one saved status. A status that belongs to the other
// tab counts as "All" here, so the chips always show what the list is really doing.
export const statusChips = (isMasteryView) => (isMasteryView ? ['All', 'Mastered', 'Unmastered'] : ['All', 'Collected', 'Missing']);
export const statusForTab = (saved, isMasteryView) => (statusChips(isMasteryView).includes(saved) ? saved : 'All');

// Whether one variant's dot belongs on a card for the chosen status. "Missing" on the Sprites tab hides what
// you already have. On the Mastery tab "Unmastered" shows only what is left to master and "Mastered" only the crowns.
export function showDot({ isMasteryView, status, collected, mastered }) {
  if (isMasteryView) {
    if (status === 'Unmastered') return Boolean(collected) && !mastered;
    if (status === 'Mastered') return Boolean(mastered);
    return true;
  }
  if (status === 'Missing') return !collected;
  return true;
}

// The variant a card leads with: its picture and the name under it. The Variant filter wins (Base if the sprite
// lacks it). With no Variant filter, on the Mastery tab with a status chip, it is the first variant that matches
// the chip. Otherwise Base.
export function cardVariant({ sprite, variantFilter, variantOrder, isMasteryView, status, collection, mastery }) {
  if (variantFilter !== 'All') {
    const picked = variantFilter.replace(/\s+/g, '').toLowerCase();
    return sprite.variants.includes(picked) ? picked : 'base';
  }
  if (isMasteryView && (status === 'Unmastered' || status === 'Mastered')) {
    const match = variantOrder.find((v) => sprite.variants.includes(v)
      && showDot({ isMasteryView, status, collected: collection[sprite.id]?.[v], mastered: mastery[sprite.id]?.[v] }));
    if (match) return match;
  }
  return 'base';
}

// What to tell someone when the list comes up empty. The wording is true whichever filter caused it.
export function emptyListMessage({ isMasteryView, status, search, seasonFilter, sprites, collection }) {
  const title = isMasteryView ? 'No Collectables Found' : 'No Sprites Found';
  const q = (search || '').trim();
  const ownsAny = sprites.some((s) => (seasonFilter === 'All' || s.season === seasonFilter)
    && s.variants.some((v) => collection[s.id]?.[v] === true));

  let hint = 'Nothing matches your filters. Try clearing one.';
  if (q) {
    hint = `Nothing matches "${q}" with your other filters. Try a different name or clear a filter.`;
  } else if (isMasteryView && !ownsAny) {
    hint = seasonFilter === 'All'
      ? "Mastery only lists Sprites you've collected. Collect some on the Sprites tab, then come back to master them."
      : "You haven't collected any Sprites from this season yet. Mastery only lists Sprites you've collected.";
  } else if (isMasteryView && status === 'Unmastered') {
    hint = 'Nothing left to master with these filters.';
  } else if (isMasteryView && status === 'Mastered') {
    hint = 'No mastered Sprites match these filters yet. Hold a dot on a collected Sprite to master it.';
  } else if (!isMasteryView && status === 'Missing') {
    hint = 'Nothing is missing with these filters.';
  } else if (!isMasteryView && status === 'Collected') {
    hint = "You haven't collected any Sprites that match these filters yet.";
  }
  return { title, hint };
}
