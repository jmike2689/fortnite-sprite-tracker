import { Utensils, Heart, Droplets, Moon, Sun, Pill } from 'lucide-react';

// What the pet screen looks like for each mood and reaction. Shared by the screen and the stage.

export const PET_STYLES = `
@keyframes petfloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes petbounce { 0%,100% { transform: translateY(0) scale(1,1); } 35% { transform: translateY(-16px) scale(0.97,1.04); } 70% { transform: translateY(0) scale(1.05,0.95); } }
@keyframes petsway { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
@keyframes petshiver { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }
@keyframes petbreathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
@keyframes petzzz { 0% { opacity: 0; transform: translate(0,0) scale(0.7); } 25% { opacity: 1; } 100% { opacity: 0; transform: translate(16px,-36px) scale(1.2); } }
@keyframes petheart { 0% { opacity: 0; transform: translateY(0) scale(0.6); } 25% { opacity: 1; } 100% { opacity: 0; transform: translateY(-48px) scale(1.1); } }
@keyframes petpop { 0% { opacity: 0; transform: scale(0.6); } 100% { opacity: 1; transform: scale(1); } }
@keyframes petghost { 0%,100% { transform: translateY(0); opacity: 0.7; } 50% { transform: translateY(-10px); opacity: 1; } }
@keyframes petbubble { 0% { opacity: 0; transform: translateY(0) scale(0.6); } 20% { opacity: 1; } 100% { opacity: 0; transform: translateY(-70px) scale(1.15); } }
@keyframes petglow { 0% { opacity: 0; transform: scale(0.6); } 40% { opacity: 1; } 100% { opacity: 0; transform: scale(1.15); } }
`;

export const MOOD_META = {
  happy: { label: 'Feeling great', text: 'text-emerald-300', anim: 'animate-[petbounce_1.8s_ease-in-out_infinite] motion-reduce:animate-none', tone: '', bubble: null },
  ok: { label: 'Doing fine', text: 'text-slate-300', anim: 'animate-[petfloat_3.4s_ease-in-out_infinite] motion-reduce:animate-none', tone: '', bubble: null },
  hungry: { label: 'Hungry', text: 'text-orange-300', anim: 'animate-[petsway_2.6s_ease-in-out_infinite] motion-reduce:animate-none', tone: 'saturate-50', bubble: Utensils },
  dirty: { label: 'Needs a bath', text: 'text-cyan-300', anim: 'animate-[petsway_2.6s_ease-in-out_infinite] motion-reduce:animate-none', tone: 'saturate-50', bubble: Droplets },
  bored: { label: 'Bored', text: 'text-pink-300', anim: 'animate-[petsway_2.6s_ease-in-out_infinite] motion-reduce:animate-none', tone: 'saturate-50', bubble: Heart },
  tired: { label: 'Sleepy', text: 'text-yellow-200', anim: 'animate-[petsway_2.6s_ease-in-out_infinite] motion-reduce:animate-none', tone: 'saturate-50', bubble: Moon },
  sick: { label: 'Sick', text: 'text-lime-300', anim: 'animate-[petshiver_0.5s_ease-in-out_infinite] motion-reduce:animate-none', tone: 'saturate-50 hue-rotate-60', bubble: Pill },
  sleeping: { label: 'Sleeping', text: 'text-indigo-300', anim: 'animate-[petbreathe_4s_ease-in-out_infinite] motion-reduce:animate-none', tone: 'brightness-75', bubble: null },
  dead: { label: 'Passed away', text: 'text-slate-400', anim: '', tone: 'grayscale opacity-60', bubble: null },
};

export const REACTION_ICON = { feed: Utensils, play: Heart, bathe: Droplets, medicine: Pill, sleep: Moon, wake: Sun };
export const REACTION_COLOR = { feed: 'text-orange-300', play: 'text-pink-300', bathe: 'text-cyan-300', medicine: 'text-lime-300', sleep: 'text-indigo-300', wake: 'text-amber-300' };
