import React, { useState, useEffect, useRef } from 'react';
import {
  Search, CheckCircle, Circle, Volume2, VolumeX, Percent, RotateCcw, AlertTriangle, X
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- VERBATIM ASSET IMPORTS ---
import zpBase from './assets/Zero_Point_Sprite_-_Item_-_Fortnite.webp';
import zpGold from './assets/Gold_Zero_Point_Sprite_-_Item_-_Fortnite.webp';
import zpGummy from './assets/Gummy_Zero_Point_Sprite_-_Item_-_Fortnite.webp';
import zpGalaxy from './assets/Galaxy_Zero_Point_Sprite_-_Item_-_Fortnite.webp';

import waterBase from './assets/Water_Sprite_-_Item_-_Fortnite.webp';
import waterGold from './assets/Gold_Water_Sprite_-_Item_-_Fortnite.webp';
import waterGummy from './assets/Gummy_Water_Sprite_-_Item_-_Fortnite.webp';
import waterGalaxy from './assets/Galaxy_Water_Sprite_-_Item_-_Fortnite.webp';

import earthBase from './assets/Earth_Sprite_-_Item_-_Fortnite.webp';
import earthGold from './assets/Gold_Earth_Sprite_-_Item_-_Fortnite.webp';
import earthGummy from './assets/Gummy_Earth_Sprite_-_Item_-_Fortnite.webp';
import earthGalaxy from './assets/Galaxy_Earth_Sprite_-_Item_-_Fortnite.webp';

import fireBase from './assets/Fire_Sprite_-_Item_-_Fortnite.webp';
import fireGold from './assets/Gold_Fire_Sprite_-_Item_-_Fortnite.webp';
import fireGummy from './assets/Gummy_Fire_Sprite_-_Item_-_Fortnite.webp';
import fireGalaxy from './assets/Galaxy_Fire_Sprite_-_Item_-_Fortnite.webp';

import duckBase from './assets/Duck_Sprite_-_Item_-_Fortnite.webp';
import duckGold from './assets/Gold_Duck_Sprite_-_Item_-_Fortnite.webp';
import duckGummy from './assets/Gummy_Duck_Sprite_-_Item_-_Fortnite.webp';
import duckGalaxy from './assets/Galaxy_Duck_Sprite_-_Item_-_Fortnite.webp';

import dreamBase from './assets/Dream_Sprite_-_Item_-_Fortnite.webp';
import dreamGold from './assets/Gold_Dream_Sprite_-_Item_-_Fortnite.webp';
import dreamGummy from './assets/Gummy_Dream_Sprite_-_Item_-_Fortnite.webp';
import dreamGalaxy from './assets/Galaxy_Dream_Sprite_-_Item_-_Fortnite.webp';

import demonBase from './assets/Demon_Sprite_-_Item_-_Fortnite.webp';
import demonGold from './assets/Gold_Demon_Sprite_-_Item_-_Fortnite.webp';
import demonGummy from './assets/Gummy_Demon_Sprite_-_Item_-_Fortnite.webp';
import demonGalaxy from './assets/Galaxy_Demon_Sprite_-_Item_-_Fortnite.webp';

import punkBase from './assets/Punk_Sprite_-_Item_-_Fortnite.webp';
import punkGold from './assets/Gold_Punk_Sprite_-_Item_-_Fortnite.webp';
import punkGummy from './assets/Gummy_Punk_Sprite_-_Item_-_Fortnite.webp';
import punkGalaxy from './assets/Galaxy_Punk_Sprite_-_Item_-_Fortnite.webp';

import peanutBase from './assets/Burnt_Peanut_-_Item_-_Fortnite.webp';

import ghostBase from './assets/Ghost_Sprite_-_Item_-_Fortnite.webp';
import ghostGold from './assets/Gold_Ghost_Sprite_-_Item_-_Fortnite.webp';
import ghostGummy from './assets/Gummy_Ghost_Sprite_-_Item_-_Fortnite.webp';
import ghostGalaxy from './assets/Galaxy_Ghost_Sprite_-_Item_-_Fortnite.webp';

import kingBase from './assets/King_Sprite_-_Item_-_Fortnite.webp';
import kingGold from './assets/Gold_King_Sprite_-_Item_-_Fortnite.webp';
import kingGummy from './assets/Gummy_King_Sprite_-_Item_-_Fortnite.webp';
import kingGalaxy from './assets/Galaxy_King_Sprite_-_Item_-_Fortnite.webp';

import auraBase from './assets/Aura_Sprite_-_Item_-_Fortnite.webp';
import auraGold from './assets/Gold_Aura_Sprite_-_Item_-_Fortnite.webp';
import auraGummy from './assets/Gummy_Aura_Sprite_-_Item_-_Fortnite.webp';
import auraGalaxy from './assets/Galaxy_Aura_Sprite_-_Item_-_Fortnite.webp';

import bossBase from './assets/Boss_Sprite_-_Item_-_Fortnite.webp';
import bossGold from './assets/Gold_Boss_Sprite_-_Item_-_Fortnite.webp';
import bossGummy from './assets/Gummy_Boss_Sprite_-_Item_-_Fortnite.webp';
import bossGalaxy from './assets/Galaxy_Boss_Sprite_-_Item_-_Fortnite.webp';

import fishyBase from './assets/Fishy_Sprite_-_Item_-_Fortnite.webp';
import fishyGold from './assets/Gold_Fishy_Sprite_-_Item_-_Fortnite.webp';
import fishyGummy from './assets/Gummy_Fishy_Sprite_-_Item_-_Fortnite.webp';
import fishyGalaxy from './assets/Galaxy_Fishy_Sprite_-_Item_-_Fortnite.webp';

import grimBase from './assets/Grim_Sprite_-_Item_-_Fortnite.webp';
import grimGold from './assets/Gold_Grim_Sprite_-_Item_-_Fortnite.webp';
import grimGummy from './assets/Gummy_Grim_Sprite_-_Item_-_Fortnite.webp';
import grimGalaxy from './assets/Galaxy_Grim_Sprite_-_Item_-_Fortnite.webp';

import strikerBase from './assets/Striker_Sprite_-_Item_-_Fortnite.webp';
import strikerGold from './assets/Gold_Striker_Sprite_-_Item_-_Fortnite.webp';
import strikerGummy from './assets/Gummy_Striker_Sprite_-_Item_-_Fortnite.webp';
import strikerGalaxy from './assets/Galaxy_Striker_Sprite_-_Item_-_Fortnite.webp';

const SPRITES_DATABASE = [
  {
    id: "zero-point",
    name: "Zero Point",
    rarity: "Mythic",
    images: { base: zpBase, gold: zpGold, gummy: zpGummy, galaxy: zpGalaxy },
    rates: { base: "0.000098%", gold: "0.00012%", gummy: "0.00006%", galaxy: "0.00004%" },
    baseAbility: "Spawn a Shield Bubble Jr. when you use a healing item on yourself (excluding splashes and grenades). Duration at each Level Up: 6s -> 7s -> 8s -> 9s -> 10s."
  },
  {
    id: "burnt-peanut",
    name: "Burnt Peanut",
    rarity: "Mythic",
    images: { base: peanutBase, gold: peanutBase, gummy: peanutBase, galaxy: peanutBase },
    rates: { base: "1.01%", gold: "N/A", gummy: "N/A", galaxy: "N/A" },
    baseAbility: "Goop! When eliminating players, you may find more loot. Sometimes mythic! Chance at each Level Up: 20% -> 30% -> 40% -> 50% -> 60% chance (10% chance to find Mythic at Max Level!)."
  },
  {
    id: "dream",
    name: "Dream",
    rarity: "Legendary",
    images: { base: dreamBase, gold: dreamGold, gummy: dreamGummy, galaxy: dreamGalaxy },
    rates: { base: "2.63%", gold: "0.03%", gummy: "0.02%", galaxy: "0.01%" },
    baseAbility: "Grants a random item at each level, exploding with legendary loot at Max Level. Loot value increases at each Level Up!"
  },
  {
    id: "punk",
    name: "Punk",
    rarity: "Legendary",
    images: { base: punkBase, gold: punkGold, gummy: punkGummy, galaxy: punkGalaxy },
    rates: { base: "1.98%", gold: "0.02%", gummy: "0.01%", galaxy: "0.01%" },
    baseAbility: "Does nothing until Level 5, in which it will always grant a buff for unlimited ammo."
  },
  {
    id: "boss",
    name: "Boss",
    rarity: "Legendary",
    images: { base: bossBase, gold: bossGold, gummy: bossGummy, galaxy: bossGalaxy },
    rates: { base: "2.63%", gold: "0.03%", gummy: "0.02%", galaxy: "0.01%" },
    baseAbility: "Grants an increase to your max HP and Shield. Increases at each Level Up: 5 -> 10 -> 15 -> 20 -> 25 HP/Shield."
  },
  {
    id: "grim",
    name: "Grim",
    rarity: "Legendary",
    images: { base: grimBase, gold: grimGold, gummy: grimGummy, galaxy: grimGalaxy },
    rates: { base: "0.0098%", gold: "0.00012%", gummy: "0.00006%", galaxy: "0.00004%" },
    baseAbility: "Players who attack you are marked for a duration. Duration at each Level Up: 3s -> 3.5s -> 4s -> 4.5s -> 5s."
  },
  {
    id: "duck",
    name: "Duck",
    rarity: "Epic",
    images: { base: duckBase, gold: duckGold, gummy: duckGummy, galaxy: duckGalaxy },
    rates: { base: "5.74%", gold: "0.07%", gummy: "0.04%", galaxy: "0.02%" },
    baseAbility: "Emoting or Jamming replenishes shields. Increases in power at each Level Up: 2 -> 3 -> 4 -> 6 -> 8 Shield per tick."
  },
  {
    id: "demon",
    name: "Demon",
    rarity: "Epic",
    images: { base: demonBase, gold: demonGold, gummy: demonGummy, galaxy: demonGalaxy },
    rates: { base: "5.76%", gold: "0.07%", gummy: "0.04%", galaxy: "0.01%" },
    baseAbility: "Siphon some health and shields when you eliminate an opponent. Increases in power at each Level Up: 10 -> 15 -> 20 -> 25 -> 30 Healing per elimination."
  },
  {
    id: "ghost",
    name: "Ghost",
    rarity: "Epic",
    images: { base: ghostBase, gold: ghostGold, gummy: ghostGummy, galaxy: ghostGalaxy },
    rates: { base: "5.74%", gold: "0.07%", gummy: "0.04%", galaxy: "0.02%" },
    baseAbility: "Grants cloak for a duration upon reloading. Increases in duration at each Level Up: 3s -> 3.5s -> 4s -> 4.5s -> 5s."
  },
  {
    id: "ghost-king",
    name: "GhostKing",
    rarity: "Epic",
    images: { base: kingBase, gold: kingGold, gummy: kingGummy, galaxy: kingGalaxy },
    rates: { base: "5.74%", gold: "0.07%", gummy: "0.04%", galaxy: "0.02%" },
    baseAbility: "Your Pickaxe deals more damage. Increases in damage at each Level Up: 30 -> 40 -> 60 -> 80 -> 120 bonus damage."
  },
  {
    id: "aura",
    name: "Aura",
    rarity: "Epic",
    images: { base: auraBase, gold: auraGold, gummy: auraGummy, galaxy: auraGalaxy },
    rates: { base: "5.74%", gold: "0.07%", gummy: "0.04%", galaxy: "0.02%" },
    baseAbility: "Gain a Shock Rock charge when you deal enough damage to enemies! Required damage decreases at each Level Up: 175 -> 150 -> 125 -> 100 -> 75 Damage to trigger."
  },
  {
    id: "striker",
    name: "Striker",
    rarity: "Epic",
    images: { base: strikerBase, gold: strikerGold, gummy: strikerGummy, galaxy: strikerGalaxy },
    rates: { base: "5.74%", gold: "0.07%", gummy: "0.04%", galaxy: "0.02%" },
    baseAbility: "Gain the Overdrive effect when you Mantle, Hurdle, or Wall Scramble. Duration increases at each Level Up: 6s -> 7s -> 8s -> 9s -> 10s of Overdrive."
  },
  {
    id: "water",
    name: "Water",
    rarity: "Rare",
    images: { base: waterBase, gold: waterGold, gummy: waterGummy, galaxy: waterGalaxy },
    rates: { base: "12.83%", gold: "0.70%", gummy: "0.28%", galaxy: "0.28%" },
    baseAbility: "Replenish shields while standing in water! Increases in power at each Level Up: 2 -> 3 -> 4 -> 5 -> 6 Shield per tick."
  },
  {
    id: "earth",
    name: "Earth",
    rarity: "Rare",
    images: { base: earthBase, gold: earthGold, gummy: earthGummy, galaxy: earthGalaxy },
    rates: { base: "12.83%", gold: "0.70%", gummy: "0.28%", galaxy: "0.28%" },
    baseAbility: "You have a chance to find additional rare items when opening chests. Chance increases at each Level Up: 10% -> 12.5% -> 15% -> 17.5% -> 20% chance."
  },
  {
    id: "fire",
    name: "Fire",
    rarity: "Rare",
    images: { base: fireBase, gold: fireGold, gummy: fireGummy, galaxy: fireGalaxy },
    rates: { base: "12.45%", gold: "0.68%", gummy: "0.68%", galaxy: "0.27%" },
    baseAbility: "Creates a fiery burst when you deal enough damage to an enemy! Required damage decreases at each Level Up: 150 -> 125 -> 100 -> 75 -> 50 Damage to trigger."
  },
  {
    id: "fishy",
    name: "Fishy",
    rarity: "Rare",
    images: { base: fishyBase, gold: fishyGold, gummy: fishyGummy, galaxy: fishyGalaxy },
    rates: { base: "13.79%", gold: "0.17%", gummy: "0.08%", galaxy: "0.06%" },
    baseAbility: "Swim speed greatly increased. Taking damage also briefly increases movement speed. Tiers: 25%/10% -> 50%/20% -> 100%/30% -> 150%/40% -> 200%/50% bonuses."
  }
];

const VARIANT_INFO = {
  base: { name: "Base", color: "text-blue-400" },
  gold: { name: "Gold", color: "text-amber-400" },
  gummy: { name: "Gummy", color: "text-pink-500" },
  galaxy: { name: "Galaxy", color: "text-purple-400" }
};

const RARITY_COLORS = {
  Mythic: "bg-yellow-400 text-black border-yellow-300 font-extrabold",
  Legendary: "bg-orange-500 text-white border-orange-400",
  Epic: "bg-purple-600 text-white border-purple-400",
  Rare: "bg-blue-600 text-white border-blue-400"
};

const RARITY_BG_GRADIENTS = {
  Mythic: "from-yellow-400 via-yellow-600 to-amber-950",
  Legendary: "from-orange-500 via-orange-700 to-amber-950",
  Epic: "from-purple-600 via-purple-800 to-slate-950",
  Rare: "from-blue-500 via-blue-700 to-slate-950"
};

const SUMMON_COST_MATRIX = {
  Mythic: { base: "7,500", variant: "15,000" },
  Legendary: { base: "5,000", variant: "10,000" },
  Epic: { base: "3,000", variant: "6,000" },
  Rare: { base: "100", variant: "4,000" }
};

const variantsList = ['base', 'gold', 'gummy', 'galaxy'];

export default function App() {
  const [collection, setCollection] = useState(() => {
    const saved = localStorage.getItem('fn_sprites_tracker_v1');
    return saved ? JSON.parse(saved) : {};
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState('All');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // --- EXPLICIT DISPLAY STATE PIPELINE ---
  const [activeTabs, setActiveTabs] = useState({});

  const audioCtxRef = useRef(null);

  useEffect(() => {
    SPRITES_DATABASE.forEach(sprite => {
      Object.values(sprite.images).forEach(src => {
        const img = new Image();
        img.src = src;
      });
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('fn_sprites_tracker_v1', JSON.stringify(collection));
  }, [collection]);

  const playBeep = (freq, type = 'sine', duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) { }
  };

  const handleTabClick = (spriteId, variant) => {
    // 1. Immediately lock down the visual tab view state change
    setActiveTabs(prev => ({ ...prev, [spriteId]: variant }));

    // 2. Compute state logic and play corresponding frequency notes
    const currentVal = collection[spriteId]?.[variant];
    const newVal = !currentVal;

    if (newVal) {
      if (variant === 'galaxy') playBeep(880, 'triangle', 0.15);
      else if (variant === 'gold') playBeep(659, 'sine', 0.1);
      else if (variant === 'gummy') playBeep(587, 'sine', 0.1);
      else playBeep(440, 'sine', 0.08);
    } else {
      playBeep(220, 'sine', 0.1);
    }

    setCollection(prev => {
      const currentSprite = prev[spriteId] || { base: false, gold: false, gummy: false, galaxy: false };
      const updated = { ...prev, [spriteId]: { ...currentSprite, [variant]: newVal } };

      const targetSprite = SPRITES_DATABASE.find(s => s.id === spriteId);
      const targets = variantsList.filter(v => targetSprite.rates[v] !== "N/A");
      const allSelected = targets.every(v => updated[spriteId][v]);

      if (newVal && allSelected) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#ffe600', '#ff007f', '#8a2be2']
        });
      }
      return updated;
    });
  };

  const handleAbsoluteReset = () => {
    setCollection({});
    setActiveTabs({});
    setShowResetConfirm(false);
    playBeep(180, 'sawtooth', 0.3);
  };

  const totalPossible = SPRITES_DATABASE.reduce((acc, sprite) => {
    const validCount = variantsList.filter(v => sprite.rates[v] !== "N/A").length;
    return acc + validCount;
  }, 0);

  const totalCollected = SPRITES_DATABASE.reduce((acc, sprite) => {
    const status = collection[sprite.id] || {};
    const validChecked = variantsList.filter(v => sprite.rates[v] !== "N/A" && status[v]).length;
    return acc + validChecked;
  }, 0);

  const completionRate = totalPossible > 0 ? Math.round((totalCollected / totalPossible) * 100) : 0;

  const filteredSprites = SPRITES_DATABASE.filter(sprite => {
    const matchesSearch = sprite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sprite.baseAbility.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = rarityFilter === 'All' || sprite.rarity === rarityFilter;
    return matchesSearch && matchesRarity;
  });

  const getVariantModifierText = (variantName) => {
    if (variantName === 'gold') return "Gain 3x bonus XP from eliminations";
    if (variantName === 'gummy') return "Gain 20% more Sprite Dust upon Extraction";
    if (variantName === 'galaxy') return "Gain 30% more Ammunition when looting";
    return null;
  };

  const getDynamicSummonCost = (rarity, variantName) => {
    const rarityMatrix = SUMMON_COST_MATRIX[rarity];
    if (!rarityMatrix) return "0";
    return variantName === 'base' ? rarityMatrix.base : rarityMatrix.variant;
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col font-sans select-none relative">

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#12141f] border-2 border-red-500/60 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_30px_rgba(239,68,68,0.2)] text-center relative">
            <button
              onClick={() => { setShowResetConfirm(false); playBeep(440, 'sine', 0.05); }}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg bg-black/40 border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-black tracking-tight text-white uppercase italic">RESET LOG DATA?</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              This action will completely wipe your checked archive configurations. Mastery counts and storage caches will revert back to 0%.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => { setShowResetConfirm(false); playBeep(440, 'sine', 0.05); }}
                className="py-2.5 text-xs font-black uppercase font-mono bg-black/40 text-slate-300 border border-slate-800 rounded-xl hover:bg-black/60"
              >
                ABORT
              </button>
              <button
                onClick={handleAbsoluteReset}
                className="py-2.5 text-xs font-black uppercase font-mono bg-gradient-to-r from-red-600 to-rose-700 text-white border border-red-500/40 rounded-xl hover:brightness-110"
              >
                CONFIRM WIPE
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#0e1017]/95 backdrop-blur-md border-b-2 border-cyan-500/80 shadow-[0_4px_20px_rgba(0,240,255,0.15)] px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-yellow-400 to-pink-500 uppercase italic">
              SPRITEDEX
            </h1>
          </div>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-xl bg-slate-900 border-2 border-slate-700/60">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col gap-5 pb-12 style={{ willChange: 'transform' }}">
        <section className="sticky top-[86px] z-30 bg-[#151824]/95 backdrop-blur-md rounded-2xl p-4 border-2 border-slate-800 shadow-xl transform-gpu backface-hidden">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-black text-gray-200 tracking-wider font-mono">SPRITE PROGRESS</span>
            <button
              onClick={() => { setShowResetConfirm(true); playBeep(330, 'sine', 0.08); }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 text-[9px] font-mono font-black text-red-400 tracking-wider uppercase"
            >
              <RotateCcw className="w-3 h-3" />
              RESET ARCHIVE
            </button>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 font-mono">COMPLETION PERCENTAGE</span>
            <span className="text-xl font-black text-cyan-400 font-mono">{completionRate}%</span>
          </div>
          <div className="w-full bg-black/60 h-4 rounded-md overflow-hidden p-0.5 border border-slate-700/50">
            <div className="bg-gradient-to-r from-cyan-400 via-yellow-400 to-pink-500 h-full rounded transition-all duration-300" style={{ width: `${completionRate}%` }} />
          </div>
        </section>

        <section className="flex flex-col gap-2 bg-[#12141f] p-3 rounded-xl border border-slate-800/80 transform-gpu backface-hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-cyan-500/70 absolute left-3 top-3" />
            <input
              type="text" placeholder="Search across core sprites..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border-2 border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto py-1">
            {['All', 'Mythic', 'Legendary', 'Epic', 'Rare'].map(rarity => (
              <button key={rarity} onClick={() => setRarityFilter(rarity)} className={`px-3 py-1.5 text-[10px] font-black tracking-wider rounded-lg border uppercase ${rarityFilter === rarity ? 'bg-cyan-400 text-black border-cyan-300' : 'bg-black/40 text-slate-400 border-slate-800'}`}>
                {rarity}
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          {filteredSprites.map(sprite => {
            const status = collection[sprite.id] || { base: false, gold: false, gummy: false, galaxy: false };

            const validVariantsInRow = variantsList.filter(v => sprite.rates[v] !== "N/A");
            const masteredCount = validVariantsInRow.filter(v => status[v]).length;
            const totalValidCount = validVariantsInRow.length;

            const rarityStyle = RARITY_COLORS[sprite.rarity] || 'bg-slate-700 text-white';
            const spriteBgGradient = RARITY_BG_GRADIENTS[sprite.rarity] || 'from-slate-700 to-slate-900';

            // --- DETERMINE THE TRUE ISOLATED ACTIVE TAB ---
            const currentTab = activeTabs[sprite.id] || 'base';
            const variantModifier = getVariantModifierText(currentTab);

            return (
              <article
                key={sprite.id}
                className={`bg-[#151722] rounded-2xl overflow-hidden border-2 transition-all duration-200 transform-gpu backface-hidden ${masteredCount === totalValidCount ? 'border-yellow-400 shadow-[0_0_15px_rgba(255,230,0,0.15)]' : 'border-slate-800/90'}`}
                style={{ willChange: 'transform, opacity' }}
              >
                <div className="p-4 flex gap-4">

                  <div className={`w-24 h-24 bg-gradient-to-b ${spriteBgGradient} rounded-xl p-0.5 border-2 border-white/10 relative overflow-hidden flex-shrink-0 transform-gpu backface-hidden`}>
                    {variantsList.map(v => {
                      if (sprite.rates[v] === "N/A") return null;
                      const isVisible = currentTab === v;

                      return (
                        <img
                          key={v}
                          src={sprite.images[v]}
                          alt={`${sprite.name} ${v}`}
                          className={`absolute inset-0 w-full h-full object-contain rounded-lg p-1 transform-gpu transition-opacity duration-150 will-change-opacity ${isVisible ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        />
                      );
                    })}
                    <span className="absolute bottom-1 right-1 bg-black/80 font-mono text-[9px] font-black text-cyan-400 px-1.5 rounded border border-slate-700/60 z-20">
                      {masteredCount}/{totalValidCount}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-black text-md text-white tracking-tight uppercase italic">{sprite.name}</h4>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-[8px] bg-slate-900 text-slate-400 font-mono font-bold px-1.5 py-0.5 rounded border border-slate-800">
                          {getDynamicSummonCost(sprite.rarity, currentTab)} DUST
                        </span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md border ${rarityStyle}`}>
                          {sprite.rarity}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mt-1 bg-cyan-950/40 border border-cyan-800/20 rounded-md px-2 py-0.5 w-fit">
                      <Percent className="w-3 h-3 text-cyan-400" />
                      <span className="text-[10px] font-mono font-black text-white">
                        {sprite.rates[currentTab]}
                      </span>
                    </div>

                    <div className="mt-2.5 bg-black/20 rounded-lg p-2 border border-slate-800/40">
                      <p className="text-xs text-slate-300">
                        <span className="font-mono text-[9px] font-black text-cyan-400 block tracking-wider uppercase">
                          BASE SPRITE PERK:
                        </span>
                        {sprite.baseAbility}
                      </p>
                    </div>

                    <div className="mt-2 min-h-[56px] rounded-lg p-2 border border-slate-800/30 bg-black/40 flex items-center">
                      <div className="w-full text-left">
                        {variantModifier ? (
                          <p className="text-xs text-slate-200">
                            <span className="font-mono text-[9px] font-black text-yellow-400 block tracking-wider uppercase">
                              +{currentTab.toUpperCase()} STYLE MODIFIER:
                            </span>
                            {variantModifier}
                          </p>
                        ) : (
                          <div className="w-full opacity-95">
                            <span className="font-mono text-[9px] font-black text-slate-500 block tracking-wider uppercase mb-0.5">
                              GLOBAL STYLE BONUSES
                            </span>
                            <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
                              <span className="text-amber-400 font-bold">GOLD:</span> 3x Elims XP <span className="text-slate-600 px-0.5">|</span> <span className="text-pink-400 font-bold">GUMMY:</span> +20% Dust <span className="text-slate-600 px-0.5">|</span> <span className="text-purple-400 font-bold">GALAXY:</span> +30% Ammo
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 border-t-2 border-slate-800/80 bg-black/40">
                  {variantsList.map(variant => {
                    const isNa = sprite.rates[variant] === "N/A";
                    const isChecked = status[variant];

                    if (isNa) {
                      return (
                        <div
                          key={variant}
                          className="py-3 flex flex-col items-center justify-center bg-black/20 border-r border-slate-800/20 last:border-0 select-none text-slate-700"
                        >
                          <span className="text-[9px] font-mono tracking-widest font-bold opacity-30">{variant.toUpperCase()}</span>
                          <span className="text-[10px] font-mono font-black tracking-tighter mt-1 opacity-40">N/A</span>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={variant}
                        onClick={() => handleTabClick(sprite.id, variant)}
                        className={`py-3 flex flex-col items-center gap-1.5 border-r border-slate-800/40 last:border-0 transition-all transform-gpu ${isChecked ? `${VARIANT_INFO[variant].color} bg-slate-900/40 font-black` : 'text-slate-600'}`}
                      >
                        <span className="text-[9px] font-mono tracking-widest font-bold">{variant.toUpperCase()}</span>
                        {isChecked ? <CheckCircle className="w-4 h-4 text-current" /> : <Circle className="w-4 h-4 opacity-40" />}
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}