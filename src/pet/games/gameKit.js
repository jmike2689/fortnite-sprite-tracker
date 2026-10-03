import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const GAME_STYLES = `
@keyframes pg-up { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-26px); } }
@keyframes pg-down { 0%,100% { transform: translateY(0); } 50% { transform: translateY(14px); } }
@keyframes pg-pop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
@keyframes pg-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
@keyframes pg-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
`;

export function tap(style = ImpactStyle.Light) {
  try {
    Promise.resolve(Haptics.impact({ style })).catch(() => {});
  } catch {
    // haptics are optional
  }
}

const LAST_GAME_KEY = 'spritedex_pet_last_game';

export const readLastGame = () => {
  try { return window.localStorage.getItem(LAST_GAME_KEY); } catch { return null; }
};

export const saveLastGame = (game) => {
  try { window.localStorage.setItem(LAST_GAME_KEY, game); } catch { /* remembering the last game is optional */ }
};
