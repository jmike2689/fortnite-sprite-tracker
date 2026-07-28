import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivacyPolicy from './PrivacyPolicy';
import {
  Search, CheckCircle, Circle, Volume2, VolumeX, Percent, RotateCcw, AlertTriangle, X, Eye, Crown, Users, UserPlus, ChevronLeft, ChevronRight, Check, XCircle, UserMinus, Target, Plus, FileText, Radio, Info, MessageSquare, Mail, Lock, List, Filter, ChevronDown, ChevronUp, ShoppingCart, Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';
// --- FIRESTORE & AUTH IMPORTS ---
import { doc, getDoc, setDoc, updateDoc, collection as firestoreCollection, query, where, getDocs, arrayUnion, arrayRemove, deleteDoc, onSnapshot, addDoc } from 'firebase/firestore';
import { sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';

// --- HIGH-RES ASSET IMPORTS ---
import zpBase from './assets/Zero Point Base.webp';
import zpGold from './assets/Zero Point Gold.webp';
import zpGummy from './assets/Zero Point Gummy.webp';
import zpGalaxy from './assets/Zero Point Galaxy.webp';

import waterBase from './assets/Water Base.webp';
import waterGold from './assets/Water Gold.webp';
import waterGummy from './assets/Water Gummy.webp';
import waterGalaxy from './assets/Water Galaxy.webp';
import waterHolofoil from './assets/Water Holofoil.webp';

import earthBase from './assets/Earth Base.webp';
import earthGold from './assets/Earth Gold.webp';
import earthGummy from './assets/Earth Gummy.webp';
import earthGalaxy from './assets/Earth Galaxy.webp';

import fireBase from './assets/Fire Base.webp';
import fireGold from './assets/Fire Gold.webp';
import fireGummy from './assets/Fire Gummy.webp';
import fireGalaxy from './assets/Fire Galaxy.webp';
import fireHolofoil from './assets/Fire Holofoil.webp';

import duckBase from './assets/Duck Base.webp';
import duckGold from './assets/Duck Gold.webp';
import duckGummy from './assets/Duck Gummy.webp';
import duckGalaxy from './assets/Duck Galaxy.webp';

import dreamBase from './assets/Dream Base.webp';
import dreamGold from './assets/Dream Gold.webp';
import dreamGummy from './assets/Dream Gummy.webp';
import dreamGalaxy from './assets/Dream Galaxy.webp';

import demonBase from './assets/Demon Base.webp';
import demonGold from './assets/Demon Gold.webp';
import demonGummy from './assets/Demon Gummy.webp';
import demonGalaxy from './assets/Demon Galaxy.webp';

import punkBase from './assets/Punk Base.webp';
import punkGold from './assets/Punk Gold.webp';
import punkGummy from './assets/Punk Gummy.webp';
import punkGalaxy from './assets/Punk Galaxy.webp';

import peanutBase from './assets/Burnt Peanut Base.webp';

import ghostBase from './assets/Ghost Base.webp';
import ghostGold from './assets/Ghost Gold.webp';
import ghostGummy from './assets/Ghost Gummy.webp';
import ghostGalaxy from './assets/Ghost Galaxy.webp';
import ghostHolofoil from './assets/Ghost Holofoil.webp';

import kingBase from './assets/King Base.webp';
import kingGold from './assets/King Gold.webp';
import kingGummy from './assets/King Gummy.webp';
import kingGalaxy from './assets/King Galaxy.webp';
import kingHolofoil from './assets/King Holofoil.webp';

import auraBase from './assets/Aura Base.webp';
import auraGold from './assets/Aura Gold.webp';
import auraGummy from './assets/Aura Gummy.webp';
import auraGalaxy from './assets/Aura Galaxy.webp';

import bossBase from './assets/Boss Base.webp';
import bossGold from './assets/Boss Gold.webp';
import bossGummy from './assets/Boss Gummy.webp';
import bossGalaxy from './assets/Boss Galaxy.webp';

import fishyBase from './assets/Fishy Base.webp';
import fishyGold from './assets/Fishy Gold.webp';
import fishyGummy from './assets/Fishy Gummy.webp';
import fishyGalaxy from './assets/Fishy Galaxy.webp';

import grimBase from './assets/Grim Base.webp';
import grimGold from './assets/Grim Gold.webp';
import grimGummy from './assets/Grim Gummy.webp';
import grimGalaxy from './assets/Grim Galaxy.webp';

import strikerBase from './assets/Striker Base.webp';
import strikerGold from './assets/Striker Gold.webp';
import strikerGummy from './assets/Striker Gummy.webp';
import strikerGalaxy from './assets/Striker Galaxy.webp';
import strikerHolofoil from './assets/Striker Holofoil.webp';

import airBase from './assets/Air base.webp';
import airGold from './assets/Air gold.webp';
import airGummy from './assets/Air gummy.webp';
import airGalaxy from './assets/Air galaxy.webp';
import airHolofoil from './assets/Air holofoil.webp';

import sevenBase from './assets/Seven base.webp';
import sevenGold from './assets/Seven gold.webp';
import sevenGummy from './assets/Seven gummy.webp';
import sevenGalaxy from './assets/Seven galaxy.webp';
import sevenHolofoil from './assets/Seven holofoil.webp';

import batmanBase from './assets/Batman base.webp';
import batmanGold from './assets/Batman gold.webp';
import batmanGummy from './assets/Batman gummy.webp';
import batmanGalaxy from './assets/Batman galaxy.webp';
import batmanHolofoil from './assets/Batman holofoil.webp';

import polloBase from './assets/Pollo Base.webp';
import viniBase from './assets/Vini Jr Base.webp';

// --- CUBE IMPORTS ---
import cubeBatman from './assets/Cube Batman.webp';
import cubeEarth from './assets/Cube Earth.webp';
import cubeFire from './assets/Cube Fire.webp';
import cubeDream from './assets/Cube Dream.webp';
import cubePunk from './assets/Cube Punk.webp';
import cubeFishy from './assets/Cube Fishy.webp';
import cubeBoss from './assets/Cube Boss.webp';
import cubeGrim from './assets/Cube Grim.webp';

// --- NEW UNRELEASED GEM & QUACK IMPORTS ---
import gemZeroPoint from './assets/Gem Zero Point.webp';
import gemWater from './assets/Gem Water.webp';
import gemEarth from './assets/Gem Earth.webp';
import gemDuck from './assets/Gem Duck.webp';
import gemDemon from './assets/Gem Demon.webp';
import gemPunk from './assets/Gem Punk.webp';
import gemAura from './assets/Gem Aura.webp';
import quackZeroPoint from './assets/Quack Zero Point.webp';

const variantsList = ['base', 'gold', 'gummy', 'galaxy', 'holofoil', 'cube', 'gem', 'quack'];

// Dictionary of locked variants (unreleased upcoming sprites)
const LOCKED_VARIANTS = {
  'zero-point': ['gem', 'quack'],
  'water': ['gem'],
  'earth': ['gem'],
  'duck': ['gem'],
  'demon': ['gem'],
  'punk': ['gem'],
  'aura': ['gem']
};

const isVariantLocked = (spriteId, variant) => {
  return LOCKED_VARIANTS[spriteId]?.includes(variant) || false;
};

const SPRITES_DATABASE = [
  { id: "zero-point", name: "Zero Point", rarity: "Mythic", images: { base: zpBase, gold: zpGold, gummy: zpGummy, galaxy: zpGalaxy, gem: gemZeroPoint, quack: quackZeroPoint }, variants: ['base', 'gold', 'gummy', 'galaxy', 'gem', 'quack'], baseAbility: "Spawn a Shield Bubble Jr. when you use a healing item on yourself (excluding splashes and grenades). Duration at each Level Up: 6s -> 7s -> 8s -> 9s -> 10s." },
  { id: "burnt-peanut", name: "Burnt Peanut", rarity: "Mythic", images: { base: peanutBase, gold: peanutBase, gummy: peanutBase, galaxy: peanutBase }, variants: ['base'], baseAbility: "Goop! When eliminating players, you may find more loot. Sometimes mythic! Chance at each Level Up: 20% -> 30% -> 40% -> 50% -> 60% chance (10% chance to find Mythic at Max Level!)." },
  { id: "batman", name: "Batman", rarity: "Mythic", images: { base: batmanBase, gold: batmanGold, gummy: batmanGummy, galaxy: batmanGalaxy, holofoil: batmanHolofoil, cube: cubeBatman }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil', 'cube'], baseAbility: "Grants the ability to launch in the air and deploy the Bat Cape!" },
  { id: "vini-jr", name: "Vini Jr", rarity: "Mythic", images: { base: viniBase, gold: viniBase, gummy: viniBase, galaxy: viniBase, holofoil: viniBase }, variants: ['base'], baseAbility: "Sprinting for a short time makes your slide destructive. Slidekicking enemies increases rate of fire and reload speed. Increases in power at each Level Up: 40 dmg / 10% fire rate -> 45 dmg / 20% fire rate -> 50 dmg / 30% fire rate -> 55 dmg / 40% fire rate -> 60 dmg / 50% fire rate" },
  { id: "pollo", name: "Pollo", rarity: "Mythic", images: { base: polloBase, gold: polloBase, gummy: polloBase, galaxy: polloBase, holofoil: polloBase }, variants: ['base'], baseAbility: "Upon earning an elimination, slowly replenish shield for you and nearby squad members for a duration. Duration increases at each Level Up: 6 Seconds -> 7 Seconds -> 8 Seconds -> 9 Seconds -> 10 Seconds" },
  { id: "dream", name: "Dream", rarity: "Legendary", images: { base: dreamBase, gold: dreamGold, gummy: dreamGummy, galaxy: dreamGalaxy, cube: cubeDream }, variants: ['base', 'gold', 'gummy', 'galaxy', 'cube'], baseAbility: "Grants a random item at each level, exploding with legendary loot at Max Level. Loot value increases at each Level Up!" },
  { id: "punk", name: "Punk", rarity: "Legendary", images: { base: punkBase, gold: punkGold, gummy: punkGummy, galaxy: punkGalaxy, cube: cubePunk, gem: gemPunk }, variants: ['base', 'gold', 'gummy', 'galaxy', 'cube', 'gem'], baseAbility: "Does nothing until Level 5, in which it will always grant a buff for unlimited ammo." },
  { id: "boss", name: "Boss", rarity: "Legendary", images: { base: bossBase, gold: bossGold, gummy: bossGummy, galaxy: bossGalaxy, cube: cubeBoss }, variants: ['base', 'gold', 'gummy', 'galaxy', 'cube'], baseAbility: "Grants an increase to your max HP and Shield. Increases at each Level Up: 5 -> 10 -> 15 -> 20 -> 25 HP/Shield." },
  { id: "grim", name: "Grim", rarity: "Legendary", images: { base: grimBase, gold: grimGold, gummy: grimGummy, galaxy: grimGalaxy, cube: cubeGrim }, variants: ['base', 'gold', 'gummy', 'galaxy', 'cube'], baseAbility: "Players who attack you are marked for a duration. Duration at each Level Up: 3s -> 3.5s -> 4s -> 4.5s -> 5s." },
  { id: "seven", name: "Seven", rarity: "Legendary", images: { base: sevenBase, gold: sevenGold, gummy: sevenGummy, galaxy: sevenGalaxy, holofoil: sevenHolofoil }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil'], baseAbility: "Enemy player foot trails are visible in the world for your Squad. Duration increases at each Level Up: 10 Seconds -> 15 Seconds -> 20 Seconds -> 25 Seconds -> 30 Second foot trails." },
  { id: "duck", name: "Duck", rarity: "Epic", images: { base: duckBase, gold: duckGold, gummy: duckGummy, galaxy: duckGalaxy, gem: gemDuck }, variants: ['base', 'gold', 'gummy', 'galaxy', 'gem'], baseAbility: "Emoting or Jamming replenishes shields. Increases in power at each Level Up: 2 -> 3 -> 4 -> 6 -> 8 Shield per tick." },
  { id: "demon", name: "Demon", rarity: "Epic", images: { base: demonBase, gold: demonGold, gummy: demonGummy, galaxy: demonGalaxy, gem: gemDemon }, variants: ['base', 'gold', 'gummy', 'galaxy', 'gem'], baseAbility: "Siphon some health and shields when you eliminate an opponent. Increases in power at each Level Up: 10 -> 15 -> 20 -> 25 -> 30 Healing per elimination." },
  { id: "ghost", name: "Ghost", rarity: "Epic", images: { base: ghostBase, gold: ghostGold, gummy: ghostGummy, galaxy: ghostGalaxy, holofoil: ghostHolofoil }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil'], baseAbility: "Grants cloak for a duration upon reloading. Increases in duration at each Level Up: 3s -> 3.5s -> 4s -> 4.5s -> 5s." },
  { id: "king", name: "King", rarity: "Epic", images: { base: kingBase, gold: kingGold, gummy: kingGummy, galaxy: kingGalaxy, holofoil: kingHolofoil }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil'], baseAbility: "Your Pickaxe deals more damage. Increases in damage at each Level Up: 30 -> 40 -> 60 -> 80 -> 120 bonus damage." },
  { id: "aura", name: "Aura", rarity: "Epic", images: { base: auraBase, gold: auraGold, gummy: auraGummy, galaxy: auraGalaxy, gem: gemAura }, variants: ['base', 'gold', 'gummy', 'galaxy', 'gem'], baseAbility: "Gain a Shock Rock charge when you deal enough damage to enemies! Required damage decreases at each Level Up: 175 -> 150 -> 125 -> 100 -> 75 Damage to trigger." },
  { id: "striker", name: "Striker", rarity: "Epic", images: { base: strikerBase, gold: strikerGold, gummy: strikerGummy, galaxy: strikerGalaxy, holofoil: strikerHolofoil }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil'], baseAbility: "Gain the Overdrive effect when you Mantle, Hurdle, or Wall Scramble. Duration increases at each Level Up: 6s -> 7s -> 8s -> 9s -> 10s of Overdrive." },
  { id: "water", name: "Water", rarity: "Rare", images: { base: waterBase, gold: waterGold, gummy: waterGummy, galaxy: waterGalaxy, holofoil: waterHolofoil, gem: gemWater }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil', 'gem'], baseAbility: "Replenish shields while standing in water! Increases in power at each Level Up: 2 -> 3 -> 4 -> 5 -> 6 Shield per tick." },
  { id: "earth", name: "Earth", rarity: "Rare", images: { base: earthBase, gold: earthGold, gummy: earthGummy, galaxy: earthGalaxy, cube: cubeEarth, gem: gemEarth }, variants: ['base', 'gold', 'gummy', 'galaxy', 'cube', 'gem'], baseAbility: "You have a chance to find additional rare items when opening chests. Chance increases at each Level Up: 10% -> 12.5% -> 15% -> 17.5% -> 20% chance." },
  { id: "fire", name: "Fire", rarity: "Rare", images: { base: fireBase, gold: fireGold, gummy: fireGummy, galaxy: fireGalaxy, holofoil: fireHolofoil, cube: cubeFire }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil', 'cube'], baseAbility: "Creates a fiery burst when you deal enough damage to an enemy! Required damage decreases at each Level Up: 150 -> 125 -> 100 -> 75 -> 50 Damage to trigger." },
  { id: "fishy", name: "Fishy", rarity: "Rare", images: { base: fishyBase, gold: fishyGold, gummy: fishyGummy, galaxy: fishyGalaxy, cube: cubeFishy }, variants: ['base', 'gold', 'gummy', 'galaxy', 'cube'], baseAbility: "Swim speed greatly increased. Taking damage also briefly increases movement speed. Tiers: 25%/10% -> 50%/20% -> 100%/30% -> 150%/40% -> 200%/50% bonuses." },
  { id: "air", name: "Air", rarity: "Rare", images: { base: airBase, gold: airGold, gummy: airGummy, galaxy: airGalaxy, holofoil: airHolofoil }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil'], baseAbility: "Increases sprinting speed and jump height. Also nullifies fall damage. Jump height increased with each Level Up!" }
];

const PATCH_NOTES = [
  {
    version: "v1.4.1",
    date: "07/28/2026",
    title: "Official Play Store Launch & Upcoming Sprites Teaser",
    changes: [
      "Official Android App Release: Spritedex is now live on the Google Play Store! Take your collection tracking everywhere on your phone.",
      "Upcoming Variants Preview: Added 8 upcoming Gem and Quack variants to the database. These are currently locked until their official in-game release.",
      "UI Refinements: Added dedicated Play Store download links and locked indicators for upcoming variants."
    ]
  },
  {
    version: "v1.4.0",
    date: "07/23/2026",
    title: "Cube Variants & Interface Separation",
    changes: [
      "New Variants: The elusive Cube variant has been discovered for 8 Sprites! Track them in your collection today.",
      "Interface Separation: The Sprites tab is now exclusively for tracking collection. The Mastery Vault securely handles all Level 5 crown progression independently.",
      "Mastery Overlays: Crowns now brilliantly overlay onto their respective variant radio dots within the Mastery Vault.",
      "Support Feature: Added a way to support the app directly through the Support tab."
    ]
  },
  {
    version: "v1.5.0",
    date: "07/16/2026",
    title: "UI & High-Res Overhaul",
    changes: [
      "Massive UI Overhaul: The streamlined list format is now the standard for maximum clarity. All mastery functions are strictly moved to the Mastery Vault.",
      "Inspection Modal: Tapping any Sprite now opens a crisp, high-resolution modal to view stats, inspect variants, and log your collection!",
      "New Sprites: Welcome the Air (Rare), Seven (Legendary), Batman (Mythic), Vini Jr (Mythic), and Pollo (Mythic) Sprites to the tracking pool!",
      "Filter Dropdown: We've added a clean new filter menu so you can easily sort by Rarity, Variant, and Collection Status.",
      "In-App Feedback: Send feedback directly to the developer from within the app."
    ]
  }
];

const totalPossibleStatic = SPRITES_DATABASE.reduce((acc, sprite) => {
  const unlockedVariants = sprite.variants.filter(v => !isVariantLocked(sprite.id, v));
  return acc + unlockedVariants.length;
}, 0);

const PROFANITY_LIST = [
  'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'whore', 'slut', 'fag', 'nigger', 'nigga', 'cock', 'bastard', 'crap'
];

const VARIANT_INFO = {
  base: { name: "Base", color: "text-blue-400", bgColor: "bg-blue-400" },
  gold: { name: "Gold", color: "text-amber-400", bgColor: "bg-amber-400" },
  gummy: { name: "Gummy", color: "text-pink-500", bgColor: "bg-pink-500" },
  galaxy: { name: "Galaxy", color: "text-purple-400", bgColor: "bg-purple-400" },
  holofoil: { name: "Holofoil", color: "text-sky-400", bgColor: "bg-sky-400" },
  cube: { name: "Cube", color: "text-violet-500", bgColor: "bg-violet-500" },
  gem: { name: "Gem", color: "text-emerald-400", bgColor: "bg-emerald-400" },
  quack: { name: "Quack", color: "text-yellow-300", bgColor: "bg-yellow-300" }
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
  Mythic: { base: "6,750", variant: "10,000" },
  Legendary: { base: "4,500", variant: "6,750" },
  Epic: { base: "2,700", variant: "4,000" },
  Rare: { base: "1,800", variant: "2,700" }
};

function MainApp() {
  const { user, signUp, logIn, logOut } = useAuth();

  // --- AUTH STATES ---
  const [isInitializing, setIsInitializing] = useState(true);
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
  const [showFilters, setShowFilters] = useState(false);
  const [rarityFilter, setRarityFilter] = useState('All');
  const [variantFilter, setVariantFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showUnfriendConfirm, setShowUnfriendConfirm] = useState(null);
  const [viewingTabs, setViewingTabs] = useState({});
  const [selectedSprite, setSelectedSprite] = useState(null);
  const audioCtxRef = useRef(null);

  // --- PATCH NOTES STATES ---
  const [showPatchNotes, setShowPatchNotes] = useState(false);
  const [showTransmission, setShowTransmission] = useState(false);
  const [hasCheckedVersion, setHasCheckedVersion] = useState(false);

  // --- DATA STATES ---
  const [collection, setCollection] = useState({});
  const [mastery, setMastery] = useState({});
  const [extractionTargets, setExtractionTargets] = useState([]);

  // --- FEEDBACK FORM STATES ---
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("idle");

  // --- FRIEND & INSPECTION STATES ---
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [friendSearchResult, setFriendSearchResult] = useState(null);
  const [friendSearchStatus, setFriendSearchStatus] = useState('');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [richFriends, setRichFriends] = useState([]);
  const [activeViewingFriend, setActiveViewingFriend] = useState(null);

  // --- EXTRACTION TARGET SELECTION SCREEN STATES ---
  const [showTargetSelector, setShowTargetSelector] = useState(false);
  const [targetSlotIndex, setTargetSlotIndex] = useState(null);

  // Update Document Title
  useEffect(() => {
    document.title = "Spritedex";
  }, []);

  // Pre-load images
  useEffect(() => {
    SPRITES_DATABASE.forEach(sprite => {
      Object.values(sprite.images).forEach(src => {
        if (src) {
          const img = new Image();
          img.src = src;
        }
      });
    });
  }, []);

  // Firebase Auth Initialization Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setIsInitializing(false);
    });
    return unsubscribe;
  }, []);

  // Fetch Cloud Data on Login (Real-time listeners)
  useEffect(() => {
    if (!user) {
      setCollection({});
      setMastery({});
      setExtractionTargets([]);
      setSpriteId(null);
      setFriendsList([]);
      setPendingRequests([]);
      setSentRequests([]);
      setRichFriends([]);
      setActiveViewingFriend(null);
      setHasCheckedVersion(false);
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const unsubUser = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCollection(data.sprites || {});
        setMastery(data.mastery || {});
        setExtractionTargets(data.extractionTargets || []);
        setFriendsList(data.friends || []);
        if (data.spriteId) {
          setSpriteId(data.spriteId);
        } else {
          setIsSettingSpriteId(true);
        }

        // --- VERSION CHECK ---
        if (!hasCheckedVersion && !isSettingSpriteId) {
          const userVersion = data.lastSeenVersion || "v1.0.0";
          if (userVersion !== PATCH_NOTES[0].version) {
            setShowTransmission(true);
          }
          setHasCheckedVersion(true);
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
  }, [user, hasCheckedVersion, isSettingSpriteId]);

  // Fetch Completion Stats for Leaderboard
  useEffect(() => {
    const fetchRichFriends = async () => {
      if (!friendsList || friendsList.length === 0) {
        setRichFriends([]);
        return;
      }

      const promises = friendsList.map(async (friend) => {
        if (typeof friend === 'string') return null;
        try {
          const docSnap = await getDoc(doc(db, "users", friend.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            const sprites = data.sprites || {};
            const friendTargets = data.extractionTargets || [];
            let tCollected = 0;

            SPRITES_DATABASE.forEach(sprite => {
              const status = sprites[sprite.id] || {};
              tCollected += sprite.variants.filter(v => !isVariantLocked(sprite.id, v) && status[v]).length;
            });

            const cRate = totalPossibleStatic > 0 ? Math.round((tCollected / totalPossibleStatic) * 100) : 0;
            return { ...friend, completionRate: cRate, sprites, extractionTargets: friendTargets };
          }
        } catch (e) {
          console.error("Error fetching friend data:", e);
        }
        return { ...friend, completionRate: 0, sprites: {}, extractionTargets: [] };
      });

      const results = await Promise.all(promises);
      const validResults = results.filter(Boolean);

      validResults.sort((a, b) => b.completionRate - a.completionRate);
      setRichFriends(validResults);
    };

    fetchRichFriends();
  }, [friendsList, collection]);

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
      await setDoc(doc(db, "users", user.uid), { spriteId: desiredSpriteId.toLowerCase(), friends: [], extractionTargets: [], lastSeenVersion: PATCH_NOTES[0].version }, { merge: true });
      setSpriteId(desiredSpriteId.toLowerCase());
      setIsSettingSpriteId(false);
    } catch (error) {
      setSpriteIdError('An error occurred. Try again.');
    }
  };

  const handleToggleCheck = (spriteId, variant) => {
    if (isVariantLocked(spriteId, variant)) return;

    const currentVal = collection[spriteId]?.[variant];
    const newVal = !currentVal;

    if (newVal) {
      if (variant === 'holofoil' || variant === 'cube' || variant === 'gem' || variant === 'quack') playBeep(1200, 'square', 0.15);
      else if (variant === 'galaxy') playBeep(880, 'triangle', 0.15);
      else if (variant === 'gold') playBeep(659, 'sine', 0.1);
      else if (variant === 'gummy') playBeep(587, 'sine', 0.1);
      else playBeep(440, 'sine', 0.08);
    } else {
      playBeep(220, 'sine', 0.1);
      if (mastery[spriteId]?.[variant]) toggleMastery(spriteId, variant, false);
    }

    setCollection(prev => {
      const currentSprite = prev[spriteId] || {};
      const updated = { ...prev, [spriteId]: { ...currentSprite, [variant]: newVal } };

      const targetSprite = SPRITES_DATABASE.find(s => s.id === spriteId);
      const targets = targetSprite.variants.filter(v => !isVariantLocked(spriteId, v));
      const allSelected = targets.every(v => updated[spriteId][v]);

      if (newVal && allSelected) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#ffe600', '#ff007f', '#8a2be2', '#38bdf8']
        });
        setTimeout(() => confetti.reset(), 3000);
      }

      if (user) {
        setDoc(doc(db, "users", user.uid), { sprites: updated }, { merge: true })
          .catch(err => console.error("Cloud save failed:", err));
      }

      return updated;
    });
  };

  const toggleMastery = (spriteId, variant, forceValue = null) => {
    if (isVariantLocked(spriteId, variant)) return;

    setMastery(prev => {
      const currentSpriteMastery = prev[spriteId] || {};
      const isCurrentlyMastered = currentSpriteMastery[variant];
      const newVal = forceValue !== null ? forceValue : !isCurrentlyMastered;

      const updated = { ...prev, [spriteId]: { ...currentSpriteMastery, [variant]: newVal } };

      if (newVal) {
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 }, colors: ['#FFD700', '#FFA500', '#DAA520', '#FFF8DC'] });
        setTimeout(() => confetti.reset(), 3000);
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

  // --- FEEDBACK HANDLER ---
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setFeedbackStatus('submitting');
    try {
      await addDoc(firestoreCollection(db, "mail"), {
        to: "prosyncts@gmail.com",
        message: {
          subject: "Spritedex App Support",
          text: `Sprite ID: ${spriteId || "Anonymous"}\n\nMessage:\n${feedbackText}`,
        }
      });
      setFeedbackStatus('success');
      setFeedbackText('');
      setTimeout(() => setFeedbackStatus('idle'), 3000);
    } catch (error) {
      console.error("Feedback error:", error);
      setFeedbackStatus('error');
      setTimeout(() => setFeedbackStatus('idle'), 3000);
    }
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
          mastery: docSnap.data().mastery || {},
          extractionTargets: docSnap.data().extractionTargets || []
        });
      }
    } catch (e) {
      alert("Could not fetch friend data.");
    }
  };

  // --- EXTRACTION TARGET FUNCTIONS ---
  const handleSetTarget = async (targetSpriteId, variant) => {
    const newTargets = [...extractionTargets];
    newTargets[targetSlotIndex] = `${targetSpriteId}_${variant}`;
    setExtractionTargets(newTargets);
    setShowTargetSelector(false);
    if (user) {
      await updateDoc(doc(db, "users", user.uid), { extractionTargets: newTargets });
    }
  };

  const handleRemoveTarget = async (index, e) => {
    e.stopPropagation();
    const newTargets = [...extractionTargets];
    newTargets.splice(index, 1);
    setExtractionTargets(newTargets);
    if (user) {
      await updateDoc(doc(db, "users", user.uid), { extractionTargets: newTargets });
    }
  };

  const isMutualMatch = (friendObj) => {
    const friendTargets = friendObj.extractionTargets || [];
    const friendSprites = friendObj.sprites || {};

    const friendHasWhatIWant = extractionTargets.some(target => {
      if (!target) return false;
      const [sId, v] = target.split('_');
      return friendSprites[sId]?.[v] === true;
    });

    const iHaveWhatFriendWants = friendTargets.some(target => {
      if (!target) return false;
      const [sId, v] = target.split('_');
      return collection[sId]?.[v] === true;
    });

    return friendHasWhatIWant && iHaveWhatFriendWants;
  };

  const renderTargetSlot = (targetKey, index) => {
    if (!targetKey) {
      return (
        <button key={index} onClick={() => { setTargetSlotIndex(index); setShowTargetSelector(true); }} className="flex-1 h-12 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors">
          <Plus className="w-5 h-5 text-slate-600" />
        </button>
      );
    }
    const [sId, v] = targetKey.split('_');
    const sprite = SPRITES_DATABASE.find(s => s.id === sId);
    return (
      <div key={index} className="flex-1 h-12 border-2 border-cyan-500/50 rounded-xl bg-cyan-950/30 relative flex flex-col items-center justify-center overflow-hidden">
        <button onClick={(e) => handleRemoveTarget(index, e)} className="absolute top-0.5 right-0.5 bg-black/80 rounded-full p-0.5 text-slate-400 hover:text-white z-20">
          <X className="w-2.5 h-2.5" />
        </button>
        <img src={sprite?.images[v]} className="w-6 h-6 object-contain z-10" alt="" />
        <span className={`text-[7px] sm:text-[8px] font-black uppercase mt-0.5 z-10 ${VARIANT_INFO[v]?.color}`}>{v}</span>
      </div>
    );
  };

  // --- VERSION ACKNOWLEDGEMENT ---
  const handleAcknowledgeTransmission = async () => {
    setShowTransmission(false);
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), { lastSeenVersion: PATCH_NOTES[0].version }, { merge: true });
      } catch (err) {
        console.error("Failed to save transmission state:", err);
      }
    }
  };

  const totalCollected = SPRITES_DATABASE.reduce((acc, sprite) => {
    const status = collection[sprite.id] || {};
    const validChecked = sprite.variants.filter(v => !isVariantLocked(sprite.id, v) && status[v]).length;
    return acc + validChecked;
  }, 0);

  const totalMastered = SPRITES_DATABASE.reduce((acc, sprite) => {
    const status = mastery[sprite.id] || {};
    const validMastered = sprite.variants.filter(v => !isVariantLocked(sprite.id, v) && status[v]).length;
    return acc + validMastered;
  }, 0);

  const completionRate = totalPossibleStatic > 0 ? Math.round((totalCollected / totalPossibleStatic) * 100) : 0;
  const masteryRate = totalPossibleStatic > 0 ? Math.round((totalMastered / totalPossibleStatic) * 100) : 0;

  const isMasteryView = currentView === 'mastery';
  const displayVariantKey = variantFilter.toLowerCase();

  const filteredSprites = SPRITES_DATABASE.filter(sprite => {
    const matchesSearch = sprite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sprite.baseAbility.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = rarityFilter === 'All' || sprite.rarity === rarityFilter;
    const matchesVariant = variantFilter === 'All' || sprite.variants.includes(displayVariantKey);

    // Status Filter Logic
    let matchesStatus = true;
    if (statusFilter !== 'All') {
      if (isMasteryView) {
        if (statusFilter === 'Mastered') {
          matchesStatus = variantFilter === 'All' ? sprite.variants.some(v => mastery[sprite.id]?.[v] === true) : mastery[sprite.id]?.[displayVariantKey] === true;
        } else if (statusFilter === 'Unmastered') {
          matchesStatus = variantFilter === 'All' ? sprite.variants.some(v => collection[sprite.id]?.[v] === true && !mastery[sprite.id]?.[v]) : (collection[sprite.id]?.[displayVariantKey] === true && !mastery[sprite.id]?.[displayVariantKey]);
        }
      } else {
        if (statusFilter === 'Collected') {
          matchesStatus = variantFilter === 'All' ? sprite.variants.some(v => collection[sprite.id]?.[v] === true) : collection[sprite.id]?.[displayVariantKey] === true;
        } else if (statusFilter === 'Missing') {
          matchesStatus = variantFilter === 'All' ? sprite.variants.some(v => !collection[sprite.id]?.[v]) : (sprite.variants.includes(displayVariantKey) && !collection[sprite.id]?.[displayVariantKey]);
        }
      }
    }

    if (isMasteryView && statusFilter === 'All') {
      const status = collection[sprite.id] || {};
      const hasCollected = variantFilter === 'All'
        ? sprite.variants.some(v => status[v] === true)
        : status[displayVariantKey] === true;
      return matchesSearch && matchesRarity && matchesVariant && matchesStatus && hasCollected;
    }

    return matchesSearch && matchesRarity && matchesVariant && matchesStatus;
  });

  const getVariantModifierText = (variantName) => {
    if (variantName === 'gold') return "Gain 3x bonus XP from eliminations";
    if (variantName === 'gummy') return "Gain 20% more Sprite Dust upon Extraction";
    if (variantName === 'galaxy') return "Gain 30% more Ammunition when looting";
    if (variantName === 'holofoil') return "Gain 5% increased chance of finding rare Sprites for yourself and entire squad";
    if (variantName === 'cube') return "Gain the Overdrive effect while in the storm";
    if (variantName === 'gem') return "Upcoming Variant (Effect TBD)";
    if (variantName === 'quack') return "Upcoming Variant (Effect TBD)";
    return null;
  };

  const getDynamicSummonCost = (rarity, variantName, spriteId = null) => {
    if (spriteId && isVariantLocked(spriteId, variantName)) return "TBD";
    const rarityMatrix = SUMMON_COST_MATRIX[rarity];
    if (!rarityMatrix) return "0";
    return variantName === 'base' ? rarityMatrix.base : rarityMatrix.variant;
  };

  // --- INITIALIZATION SCREEN ---
  if (isInitializing) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden relative font-sans px-4">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600 rounded-full blur-[120px] opacity-20 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-600 rounded-full blur-[120px] opacity-15 pointer-events-none" />
        <img src="/app_icon.webp" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] object-contain animate-pulse duration-[2000ms] z-10" alt="Loading Spritedex..." />
      </div>
    );
  }

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
            <p className="text-slate-400 text-sm sm:text-base max-w-xs px-2">Track every sprite, sync across your devices, and monitor your personal collection in real-time.</p>
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
            <p className="text-[10px] sm:text-xs text-slate-500 mt-2 leading-relaxed max-w-xs mx-auto">
              Portions of the materials used are trademarks and/or copyrighted works of Epic Games, Inc. All rights reserved by Epic. This material is not official and is not endorsed by Epic.
            </p>
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
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase italic mb-2">Claim Your Sprite ID</h2>
          <p className="text-sm sm:text-base text-slate-400 mb-6">
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

      {/* --- MODAL: SPRITE INSPECTION --- */}
      {selectedSprite && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          {(() => {
            const sprite = SPRITES_DATABASE.find(s => s.id === selectedSprite.id);
            const validVariants = sprite.variants;
            const v = selectedSprite.variant;
            const vIndex = validVariants.indexOf(v);

            const isLocked = isVariantLocked(sprite.id, v);
            const isCollected = collection[sprite.id]?.[v];
            const isMastered = mastery[sprite.id]?.[v];
            const variantModifier = getVariantModifierText(v);

            const handlePrevVariant = () => {
              const newV = validVariants[vIndex === 0 ? validVariants.length - 1 : vIndex - 1];
              setSelectedSprite({ id: sprite.id, variant: newV });
            };

            const handleNextVariant = () => {
              const newV = validVariants[vIndex === validVariants.length - 1 ? 0 : vIndex + 1];
              setSelectedSprite({ id: sprite.id, variant: newV });
            };

            return (
              <div className="bg-[#12141f] border border-slate-700/80 rounded-3xl w-full max-w-sm overflow-hidden relative shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                <button onClick={() => setSelectedSprite(null)} className="absolute top-4 right-4 z-50 p-2 bg-black/60 rounded-full text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>

                <div className={`w-full aspect-square bg-gradient-to-b ${RARITY_BG_GRADIENTS[sprite.rarity]} flex items-center justify-center relative`}>
                  {validVariants.length > 1 && (
                    <button onClick={handlePrevVariant} className="absolute left-4 z-40 p-2 bg-black/40 rounded-full hover:bg-black/60 transition-colors">
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                  )}

                  <img
                    src={sprite.images[v]}
                    className={`w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] ${isLocked ? 'grayscale opacity-75' : ''}`}
                    alt=""
                  />

                  {validVariants.length > 1 && (
                    <button onClick={handleNextVariant} className="absolute right-4 z-40 p-2 bg-black/40 rounded-full hover:bg-black/60 transition-colors">
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                  )}
                </div>

                <div className="p-5 flex flex-col gap-4">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight">{v !== 'base' ? `${v} ` : ''}{sprite.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded border ${RARITY_COLORS[sprite.rarity]}`}>
                        {sprite.rarity}
                      </span>
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded border border-slate-700 bg-slate-800 ${VARIANT_INFO[v]?.color}`}>
                        {v}
                      </span>
                      {isLocked && (
                        <span className="text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded border border-amber-500/50 bg-amber-950/60 text-amber-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-xl p-3 border border-slate-800/60">
                    <p className="text-sm text-slate-300 leading-snug">
                      <span className="font-mono text-[10px] font-black text-cyan-400 block tracking-wider uppercase mb-1">Base Ability:</span>
                      {sprite.baseAbility}
                    </p>
                    {variantModifier && (
                      <p className="text-sm text-slate-200 mt-2 pt-2 border-t border-slate-800/60">
                        <span className="font-mono text-[10px] font-black text-yellow-400 block tracking-wider uppercase mb-1">+{v} Modifier:</span>
                        {variantModifier}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/60">
                      <span className="font-mono text-[10px] font-black text-emerald-400 uppercase tracking-wider">Summon Cost:</span>
                      <span className="text-xs font-black text-white">{getDynamicSummonCost(sprite.rarity, v, sprite.id)} {isLocked ? '' : 'Dust'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isLocked ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl border-2 bg-slate-900/60 border-amber-500/40 text-amber-400">
                        <Lock className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Locked Until Release</span>
                      </div>
                    ) : (
                      <>
                        {!isMasteryView && (
                          <button
                            onClick={() => handleToggleCheck(sprite.id, v)}
                            className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl border-2 transition-all ${isCollected ? 'bg-cyan-900/40 border-cyan-500 text-cyan-400' : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                          >
                            {isCollected ? <CheckCircle className="w-5 h-5 mb-1" /> : <Circle className="w-5 h-5 mb-1 opacity-50" />}
                            <span className="text-[10px] font-black uppercase tracking-wider">{isCollected ? 'Collected' : 'Collect'}</span>
                          </button>
                        )}

                        {isMasteryView && (
                          <button
                            onClick={() => toggleMastery(sprite.id, v)}
                            className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl border-2 transition-all ${!isCollected ? 'opacity-30 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-600' : isMastered ? 'bg-yellow-900/40 border-yellow-500 text-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.2)]' : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-yellow-500/50 hover:text-yellow-500'}`}
                          >
                            <Crown className="w-5 h-5 mb-1" />
                            <span className="text-[10px] font-black uppercase tracking-wider">{isMastered ? 'Mastered' : 'Set Lvl 5'}</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* --- MENU: TRANSMISSION SPLASH SCREEN --- */}
      {showTransmission && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#12141f] border-2 border-cyan-500 shadow-[0_0_40px_rgba(34,211,238,0.2)] rounded-2xl max-w-sm w-full relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            <header className="p-5 border-b border-cyan-900/50 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-cyan-950/50 rounded-full border border-cyan-500/40 flex items-center justify-center mb-3">
                <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-cyan-400 uppercase italic tracking-wider">Incoming Transmission</h2>
              <span className="text-[10px] sm:text-xs font-mono text-cyan-600 uppercase tracking-widest mt-1">Update {PATCH_NOTES[0].version} Deployed</span>
            </header>
            <div className="p-5 flex flex-col gap-4">
              <h3 className="text-md sm:text-lg font-bold text-white text-center">{PATCH_NOTES[0].title}</h3>
              <ul className="space-y-3">
                {PATCH_NOTES[0].changes.map((change, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed">
                    <CheckCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    {change}
                  </li>
                ))}
              </ul>
              <button onClick={handleAcknowledgeTransmission} className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-wider py-3 rounded-xl transition-colors">
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MENU: PATCH NOTES & ABOUT HUB --- */}
      {showPatchNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12141f] border-2 border-slate-700 rounded-2xl flex flex-col max-w-sm w-full h-[80vh] relative overflow-hidden">
            <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0e1017]">
              <h3 className="text-md sm:text-lg font-black tracking-tight text-white uppercase italic flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" /> Patch Notes
              </h3>
              <button onClick={() => setShowPatchNotes(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">

              {/* --- APP DESCRIPTION / ABOUT SECTION --- */}
              <section className="bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-purple-400" />
                  <h4 className="font-black text-purple-400 uppercase italic text-sm sm:text-base">About the App</h4>
                </div>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Spritedex is your ultimate companion for tracking Battle Royale Sprites. Sync your collection across devices, coordinate in-game trades with your Sprite Squad using Extraction Targets, and keep track of your Mastery crowns all in one secure, real-time interface.
                </p>
                <div className="mt-4 pt-3 border-t border-purple-500/30">
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    You've collected them in-game, now collect them in real life! Grab some physical Sprites <a href="https://amzn.to/3ThkM2y" target="_blank" rel="noopener noreferrer" className="text-purple-400 font-bold hover:underline">here</a>. <br /><span className="text-[10px] text-slate-500">(As an Amazon Associate I earn from qualifying purchases.)</span>
                  </p>
                </div>
              </section>

              {/* --- UPDATE TIMELINE --- */}
              <section className="flex flex-col gap-4">
                <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Transmission History</h4>
                {PATCH_NOTES.map((note, index) => (
                  <div key={index} className="bg-black/40 border border-slate-800 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-base sm:text-lg font-black text-white">{note.version}</span>
                      <span className="text-[10px] sm:text-xs font-mono text-slate-500">{note.date}</span>
                    </div>
                    <span className="text-sm font-bold text-cyan-400 block mb-3">{note.title}</span>
                    <ul className="space-y-2">
                      {note.changes.map((change, cIdx) => (
                        <li key={cIdx} className="text-xs sm:text-sm text-slate-400 leading-relaxed flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0"></span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>

            </div>
          </div>
        </div>
      )}

      {/* --- SELECTION SCREEN: TARGET SELECTOR --- */}
      {showTargetSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12141f] border-2 border-cyan-500/60 rounded-2xl flex flex-col max-w-sm w-full h-[75vh] relative overflow-hidden">
            <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0e1017]">
              <h3 className="text-md sm:text-lg font-black tracking-tight text-cyan-400 uppercase italic flex items-center gap-2">
                <Target className="w-5 h-5" /> Select Target
              </h3>
              <button onClick={() => setShowTargetSelector(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {SPRITES_DATABASE.map(sprite => {
                const validVariants = sprite.variants.filter(v => !collection[sprite.id]?.[v] && !isVariantLocked(sprite.id, v));
                if (validVariants.length === 0) return null;

                return (
                  <div key={sprite.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                    <span className="text-sm font-black text-white uppercase italic mb-2 block">{sprite.name}</span>
                    <div className="grid grid-cols-6 gap-2">
                      {validVariants.map(v => (
                        <button
                          key={v}
                          onClick={() => handleSetTarget(sprite.id, v)}
                          className="flex flex-col items-center p-2 rounded-lg border border-slate-700 bg-black/40 hover:bg-slate-800 transition-colors"
                        >
                          <img src={sprite.images[v]} className="w-8 h-8 object-contain mb-1" alt="" />
                          <span className={`text-[7px] sm:text-[8px] font-black uppercase ${VARIANT_INFO[v]?.color}`}>{v}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- MENU: ABSOLUTE DATA RESET --- */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12141f] border-2 border-red-500/60 rounded-2xl p-6 max-w-sm w-full text-center relative">
            <button onClick={() => { setShowResetConfirm(false); playBeep(440, 'sine', 0.05); }} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg bg-black/40 border border-slate-800">
              <X className="w-4 h-4" />
            </button>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase italic">RESET LOG DATA?</h3>
            <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
              This action will completely wipe your checked archive configurations. Mastery counts and storage caches will revert back to 0%.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => { setShowResetConfirm(false); playBeep(440, 'sine', 0.05); }} className="py-2.5 text-sm font-black uppercase font-mono bg-black/40 text-slate-300 border border-slate-800 rounded-xl hover:bg-black/60">ABORT</button>
              <button onClick={handleAbsoluteReset} className="py-2.5 text-sm font-black uppercase font-mono bg-gradient-to-r from-red-600 to-rose-700 text-white border border-red-500/40 rounded-xl hover:brightness-110">CONFIRM WIPE</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MENU: THEMED UNFRIEND CONFIRMATION --- */}
      {showUnfriendConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12141f] border-2 border-amber-500/60 rounded-2xl p-6 max-w-sm w-full text-center relative">
            <button onClick={() => setShowUnfriendConfirm(null)} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg bg-black/40">
              <X className="w-4 h-4" />
            </button>
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-950/60 border border-amber-500/40 flex items-center justify-center mb-4">
              <UserMinus className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase italic">REMOVE FRIEND?</h3>
            <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
              Are you sure you want to remove <span className="text-amber-400 font-bold">@{showUnfriendConfirm.spriteId}</span>? This severs connection access across both profiles immediately.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setShowUnfriendConfirm(null)} className="py-2.5 text-sm font-black uppercase font-mono bg-black/40 text-slate-300 border border-slate-800 rounded-xl">CANCEL</button>
              <button onClick={handleUnfriendExecution} className="py-2.5 text-sm font-black uppercase font-mono bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl">UNFRIEND</button>
            </div>
          </div>
        </div>
      )}

      {/* --- LAYER: NEW READ-ONLY FRIEND COLLECTION INSPECTOR --- */}
      {activeViewingFriend && (
        <div className="fixed inset-0 z-50 bg-[#0b0c10] flex flex-col animate-in slide-in-from-bottom duration-300 overflow-y-auto pb-12">

          <header className="bg-[#0e1017]/95 backdrop-blur-md border-b-2 border-indigo-500 p-4 sticky top-0 z-50 shadow-[0_4px_20px_rgba(99,102,241,0.15)]">
            <div className="max-w-md mx-auto w-full flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-black text-indigo-400 uppercase tracking-widest block">INSPECTING ARCHIVE</span>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black italic uppercase text-white">@{activeViewingFriend.spriteId}</h2>
                  <span className="bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md">
                    {activeViewingFriend.completionRate}%
                  </span>
                </div>
              </div>
              <button onClick={() => setActiveViewingFriend(null)} className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black text-slate-300 hover:text-white transition-colors">
                <X className="w-4 h-4" /> CLOSE VIEW
              </button>
            </div>
          </header>

          {activeViewingFriend.extractionTargets && activeViewingFriend.extractionTargets.length > 0 && (
            <div className="max-w-md mx-auto w-full px-4 pt-4">
              <div className="bg-[#151722] border border-cyan-500/30 rounded-xl p-3 flex flex-col gap-2">
                <span className="text-[10px] sm:text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> Their Extraction Targets
                </span>
                <div className="flex gap-2">
                  {activeViewingFriend.extractionTargets.map((target, idx) => {
                    if (!target) return null;
                    const [sId, v] = target.split('_');
                    const sprite = SPRITES_DATABASE.find(s => s.id === sId);
                    return (
                      <div key={idx} className="flex-1 flex items-center gap-2 bg-black/40 border border-slate-800 rounded-lg p-1.5">
                        <img src={sprite?.images[v]} className="w-6 h-6 object-contain" alt="" />
                        <div className="flex flex-col">
                          <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase truncate">{sprite?.name}</span>
                          <span className={`text-[8px] sm:text-[9px] font-black uppercase ${VARIANT_INFO[v]?.color}`}>{v}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="max-w-md w-full mx-auto p-4 flex flex-col gap-2">
            {SPRITES_DATABASE.map(sprite => {
              const friendStatus = activeViewingFriend.sprites[sprite.id] || {};
              const friendMastery = activeViewingFriend.mastery[sprite.id] || {};

              const hasAnyVariant = variantsList.some(v => friendStatus[v]);
              const displayVariant = 'base';

              return (
                <div key={sprite.id} className="flex items-center justify-between bg-[#151722] border border-slate-800/90 rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg p-1 border-2 transition-all flex-shrink-0 ${hasAnyVariant ? 'bg-indigo-950/40 border-indigo-500/50' : 'bg-slate-900 border-slate-800 grayscale opacity-60'}`}>
                      <img src={sprite.images[displayVariant]} className="w-full h-full object-contain drop-shadow-md" alt="" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-sm sm:text-base text-white uppercase italic tracking-tight">{sprite.name}</span>
                    </div>
                  </div>

                  <div className="flex gap-1.5 sm:gap-2">
                    {variantsList.map(v => {
                      if (!sprite.variants.includes(v)) return null;
                      const isLocked = isVariantLocked(sprite.id, v);
                      const isCollected = friendStatus[v];
                      const isMastered = friendMastery[v];

                      const isMatch = extractionTargets.includes(`${sprite.id}_${v}`) && isCollected;

                      return (
                        <div key={v} className="flex flex-col items-center gap-1">
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border transition-all relative ${isLocked ? 'bg-slate-950/80 border-slate-800/50 opacity-50' : isMatch ? 'bg-cyan-900/40 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)] animate-pulse' : isMastered ? 'bg-yellow-900/40 border-yellow-400' : isCollected ? `bg-slate-900 border-${VARIANT_INFO[v]?.color.split('-')[1]}-500/70` : 'bg-black border-slate-800'}`}>
                            {isLocked ? (
                              <Lock className="w-2.5 h-2.5 text-slate-600" />
                            ) : (
                              <>
                                {isCollected && (
                                  <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${isMatch ? 'bg-cyan-400' : VARIANT_INFO[v]?.bgColor} ${isMastered && !isMatch ? 'opacity-30' : 'opacity-100'}`} />
                                )}
                                {isMastered && !isMatch && (
                                  <Crown className="w-3.5 h-3.5 text-yellow-400 drop-shadow-[0_0_2px_rgba(255,215,0,0.8)] absolute z-10" />
                                )}
                              </>
                            )}
                          </div>
                          <span className="text-[7px] font-bold uppercase text-slate-500">{v === 'holofoil' ? 'Holo' : v}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-[#0e1017]/95 backdrop-blur-md border-b-2 border-cyan-500/80 shadow-[0_4px_20px_rgba(0,240,255,0.15)] px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-yellow-400 to-pink-500 uppercase italic">
              SPRITEDEX
            </h1>
            <p className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-widest mt-0.5">ID: {spriteId}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setShowPatchNotes(true); playBeep(523, 'sine', 0.08); }} className="p-2 rounded-xl bg-slate-900 border-2 border-slate-700/60 hover:bg-slate-800 transition-colors">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            </button>
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-xl bg-slate-900 border-2 border-slate-700/60 hover:bg-slate-800 transition-colors">
              {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
            </button>
            <button onClick={logOut} className="text-[10px] sm:text-xs text-red-400 font-bold uppercase tracking-widest hover:text-red-300 transition-colors ml-1">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col gap-5 pb-24">

        {/* --- MAIN VIEWS (SPRITES / MASTERY) --- */}
        {(currentView === 'sprites' || currentView === 'mastery') && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">

            {currentView === 'sprites' && (
              <section className="sticky top-[86px] sm:top-[94px] z-40 bg-[#151824]/95 backdrop-blur-md rounded-2xl p-4 border-2 border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm sm:text-base font-black text-gray-200 tracking-wider font-mono">SPRITE PROGRESS</span>
                  <button onClick={() => { setShowResetConfirm(true); playBeep(330, 'sine', 0.08); }} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 text-[9px] sm:text-[10px] font-mono font-black text-red-400 tracking-wider uppercase">
                    <RotateCcw className="w-3 h-3" /> RESET ARCHIVE
                  </button>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-xs text-slate-400 font-mono">COMPLETION PERCENTAGE</span>
                  <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">{completionRate}%</span>
                </div>
                <div className="w-full bg-black/60 h-4 sm:h-5 rounded-md overflow-hidden p-0.5 border border-slate-700/50">
                  <div className="bg-gradient-to-r from-cyan-400 via-yellow-400 to-pink-500 h-full rounded transition-all duration-300" style={{ width: `${completionRate}%` }} />
                </div>
              </section>
            )}

            {isMasteryView && (
              <section className="sticky top-[86px] sm:top-[94px] z-40 bg-gradient-to-r from-yellow-900/95 to-amber-900/95 backdrop-blur-md border-2 border-yellow-500/50 rounded-2xl p-5 mb-2 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400" />
                  <h2 className="text-xl sm:text-2xl font-black text-yellow-400 uppercase italic">Mastery Vault</h2>
                </div>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                  Select variants you have already collected and upgrade them to Mastered status once they reach Level 5.
                </p>

                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] sm:text-xs text-yellow-500/80 font-mono font-bold tracking-wider">VAULT COMPLETION</span>
                    <span className="text-lg sm:text-xl font-black text-yellow-400 font-mono">{masteryRate}%</span>
                  </div>
                  <div className="w-full bg-black/60 h-2.5 sm:h-3 rounded-full overflow-hidden p-0.5 border border-yellow-900/50">
                    <div className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-amber-200 h-full rounded-full transition-all duration-300" style={{ width: `${masteryRate}%` }} />
                  </div>
                </div>
              </section>
            )}

            {/* --- FILTER & SEARCH SECTION --- */}
            <section className="flex flex-col gap-2 bg-[#12141f] p-3 rounded-xl border border-slate-800/80">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-cyan-500/70 absolute left-3 top-3" />
                  <input
                    type="text" placeholder="Search sprites..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/50 border-2 border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 flex items-center gap-2 rounded-xl border-2 transition-all font-black text-xs uppercase tracking-wider ${showFilters ? 'bg-cyan-900/40 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* COLLAPSIBLE FILTER DROPDOWN */}
              {showFilters && (
                <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-slate-800/80 animate-in slide-in-from-top-2">
                  <div>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5 block">Rarity</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['All', 'Mythic', 'Legendary', 'Epic', 'Rare'].map(rarity => (
                        <button key={rarity} onClick={() => setRarityFilter(rarity)} className={`px-3 py-1.5 text-[10px] font-black tracking-wider rounded-lg border uppercase ${rarityFilter === rarity ? 'bg-cyan-400 text-black border-cyan-300' : 'bg-black/40 text-slate-400 border-slate-800'}`}>
                          {rarity}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5 block">Variant Type</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['All', 'Base', 'Gold', 'Gummy', 'Galaxy', 'Holofoil', 'Cube', 'Gem', 'Quack'].map(variant => (
                        <button key={variant} onClick={() => setVariantFilter(variant)} className={`px-3 py-1.5 text-[10px] font-black tracking-wider rounded-lg border uppercase ${variantFilter === variant ? 'bg-purple-500 text-white border-purple-400' : 'bg-black/40 text-slate-400 border-slate-800'}`}>
                          {variant}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5 block">Collection Status</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['All', isMasteryView ? 'Mastered' : 'Collected', isMasteryView ? 'Unmastered' : 'Missing'].map(status => (
                        <button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1.5 text-[10px] font-black tracking-wider rounded-lg border uppercase ${statusFilter === status ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-black/40 text-slate-400 border-slate-800'}`}>
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="flex flex-col">
              {filteredSprites.length === 0 && (
                <div className="text-center p-8 bg-[#12141f] rounded-2xl border border-slate-800">
                  <Crown className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-sm sm:text-base text-slate-400 font-bold uppercase tracking-widest">{isMasteryView ? "No Collectables Found" : "No Sprites Found"}</p>
                  <p className="text-sm sm:text-base text-slate-500 mt-2">{isMasteryView ? "You must collect variants in the Sprites tab before you can master them here." : "Try adjusting your search or filters."}</p>
                </div>
              )}

              {/* COMPACT LIST VIEW */}
              <div className="flex flex-col gap-2 animate-in fade-in duration-300">
                {filteredSprites.map(sprite => {
                  const displayVariant = variantFilter === 'All' ? 'base' : variantFilter.toLowerCase();
                  const validInitialVariant = sprite.variants.includes(displayVariant) ? displayVariant : 'base';

                  const hasAnyVariant = variantsList.some(v => collection[sprite.id]?.[v]);

                  return (
                    <div
                      key={sprite.id}
                      onClick={() => setSelectedSprite({ id: sprite.id, variant: validInitialVariant })}
                      className="flex items-center justify-between bg-[#151722] border border-slate-800/90 rounded-xl p-3 hover:bg-slate-800/80 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg p-1 border-2 transition-all flex-shrink-0 ${hasAnyVariant ? 'bg-cyan-950/40 border-cyan-500/50' : 'bg-slate-900 border-slate-800 grayscale opacity-60'}`}>
                          <img src={sprite.images[validInitialVariant]} className="w-full h-full object-contain drop-shadow-md" alt="" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-sm sm:text-base text-white uppercase italic tracking-tight">{sprite.name}</span>
                          <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider ${VARIANT_INFO[validInitialVariant]?.color}`}>{validInitialVariant}</span>
                        </div>
                      </div>

                      {/* Interactive Labeled Radio Dots Container */}
                      <div className="flex gap-1.5 sm:gap-2">
                        {variantsList.map(v => {
                          if (!sprite.variants.includes(v)) return null;
                          const isLocked = isVariantLocked(sprite.id, v);
                          const isCollected = collection[sprite.id]?.[v];
                          const isMastered = mastery[sprite.id]?.[v];

                          if (statusFilter === 'Missing' && isCollected && !isMasteryView) return null;

                          return (
                            <div key={v} className="flex flex-col items-center gap-1">
                              <div
                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border transition-all relative ${isLocked ? 'bg-slate-950/80 border-slate-800/60 opacity-60' : isMasteryView && isMastered ? 'bg-yellow-900/40 border-yellow-400' : isCollected ? `bg-slate-900 border-${VARIANT_INFO[v]?.color.split('-')[1]}-500/70` : 'bg-black border-slate-800'}`}
                              >
                                {isLocked ? (
                                  <Lock className="w-2.5 h-2.5 text-amber-400/80" />
                                ) : (
                                  <>
                                    {isCollected && (
                                      <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${VARIANT_INFO[v]?.bgColor} ${(isMasteryView && isMastered) ? 'opacity-30' : 'opacity-100'}`} />
                                    )}
                                    {isMasteryView && isMastered && (
                                      <Crown className="w-3.5 h-3.5 text-yellow-400 drop-shadow-[0_0_2px_rgba(255,215,0,0.8)] absolute z-10" />
                                    )}
                                  </>
                                )}
                              </div>
                              <span className="text-[7px] font-bold uppercase text-slate-500">{v === 'holofoil' ? 'Holo' : v}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        )}

        {/* --- FRIENDS TAB VIEW --- */}
        {currentView === 'friends' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <section className="bg-gradient-to-br from-indigo-900/40 to-blue-900/20 border-2 border-indigo-500/50 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400" />
                <h2 className="text-xl sm:text-2xl font-black text-indigo-400 uppercase italic">Sprite Squad</h2>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Search for friends by their Sprite ID. Once they accept your request, you can view their collections and crowns.
              </p>
            </section>

            {/* COMPACT EXTRACTION TARGETS BANNER */}
            <section className="bg-[#12141f] rounded-2xl border border-slate-800 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5" /> Extraction Targets
                </h3>
                <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase">{extractionTargets.filter(Boolean).length} / 3 Targets</span>
              </div>
              <div className="flex gap-2">
                {[0, 1, 2].map(index => renderTargetSlot(extractionTargets[index], index))}
              </div>
            </section>

            <section className="bg-[#12141f] rounded-2xl border border-slate-800 p-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">Add Friend</h3>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={friendSearchQuery}
                    onChange={(e) => setFriendSearchQuery(e.target.value)}
                    placeholder="Search Sprite ID..."
                    className="w-full bg-black border-2 border-slate-800 rounded-xl pl-9 sm:pl-10 pr-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button onClick={handleSearchFriend} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-xl flex items-center justify-center transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {friendSearchStatus === 'searching' && <p className="text-sm text-slate-400 mt-3">Searching...</p>}
              {friendSearchStatus === 'not-found' && <p className="text-sm text-red-400 mt-3 font-bold">Sprite ID not found.</p>}
              {friendSearchStatus === 'found' && friendSearchResult && (
                <div className="mt-4 p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-xl flex justify-between items-center animate-in zoom-in-95">
                  <span className="text-base sm:text-lg font-bold text-white">@{friendSearchResult.spriteId}</span>
                  <button onClick={handleSendFriendRequest} className="bg-indigo-500 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-white flex items-center gap-1 hover:bg-indigo-400 transition-colors">
                    <UserPlus className="w-4 h-4" /> Request
                  </button>
                </div>
              )}
            </section>

            {/* SENT REQUESTS */}
            {sentRequests.length > 0 && (
              <section className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">Sent Requests</h3>
                {sentRequests.map(req => (
                  <div key={req.id} className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-slate-800 mb-2">
                    <span className="text-sm sm:text-base font-bold text-slate-300 tracking-wider">To: @{req.receiverSpriteId}</span>
                    <button onClick={() => cancelFriendRequest(req.id)} className="bg-red-900/40 hover:bg-red-900/60 border border-red-800/50 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase text-red-400 transition-colors flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Cancel
                    </button>
                  </div>
                ))}
              </section>
            )}

            {/* PENDING REQUESTS */}
            {pendingRequests.length > 0 && (
              <section className="bg-indigo-950/20 rounded-2xl border border-indigo-500/30 p-4">
                <h3 className="text-sm font-black text-indigo-400 uppercase tracking-wider mb-3">Incoming Requests</h3>
                {pendingRequests.map(req => (
                  <div key={req.id} className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-slate-800 mb-2">
                    <span className="text-sm sm:text-base font-bold text-white tracking-wider">@{req.senderSpriteId}</span>
                    <button onClick={() => acceptFriendRequest(req)} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase text-white transition-colors flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Accept
                    </button>
                  </div>
                ))}
              </section>
            )}

            {/* RICH LEADERBOARD FRIEND LIST */}
            <section className="bg-[#12141f] rounded-2xl border border-slate-800 p-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">Sprite Squad ({richFriends.length})</h3>

              {richFriends.length === 0 ? (
                <div className="text-center py-6">
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm sm:text-base font-bold text-slate-500">No friends added yet.</p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">Use the search bar above to connect.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {richFriends.map((friend, index) => {
                    const matchFound = isMutualMatch(friend);
                    const cardClass = matchFound
                      ? "bg-cyan-950/40 border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                      : "bg-slate-900 border border-slate-800/80";

                    return (
                      <div key={index} className={`p-3 rounded-xl flex items-center justify-between transition-all duration-300 ${cardClass}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black ${matchFound ? 'bg-cyan-900/50 border-cyan-400 text-cyan-400' : 'bg-indigo-900/50 border-indigo-500/50 text-indigo-400'}`}>
                            #{index + 1}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm sm:text-base font-bold text-white tracking-wider flex items-center gap-1">
                              @{friend.spriteId || 'Unknown'}
                            </span>
                            {matchFound ? (
                              <span className="text-[9px] sm:text-[10px] font-black text-cyan-400 font-mono tracking-widest mt-0.5 animate-pulse uppercase flex items-center gap-1">
                                <Target className="w-3 h-3" /> Extraction Match
                              </span>
                            ) : (
                              <span className="text-[10px] sm:text-[11px] font-black text-indigo-400 font-mono tracking-widest">
                                {friend.completionRate}% COMPLETE
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button onClick={() => inspectFriendLibrary(friend)} className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-colors ${matchFound ? 'bg-cyan-900/40 text-cyan-300 hover:bg-cyan-900/60 border-cyan-500/50' : 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-900/60 border-indigo-500/30'}`}>
                            View
                          </button>
                          <button onClick={() => setShowUnfriendConfirm(friend)} className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-950/30 transition-colors">
                            <UserMinus className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* --- SUPPORT TAB VIEW --- */}
        {currentView === 'feedback' && (
          <section className="flex flex-col gap-4 animate-in fade-in duration-300 pt-2">

            {/* --- GOOGLE PLAY STORE PROMO CARD --- */}
            <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900 border-2 border-emerald-500/50 rounded-2xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-emerald-950/80 rounded-full border border-emerald-400 flex items-center justify-center mb-3">
                <Smartphone className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-lg font-black text-white uppercase italic mb-1 tracking-wider">Spritedex is on Android!</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 max-w-xs">
                Take your sprite tracking on the go! Download the official app directly from the Google Play Store.
              </p>
              <a
                href="https://play.google.com/store/apps/details?id=com.prosynctech.spritedex"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-lg"
              >
                <span>Get it on Google Play</span>
              </a>
            </div>

            <div className="bg-[#12141f] border-2 border-emerald-500/40 rounded-2xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <h3 className="text-xl sm:text-2xl font-black text-emerald-400 uppercase italic mb-2">Feedback & Support</h3>
              <p className="text-sm sm:text-base text-slate-400 mb-6">Have an idea to improve the app? Found missing information or encountered a bug? We want to hear from you!</p>

              <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-3">
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us what you think..."
                  className="w-full bg-black/50 border-2 border-slate-800 rounded-xl p-3 text-sm sm:text-base text-white focus:outline-none focus:border-emerald-500 min-h-[120px] resize-y"
                  required
                />
                <button
                  type="submit"
                  disabled={feedbackStatus === 'submitting'}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white font-black uppercase tracking-wider py-3 rounded-xl transition-colors"
                >
                  {feedbackStatus === 'submitting' ? 'Sending...' : feedbackStatus === 'success' ? <><CheckCircle className="w-5 h-5" /> Sent!</> : <><Mail className="w-5 h-5" /> Send Feedback</>}
                </button>
                {feedbackStatus === 'error' && <p className="text-red-400 text-xs text-center font-bold mt-1">Failed to send. Please try again.</p>}
              </form>
            </div>

            {/* --- AFFILIATE / SUPPORT APP SECTION --- */}
            <div className="p-5 bg-gradient-to-r from-purple-900/30 to-fuchsia-900/20 border border-purple-500/40 rounded-2xl flex flex-col items-center text-center shadow-[0_0_15px_rgba(168,85,247,0.15)] animate-in fade-in duration-500">
              <div className="w-12 h-12 bg-purple-900/50 rounded-full border border-purple-400/50 flex items-center justify-center mb-3">
                <Info className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-lg font-black text-purple-400 uppercase italic mb-2 tracking-wider">Support the Tracker</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 max-w-[280px]">
                You've collected them in-game, now collect them in real life! Grab some physical Sprites online and help keep this app running.
              </p>

              <div className="flex flex-col gap-2.5 w-full max-w-[280px]">
                <a
                  href="https://amzn.to/3ThkM2y"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-purple-900/40 hover:bg-purple-600 border border-purple-500/50 text-white font-black uppercase tracking-widest py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md"
                >
                  <span>Mini Sprites</span>
                  <ShoppingCart className="w-4 h-4 opacity-70" />
                </a>

                <a
                  href="https://amzn.to/4yzmyfD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-purple-900/40 hover:bg-purple-600 border border-purple-500/50 text-white font-black uppercase tracking-widest py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md"
                >
                  <span>Sprite Plush</span>
                  <ShoppingCart className="w-4 h-4 opacity-70" />
                </a>
              </div>

              <p className="text-[9px] text-slate-500 mt-5 italic font-mono tracking-tight max-w-[240px]">
                As an Amazon Associate I earn from qualifying purchases.
              </p>
            </div>
          </section>
        )}

        <footer className="mt-6 pt-6 border-t border-slate-800 text-center pb-4">
          <p className="text-[9px] sm:text-[10px] text-slate-500 leading-relaxed px-2">
            Portions of the materials used are trademarks and/or copyrighted works of Epic Games, Inc. All rights reserved by Epic. This material is not official and is not endorsed by Epic.
          </p>
        </footer>

      </main>

      {/* --- EXTENDED BOTTOM NAVIGATION BAR --- */}
      <nav className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
        <div className="bg-[#0e1017]/95 backdrop-blur-md border border-slate-800 rounded-2xl w-full max-w-sm px-2 py-2 flex justify-between shadow-2xl">

          <button onClick={() => { setCurrentView('sprites'); setActiveViewingFriend(null); playBeep(440, 'sine', 0.05); }} className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${currentView === 'sprites' && !activeViewingFriend ? 'text-cyan-400' : 'text-slate-600'}`}>
            <List className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">Sprites</span>
          </button>

          <button onClick={() => { setCurrentView('mastery'); setActiveViewingFriend(null); playBeep(523, 'sine', 0.05); }} className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${currentView === 'mastery' && !activeViewingFriend ? 'text-yellow-400' : 'text-slate-600'}`}>
            <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">Mastery</span>
          </button>

          <button onClick={() => { setCurrentView('friends'); setActiveViewingFriend(null); playBeep(587, 'sine', 0.05); }} className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${currentView === 'friends' || activeViewingFriend ? 'text-indigo-400' : 'text-slate-600'}`}>
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">Friends</span>
          </button>

          <button onClick={() => { setCurrentView('feedback'); setActiveViewingFriend(null); playBeep(659, 'sine', 0.05); }} className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${currentView === 'feedback' && !activeViewingFriend ? 'text-emerald-400' : 'text-slate-600'}`}>
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">Support</span>
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