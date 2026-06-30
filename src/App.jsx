import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivacyPolicy from './PrivacyPolicy';
import {
  Search, CheckCircle, Circle, Volume2, VolumeX, Percent, RotateCcw, AlertTriangle, X, Eye, Grid, Crown, Users, UserPlus, ChevronLeft, ChevronRight, Check, XCircle, UserMinus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';
// --- FIRESTORE & AUTH IMPORTS ---
import { doc, getDoc, setDoc, updateDoc, collection as firestoreCollection, query, where, getDocs, arrayUnion, arrayRemove, deleteDoc, onSnapshot } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from './firebase';

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

const variantsList = ['base', 'gold', 'gummy', 'galaxy'];

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

const totalPossibleStatic = SPRITES_DATABASE.reduce((acc, sprite) => {
  const validCount = variantsList.filter(v => sprite.rates[v] !== "N/A").length;
  return acc + validCount;
}, 0);

const UNOFFICIAL_LEAKS_DATABASE = [
  { file: "ESD_ZeroPointSprite_Variant_Gem", sprite: "Zero Point", variant: "Gem", type: "Style Variant" },
  { file: "ESD_ZeroPointSprite_Variant_Holofoil", sprite: "Zero Point", variant: "Holofoil", type: "Style Variant" },
  { file: "ESD_ZeroPointSprite_Variant_Cube", sprite: "Zero Point", variant: "Cube", type: "Style Variant" },
  { file: "ESD_ZeroPointSprite_Variant_Quack", sprite: "Zero Point", variant: "Quack", type: "Style Variant" },
  { file: "ESD_PunkSprite_Variant_Gem", sprite: "Punk", variant: "Gem", type: "Style Variant" },
  { file: "ESD_PunkSprite_Variant_Cube", sprite: "Punk", variant: "Cube", type: "Style Variant" },
  { file: "ESD_SleepySprite_Variant_Gem", sprite: "Dream", variant: "Gem", type: "NEW SPRITE TYPE" },
  { file: "ESD_SleepySprite_Variant_Cube", sprite: "Dream", variant: "Cube", type: "NEW SPRITE TYPE" },
  { file: "ESD_DuckSprite_Variant_Gem", sprite: "Duck", variant: "Gem", type: "Style Variant" },
  { file: "ESD_DuckSprite_Variant_Holofoil", sprite: "Duck", variant: "Holofoil", type: "Style Variant" },
  { file: "ESD_DemonSprite_Variant_Gem", sprite: "Demon", variant: "Gem", type: "Style Variant" },
  { file: "ESD_GhostSprite_Variant_Gem", sprite: "Ghost", variant: "Gem", type: "Style Variant" },
  { file: "ESD_GhostSprite_Variant_Holofoil", sprite: "Ghost", variant: "Holofoil", type: "Style Variant" },
  { file: "ESD_KingSprite_Variant_Holofoil", sprite: "King", variant: "Holofoil", type: "Style Variant" },
  { file: "ESD_Water_Variant_Gem", sprite: "Water", variant: "Gem", type: "Style Variant" },
  { file: "ESD_Water_Variant_Holofoil", sprite: "Water", variant: "Holofoil", type: "Style Variant" },
  { file: "ESD_EarthSprite_Variant_Gem", sprite: "Earth", variant: "Gem", type: "Style Variant" },
  { file: "ESD_EarthSprite_Variant_Holofoil", sprite: "Earth", variant: "Holofoil", type: "Style Variant" },
  { file: "ESD_Spitfire_Variant_Gem", sprite: "Fire", variant: "Gem", type: "NEW SPRITE TYPE" },
  { file: "ESD_Spitfire_Variant_Holofoil", sprite: "Fire", variant: "Holofoil", type: "NEW SPRITE TYPE" }
];

const PROFANITY_LIST = [
  'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'whore', 'slut', 'fag', 'nigger', 'nigga', 'cock', 'bastard', 'crap'
];

const VARIANT_INFO = {
  base: { name: "Base", color: "text-blue-400" },
  gold: { name: "Gold", color: "text-amber-400" },
  gummy: { name: "Gummy", color: "text-pink-500" },
  galaxy: { name: "Galaxy", color: "text-purple-400" }
};

const LEAK_VARIANT_COLORS = {
  Gem: "border-emerald-500/40 text-emerald-400 bg-emerald-950/20",
  Holofoil: "border-fuchsia-500/40 text-fuchsia-400 bg-fuchsia-950/20",
  Cube: "border-purple-500/40 text-purple-400 bg-purple-950/20",
  Quack: "border-yellow-500/40 text-yellow-400 bg-yellow-950/20"
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

// --- RENAME ORIGINAL COMPONENT TO MainApp ---
function MainApp() {
  const { user, signUp, logIn, logOut } = useAuth();

  // --- AUTH STATES ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  // --- USER PROFILE STATES ---
  const [spriteId, setSpriteId] = useState(null);
  const [isSettingSpriteId, setIsSettingSpriteId] = useState(false);
  const [desiredSpriteId, setDesiredSpriteId] = useState('');
  const [spriteIdError, setSpriteIdError] = useState('');

  // --- NAVIGATION & UI STATES ---
  const [currentView, setCurrentView] = useState('sprites');
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState('All');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showUnfriendConfirm, setShowUnfriendConfirm] = useState(null);
  const [viewingTabs, setViewingTabs] = useState({});
  const audioCtxRef = useRef(null);

  // --- DATA STATES ---
  const [collection, setCollection] = useState({});
  const [mastery, setMastery] = useState({});

  // --- FRIEND & INSPECTION STATES ---
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [friendSearchResult, setFriendSearchResult] = useState(null);
  const [friendSearchStatus, setFriendSearchStatus] = useState('');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [richFriends, setRichFriends] = useState([]); // Leaderboard state
  const [activeViewingFriend, setActiveViewingFriend] = useState(null);

  // Pre-load images
  useEffect(() => {
    SPRITES_DATABASE.forEach(sprite => {
      Object.values(sprite.images).forEach(src => {
        const img = new Image();
        img.src = src;
      });
    });
  }, []);

  // Fetch Cloud Data on Login (Real-time listeners)
  useEffect(() => {
    if (!user) {
      setCollection({});
      setMastery({});
      setSpriteId(null);
      setFriendsList([]);
      setPendingRequests([]);
      setSentRequests([]);
      setRichFriends([]);
      setActiveViewingFriend(null);
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const unsubUser = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCollection(data.sprites || {});
        setMastery(data.mastery || {});
        setFriendsList(data.friends || []);
        if (data.spriteId) {
          setSpriteId(data.spriteId);
        } else {
          setIsSettingSpriteId(true);
        }
      } else {
        setIsSettingSpriteId(true);
      }
    });

    const reqsQuery = query(firestoreCollection(db, "friend_requests"), where("receiverId", "==", user.uid));
    const unsubReqs = onSnapshot(reqsQuery, (snapshot) => {
      setPendingRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const sentReqsQuery = query(firestoreCollection(db, "friend_requests"), where("senderId", "==", user.uid));
    const unsubSentReqs = onSnapshot(sentReqsQuery, (snapshot) => {
      setSentRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubUser(); unsubReqs(); unsubSentReqs(); };
  }, [user]);

  // Fetch Completion Stats for Leaderboard
  useEffect(() => {
    const fetchRichFriends = async () => {
      if (!friendsList || friendsList.length === 0) {
        setRichFriends([]);
        return;
      }

      const promises = friendsList.map(async (friend) => {
        if (typeof friend === 'string') return null; // Legacy protection
        try {
          const docSnap = await getDoc(doc(db, "users", friend.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            const sprites = data.sprites || {};
            let tCollected = 0;

            SPRITES_DATABASE.forEach(sprite => {
              const status = sprites[sprite.id] || {};
              tCollected += variantsList.filter(v => sprite.rates[v] !== "N/A" && status[v]).length;
            });

            const cRate = totalPossibleStatic > 0 ? Math.round((tCollected / totalPossibleStatic) * 100) : 0;
            return { ...friend, completionRate: cRate };
          }
        } catch (e) {
          console.error("Error fetching friend data:", e);
        }
        return { ...friend, completionRate: 0 };
      });

      const results = await Promise.all(promises);
      const validResults = results.filter(Boolean);

      // Sort Highest Completion to Lowest
      validResults.sort((a, b) => b.completionRate - a.completionRate);
      setRichFriends(validResults);
    };

    fetchRichFriends();
  }, [friendsList]);

  const playBeep = (freq, type = 'sine', duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
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

  const handleSaveSpriteId = async (e) => {
    e.preventDefault();
    setSpriteIdError('');
    if (desiredSpriteId.length < 3) {
      setSpriteIdError('Sprite ID must be at least 3 characters.');
      return;
    }
    if (PROFANITY_LIST.some(word => desiredSpriteId.toLowerCase().includes(word))) {
      setSpriteIdError('Please choose a more appropriate Sprite ID.');
      return;
    }
    try {
      const q = query(firestoreCollection(db, "users"), where("spriteId", "==", desiredSpriteId.toLowerCase()));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setSpriteIdError('That Sprite ID is already taken!');
        return;
      }
      await setDoc(doc(db, "users", user.uid), { spriteId: desiredSpriteId.toLowerCase(), friends: [] }, { merge: true });
      setSpriteId(desiredSpriteId.toLowerCase());
      setIsSettingSpriteId(false);
    } catch (error) {
      setSpriteIdError('An error occurred. Try again.');
    }
  };

  const handleToggleCheck = (spriteId, variant) => {
    const currentVal = collection[spriteId]?.[variant];
    const newVal = !currentVal;

    if (newVal) {
      if (variant === 'galaxy') playBeep(880, 'triangle', 0.15);
      else if (variant === 'gold') playBeep(659, 'sine', 0.1);
      else if (variant === 'gummy') playBeep(587, 'sine', 0.1);
      else playBeep(440, 'sine', 0.08);
    } else {
      playBeep(220, 'sine', 0.1);
      if (mastery[spriteId]?.[variant]) toggleMastery(spriteId, variant, false);
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

      if (user) {
        setDoc(doc(db, "users", user.uid), { sprites: updated }, { merge: true })
          .catch(err => console.error("Cloud save failed:", err));
      }

      return updated;
    });
  };

  const toggleMastery = (spriteId, variant, forceValue = null) => {
    setMastery(prev => {
      const currentSpriteMastery = prev[spriteId] || { base: false, gold: false, gummy: false, galaxy: false };
      const isCurrentlyMastered = currentSpriteMastery[variant];
      const newVal = forceValue !== null ? forceValue : !isCurrentlyMastered;

      const updated = { ...prev, [spriteId]: { ...currentSpriteMastery, [variant]: newVal } };

      if (newVal) {
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 }, colors: ['#FFD700', '#FFA500', '#DAA520', '#FFF8DC'] });
        playBeep(1046.50, 'sine', 0.2);
      } else {
        playBeep(220, 'sawtooth', 0.1);
      }

      if (user) {
        setDoc(doc(db, "users", user.uid), { mastery: updated }, { merge: true })
          .catch(err => console.error("Cloud save failed:", err));
      }

      return updated;
    });
  };

  const handleAbsoluteReset = () => {
    setCollection({});
    setMastery({});
    setViewingTabs({});
    setShowResetConfirm(false);

    if (user) {
      setDoc(doc(db, "users", user.uid), { sprites: {}, mastery: {} }, { merge: true });
    }

    playBeep(180, 'sawtooth', 0.3);
  };

  const handlePasswordReset = () => {
    if (!email) {
      alert("Please enter your email address in the field above first.");
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setResetSent(true);
        setTimeout(() => setResetSent(false), 6000);
      })
      .catch((error) => alert(error.message));
  };

  // --- SOCIAL OPERATIONS ---
  const handleSearchFriend = async () => {
    if (!friendSearchQuery || friendSearchQuery.toLowerCase() === spriteId) return;
    setFriendSearchStatus('searching');
    try {
      const q = query(firestoreCollection(db, "users"), where("spriteId", "==", friendSearchQuery.toLowerCase()));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setFriendSearchResult({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
        setFriendSearchStatus('found');
      } else {
        setFriendSearchResult(null);
        setFriendSearchStatus('not-found');
      }
    } catch (e) {
      setFriendSearchStatus('error');
    }
  };

  const handleSendFriendRequest = async () => {
    if (!friendSearchResult) return;
    try {
      const requestRef = doc(db, "friend_requests", `${user.uid}_${friendSearchResult.id}`);
      await setDoc(requestRef, {
        senderId: user.uid,
        senderSpriteId: spriteId,
        receiverId: friendSearchResult.id,
        receiverSpriteId: friendSearchResult.spriteId,
        status: 'pending',
        timestamp: new Date()
      });
      alert('Friend request sent!');
      setFriendSearchResult(null);
      setFriendSearchQuery('');
      setFriendSearchStatus('');
    } catch (e) {
      alert('Failed to send request. Make sure Firestore rules are updated.');
    }
  };

  const acceptFriendRequest = async (req) => {
    try {
      await updateDoc(doc(db, "users", user.uid), { friends: arrayUnion({ uid: req.senderId, spriteId: req.senderSpriteId }) });
      await updateDoc(doc(db, "users", req.senderId), { friends: arrayUnion({ uid: user.uid, spriteId: spriteId }) });
      await deleteDoc(doc(db, "friend_requests", req.id));
      playBeep(880, 'sine', 0.1);
    } catch (e) {
      console.error(e);
    }
  };

  const cancelFriendRequest = async (reqId) => {
    try {
      await deleteDoc(doc(db, "friend_requests", reqId));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnfriendExecution = async () => {
    if (!showUnfriendConfirm) return;
    const target = showUnfriendConfirm;
    try {
      // Create objects to remove exactly as they were added
      const targetObj = { uid: target.uid, spriteId: target.spriteId };
      const selfObj = { uid: user.uid, spriteId: spriteId };

      await updateDoc(doc(db, "users", user.uid), { friends: arrayRemove(targetObj) });
      await updateDoc(doc(db, "users", target.uid), { friends: arrayRemove(selfObj) });
      setShowUnfriendConfirm(null);
      playBeep(220, 'sawtooth', 0.15);
    } catch (e) {
      console.error(e);
    }
  };

  const inspectFriendLibrary = async (friendObj) => {
    try {
      const docRef = doc(db, "users", friendObj.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setActiveViewingFriend({
          spriteId: friendObj.spriteId,
          completionRate: friendObj.completionRate || 0,
          sprites: docSnap.data().sprites || {},
          mastery: docSnap.data().mastery || {}
        });
      }
    } catch (e) {
      alert("Could not fetch friend data.");
    }
  };

  const totalCollected = SPRITES_DATABASE.reduce((acc, sprite) => {
    const status = collection[sprite.id] || {};
    const validChecked = variantsList.filter(v => sprite.rates[v] !== "N/A" && status[v]).length;
    return acc + validChecked;
  }, 0);

  const completionRate = totalPossibleStatic > 0 ? Math.round((totalCollected / totalPossibleStatic) * 100) : 0;
  const isMasteryView = currentView === 'mastery';

  const filteredSprites = SPRITES_DATABASE.filter(sprite => {
    const matchesSearch = sprite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sprite.baseAbility.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = rarityFilter === 'All' || sprite.rarity === rarityFilter;

    if (isMasteryView) {
      const spriteMastery = mastery[sprite.id] || {};
      const hasMastery = variantsList.some(v => spriteMastery[v] === true);
      return matchesSearch && matchesRarity && hasMastery;
    }
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

  // --- LOGIN UI ---
  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden relative font-sans px-4">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600 rounded-full blur-[120px] opacity-20 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-600 rounded-full blur-[120px] opacity-15 pointer-events-none" />

        <div className="bg-white/[0.03] backdrop-blur-xl p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl z-10 transition-all duration-300 hover:border-white/15">
          <div className="flex flex-col items-center text-center mb-8">
            <img src="/app_icon.webp" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] object-contain mb-4 animate-pulse duration-[4000ms]" alt="Spritedex Logo" />
            <h1 className="text-white text-3xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Spritedex
            </h1>
            <p className="text-purple-400 text-sm font-semibold uppercase tracking-wider mb-1">Master your collection</p>
            <p className="text-slate-400 text-xs max-w-xs px-2">Track every sprite, sync across your devices, and monitor your personal collection in real-time.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); isLoginMode ? logIn(email, password).catch(err => alert(err.message)) : signUp(email, password).catch(err => alert(err.message)); }} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-xs font-medium uppercase tracking-wide mb-2">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm" placeholder="name@example.com" required />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-slate-300 text-xs font-medium uppercase tracking-wide">Password</label>
              </div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm" placeholder="••••••••" required />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl py-3 px-4 shadow-lg shadow-purple-900/30 transition-all duration-200 transform active:scale-[0.98] mt-2 text-sm">
              {isLoginMode ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-white/5 pt-5 flex flex-col gap-3">
            <p className="text-slate-400 text-sm">
              {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
              <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} className="text-purple-400 font-medium hover:text-purple-300 hover:underline transition-all bg-transparent border-none p-0 cursor-pointer">
                {isLoginMode ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
            {isLoginMode && (
              <button type="button" onClick={handlePasswordReset} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                {resetSent ? "Reset link sent!" : "Forgot Password?"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- SPRITE ID ONBOARDING OVERLAY ---
  if (isSettingSpriteId) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_30px_rgba(0,240,255,0.1)]">
          <div className="w-16 h-16 bg-cyan-950/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
            <Users className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase italic mb-2">Claim Your Sprite ID</h2>
          <p className="text-sm text-slate-400 mb-6">
            We're launching new social features! Set your unique public Sprite ID so your friends can find you.
          </p>
          <form onSubmit={handleSaveSpriteId} className="space-y-4">
            <div>
              <input
                type="text"
                value={desiredSpriteId}
                onChange={(e) => setDesiredSpriteId(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                placeholder="e.g. ImBearKat"
                className="w-full bg-black border-2 border-slate-700 rounded-xl px-4 py-3 text-white text-center font-bold tracking-wider focus:border-cyan-500 focus:outline-none"
              />
              {spriteIdError && <p className="text-red-400 text-xs mt-2 font-bold">{spriteIdError}</p>}
            </div>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase rounded-xl py-3 transition-colors">
              Lock it in
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col font-sans select-none relative">

      {/* --- MODAL: ABSOLUTE DATA RESET --- */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12141f] border-2 border-red-500/60 rounded-2xl p-6 max-w-sm w-full text-center relative">
            <button onClick={() => { setShowResetConfirm(false); playBeep(440, 'sine', 0.05); }} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg bg-black/40 border border-slate-800">
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
              <button onClick={() => { setShowResetConfirm(false); playBeep(440, 'sine', 0.05); }} className="py-2.5 text-xs font-black uppercase font-mono bg-black/40 text-slate-300 border border-slate-800 rounded-xl hover:bg-black/60">ABORT</button>
              <button onClick={handleAbsoluteReset} className="py-2.5 text-xs font-black uppercase font-mono bg-gradient-to-r from-red-600 to-rose-700 text-white border border-red-500/40 rounded-xl hover:brightness-110">CONFIRM WIPE</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: THEMED UNFRIEND CONFIRMATION --- */}
      {showUnfriendConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12141f] border-2 border-amber-500/60 rounded-2xl p-6 max-w-sm w-full text-center relative">
            <button onClick={() => setShowUnfriendConfirm(null)} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg bg-black/40">
              <X className="w-4 h-4" />
            </button>
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-950/60 border border-amber-500/40 flex items-center justify-center mb-4">
              <UserMinus className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-black tracking-tight text-white uppercase italic">REMOVE FRIEND?</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Are you sure you want to remove <span className="text-amber-400 font-bold">@{showUnfriendConfirm.spriteId}</span>? This severs connection access across both profiles immediately.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setShowUnfriendConfirm(null)} className="py-2.5 text-xs font-black uppercase font-mono bg-black/40 text-slate-300 border border-slate-800 rounded-xl">CANCEL</button>
              <button onClick={handleUnfriendExecution} className="py-2.5 text-xs font-black uppercase font-mono bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl">UNFRIEND</button>
            </div>
          </div>
        </div>
      )}

      {/* --- LAYER: READ ONLY FRIEND COLLECTION INSPECTOR --- */}
      {activeViewingFriend && (
        <div className="fixed inset-0 z-50 bg-[#0b0c10] flex flex-col animate-in slide-in-from-bottom duration-300 overflow-y-auto pb-12">

          <header className="bg-[#0e1017]/95 backdrop-blur-md border-b-2 border-indigo-500 p-4 sticky top-0 z-50 shadow-[0_4px_20px_rgba(99,102,241,0.15)]">
            <div className="max-w-md mx-auto w-full flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-black text-indigo-400 uppercase tracking-widest block">INSPECTING ARCHIVE</span>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black italic uppercase text-white">@{activeViewingFriend.spriteId}</h2>
                  <span className="bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 text-[10px] font-black px-2 py-0.5 rounded-md">
                    {activeViewingFriend.completionRate}%
                  </span>
                </div>
              </div>
              <button onClick={() => setActiveViewingFriend(null)} className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-black text-slate-300 hover:text-white transition-colors">
                <X className="w-4 h-4" /> CLOSE VIEW
              </button>
            </div>
          </header>

          <div className="max-w-md w-full mx-auto p-4 flex flex-col gap-4">
            {SPRITES_DATABASE.map(sprite => {
              const friendStatus = activeViewingFriend.sprites[sprite.id] || {};
              const friendMastery = activeViewingFriend.mastery[sprite.id] || {};
              const validVariantsInRow = variantsList.filter(v => sprite.rates[v] !== "N/A");

              const currentTab = viewingTabs[`inspect_${sprite.id}`] || 'base';

              const handleInspectPrev = (e) => {
                e.stopPropagation();
                const currentIndex = validVariantsInRow.indexOf(currentTab);
                const newIndex = currentIndex === 0 ? validVariantsInRow.length - 1 : currentIndex - 1;
                setViewingTabs(prev => ({ ...prev, [`inspect_${sprite.id}`]: validVariantsInRow[newIndex] }));
              };

              const handleInspectNext = (e) => {
                e.stopPropagation();
                const currentIndex = validVariantsInRow.indexOf(currentTab);
                const newIndex = currentIndex === validVariantsInRow.length - 1 ? 0 : currentIndex + 1;
                setViewingTabs(prev => ({ ...prev, [`inspect_${sprite.id}`]: validVariantsInRow[newIndex] }));
              };

              return (
                <article key={sprite.id} className="bg-[#151722] rounded-2xl overflow-hidden border-2 border-slate-800/90 flex flex-col">
                  <div className="p-4 flex gap-4">

                    <div className="flex flex-col gap-2 w-24 flex-shrink-0">
                      <div className={`w-24 h-24 bg-gradient-to-b ${RARITY_BG_GRADIENTS[sprite.rarity]} rounded-xl p-0.5 border-2 relative overflow-hidden ${friendMastery[currentTab] ? 'border-yellow-400' : 'border-white/10'}`}>

                        {friendMastery[currentTab] && (
                          <div className="absolute top-1 right-1 z-40 bg-black/60 rounded-full p-0.5 border border-yellow-500/50">
                            <Crown className="w-4 h-4 text-yellow-400" />
                          </div>
                        )}

                        {validVariantsInRow.length > 1 && (
                          <>
                            <button onClick={handleInspectPrev} className="absolute left-0 top-0 bottom-0 px-0.5 z-30 flex items-center justify-center transition-transform hover:scale-110">
                              <ChevronLeft className="w-5 h-5 text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]" />
                            </button>
                            <button onClick={handleInspectNext} className="absolute right-0 top-0 bottom-0 px-0.5 z-30 flex items-center justify-center transition-transform hover:scale-110">
                              <ChevronRight className="w-5 h-5 text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]" />
                            </button>
                          </>
                        )}

                        {variantsList.map(v => {
                          if (sprite.rates[v] === "N/A") return null;
                          const isVisible = currentTab === v;
                          return (
                            <img
                              key={v}
                              src={sprite.images[v]}
                              alt=""
                              className={`absolute inset-0 w-full h-full object-contain p-1 z-10 transition-opacity duration-150 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                            />
                          );
                        })}
                      </div>

                      {friendStatus[currentTab] && (
                        <div className={`w-full py-1.5 rounded-lg text-[9px] font-black uppercase text-center border flex items-center justify-center gap-1 ${friendMastery[currentTab] ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                          {friendMastery[currentTab] ? <><Crown className="w-3 h-3" /> Mastered</> : <><CheckCircle className="w-3 h-3" /> Collected</>}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-md text-white uppercase italic">{sprite.name}</h4>
                      </div>
                      <div className="mt-2 bg-black/20 rounded-lg p-2 border border-slate-800/40 text-xs text-slate-300">
                        {sprite.baseAbility}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 border-t border-slate-800 bg-black/20">
                    {variantsList.map(v => {
                      if (sprite.rates[v] === "N/A") return <div key={v} className="py-2 text-center text-[9px] text-slate-800 font-bold border-r border-slate-800/40 last:border-r-0">N/A</div>;

                      return (
                        <button
                          key={v}
                          onClick={() => setViewingTabs({ ...viewingTabs, [`inspect_${sprite.id}`]: v })}
                          className={`py-3 flex flex-col items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider border-r border-slate-800/40 last:border-r-0 transition-colors ${currentTab === v ? 'bg-slate-800/40 text-white' : 'text-slate-600'}`}
                        >
                          {v}
                          {friendMastery[v] ? (
                            <Crown className="w-4 h-4 text-yellow-400 drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]" />
                          ) : friendStatus[v] ? (
                            <CheckCircle className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <div className="w-4 h-4" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#0e1017]/95 backdrop-blur-md border-b-2 border-cyan-500/80 shadow-[0_4px_20px_rgba(0,240,255,0.15)] px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-yellow-400 to-pink-500 uppercase italic">
              SPRITEDEX
            </h1>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">ID: {spriteId}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={logOut} className="text-[10px] text-red-400 font-bold uppercase tracking-widest hover:text-red-300 transition-colors">
              Logout
            </button>
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-xl bg-slate-900 border-2 border-slate-700/60">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col gap-5 pb-24" style={{ willChange: 'transform' }}>

        {/* --- MAIN VIEWS (SPRITES / MASTERY) --- */}
        {(currentView === 'sprites' || currentView === 'mastery') && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">

            {currentView === 'sprites' && (
              <section className="sticky top-[86px] z-30 bg-[#151824]/95 backdrop-blur-md rounded-2xl p-4 border-2 border-slate-800 shadow-xl transform-gpu backface-hidden">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-black text-gray-200 tracking-wider font-mono">SPRITE PROGRESS</span>
                  <button onClick={() => { setShowResetConfirm(true); playBeep(330, 'sine', 0.08); }} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 text-[9px] font-mono font-black text-red-400 tracking-wider uppercase">
                    <RotateCcw className="w-3 h-3" /> RESET ARCHIVE
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
            )}

            {isMasteryView && (
              <section className="bg-gradient-to-r from-yellow-900/40 to-amber-900/20 border-2 border-yellow-500/50 rounded-2xl p-5 mb-2">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-lg font-black text-yellow-400 uppercase italic">Mastery Vault</h2>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your most prestigious assets. Only variants that have reached Level 5 and earned a crown are displayed here.
                </p>
              </section>
            )}

            <section className="flex flex-col gap-2 bg-[#12141f] p-3 rounded-xl border border-slate-800/80 transform-gpu backface-hidden">
              <div className="relative">
                <Search className="w-4 h-4 text-cyan-500/70 absolute left-3 top-3" />
                <input
                  type="text" placeholder="Search sprites..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/50 border-2 border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
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
              {filteredSprites.length === 0 && isMasteryView && (
                <div className="text-center p-8 bg-[#12141f] rounded-2xl border border-slate-800">
                  <Crown className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest">No Crowns Yet</p>
                  <p className="text-xs text-slate-500 mt-2">Level up a variant and mark it as mastered to see it here.</p>
                </div>
              )}

              {filteredSprites.map(sprite => {
                const status = collection[sprite.id] || { base: false, gold: false, gummy: false, galaxy: false };
                const spriteMastery = mastery[sprite.id] || { base: false, gold: false, gummy: false, galaxy: false };

                const validVariantsInRow = variantsList.filter(v => sprite.rates[v] !== "N/A");
                const masteredCount = validVariantsInRow.filter(v => status[v]).length;
                const totalValidCount = validVariantsInRow.length;

                const rarityStyle = RARITY_COLORS[sprite.rarity] || 'bg-slate-700 text-white';
                const spriteBgGradient = RARITY_BG_GRADIENTS[sprite.rarity] || 'from-slate-700 to-slate-900';

                const currentTab = viewingTabs[sprite.id] || 'base';

                const handlePrevImage = (e) => {
                  e.stopPropagation();
                  const currentIndex = validVariantsInRow.indexOf(currentTab);
                  const newIndex = currentIndex === 0 ? validVariantsInRow.length - 1 : currentIndex - 1;
                  setViewingTabs(prev => ({ ...prev, [sprite.id]: validVariantsInRow[newIndex] }));
                };

                const handleNextImage = (e) => {
                  e.stopPropagation();
                  const currentIndex = validVariantsInRow.indexOf(currentTab);
                  const newIndex = currentIndex === validVariantsInRow.length - 1 ? 0 : currentIndex + 1;
                  setViewingTabs(prev => ({ ...prev, [sprite.id]: validVariantsInRow[newIndex] }));
                };

                const variantModifier = getVariantModifierText(currentTab);
                const isCurrentTabCollected = status[currentTab];
                const isCurrentTabMastered = spriteMastery[currentTab];

                return (
                  <article
                    key={sprite.id}
                    className={`bg-[#151722] rounded-2xl overflow-hidden border-2 transition-all duration-300 transform-gpu backface-hidden border-slate-800/90`}
                  >
                    <div className="p-4 flex gap-4">

                      <div className="flex flex-col gap-2 w-24 flex-shrink-0">
                        <div className={`w-24 h-24 bg-gradient-to-b ${spriteBgGradient} rounded-xl p-0.5 border-2 relative overflow-hidden transform-gpu backface-hidden transition-all duration-300 ${isCurrentTabMastered ? 'border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.4)]' : 'border-white/10'}`}>

                          {isCurrentTabMastered && (
                            <div className="absolute top-1 right-1 z-40 bg-black/60 rounded-full p-0.5 border border-yellow-500/50">
                              <Crown className="w-4 h-4 text-yellow-400 drop-shadow-[0_0_8px_rgba(255,215,0,1)]" />
                            </div>
                          )}

                          {validVariantsInRow.length > 1 && (
                            <>
                              <button onClick={handlePrevImage} className="absolute left-0 top-0 bottom-0 px-0.5 z-30 flex items-center justify-center transition-transform hover:scale-110">
                                <ChevronLeft className="w-5 h-5 text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]" />
                              </button>
                              <button onClick={handleNextImage} className="absolute right-0 top-0 bottom-0 px-0.5 z-30 flex items-center justify-center transition-transform hover:scale-110">
                                <ChevronRight className="w-5 h-5 text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]" />
                              </button>
                            </>
                          )}

                          {variantsList.map(v => {
                            if (sprite.rates[v] === "N/A") return null;
                            const isVisible = currentTab === v;
                            return (
                              <img
                                key={v}
                                src={sprite.images[v]}
                                alt={`${sprite.name} ${v}`}
                                className={`absolute inset-0 w-full h-full object-contain rounded-lg p-1 transform-gpu transition-opacity duration-150 will-change-[opacity] ${isVisible ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                              />
                            );
                          })}
                          <span className="absolute bottom-1 right-1 bg-black/80 font-mono text-[9px] font-black text-cyan-400 px-1.5 rounded border border-slate-700/60 z-20">
                            {masteredCount}/{totalValidCount}
                          </span>
                        </div>

                        {isCurrentTabCollected && !isMasteryView && (
                          <button
                            onClick={() => toggleMastery(sprite.id, currentTab)}
                            className={`w-full py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex flex-col items-center justify-center gap-0.5 transition-all border-2 ${isCurrentTabMastered ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-[0_0_15px_rgba(255,215,0,0.2)]' : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'}`}
                          >
                            <Crown className="w-3.5 h-3.5" />
                            {isCurrentTabMastered ? 'Mastered' : 'Set Lvl 5'}
                          </button>
                        )}

                        {isCurrentTabMastered && isMasteryView && (
                          <div className="w-full py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex flex-col items-center justify-center gap-0.5 text-yellow-400 text-[9px] font-black uppercase text-center">
                            <Crown className="w-3.5 h-3.5" /> Mastered
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-start">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-black text-md text-white tracking-tight uppercase italic">{sprite.name}</h4>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md border ${rarityStyle}`}>
                              {sprite.rarity}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <div className="bg-cyan-950/40 border border-cyan-800/20 rounded-md px-2 py-0.5 flex items-center gap-1">
                            <Percent className="w-3 h-3 text-cyan-400" />
                            <span className="text-[10px] font-mono font-black text-white">{sprite.rates[currentTab]}</span>
                          </div>
                          <span className="text-[8px] bg-slate-900 text-slate-400 font-mono font-bold px-1.5 py-1 rounded border border-slate-800">
                            {getDynamicSummonCost(sprite.rarity, currentTab)} DUST
                          </span>
                        </div>

                        <div className="mt-2.5 bg-black/20 rounded-lg p-2 border border-slate-800/40">
                          <p className="text-xs text-slate-300 leading-tight">
                            <span className="font-mono text-[9px] font-black text-cyan-400 block tracking-wider uppercase mb-0.5">
                              BASE SPRITE PERK:
                            </span>
                            {sprite.baseAbility}
                          </p>
                        </div>

                        <div className="mt-2 min-h-[48px] rounded-lg p-2 border border-slate-800/30 bg-black/40 flex items-center">
                          <div className="w-full text-left">
                            {variantModifier ? (
                              <p className="text-xs text-slate-200">
                                <span className="font-mono text-[9px] font-black text-yellow-400 block tracking-wider uppercase mb-0.5">
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
                                  <span className="text-amber-400 font-bold">GOLD:</span> 3x XP <span className="text-slate-600 px-0.5">|</span> <span className="text-pink-400 font-bold">GUMMY:</span> +20% Dust <span className="text-slate-600 px-0.5">|</span> <span className="text-purple-400 font-bold">GALAXY:</span> +30% Ammo
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
                        const isVariantMastered = spriteMastery[variant];
                        const isActiveTab = currentTab === variant;

                        if (isNa) {
                          return (
                            <div key={variant} className="py-3 flex flex-col items-center justify-center bg-black/20 border-r border-slate-800/20 last:border-r-0 select-none text-slate-700">
                              <span className="text-[9px] font-mono tracking-widest font-bold opacity-30">{variant.toUpperCase()}</span>
                              <span className="text-[10px] font-mono font-black tracking-tighter mt-1 opacity-40">N/A</span>
                            </div>
                          );
                        }

                        let btnStyle = 'text-slate-600 bg-transparent';
                        if (isVariantMastered) {
                          btnStyle = `${VARIANT_INFO[variant].color} bg-yellow-900/20 font-black border-t-2 border-t-yellow-400 shadow-[inset_0_4px_10px_rgba(255,215,0,0.1)]`;
                        } else if (isChecked) {
                          btnStyle = `${VARIANT_INFO[variant].color} bg-slate-900/60 font-black`;
                        }

                        return (
                          <button
                            key={variant}
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingTabs(prev => ({ ...prev, [sprite.id]: variant }));
                              if (!isMasteryView) {
                                handleToggleCheck(sprite.id, variant);
                              }
                            }}
                            className={`py-3 flex flex-col items-center gap-1.5 border-r border-slate-800/40 last:border-r-0 transition-all transform-gpu relative ${btnStyle} ${isActiveTab && !isVariantMastered ? 'bg-slate-800/50' : ''} ${isMasteryView ? 'cursor-pointer' : ''}`}
                          >
                            <span className="text-[9px] font-mono tracking-widest font-bold">{variant.toUpperCase()}</span>

                            {isVariantMastered ? (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            ) : isChecked ? (
                              <CheckCircle className="w-4 h-4 text-current" />
                            ) : (
                              <Circle className="w-4 h-4 opacity-40" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </section>
          </div>
        )}

        {/* --- FRIENDS TAB VIEW --- */}
        {currentView === 'friends' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <section className="bg-gradient-to-br from-indigo-900/40 to-blue-900/20 border-2 border-indigo-500/50 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-indigo-400" />
                <h2 className="text-lg font-black text-indigo-400 uppercase italic">Sprite Squad</h2>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Search for friends by their Sprite ID. Once they accept your request, you can view their collections and crowns.
              </p>
            </section>

            <section className="bg-[#12141f] rounded-2xl border border-slate-800 p-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Add Friend</h3>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={friendSearchQuery}
                    onChange={(e) => setFriendSearchQuery(e.target.value)}
                    placeholder="Search Sprite ID..."
                    className="w-full bg-black border-2 border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button onClick={handleSearchFriend} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-xl flex items-center justify-center transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {friendSearchStatus === 'searching' && <p className="text-xs text-slate-400 mt-3">Searching...</p>}
              {friendSearchStatus === 'not-found' && <p className="text-xs text-red-400 mt-3 font-bold">Sprite ID not found.</p>}
              {friendSearchStatus === 'found' && friendSearchResult && (
                <div className="mt-4 p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-xl flex justify-between items-center animate-in zoom-in-95">
                  <span className="text-sm font-bold text-white">@{friendSearchResult.spriteId}</span>
                  <button onClick={handleSendFriendRequest} className="bg-indigo-500 px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 hover:bg-indigo-400 transition-colors">
                    <UserPlus className="w-4 h-4" /> Request
                  </button>
                </div>
              )}
            </section>

            {/* SENT REQUESTS */}
            {sentRequests.length > 0 && (
              <section className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Sent Requests</h3>
                {sentRequests.map(req => (
                  <div key={req.id} className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-slate-800 mb-2">
                    <span className="text-sm font-bold text-slate-300 tracking-wider">To: @{req.receiverSpriteId}</span>
                    <button onClick={() => cancelFriendRequest(req.id)} className="bg-red-900/40 hover:bg-red-900/60 border border-red-800/50 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-red-400 transition-colors flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                ))}
              </section>
            )}

            {/* PENDING REQUESTS */}
            {pendingRequests.length > 0 && (
              <section className="bg-indigo-950/20 rounded-2xl border border-indigo-500/30 p-4">
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-wider mb-3">Incoming Requests</h3>
                {pendingRequests.map(req => (
                  <div key={req.id} className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-slate-800 mb-2">
                    <span className="text-sm font-bold text-white tracking-wider">@{req.senderSpriteId}</span>
                    <button onClick={() => acceptFriendRequest(req)} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-[10px] font-black uppercase text-white transition-colors flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Accept
                    </button>
                  </div>
                ))}
              </section>
            )}

            {/* RICH LEADERBOARD FRIEND LIST */}
            <section className="bg-[#12141f] rounded-2xl border border-slate-800 p-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Sprite Squad ({richFriends.length})</h3>

              {richFriends.length === 0 ? (
                <div className="text-center py-6">
                  <Users className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-500">No friends added yet.</p>
                  <p className="text-xs text-slate-600 mt-1">Use the search bar above to connect.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {richFriends.map((friend, index) => (
                    <div key={index} className="bg-slate-900 p-3 rounded-xl flex items-center justify-between border border-slate-800/80">

                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-900/50 border border-indigo-500/50 flex items-center justify-center text-[10px] font-black text-indigo-400">
                          #{index + 1}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white tracking-wider flex items-center gap-1">
                            @{friend.spriteId || 'Unknown'}
                          </span>
                          <span className="text-[10px] font-black text-indigo-400 font-mono tracking-widest">
                            {friend.completionRate}% COMPLETE
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => inspectFriendLibrary(friend)} className="text-[10px] bg-indigo-900/40 text-indigo-300 font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-indigo-900/60 border border-indigo-500/30 transition-colors">
                          View
                        </button>
                        <button onClick={() => setShowUnfriendConfirm(friend)} className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-950/30 transition-colors">
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* --- RUMORED TAB VIEW --- */}
        {currentView === 'unreleased' && (
          <section className="flex flex-col gap-4 animate-in fade-in duration-300 pt-2">
            <div className="bg-[#12141f] border-2 border-amber-500/40 rounded-2xl p-5">
              <h3 className="text-lg font-black text-amber-400 uppercase italic mb-2">UNRELEASED / RUMORED</h3>
              <p className="text-xs text-slate-400">Files found in-game for upcoming sprites and variants.</p>
            </div>

            {[...new Set(UNOFFICIAL_LEAKS_DATABASE.map(l => l.sprite))].map((sName) => (
              <div key={sName} className="bg-[#12141f] border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-black text-amber-500 uppercase mb-3 border-b border-slate-800 pb-2">{sName}</h4>
                <div className="flex flex-col gap-2">
                  {UNOFFICIAL_LEAKS_DATABASE.filter(l => l.sprite === sName).map((l, i) => (
                    <div key={i} className="bg-black/40 px-3 py-2 rounded-lg border border-slate-900 flex justify-between items-center">
                      <code className="text-[10px] text-slate-300 font-bold">{l.file}</code>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${LEAK_VARIANT_COLORS[l.variant]}`}>
                        {l.variant}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* --- EXTENDED BOTTOM NAVIGATION BAR --- */}
      <nav className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
        <div className="bg-[#0e1017]/95 backdrop-blur-md border border-slate-800 rounded-2xl w-full max-w-sm px-2 py-2 flex justify-between shadow-2xl">

          <button onClick={() => { setCurrentView('sprites'); setActiveViewingFriend(null); playBeep(440, 'sine', 0.05); }} className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${currentView === 'sprites' && !activeViewingFriend ? 'text-cyan-400' : 'text-slate-600'}`}>
            <Grid className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Sprites</span>
          </button>

          <button onClick={() => { setCurrentView('mastery'); setActiveViewingFriend(null); playBeep(523, 'sine', 0.05); }} className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${currentView === 'mastery' && !activeViewingFriend ? 'text-yellow-400' : 'text-slate-600'}`}>
            <Crown className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Mastery</span>
          </button>

          <button onClick={() => { setCurrentView('friends'); setActiveViewingFriend(null); playBeep(587, 'sine', 0.05); }} className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${currentView === 'friends' || activeViewingFriend ? 'text-indigo-400' : 'text-slate-600'}`}>
            <Users className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Friends</span>
          </button>

          <button onClick={() => { setCurrentView('unreleased'); setActiveViewingFriend(null); playBeep(659, 'sine', 0.05); }} className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${currentView === 'unreleased' && !activeViewingFriend ? 'text-amber-400' : 'text-slate-600'}`}>
            <Eye className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Rumored</span>
          </button>

        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </Router>
  );
}