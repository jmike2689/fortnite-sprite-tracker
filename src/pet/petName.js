// A Sprite's private nickname. It is chosen once, when the Sprite is adopted, and can never be changed or added
// afterwards (the Firestore rules enforce that). Only the owner can read their pet, so no one else ever sees it.
// Pure: no React, no Firebase.

export const NICKNAME_MAX = 14;

// What gets stored. Control and invisible characters are dropped, runs of spaces squeezed, the ends trimmed and
// the result cut to NICKNAME_MAX characters (an emoji counts as one). '' means "no name".
export function cleanNickname(raw) {
  if (typeof raw !== 'string') return '';
  // Normalizing comes after the removals: dropping an invisible mark can leave two accents side by side.
  // (Line and paragraph separators count as white space below, so they need no mention here.)
  const text = raw
    .replace(/\p{Cc}/gu, ' ')
    .replace(/\p{Cf}/gu, '')
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim();
  return Array.from(text).slice(0, NICKNAME_MAX).join('').trim();
}

// While typing: stop at the length limit but leave spaces alone, so "Bis" can still become "Bis cuit".
export const limitNickname = (raw) => (typeof raw === 'string' ? Array.from(raw).slice(0, NICKNAME_MAX).join('') : '');

// The name to show for a pet: its nickname, otherwise the Sprite's own name.
export const petName = (pet, sprite) => cleanNickname(pet?.nickname) || sprite?.name || 'Your Sprite';
