import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivacyPolicy from './PrivacyPolicy';
import { App as CapApp } from '@capacitor/app';
import {
  Search, CheckCircle, Circle, Volume2, VolumeX, Percent, RotateCcw, AlertTriangle, X, Eye, Crown, Users, UserPlus, ChevronLeft, ChevronRight, Check, XCircle, UserMinus, Target, Plus, FileText, Radio, Info, MessageSquare, Mail, Lock, List, Filter, ChevronDown, ChevronUp, ShoppingCart, Smartphone, Globe, Settings, LogOut, History, AtSign, User as UserIcon, Edit3, Save, Tv, Gamepad2, Calendar, Award, Video, Music, Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc, updateDoc, collection as firestoreCollection, query, where, getDocs, arrayUnion, arrayRemove, deleteDoc, onSnapshot, addDoc } from 'firebase/firestore';
import { sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';

import { translations } from './locales';

// --- NEW SPRITES & VARIANTS IMPORTS ---
import ironMouseBase from './assets/Iron Mouse Base.webp';

import peelyBase from './assets/Peely Base.webp';
import peelyGold from './assets/Gold Peely.webp';
import peelyGummy from './assets/Gummy Peely.webp';
import peelyGalaxy from './assets/Galaxy Peely.webp';
import peelyHolofoil from './assets/Holofoil Peely.webp';

import llamaBase from './assets/Llama Base.webp';
import llamaGold from './assets/Gold Llama.webp';
import llamaGummy from './assets/Gummy Llama.webp';
import llamaGalaxy from './assets/Galaxy Llama.webp';
import llamaGem from './assets/Gem Llama.webp';

import zpHolofoil from './assets/Holofoil Zero Point.webp';
import zpCube from './assets/Cube Zero Point.webp';

import waterQuack from './assets/Quack Water.webp';
import earthQuack from './assets/Quack Earth.webp';
import fireQuack from './assets/Quack Fire.webp';

import grimGem from './assets/Gem Grim.webp';
import grimHolofoil from './assets/Holofoil Grim.webp';

// --- EXISTING IMPORTS ---
import johnWickBase from './assets/John Wick Base.webp';
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
import cubeBatman from './assets/Cube Batman.webp';
import cubeEarth from './assets/Cube Earth.webp';
import cubeFire from './assets/Cube Fire.webp';
import cubeDream from './assets/Cube Dream.webp';
import cubePunk from './assets/Cube Punk.webp';
import cubeFishy from './assets/Cube Fishy.webp';
import cubeBoss from './assets/Cube Boss.webp';
import cubeGrim from './assets/Cube Grim.webp';
import gemZeroPoint from './assets/Gem Zero Point.webp';
import gemWater from './assets/Gem Water.webp';
import gemEarth from './assets/Gem Earth.webp';
import gemDuck from './assets/Gem Duck.webp';
import gemDemon from './assets/Gem Demon.webp';
import gemPunk from './assets/Gem Punk.webp';
import gemAura from './assets/Gem Aura.webp';
import quackZeroPoint from './assets/Quack Zero Point.webp';

const variantsList = ['base', 'gold', 'gummy', 'galaxy', 'holofoil', 'cube', 'gem', 'quack'];
const LOCKED_VARIANTS = {};

const isVariantLocked = (spriteId, variant) => {
  return LOCKED_VARIANTS[spriteId]?.includes(variant) || false;
};

const SPRITES_DATABASE = [
  { id: "iron-mouse", name: "Iron Mouse", rarity: "Mythic", images: { base: ironMouseBase }, variants: ['base'], baseAbility: { en: "Regenerate health over time when low. While regenerating, gain Cloak and low gravity! Health regenerated to increases at each Level Up: 60 Health -> 70 Health -> 80 Health -> 90 Health -> 100 Health", es: "Regenera salud con el tiempo cuando está baja. ¡Mientras te regeneras, obtienes Camuflaje y baja gravedad! La salud regenerada aumenta en cada Nivel: 60 Salud -> 70 Salud -> 80 Salud -> 90 Salud -> 100 Salud" } },
  { id: "john-wick", name: "John Wick", rarity: "Mythic", images: { base: johnWickBase }, variants: ['base'], baseAbility: { en: "Reveals nearby enemies after you knock or eliminate another player. Sprite level stays exactly as found. Only Sprite usable in Fortnite Reload (Simpsons Reload Mode). Claiming in Reload unlocks it for Battle Royale and other modes.", es: "Revela enemigos cercanos después de derribar o eliminar a otro jugador. Su nivel se mantiene exactamente como se encontró. Es el único Sprite utilizable en Fortnite Recarga. Reclamarlo en Recarga lo desbloquea para Battle Royale y otros modos." } },
  { id: "peely", name: "Peely", rarity: "Legendary", images: { base: peelyBase, gold: peelyGold, gummy: peelyGummy, galaxy: peelyGalaxy, holofoil: peelyHolofoil }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil'], baseAbility: { en: "Emits a ping for players with rare sprites nearby, but marks you on the map. Ping radius increases at each Level Up: 40m -> 50m -> 60m -> 70m -> 80m", es: "Emite un ping para los jugadores con sprites raros cercanos, pero te marca en el mapa. El radio del ping aumenta en cada Nivel: 40m -> 50m -> 60m -> 70m -> 80m" } },
  { id: "llama", name: "Llama", rarity: "Legendary", images: { base: llamaBase, gold: llamaGold, gummy: llamaGummy, galaxy: llamaGalaxy, gem: llamaGem }, variants: ['base', 'gold', 'gummy', 'galaxy', 'gem'], baseAbility: { en: "Opening ammo boxes has a chance to grant a weapon upgrade. Chance increases at each Level Up: 5% -> 10% -> 15% -> 17% -> 20%", es: "Abrir cajas de munición tiene la posibilidad de otorgar una mejora de arma. La probabilidad aumenta en cada Nivel: 5% -> 10% -> 15% -> 17% -> 20%" } },
  { id: "zero-point", name: "Zero Point", rarity: "Mythic", images: { base: zpBase, gold: zpGold, gummy: zpGummy, galaxy: zpGalaxy, holofoil: zpHolofoil, cube: zpCube, gem: gemZeroPoint, quack: quackZeroPoint }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil', 'cube', 'gem', 'quack'], baseAbility: { en: "Spawn a Shield Bubble Jr. when you use a healing item on yourself (excluding splashes and grenades). Duration at each Level Up: 6s -> 7s -> 8s -> 9s -> 10s.", es: "Genera una Burbuja Escudo Jr. cuando usas un objeto de curación en ti mismo (excluyendo salpicones y granadas). Duración por nivel: 6s -> 7s -> 8s -> 9s -> 10s." } },
  { id: "burnt-peanut", name: "Burnt Peanut", rarity: "Mythic", images: { base: peanutBase, gold: peanutBase, gummy: peanutBase, galaxy: peanutBase }, variants: ['base'], baseAbility: { en: "Goop! When eliminating players, you may find more loot. Sometimes mythic! Chance at each Level Up: 20% -> 30% -> 40% -> 50% -> 60% chance (10% chance to find Mythic at Max Level!).", es: "¡Pringue! Al eliminar jugadores, puedes encontrar más botín. ¡A veces mítico! Probabilidad por nivel: 20% -> 30% -> 40% -> 50% -> 60% (¡10% de encontrar Mítico al Nivel Máximo!)." } },
  { id: "batman", name: "Batman", rarity: "Mythic", images: { base: batmanBase, gold: batmanGold, gummy: batmanGummy, galaxy: batmanGalaxy, holofoil: batmanHolofoil, cube: cubeBatman }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil', 'cube'], baseAbility: { en: "Grants the ability to launch in the air and deploy the Bat Cape!", es: "¡Otorga la habilidad de lanzarte en el aire y desplegar la capa de murciélago!" } },
  { id: "vini-jr", name: "Vini Jr", rarity: "Mythic", images: { base: viniBase, gold: viniBase, gummy: viniBase, galaxy: viniBase, holofoil: viniBase }, variants: ['base'], baseAbility: { en: "Sprinting for a short time makes your slide destructive. Slidekicking enemies increases rate of fire and reload speed. Increases in power at each Level Up: 40 dmg / 10% fire rate -> 45 dmg / 20% fire rate -> 50 dmg / 30% fire rate -> 55 dmg / 40% fire rate -> 60 dmg / 50% fire rate", es: "Esprintar por poco tiempo hace que tu deslizamiento sea destructivo. Patear enemigos deslizándote aumenta la cadencia de fuego y recarga. Aumentos: 40 daño / 10% cadencia -> 45 / 20% -> 50 / 30% -> 55 / 40% -> 60 / 50%." } },
  { id: "pollo", name: "Pollo", rarity: "Mythic", images: { base: polloBase, gold: polloBase, gummy: polloBase, galaxy: polloBase, holofoil: polloBase }, variants: ['base'], baseAbility: { en: "Upon earning an elimination, slowly replenish shield for you and nearby squad members for a duration. Duration increases at each Level Up: 6 Seconds -> 7 Seconds -> 8 Seconds -> 9 Seconds -> 10 Seconds", es: "Al conseguir una eliminación, repón lentamente el escudo para ti y miembros cercanos del escuadrón. Duración: 6s -> 7s -> 8s -> 9s -> 10s." } },
  { id: "dream", name: "Dream", rarity: "Legendary", images: { base: dreamBase, gold: dreamGold, gummy: dreamGummy, galaxy: dreamGalaxy, cube: cubeDream }, variants: ['base', 'gold', 'gummy', 'galaxy', 'cube'], baseAbility: { en: "Grants a random item at each level, exploding with legendary loot at Max Level. Loot value increases at each Level Up!", es: "Otorga un objeto aleatorio en cada nivel, explotando con botín legendario en el Nivel Máximo. ¡El valor del botín aumenta!" } },
  { id: "punk", name: "Punk", rarity: "Legendary", images: { base: punkBase, gold: punkGold, gummy: punkGummy, galaxy: punkGalaxy, cube: cubePunk, gem: gemPunk }, variants: ['base', 'gold', 'gummy', 'galaxy', 'cube', 'gem'], baseAbility: { en: "Does nothing until Level 5, in which it will always grant a buff for unlimited ammo.", es: "No hace nada hasta el Nivel 5, en el que siempre otorgará un potenciador de munición ilimitada." } },
  { id: "boss", name: "Boss", rarity: "Legendary", images: { base: bossBase, gold: bossGold, gummy: bossGummy, galaxy: bossGalaxy, cube: cubeBoss }, variants: ['base', 'gold', 'gummy', 'galaxy', 'cube'], baseAbility: { en: "Grants an increase to your max HP and Shield. Increases at each Level Up: 5 -> 10 -> 15 -> 20 -> 25 HP/Shield.", es: "Otorga un aumento a tu vida máxima y Escudo. Aumenta: 5 -> 10 -> 15 -> 20 -> 25 PV/Escudo." } },
  { id: "grim", name: "Grim", rarity: "Legendary", images: { base: grimBase, gold: grimGold, gummy: grimGummy, galaxy: grimGalaxy, holofoil: grimHolofoil, cube: cubeGrim, gem: grimGem }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil', 'cube', 'gem'], baseAbility: { en: "Players who attack you are marked for a duration. Duration at each Level Up: 3s -> 3.5s -> 4s -> 4.5s -> 5s.", es: "Los jugadores que te ataquen quedan marcados. Duración: 3s -> 3.5s -> 4s -> 4.5s -> 5s." } },
  { id: "seven", name: "Seven", rarity: "Legendary", images: { base: sevenBase, gold: sevenGold, gummy: sevenGummy, galaxy: sevenGalaxy, holofoil: sevenHolofoil }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil'], baseAbility: { en: "Enemy player foot trails are visible in the world for your Squad. Duration increases at each Level Up: 10 Seconds -> 15 Seconds -> 20 Seconds -> 25 Seconds -> 30 Second foot trails.", es: "Los rastros de los jugadores enemigos son visibles para tu Escuadrón. Duración: 10s -> 15s -> 20s -> 25s -> 30s." } },
  { id: "duck", name: "Duck", rarity: "Epic", images: { base: duckBase, gold: duckGold, gummy: duckGummy, galaxy: duckGalaxy, gem: gemDuck }, variants: ['base', 'gold', 'gummy', 'galaxy', 'gem'], baseAbility: { en: "Emoting or Jamming replenishes shields. Increases in power at each Level Up: 2 -> 3 -> 4 -> 6 -> 8 Shield per tick.", es: "Hacer un gesto o improvisar repone los escudos. Poder: 2 -> 3 -> 4 -> 6 -> 8 Escudo por tick." } },
  { id: "demon", name: "Demon", rarity: "Epic", images: { base: demonBase, gold: demonGold, gummy: demonGummy, galaxy: demonGalaxy, gem: gemDemon }, variants: ['base', 'gold', 'gummy', 'galaxy', 'gem'], baseAbility: { en: "Siphon some health and shields when you eliminate an opponent. Increases in power at each Level Up: 10 -> 15 -> 20 -> 25 -> 30 Healing per elimination.", es: "Sifón de salud y escudo cuando eliminas a un oponente. Poder: 10 -> 15 -> 20 -> 25 -> 30 Curación." } },
  { id: "ghost", name: "Ghost", rarity: "Epic", images: { base: ghostBase, gold: ghostGold, gummy: ghostGummy, galaxy: ghostGalaxy, holofoil: ghostHolofoil }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil'], baseAbility: { en: "Grants cloak for a duration upon reloading. Increases in duration at each Level Up: 3s -> 3.5s -> 4s -> 4.5s -> 5s.", es: "Otorga camuflaje por una duración al recargar. Duración: 3s -> 3.5s -> 4s -> 4.5s -> 5s." } },
  { id: "king", name: "King", rarity: "Epic", images: { base: kingBase, gold: kingGold, gummy: kingGummy, galaxy: kingGalaxy, holofoil: kingHolofoil }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil'], baseAbility: { en: "Your Pickaxe deals more damage. Increases in damage at each Level Up: 30 -> 40 -> 60 -> 80 -> 120 bonus damage.", es: "Tu pico inflige más daño. Daño: 30 -> 40 -> 60 -> 80 -> 120 daño adicional." } },
  { id: "aura", name: "Aura", rarity: "Epic", images: { base: auraBase, gold: auraGold, gummy: auraGummy, galaxy: auraGalaxy, gem: gemAura }, variants: ['base', 'gold', 'gummy', 'galaxy', 'gem'], baseAbility: { en: "Gain a Shock Rock charge when you deal enough damage to enemies! Required damage decreases at each Level Up: 175 -> 150 -> 125 -> 100 -> 75 Damage to trigger.", es: "¡Obtén una carga de Roca de Choque al infligir suficiente daño a enemigos! Daño requerido: 175 -> 150 -> 125 -> 100 -> 75 Daño." } },
  { id: "striker", name: "Striker", rarity: "Epic", images: { base: strikerBase, gold: strikerGold, gummy: strikerGummy, galaxy: strikerGalaxy, holofoil: strikerHolofoil }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil'], baseAbility: { en: "Gain the Overdrive effect when you Mantle, Hurdle, or Wall Scramble. Duration increases at each Level Up: 6s -> 7s -> 8s -> 9s -> 10s of Overdrive.", es: "Obtén el efecto Sobrecarga cuando trepas, saltas o te encaramas. Duración: 6s -> 7s -> 8s -> 9s -> 10s." } },
  { id: "water", name: "Water", rarity: "Rare", images: { base: waterBase, gold: waterGold, gummy: waterGummy, galaxy: waterGalaxy, holofoil: waterHolofoil, gem: gemWater, quack: waterQuack }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil', 'gem', 'quack'], baseAbility: { en: "Replenish shields while standing in water! Increases in power at each Level Up: 2 -> 3 -> 4 -> 5 -> 6 Shield per tick.", es: "¡Repón escudos mientras estás en el agua! Poder: 2 -> 3 -> 4 -> 5 -> 6 Escudo por tick." } },
  { id: "earth", name: "Earth", rarity: "Rare", images: { base: earthBase, gold: earthGold, gummy: earthGummy, galaxy: earthGalaxy, cube: cubeEarth, gem: gemEarth, quack: earthQuack }, variants: ['base', 'gold', 'gummy', 'galaxy', 'cube', 'gem', 'quack'], baseAbility: { en: "You have a chance to find additional rare items when opening chests. Chance increases at each Level Up: 10% -> 12.5% -> 15% -> 17.5% -> 20% chance.", es: "Tienes la posibilidad de encontrar objetos raros adicionales al abrir cofres. Probabilidad: 10% -> 12.5% -> 15% -> 17.5% -> 20%." } },
  { id: "fire", name: "Fire", rarity: "Rare", images: { base: fireBase, gold: fireGold, gummy: fireGummy, galaxy: fireGalaxy, holofoil: fireHolofoil, cube: cubeFire, quack: fireQuack }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil', 'cube', 'quack'], baseAbility: { en: "Creates a fiery burst when you deal enough damage to an enemy! Required damage decreases at each Level Up: 150 -> 125 -> 100 -> 75 -> 50 Damage to trigger.", es: "¡Crea un estallido ardiente cuando infliges suficiente daño a un enemigo! Daño requerido: 150 -> 125 -> 100 -> 75 -> 50 Daño." } },
  { id: "fishy", name: "Fishy", rarity: "Rare", images: { base: fishyBase, gold: fishyGold, gummy: fishyGummy, galaxy: fishyGalaxy, cube: cubeFishy }, variants: ['base', 'gold', 'gummy', 'galaxy', 'cube'], baseAbility: { en: "Swim speed greatly increased. Taking damage also briefly increases movement speed. Tiers: 25%/10% -> 50%/20% -> 100%/30% -> 150%/40% -> 200%/50% bonuses.", es: "Aumenta enormemente la velocidad de nado. Recibir daño también aumenta brevemente la velocidad de movimiento. Bonificaciones: 25%/10% -> 50%/20% -> 100%/30% -> 150%/40% -> 200%/50%." } },
  { id: "air", name: "Air", rarity: "Rare", images: { base: airBase, gold: airGold, gummy: airGummy, galaxy: airGalaxy, holofoil: airHolofoil }, variants: ['base', 'gold', 'gummy', 'galaxy', 'holofoil'], baseAbility: { en: "Increases sprinting speed and jump height. Also nullifies fall damage. Jump height increased with each Level Up!", es: "Aumenta la velocidad de esprint y la altura de salto. También anula el daño por caída. ¡Altura de salto aumentada con cada nivel!" } }
];

const PATCH_NOTES = [
  {
    version: "v1.7.0",
    date: "08/05/2026",
    title: "Gems Officially Unlocked!",
    changes: [
      "Gems Unlocked: The vault doors are open! All Gem variants are now officially live and available to check off in your collection.",
      "Backend Integration: Live analytics and database syncing are now running fully in the cloud.",
      "Stats Integrity: All Vault stats and progression trackers have been refreshed to accommodate the official drop!"
    ]
  },
  {
    version: "v1.6.1",
    date: "08/03/2026",
    title: "Friend Comparisons & Navigation Tweaks!",
    changes: [
      "Squad Comparisons: We added 'I Need' and 'They Need' filters when viewing a friend's profile to easily see which Sprites you can trade or hunt together.",
      "Smooth Navigation: Full support for the native Android hardware back button and swipe-to-go-back gestures has been added for seamless app browsing.",
      "Iron Mouse Unlocked: The Mythic Iron Mouse Sprite is now officially live and available to check off in your collection!"
    ]
  },
  {
    version: "v1.6.0",
    date: "08/02/2026",
    title: "Player Profiles & Squad Upgrades!",
    changes: [
      "Custom Player Profiles: Edit your bio, show off your Epic ID, and link your Twitch, Kick, YouTube, and TikTok channels!",
      "Trophy Case: Feature up to 4 of your favorite or rarest Sprites on your profile for everyone to see.",
      "Glowing Milestone Themes: Unlock vibrant, glowing profile cards as you master Sprites and complete your collection.",
      "Pulsing Extraction Matches: Target matches now glow with bright cyan across entire friend cards for instant clarity.",
      "Vault Balancing: Iron Mouse and Gem variants are locked until their official drop on 8/6/26 so completion stats stay 100% accurate!"
    ]
  },
  {
    version: "v1.5.1",
    date: "07/31/2026",
    title: "New Sprites!",
    changes: [
      "New Sprites Dropped: Added the Mythic John Wick Sprite, alongside newly discovered Llama, Iron Mouse, and Peely Sprites.",
      "Gem & Quack Sprites Unlocked: All variants are now live in-game and ready to be checked off in your collection!",
      "Language Support: Added full Spanish translation via the new Settings Menu.",
      "Cloud Accounts: Spritedex securely syncs your collection to the cloud so you never lose your progress.",
      "Clean UI Update: Re-proportioned Sprite cards and radio dots for a sleek, uncrowded viewing experience.",
      "Sorting Options: You can now sort alphabetically or by Rarity from the filters tab."
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
      "Filter Dropdown: We've added a clean new filter menu so you can easily sort by Rarity, Variant, and Collection Status."
    ]
  }
];

const totalPossibleStatic = SPRITES_DATABASE.reduce((acc, sprite) => acc + sprite.variants.filter(v => !isVariantLocked(sprite.id, v)).length, 0);

// --- MILESTONES FOR DOSSIER UNLOCKS ---
const MILESTONES = [
  { type: 'mastery', count: 10, name: "Bronze Initiate", bg: "bg-gradient-to-br from-amber-900/40 to-orange-900/20 border-amber-700/50", glow: "shadow-[0_0_20px_rgba(180,83,9,0.8)] border-amber-500" },
  { type: 'mastery', count: 25, name: "Silver Hunter", bg: "bg-gradient-to-br from-slate-400/20 to-slate-300/10 border-slate-400/50", glow: "shadow-[0_0_20px_rgba(148,163,184,0.8)] border-slate-400" },
  { type: 'mastery', count: 50, name: "Gold Striker", bg: "bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border-yellow-400/50", glow: "shadow-[0_0_20px_rgba(250,204,21,0.8)] border-yellow-400" },
  { type: 'mastery', count: 100, name: "Diamond Master", bg: "bg-gradient-to-br from-cyan-400/20 to-blue-500/10 border-cyan-400/50", glow: "shadow-[0_0_25px_rgba(34,211,238,0.8)] border-cyan-400" },
  { type: 'collection', count: 100, isPercent: true, name: "The Collector", bg: "bg-gradient-to-br from-purple-600/20 to-fuchsia-500/10 border-purple-500/50", glow: "shadow-[0_0_25px_rgba(168,85,247,0.8)] border-purple-400" },
  { type: 'mastery', count: 100, isPercent: true, name: "True Perfection", bg: "bg-gradient-to-br from-rose-500/20 via-purple-500/20 to-cyan-500/20 border-rose-400/50", glow: "shadow-[0_0_30px_rgba(244,63,94,0.8)] border-rose-400" }
];

const getUnlockedMilestone = (collectedCount, masteredCount) => {
  let highest = null;
  const colPercent = totalPossibleStatic > 0 ? Math.round((collectedCount / totalPossibleStatic) * 100) : 0;
  const mastPercent = totalPossibleStatic > 0 ? Math.round((masteredCount / totalPossibleStatic) * 100) : 0;

  if (masteredCount >= 10) highest = MILESTONES[0];
  if (masteredCount >= 25) highest = MILESTONES[1];
  if (masteredCount >= 50) highest = MILESTONES[2];
  if (masteredCount >= 100) highest = MILESTONES[3];
  if (colPercent >= 100) highest = MILESTONES[4];
  if (mastPercent >= 100) highest = MILESTONES[5];

  return highest;
};

const PROFANITY_LIST = ['fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'whore', 'slut', 'fag', 'nigger', 'nigga', 'cock', 'bastard', 'crap'];

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

const RARITY_COLORS = { Mythic: "bg-yellow-400 text-black border-yellow-300 font-extrabold", Legendary: "bg-orange-500 text-white border-orange-400", Epic: "bg-purple-600 text-white border-purple-400", Rare: "bg-blue-600 text-white border-blue-400", Unknown: "bg-slate-500 text-white border-slate-400" };
const RARITY_BG_GRADIENTS = { Mythic: "from-yellow-400 via-yellow-600 to-amber-950", Legendary: "from-orange-500 via-orange-700 to-amber-950", Epic: "from-purple-600 via-purple-800 to-slate-950", Rare: "from-blue-500 via-blue-700 to-slate-950", Unknown: "from-slate-600 via-slate-800 to-slate-950" };
const SUMMON_COST_MATRIX = { Mythic: { base: "6,750", variant: "10,000" }, Legendary: { base: "4,500", variant: "6,750" }, Epic: { base: "2,700", variant: "4,000" }, Rare: { base: "1,800", variant: "2,700" }, Unknown: { base: "TBD", variant: "TBD" } };
const RARITY_WEIGHT = { Mythic: 4, Legendary: 3, Epic: 2, Rare: 1, Unknown: 0 };

function MainApp() {
  const { user, signUp, logIn, logOut } = useAuth();

  const [lang, setLang] = useState(localStorage.getItem('spritedex_lang') || 'en');
  const t = (key) => translations[lang][key] || key;

  const toggleLang = () => {
    const nextLang = lang === 'en' ? 'es' : 'en';
    setLang(nextLang);
    localStorage.setItem('spritedex_lang', nextLang);
  };

  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [spriteId, setSpriteId] = useState(null);
  const [isSettingSpriteId, setIsSettingSpriteId] = useState(false);
  const [desiredSpriteId, setDesiredSpriteId] = useState('');
  const [spriteIdError, setSpriteIdError] = useState('');

  const [currentView, setCurrentView] = useState('sprites');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [rarityFilter, setRarityFilter] = useState('All');
  const [variantFilter, setVariantFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('A-Z');

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showUnfriendConfirm, setShowUnfriendConfirm] = useState(null);
  const [selectedSprite, setSelectedSprite] = useState(null);
  const audioCtxRef = useRef(null);

  const [showPatchNotes, setShowPatchNotes] = useState(false);
  const [showTransmission, setShowTransmission] = useState(false);
  const [hasCheckedVersion, setHasCheckedVersion] = useState(false);

  const [collection, setCollection] = useState({});
  const [mastery, setMastery] = useState({});
  const [extractionTargets, setExtractionTargets] = useState([]);
  const [profileData, setProfileData] = useState({ bio: '', epicName: '', twitchName: '', tiktokName: '', youtubeName: '', kickName: '', trophies: [null, null, null, null] });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("idle");

  const [squadSearchQuery, setSquadSearchQuery] = useState('');

  const [showAddFriendInput, setShowAddFriendInput] = useState(false);
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [friendSearchResult, setFriendSearchResult] = useState(null);
  const [friendSearchStatus, setFriendSearchStatus] = useState('');

  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [richFriends, setRichFriends] = useState([]);
  const [activeViewingFriend, setActiveViewingFriend] = useState(null);

  const [fSearchQuery, setFSearchQuery] = useState('');
  const [showFFilters, setShowFFilters] = useState(false);
  const [fRarityFilter, setFRarityFilter] = useState('All');
  const [fVariantFilter, setFVariantFilter] = useState('All');
  const [fStatusFilter, setFStatusFilter] = useState('All');
  const [fSortBy, setFSortBy] = useState('A-Z');

  const [showTargetSelector, setShowTargetSelector] = useState(false);
  const [targetSlotIndex, setTargetSlotIndex] = useState(null);

  const [showTrophySelector, setShowTrophySelector] = useState(false);
  const [trophySlotIndex, setTrophySlotIndex] = useState(null);

  useEffect(() => { document.title = "Spritedex"; }, []);

  // --- HARDWARE BACK BUTTON LOGIC ---
  useEffect(() => {
    const handleBackButton = ({ canGoBack }) => {
      if (showSettingsModal) return setShowSettingsModal(false);
      if (showAboutModal) return setShowAboutModal(false);
      if (selectedSprite) return setSelectedSprite(null);
      if (showPatchNotes) return setShowPatchNotes(false);
      if (showTransmission) return setShowTransmission(false);
      if (showTargetSelector) return setShowTargetSelector(false);
      if (showTrophySelector) return setShowTrophySelector(false);
      if (showUnfriendConfirm) return setShowUnfriendConfirm(null);
      if (showResetConfirm) return setShowResetConfirm(false);
      if (showAddFriendInput) return setShowAddFriendInput(false);
      if (activeViewingFriend) return setActiveViewingFriend(null);

      // Navigate back to the Sprites tab if currently in another section
      if (currentView !== 'sprites') return setCurrentView('sprites');

      // If nothing is open and we are on the main tab, minimize the app
      if (canGoBack) window.history.back();
    };

    const listener = CapApp.addListener('backButton', handleBackButton);
    return () => { listener.then(handle => handle.remove()); };
  }, [showSettingsModal, showAboutModal, selectedSprite, showPatchNotes, showTransmission, showTargetSelector, showTrophySelector, showUnfriendConfirm, showResetConfirm, showAddFriendInput, activeViewingFriend, currentView]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => { setIsInitializing(false); });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setCollection({});
      setMastery({});
      setExtractionTargets([]);
      setProfileData({ bio: '', epicName: '', twitchName: '', tiktokName: '', youtubeName: '', kickName: '', trophies: [null, null, null, null] });
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
        setProfileData(data.profile || { bio: '', epicName: '', twitchName: '', tiktokName: '', youtubeName: '', kickName: '', trophies: [null, null, null, null] });
        setFriendsList(data.friends || []);

        // --- NEW: Self-healing script for legacy accounts ---
        if (!data.creationTime && user.metadata?.creationTime) {
          updateDoc(userDocRef, { creationTime: user.metadata.creationTime }).catch(e => { });
        }
        // ----------------------------------------------------

        if (data.spriteId) {
          setSpriteId(data.spriteId);
        } else {
          setIsSettingSpriteId(true);
        }

        if (!hasCheckedVersion && !isSettingSpriteId) {
          const userVersion = data.lastSeenVersion || "v1.0.0";
          if (userVersion !== PATCH_NOTES[0].version) setShowTransmission(true);
          setHasCheckedVersion(true);
        }
      } else {
        setIsSettingSpriteId(true);
      }
    });

    const reqsQuery = query(firestoreCollection(db, "friend_requests"), where("receiverId", "==", user.uid));
    const unsubReqs = onSnapshot(reqsQuery, (snapshot) => setPendingRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    const sentReqsQuery = query(firestoreCollection(db, "friend_requests"), where("senderId", "==", user.uid));
    const unsubSentReqs = onSnapshot(sentReqsQuery, (snapshot) => setSentRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    return () => { unsubUser(); unsubReqs(); unsubSentReqs(); };
  }, [user, hasCheckedVersion, isSettingSpriteId]);

  useEffect(() => {
    const fetchRichFriends = async () => {
      if (!friendsList || friendsList.length === 0) return setRichFriends([]);
      const promises = friendsList.map(async (friend) => {
        if (typeof friend === 'string') return null;
        try {
          const docSnap = await getDoc(doc(db, "users", friend.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            let tCollected = 0;
            let tMastered = 0;
            SPRITES_DATABASE.forEach(sprite => {
              tCollected += sprite.variants.filter(v => !isVariantLocked(sprite.id, v) && (data.sprites || {})[sprite.id]?.[v]).length;
              tMastered += sprite.variants.filter(v => !isVariantLocked(sprite.id, v) && (data.mastery || {})[sprite.id]?.[v]).length;
            });
            const cRate = totalPossibleStatic > 0 ? Math.round((tCollected / totalPossibleStatic) * 100) : 0;
            const mRate = totalPossibleStatic > 0 ? Math.round((tMastered / totalPossibleStatic) * 100) : 0;
            return { ...friend, completionRate: cRate, masteryRate: mRate, sprites: data.sprites || {}, profile: data.profile || {}, creationTime: data.creationTime || null, extractionTargets: data.extractionTargets || [] };
          }
        } catch (e) { }
        return { ...friend, completionRate: 0, masteryRate: 0, sprites: {}, profile: {}, extractionTargets: [] };
      });
      const results = await Promise.all(promises);
      setRichFriends(results.filter(Boolean).sort((a, b) => b.completionRate - a.completionRate));
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

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsAuthLoading(true);
    const sanitizedEmail = email.trim().toLowerCase();

    try {
      if (isLoginMode) {
        await logIn(sanitizedEmail, password);
      } else {
        const userCred = await signUp(sanitizedEmail, password);
        await setDoc(doc(db, "users", userCred.user.uid), { creationTime: new Date().toISOString() }, { merge: true });
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        alert(lang === 'es' ? "¡Ya existe una cuenta con este correo! Por favor, inicia sesión o restablece tu contraseña." : "An account with this email already exists! Please sign in or reset your password.");
        setIsLoginMode(true);
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        alert(lang === 'es' ? "Correo o contraseña incorrectos. Inténtalo de nuevo." : "Incorrect email or password. Please try again.");
      } else {
        alert(err.message);
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSaveSpriteId = async (e) => {
    e.preventDefault();
    setSpriteIdError('');
    if (desiredSpriteId.length < 3) return setSpriteIdError('Sprite ID must be at least 3 characters.');
    if (PROFANITY_LIST.some(word => desiredSpriteId.toLowerCase().includes(word))) return setSpriteIdError('Please choose a more appropriate Sprite ID.');
    try {
      const querySnapshot = await getDocs(query(firestoreCollection(db, "users"), where("spriteId", "==", desiredSpriteId.toLowerCase())));
      if (!querySnapshot.empty) return setSpriteIdError('That Sprite ID is already taken!');
      await setDoc(doc(db, "users", user.uid), { spriteId: desiredSpriteId.toLowerCase(), friends: [], extractionTargets: [], lastSeenVersion: PATCH_NOTES[0].version }, { merge: true });
      setSpriteId(desiredSpriteId.toLowerCase());
      setIsSettingSpriteId(false);
    } catch (error) { setSpriteIdError('An error occurred. Try again.'); }
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
      const updated = { ...prev, [spriteId]: { ...(prev[spriteId] || {}), [variant]: newVal } };
      if (newVal && SPRITES_DATABASE.find(s => s.id === spriteId).variants.filter(v => !isVariantLocked(spriteId, v)).every(v => updated[spriteId][v])) {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 }, colors: ['#00f0ff', '#ffe600', '#ff007f', '#8a2be2', '#38bdf8'] });
        setTimeout(() => confetti.reset(), 3000);
      }
      setDoc(doc(db, "users", user.uid), { sprites: updated }, { merge: true }).catch(e => { });
      return updated;
    });
  };

  const toggleMastery = (spriteId, variant, forceValue = null) => {
    if (isVariantLocked(spriteId, variant)) return;
    setMastery(prev => {
      const newVal = forceValue !== null ? forceValue : !(prev[spriteId] || {})[variant];
      const updated = { ...prev, [spriteId]: { ...(prev[spriteId] || {}), [variant]: newVal } };
      if (newVal) {
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 }, colors: ['#FFD700', '#FFA500', '#DAA520', '#FFF8DC'] });
        setTimeout(() => confetti.reset(), 3000);
        playBeep(1046.50, 'sine', 0.2);
      } else playBeep(220, 'sawtooth', 0.1);
      setDoc(doc(db, "users", user.uid), { mastery: updated }, { merge: true }).catch(e => { });
      return updated;
    });
  };

  const handleAbsoluteReset = () => {
    setCollection({}); setMastery({}); setShowResetConfirm(false);
    setDoc(doc(db, "users", user.uid), { sprites: {}, mastery: {} }, { merge: true });
    playBeep(180, 'sawtooth', 0.3);
  };

  const handlePasswordReset = () => {
    if (!email) return alert("Please enter your email address in the field above first.");
    sendPasswordResetEmail(auth, email).then(() => { setResetSent(true); setTimeout(() => setResetSent(false), 6000); }).catch((e) => alert(e.message));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackStatus('submitting');
    try {
      await addDoc(firestoreCollection(db, "mail"), { to: "prosyncts@gmail.com", message: { subject: "Spritedex App Support", text: `Sprite ID: ${spriteId || "User"}\n\nMessage:\n${feedbackText}` } });
      setFeedbackStatus('success'); setFeedbackText(''); setTimeout(() => setFeedbackStatus('idle'), 3000);
    } catch (error) { setFeedbackStatus('error'); setTimeout(() => setFeedbackStatus('idle'), 3000); }
  };

  const handleSearchFriend = async () => {
    if (!friendSearchQuery || friendSearchQuery.toLowerCase() === spriteId) return;
    setFriendSearchStatus('searching');
    try {
      const q = query(firestoreCollection(db, "users"), where("spriteId", "==", friendSearchQuery.toLowerCase()));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) { setFriendSearchResult({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() }); setFriendSearchStatus('found'); } else { setFriendSearchResult(null); setFriendSearchStatus('not-found'); }
    } catch (e) { setFriendSearchStatus('error'); }
  };

  const handleSendFriendRequest = async () => {
    if (!friendSearchResult) return;
    try {
      await setDoc(doc(db, "friend_requests", `${user.uid}_${friendSearchResult.id}`), { senderId: user.uid, senderSpriteId: spriteId, receiverId: friendSearchResult.id, receiverSpriteId: friendSearchResult.spriteId, status: 'pending', timestamp: new Date() });
      alert('Friend request sent!'); setFriendSearchResult(null); setFriendSearchQuery(''); setFriendSearchStatus(''); setShowAddFriendInput(false);
    } catch (e) { }
  };

  const acceptFriendRequest = async (req) => {
    try { await updateDoc(doc(db, "users", user.uid), { friends: arrayUnion({ uid: req.senderId, spriteId: req.senderSpriteId }) }); await updateDoc(doc(db, "users", req.senderId), { friends: arrayUnion({ uid: user.uid, spriteId: spriteId }) }); await deleteDoc(doc(db, "friend_requests", req.id)); playBeep(880, 'sine', 0.1); } catch (e) { }
  };

  const cancelFriendRequest = async (reqId) => { try { await deleteDoc(doc(db, "friend_requests", reqId)); } catch (e) { } };

  const handleUnfriendExecution = async () => {
    if (!showUnfriendConfirm) return;
    try {
      await updateDoc(doc(db, "users", user.uid), { friends: arrayRemove({ uid: showUnfriendConfirm.uid, spriteId: showUnfriendConfirm.spriteId }) });
      await updateDoc(doc(db, "users", showUnfriendConfirm.uid), { friends: arrayRemove({ uid: user.uid, spriteId: spriteId }) });
      setShowUnfriendConfirm(null); playBeep(220, 'sawtooth', 0.15);
    } catch (e) { }
  };

  const inspectFriendLibrary = async (friendObj) => {
    try {
      const docSnap = await getDoc(doc(db, "users", friendObj.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        let tCollected = 0;
        let tMastered = 0;
        SPRITES_DATABASE.forEach(s => {
          tCollected += s.variants.filter(v => !isVariantLocked(s.id, v) && (data.sprites || {})[s.id]?.[v]).length;
          tMastered += s.variants.filter(v => !isVariantLocked(s.id, v) && (data.mastery || {})[s.id]?.[v]).length;
        });
        const cRate = totalPossibleStatic > 0 ? Math.round((tCollected / totalPossibleStatic) * 100) : 0;
        const mRate = totalPossibleStatic > 0 ? Math.round((tMastered / totalPossibleStatic) * 100) : 0;

        setActiveViewingFriend({
          spriteId: friendObj.spriteId,
          completionRate: cRate,
          masteryRate: mRate,
          sprites: data.sprites || {},
          mastery: data.mastery || {},
          extractionTargets: data.extractionTargets || [],
          profile: data.profile || { bio: '', epicName: '', twitchName: '', tiktokName: '', youtubeName: '', kickName: '', trophies: [null, null, null, null] },
          creationTime: data.creationTime || null
        });

        // Reset Profile filters just in case
        setFSearchQuery('');
        setFRarityFilter('All');
        setFVariantFilter('All');
        setFStatusFilter('All');
        setFSortBy('A-Z');
        setShowFFilters(false);
      }
    } catch (e) { }
  };

  const handleSetTarget = async (targetSpriteId, variant) => {
    const newTargets = [...extractionTargets]; newTargets[targetSlotIndex] = `${targetSpriteId}_${variant}`; setExtractionTargets(newTargets); setShowTargetSelector(false);
    await updateDoc(doc(db, "users", user.uid), { extractionTargets: newTargets });
  };

  const handleRemoveTarget = async (index, e) => {
    e.stopPropagation(); const newTargets = [...extractionTargets]; newTargets.splice(index, 1); setExtractionTargets(newTargets);
    await updateDoc(doc(db, "users", user.uid), { extractionTargets: newTargets });
  };

  const handleSetTrophy = async (targetSpriteId, variant) => {
    const newTrophies = [...(profileData.trophies || [null, null, null, null])];
    newTrophies[trophySlotIndex] = `${targetSpriteId}_${variant}`;
    setProfileData({ ...profileData, trophies: newTrophies });
    setShowTrophySelector(false);
  };

  const handleRemoveTrophy = (index, e) => {
    e.stopPropagation();
    const newTrophies = [...(profileData.trophies || [null, null, null, null])];
    newTrophies[index] = null;
    setProfileData({ ...profileData, trophies: newTrophies });
  };

  const handleSaveProfile = async () => {
    setIsEditingProfile(false);
    try {
      await updateDoc(doc(db, "users", user.uid), { profile: profileData });
      playBeep(880, 'sine', 0.1);
    } catch (e) { }
  };

  const isMutualMatch = (friendObj) => {
    return extractionTargets.some(target => target && (friendObj.sprites || {})[target.split('_')[0]]?.[target.split('_')[1]] === true) && (friendObj.extractionTargets || []).some(target => target && collection[target.split('_')[0]]?.[target.split('_')[1]] === true);
  };

  const renderTargetSlot = (targetKey, index) => {
    if (!targetKey) return (<button key={index} onClick={() => { setTargetSlotIndex(index); setShowTargetSelector(true); }} className="flex-1 h-12 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors"><Plus className="w-5 h-5 text-slate-600" /></button>);
    const sprite = SPRITES_DATABASE.find(s => s.id === targetKey.split('_')[0]);
    const v = targetKey.split('_')[1];
    return (
      <div key={index} className="flex-1 h-12 border-2 border-cyan-500/50 rounded-xl bg-cyan-950/30 relative flex flex-col items-center justify-center overflow-hidden">
        <button onClick={(e) => handleRemoveTarget(index, e)} className="absolute top-0.5 right-0.5 bg-black/80 rounded-full p-0.5 text-slate-400 hover:text-white z-20"><X className="w-2.5 h-2.5" /></button>
        <img src={sprite?.images[v]} className="w-6 h-6 object-contain z-10" alt="" />
        <span className={`text-[7px] sm:text-[8px] font-black uppercase mt-0.5 z-10 ${VARIANT_INFO[v]?.color}`}>{t(v)}</span>
      </div>
    );
  };

  const renderTrophySlot = (targetKey, index, isSelf, isEditing, userMasteryData) => {
    if (!targetKey) {
      if (isEditing) {
        return (<button key={index} onClick={() => { setTrophySlotIndex(index); setShowTrophySelector(true); }} className="flex-1 aspect-square border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors"><Plus className="w-5 h-5 text-slate-600" /></button>);
      }
      return (<div key={index} className="flex-1 aspect-square border-2 border-dashed border-slate-800/50 rounded-xl flex items-center justify-center bg-black/20 opacity-50"><Eye className="w-4 h-4 text-slate-700" /></div>);
    }

    const spriteId = targetKey.split('_')[0];
    const v = targetKey.split('_')[1];
    const sprite = SPRITES_DATABASE.find(s => s.id === spriteId);
    const isMastered = userMasteryData[spriteId]?.[v];

    return (
      <div key={index} className={`flex-1 aspect-square border-2 ${isMastered ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)] bg-yellow-950/20' : 'border-slate-700 bg-slate-900/50'} rounded-xl relative flex flex-col items-center justify-center overflow-hidden`}>
        {isEditing && <button onClick={(e) => handleRemoveTrophy(index, e)} className="absolute top-1 right-1 bg-black/80 rounded-full p-0.5 text-slate-400 hover:text-white z-20"><X className="w-3 h-3" /></button>}
        {isMastered && <Crown className="absolute top-1 left-1 w-3.5 h-3.5 text-yellow-400 drop-shadow-[0_0_2px_rgba(255,215,0,0.8)] z-20" />}
        <img src={sprite?.images[v]} className="w-10 h-10 sm:w-12 sm:h-12 object-contain z-10" alt="" />
        <span className={`text-[8px] sm:text-[9px] font-black uppercase mt-1 z-10 ${VARIANT_INFO[v]?.color}`}>{t(v)}</span>
      </div>
    );
  };

  const handleAcknowledgeTransmission = async () => { setShowTransmission(false); if (user) { try { await setDoc(doc(db, "users", user.uid), { lastSeenVersion: PATCH_NOTES[0].version }, { merge: true }); } catch (err) { } } };

  const totalCollected = SPRITES_DATABASE.reduce((acc, sprite) => acc + sprite.variants.filter(v => !isVariantLocked(sprite.id, v) && (collection[sprite.id] || {})[v]).length, 0);
  const totalMastered = SPRITES_DATABASE.reduce((acc, sprite) => acc + sprite.variants.filter(v => !isVariantLocked(sprite.id, v) && (mastery[sprite.id] || {})[v]).length, 0);
  const completionRate = totalPossibleStatic > 0 ? Math.round((totalCollected / totalPossibleStatic) * 100) : 0;
  const masteryRate = totalPossibleStatic > 0 ? Math.round((totalMastered / totalPossibleStatic) * 100) : 0;

  const isMasteryView = currentView === 'mastery';
  const displayVariantKey = variantFilter === 'All' ? 'All' : variantFilter.toLowerCase();

  const filteredSprites = [...SPRITES_DATABASE].filter(sprite => {
    const matchesSearch = sprite.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = rarityFilter === 'All' || sprite.rarity === rarityFilter;
    const matchesVariant = variantFilter === 'All' || sprite.variants.includes(displayVariantKey);
    let matchesStatus = true;
    if (statusFilter !== 'All') {
      if (isMasteryView) matchesStatus = statusFilter === 'Mastered' ? (variantFilter === 'All' ? sprite.variants.some(v => mastery[sprite.id]?.[v] === true) : mastery[sprite.id]?.[displayVariantKey] === true) : (variantFilter === 'All' ? sprite.variants.some(v => collection[sprite.id]?.[v] === true && !mastery[sprite.id]?.[v]) : (collection[sprite.id]?.[displayVariantKey] === true && !mastery[sprite.id]?.[displayVariantKey]));
      else matchesStatus = statusFilter === 'Collected' ? (variantFilter === 'All' ? sprite.variants.some(v => collection[sprite.id]?.[v] === true) : collection[sprite.id]?.[displayVariantKey] === true) : (variantFilter === 'All' ? sprite.variants.some(v => !collection[sprite.id]?.[v]) : (sprite.variants.includes(displayVariantKey) && !collection[sprite.id]?.[displayVariantKey]));
    }
    if (isMasteryView && statusFilter === 'All') return matchesSearch && matchesRarity && matchesVariant && matchesStatus && (variantFilter === 'All' ? sprite.variants.some(v => (collection[sprite.id] || {})[v] === true) : (collection[sprite.id] || {})[displayVariantKey] === true);
    return matchesSearch && matchesRarity && matchesVariant && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'A-Z') return a.name.localeCompare(b.name);
    if (sortBy === 'Z-A') return b.name.localeCompare(a.name);
    if (sortBy === 'Rarity (High to Low)') return RARITY_WEIGHT[b.rarity] - RARITY_WEIGHT[a.rarity];
    if (sortBy === 'Rarity (Low to High)') return RARITY_WEIGHT[a.rarity] - RARITY_WEIGHT[b.rarity];
    return a.name.localeCompare(b.name);
  });

  const filteredFriendSprites = [...SPRITES_DATABASE].filter(sprite => {
    if (!activeViewingFriend) return false;
    const matchesSearch = sprite.name.toLowerCase().includes(fSearchQuery.toLowerCase());
    const matchesRarity = fRarityFilter === 'All' || sprite.rarity === fRarityFilter;
    const matchesVariant = fVariantFilter === 'All' || sprite.variants.includes(fVariantFilter === 'All' ? 'base' : fVariantFilter.toLowerCase());

    let matchesStatus = true;
    if (fStatusFilter !== 'All') {
      const displayV = fVariantFilter === 'All' ? 'All' : fVariantFilter.toLowerCase();
      const friendStatus = activeViewingFriend.sprites[sprite.id] || {};
      const friendMastery = activeViewingFriend.mastery[sprite.id] || {};

      if (fStatusFilter === 'Mastered') {
        matchesStatus = displayV === 'All' ? sprite.variants.some(v => friendMastery[v]) : friendMastery[displayV];
      } else if (fStatusFilter === 'Collected') {
        matchesStatus = displayV === 'All' ? sprite.variants.some(v => friendStatus[v]) : friendStatus[displayV];
      } else if (fStatusFilter === 'Missing') {
        matchesStatus = displayV === 'All' ? sprite.variants.some(v => !friendStatus[v]) : (sprite.variants.includes(displayV) && !friendStatus[displayV]);
      } else if (fStatusFilter === 'I Need') {
        matchesStatus = displayV === 'All' ? sprite.variants.some(v => friendStatus[v] && !collection[sprite.id]?.[v]) : (friendStatus[displayV] && !collection[sprite.id]?.[displayV]);
      } else if (fStatusFilter === 'They Need') {
        matchesStatus = displayV === 'All' ? sprite.variants.some(v => collection[sprite.id]?.[v] && !friendStatus[v]) : (collection[sprite.id]?.[displayV] && !friendStatus[displayV]);
      }
    }
    return matchesSearch && matchesRarity && matchesVariant && matchesStatus;
  }).sort((a, b) => {
    if (fSortBy === 'A-Z') return a.name.localeCompare(b.name);
    if (fSortBy === 'Z-A') return b.name.localeCompare(a.name);
    if (fSortBy === 'Rarity (High to Low)') return RARITY_WEIGHT[b.rarity] - RARITY_WEIGHT[a.rarity];
    if (fSortBy === 'Rarity (Low to High)') return RARITY_WEIGHT[a.rarity] - RARITY_WEIGHT[b.rarity];
    return a.name.localeCompare(b.name);
  });

  const filteredSquad = richFriends.filter(f =>
    (f.spriteId || '').toLowerCase().includes(squadSearchQuery.toLowerCase())
  ).sort((a, b) => {
    if (b.completionRate !== a.completionRate) return b.completionRate - a.completionRate;
    if (b.masteryRate !== a.masteryRate) return (b.masteryRate || 0) - (a.masteryRate || 0);
    return (a.spriteId || '').localeCompare(b.spriteId || '');
  });

  const getVariantModifierText = (variantName) => {
    if (variantName === 'gold') return lang === 'es' ? "Gana 3x de XP de bonificación por eliminaciones" : "Gain 3x bonus XP from eliminations";
    if (variantName === 'gummy') return lang === 'es' ? "Gana un 20% más de Polvo al extraer" : "Gain 20% more Sprite Dust upon Extraction";
    if (variantName === 'galaxy') return lang === 'es' ? "Gana un 30% más de munición al saquear" : "Gain 30% more Ammunition when looting";
    if (variantName === 'holofoil') return lang === 'es' ? "Gana un 5% más de probabilidad de encontrar Sprites raros" : "Gain 5% increased chance of finding rare Sprites for yourself and entire squad";
    if (variantName === 'cube') return lang === 'es' ? "Obtén el efecto Sobrecarga estando en la tormenta" : "Gain the Overdrive effect while in the storm";
    if (variantName === 'gem') return lang === 'es' ? "Recibe un 30% menos de daño por caída" : "Take 30% less fall damage";
    if (variantName === 'quack') return lang === 'es' ? "Otorga un 50% más de XP de Sprite a otros Sprites en tu inventario" : "Grants 50% more Sprite XP to other Sprites in your inventory";
    return null;
  };

  const getDynamicSummonCost = (rarity, variantName, spriteId = null) => {
    if (spriteId && isVariantLocked(spriteId, variantName)) return "TBD";
    return variantName === 'base' ? SUMMON_COST_MATRIX[rarity].base : SUMMON_COST_MATRIX[rarity].variant;
  };

  const formatJoinDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const d = new Date(timestamp);
    return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { month: 'short', year: 'numeric' });
  };

  const renderProfileCard = (id, profData, colRate, mastRate, joinTime, isSelf, masteriesObj) => {
    const unlockedBg = getUnlockedMilestone(Math.round((colRate / 100) * totalPossibleStatic), Math.round((mastRate / 100) * totalPossibleStatic));
    const bgClass = unlockedBg ? unlockedBg.bg : "bg-slate-900 border-slate-800";
    const glowClass = unlockedBg ? unlockedBg.glow : "";

    return (
      <div className="relative mt-2 mb-4">
        {unlockedBg && (
          <div className={`absolute inset-0 rounded-2xl border-2 ${glowClass} animate-pulse pointer-events-none opacity-90`}></div>
        )}
        <div className={`rounded-2xl border-2 p-5 relative overflow-hidden transition-all ${bgClass}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black/40 rounded-full border-2 border-white/10 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-slate-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tight">@{id}</h2>
                  {unlockedBg && <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border bg-black/40 text-slate-200 border-white/20">{unlockedBg.name}</span>}
                </div>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3" /> Joined {formatJoinDate(joinTime)}</span>
              </div>
            </div>
            {isSelf && (
              <button onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)} className="p-2 bg-black/40 hover:bg-black/60 rounded-xl border border-white/10 text-white transition-colors">
                {isEditingProfile ? <Save className="w-5 h-5 text-emerald-400" /> : <Edit3 className="w-5 h-5" />}
              </button>
            )}
          </div>

          <div className="flex gap-2 mb-4">
            <div className="flex-1 bg-black/30 border border-white/5 rounded-xl p-2 text-center">
              <span className="block text-xl font-black text-cyan-400">{colRate}%</span>
              <span className="block text-[8px] font-mono uppercase text-slate-500 tracking-wider">Collected</span>
            </div>
            <div className="flex-1 bg-black/30 border border-white/5 rounded-xl p-2 text-center">
              <span className="block text-xl font-black text-yellow-400">{mastRate}%</span>
              <span className="block text-[8px] font-mono uppercase text-slate-500 tracking-wider">Mastered</span>
            </div>
          </div>

          {isEditingProfile ? (
            <div className="space-y-3 mb-4">
              <textarea value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value.substring(0, 100) })} placeholder="Enter bio (max 100 chars)..." className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500 resize-none h-20" />
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Gamepad2 className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input type="text" value={profileData.epicName} onChange={(e) => setProfileData({ ...profileData, epicName: e.target.value })} placeholder="Epic Name" className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="relative">
                  <Tv className="w-4 h-4 text-purple-500 absolute left-3 top-2.5" />
                  <input type="text" value={profileData.twitchName} onChange={(e) => setProfileData({ ...profileData, twitchName: e.target.value })} placeholder="Twitch Username" className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
                </div>
                <div className="relative">
                  <Music className="w-4 h-4 text-pink-500 absolute left-3 top-2.5" />
                  <input type="text" value={profileData.tiktokName} onChange={(e) => setProfileData({ ...profileData, tiktokName: e.target.value })} placeholder="TikTok Username" className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500" />
                </div>
                <div className="relative">
                  <Video className="w-4 h-4 text-red-500 absolute left-3 top-2.5" />
                  <input type="text" value={profileData.youtubeName} onChange={(e) => setProfileData({ ...profileData, youtubeName: e.target.value })} placeholder="YouTube Handle" className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-red-500" />
                </div>
                <div className="relative col-span-2">
                  <Play className="w-4 h-4 text-green-500 absolute left-3 top-2.5" />
                  <input type="text" value={profileData.kickName} onChange={(e) => setProfileData({ ...profileData, kickName: e.target.value })} placeholder="Kick Channel" className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-green-500" />
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              {profData.bio && <p className="text-sm text-slate-300 italic mb-3 bg-black/20 p-3 rounded-xl border-l-2 border-indigo-500">"{profData.bio}"</p>}
              <div className="flex flex-wrap gap-2">
                {profData.epicName && (
                  <div className="bg-blue-900/30 border border-blue-500/30 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                    <Gamepad2 className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[10px] uppercase font-mono text-slate-400">Epic ID:</span> {profData.epicName}
                  </div>
                )}
                {profData.twitchName && (
                  <a href={`https://www.twitch.tv/${profData.twitchName}`} target="_blank" rel="noopener noreferrer" className="bg-purple-900/30 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors">
                    <Tv className="w-3.5 h-3.5 text-purple-400" />
                    Twitch
                  </a>
                )}
                {profData.tiktokName && (
                  <a href={`https://tiktok.com/@${profData.tiktokName}`} target="_blank" rel="noopener noreferrer" className="bg-pink-900/30 hover:bg-pink-600/40 border border-pink-500/30 text-pink-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors">
                    <Music className="w-3.5 h-3.5 text-pink-400" />
                    TikTok
                  </a>
                )}
                {profData.youtubeName && (
                  <a href={`https://youtube.com/@${profData.youtubeName}`} target="_blank" rel="noopener noreferrer" className="bg-red-900/30 hover:bg-red-600/40 border border-red-500/30 text-red-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors">
                    <Video className="w-3.5 h-3.5 text-red-400" />
                    YouTube
                  </a>
                )}
                {profData.kickName && (
                  <a href={`https://kick.com/${profData.kickName}`} target="_blank" rel="noopener noreferrer" className="bg-green-900/30 hover:bg-green-600/40 border border-green-500/30 text-green-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors">
                    <Play className="w-3.5 h-3.5 text-green-400" />
                    Kick
                  </a>
                )}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Award className="w-4 h-4" /> Trophy Case</h3>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map(index => renderTrophySlot(profData.trophies?.[index], index, isSelf, isEditingProfile, masteriesObj))}
            </div>
          </div>
        </div>
      </div>
    );
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

  // --- LOGIN UI (FULL SCREEN GATE) ---
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
            <p className="text-slate-400 text-sm sm:text-base max-w-xs px-2">{t('app_desc')}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
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
            <button type="submit" disabled={isAuthLoading} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl py-3 px-4 shadow-lg shadow-purple-900/30 transition-all duration-200 transform active:scale-[0.98] mt-2 text-sm disabled:opacity-50">
              {isAuthLoading ? (lang === 'es' ? 'Cargando...' : 'Loading...') : (isLoginMode ? (lang === 'es' ? 'Iniciar Sesión' : 'Sign In') : (lang === 'es' ? 'Crear Cuenta' : 'Create Account'))}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-white/5 pt-5 flex flex-col gap-3">
            <p className="text-slate-400 text-sm">
              {isLoginMode ? (lang === 'es' ? '¿No tienes cuenta?' : "Don't have an account?") : (lang === 'es' ? '¿Ya tienes una cuenta?' : "Already have an account?")}{' '}
              <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} className="text-purple-400 font-medium hover:text-purple-300 hover:underline transition-all bg-transparent border-none p-0 cursor-pointer">
                {isLoginMode ? (lang === 'es' ? 'Regístrate' : 'Sign Up') : (lang === 'es' ? 'Inicia Sesión' : 'Sign In')}
              </button>
            </p>
            {isLoginMode && (
              <button type="button" onClick={handlePasswordReset} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                {resetSent ? (lang === 'es' ? '¡Enlace enviado!' : 'Reset link sent!') : (lang === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot Password?')}
              </button>
            )}
            <p className="text-[10px] sm:text-xs text-slate-500 mt-2 leading-relaxed max-w-xs mx-auto">
              {t('disclaimer')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- SPRITE ID ONBOARDING OVERLAY ---
  if (user && isSettingSpriteId) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_30px_rgba(0,240,255,0.1)]">
          <div className="w-16 h-16 bg-cyan-950/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30"><Users className="w-8 h-8 text-cyan-400" /></div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase italic mb-2">Claim Your Sprite ID</h2>
          <p className="text-sm sm:text-base text-slate-400 mb-6">We're launching new social features! Set your unique public Sprite ID so your friends can find you.</p>
          <form onSubmit={handleSaveSpriteId} className="space-y-4">
            <div>
              <input type="text" value={desiredSpriteId} onChange={(e) => setDesiredSpriteId(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))} placeholder="e.g. ImBearKat" className="w-full bg-black border-2 border-slate-700 rounded-xl px-4 py-3 text-white text-center font-bold tracking-wider focus:border-cyan-500 focus:outline-none" />
              {spriteIdError && <p className="text-red-400 text-xs mt-2 font-bold">{spriteIdError}</p>}
            </div>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase rounded-xl py-3 transition-colors">Lock it in</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col font-sans select-none relative">

      {/* --- NEW MAIN SETTINGS MODAL --- */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[80] flex flex-col justify-end sm:justify-center items-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#12141f] w-full max-w-md rounded-t-3xl sm:rounded-3xl border-t-2 sm:border-2 border-slate-800 p-6 shadow-2xl animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white uppercase italic">{t('settings')}</h2>
              <button onClick={() => setShowSettingsModal(false)} className="p-2 bg-black/40 rounded-full text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{t('logged_in_as')}</span>
                  <span className="block text-sm font-bold text-white mt-0.5">{user.email}</span>
                </div>
                <button onClick={() => { logOut(); setShowSettingsModal(false); }} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl border border-red-500/20 text-red-400 transition-colors"><LogOut className="w-5 h-5" /></button>
              </div>
              <div className="h-px bg-slate-800/50 my-2" />
              <button onClick={toggleLang} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4"><Globe className="w-6 h-6 text-slate-400" /><span className="text-base font-bold text-slate-200">{t('language')}</span></div>
                <span className="text-sm font-black text-cyan-400">{lang === 'en' ? 'English' : 'Español'}</span>
              </button>
              <button onClick={() => { setShowSettingsModal(false); setShowPatchNotes(true); }} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-800/50 transition-colors text-left">
                <History className="w-6 h-6 text-slate-400" /><span className="text-base font-bold text-slate-200">{t('whats_new')}</span>
              </button>
              <button onClick={() => { setShowSettingsModal(false); setShowAboutModal(true); }} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-800/50 transition-colors text-left">
                <Info className="w-6 h-6 text-slate-400" /><span className="text-base font-bold text-slate-200">{t('about')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: ABOUT --- */}
      {showAboutModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12141f] border-2 border-slate-700 rounded-2xl flex flex-col max-w-sm w-full relative overflow-hidden shadow-2xl">
            <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0e1017]">
              <h3 className="text-md sm:text-lg font-black tracking-tight text-white uppercase italic flex items-center gap-2"><Info className="w-5 h-5 text-indigo-400" /> {t('about')}</h3>
              <button onClick={() => setShowAboutModal(false)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </header>
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <img src="/app_icon.webp" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] object-contain mb-1" alt="Spritedex Logo" />
              <div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-0.5">Spritedex</h2>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Version {PATCH_NOTES[0].version}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mt-2">{t('app_desc')}</p>
              <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2 text-left mt-2">
                <AlertTriangle className="w-4 h-4 text-amber-500/70 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-400 leading-relaxed">{t('disclaimer')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
            const abilityText = typeof sprite.baseAbility === 'object' ? sprite.baseAbility[lang] : sprite.baseAbility;

            return (
              <div className="bg-[#12141f] border border-slate-700/80 rounded-3xl w-full max-w-sm overflow-hidden relative shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                <button onClick={() => setSelectedSprite(null)} className="absolute top-4 right-4 z-50 p-2 bg-black/60 rounded-full text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                <div className={`w-full aspect-square bg-gradient-to-b ${RARITY_BG_GRADIENTS[sprite.rarity]} flex items-center justify-center relative`}>
                  {validVariants.length > 1 && <button onClick={() => setSelectedSprite({ id: sprite.id, variant: validVariants[vIndex === 0 ? validVariants.length - 1 : vIndex - 1] })} className="absolute left-4 z-40 p-2 bg-black/40 rounded-full hover:bg-black/60 transition-colors"><ChevronLeft className="w-6 h-6 text-white" /></button>}
                  <img src={sprite.images[v]} className={`w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] ${isLocked ? 'grayscale opacity-75' : ''}`} alt="" />
                  {validVariants.length > 1 && <button onClick={() => setSelectedSprite({ id: sprite.id, variant: validVariants[vIndex === validVariants.length - 1 ? 0 : vIndex + 1] })} className="absolute right-4 z-40 p-2 bg-black/40 rounded-full hover:bg-black/60 transition-colors"><ChevronRight className="w-6 h-6 text-white" /></button>}
                </div>
                <div className="p-5 flex flex-col gap-4">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight">{v !== 'base' ? `${t(v)} ` : ''}{sprite.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded border ${RARITY_COLORS[sprite.rarity]}`}>{t(sprite.rarity.toLowerCase())}</span>
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded border border-slate-700 bg-slate-800 ${VARIANT_INFO[v]?.color}`}>{t(v)}</span>
                      {isLocked && <span className="text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded border border-amber-500/50 bg-amber-950/60 text-amber-400 flex items-center gap-1"><Lock className="w-3 h-3" /> {t('locked_until_release')}</span>}
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 border border-slate-800/60">
                    <p className="text-sm text-slate-300 leading-snug"><span className="font-mono text-[10px] font-black text-cyan-400 block tracking-wider uppercase mb-1">{t('base_ability')}</span>{abilityText}</p>
                    {variantModifier && <p className="text-sm text-slate-200 mt-2 pt-2 border-t border-slate-800/60"><span className="font-mono text-[10px] font-black text-yellow-400 block tracking-wider uppercase mb-1">+{t(v)} {t('modifier')}</span>{variantModifier}</p>}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/60"><span className="font-mono text-[10px] font-black text-emerald-400 uppercase tracking-wider">{t('summon_cost')}</span><span className="text-xs font-black text-white">{getDynamicSummonCost(sprite.rarity, v, sprite.id)} {isLocked ? '' : 'Dust'}</span></div>
                  </div>
                  <div className="flex gap-2">
                    {isLocked ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl border-2 bg-slate-900/60 border-amber-500/40 text-amber-400"><Lock className="w-5 h-5 mb-1" /><span className="text-[10px] font-black uppercase tracking-wider">{t('locked_until_release')}</span></div>
                    ) : (
                      <>
                        {!isMasteryView && <button onClick={() => handleToggleCheck(sprite.id, v)} className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl border-2 transition-all ${isCollected ? 'bg-cyan-900/40 border-cyan-500 text-cyan-400' : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-500'}`}>{isCollected ? <CheckCircle className="w-5 h-5 mb-1" /> : <Circle className="w-5 h-5 mb-1 opacity-50" />}<span className="text-[10px] font-black uppercase tracking-wider">{isCollected ? t('collected') : t('collect')}</span></button>}
                        {isMasteryView && <button onClick={() => toggleMastery(sprite.id, v)} className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl border-2 transition-all ${!isCollected ? 'opacity-30 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-600' : isMastered ? 'bg-yellow-900/40 border-yellow-500 text-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.2)]' : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-yellow-500/50 hover:text-yellow-500'}`}><Crown className="w-5 h-5 mb-1" /><span className="text-[10px] font-black uppercase tracking-wider">{isMastered ? t('mastered') : t('set_lvl_5')}</span></button>}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* --- TRANSMISSION SPLASH SCREEN --- */}
      {showTransmission && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#12141f] border-2 border-cyan-500 shadow-[0_0_40px_rgba(34,211,238,0.2)] rounded-2xl max-w-sm w-full relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            <header className="p-5 border-b border-cyan-900/50 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-cyan-950/50 rounded-full border border-cyan-500/40 flex items-center justify-center mb-3"><Radio className="w-6 h-6 text-cyan-400 animate-pulse" /></div>
              <h2 className="text-xl sm:text-2xl font-black text-cyan-400 uppercase italic tracking-wider">Incoming Transmission</h2>
              <span className="text-[10px] sm:text-xs font-mono text-cyan-600 uppercase tracking-widest mt-1">Update {PATCH_NOTES[0].version} Deployed</span>
            </header>
            <div className="p-5 flex flex-col gap-4">
              <h3 className="text-md sm:text-lg font-bold text-white text-center">{PATCH_NOTES[0].title}</h3>
              <ul className="space-y-3">
                {PATCH_NOTES[0].changes.map((change, idx) => (<li key={idx} className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed"><CheckCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />{change}</li>))}
              </ul>
              <button onClick={handleAcknowledgeTransmission} className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-wider py-3 rounded-xl transition-colors">Acknowledge</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MENU: PATCH NOTES HUB --- */}
      {showPatchNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12141f] border-2 border-slate-700 rounded-2xl flex flex-col max-w-sm w-full h-[80vh] relative overflow-hidden">
            <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0e1017]">
              <h3 className="text-md sm:text-lg font-black tracking-tight text-white uppercase italic flex items-center gap-2"><FileText className="w-5 h-5 text-purple-400" /> {t('whats_new')}</h3>
              <button onClick={() => setShowPatchNotes(false)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
              <section className="flex flex-col gap-4">
                {PATCH_NOTES.map((note, index) => (
                  <div key={index} className="bg-black/40 border border-slate-800 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2"><span className="text-base sm:text-lg font-black text-white">{note.version}</span><span className="text-[10px] sm:text-xs font-mono text-slate-500">{note.date}</span></div>
                    <span className="text-sm font-bold text-cyan-400 block mb-3">{note.title}</span>
                    <ul className="space-y-2">{note.changes.map((change, cIdx) => (<li key={cIdx} className="text-xs sm:text-sm text-slate-400 leading-relaxed flex items-start gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0"></span>{change}</li>))}</ul>
                  </div>
                ))}
              </section>
            </div>
          </div>
        </div>
      )}

      {/* --- SELECTION SCREEN: TARGET/TROPHY SELECTOR --- */}
      {(showTargetSelector || showTrophySelector) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12141f] border-2 border-cyan-500/60 rounded-2xl flex flex-col max-w-sm w-full h-[75vh] relative overflow-hidden">
            <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0e1017]">
              <h3 className="text-md sm:text-lg font-black tracking-tight text-cyan-400 uppercase italic flex items-center gap-2"><Target className="w-5 h-5" /> Select {showTrophySelector ? 'Trophy' : 'Target'}</h3>
              <button onClick={() => { setShowTargetSelector(false); setShowTrophySelector(false); }} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {SPRITES_DATABASE.map(sprite => {
                let validVariants = [];
                if (showTrophySelector) {
                  validVariants = sprite.variants.filter(v => collection[sprite.id]?.[v]);
                } else {
                  validVariants = sprite.variants.filter(v => !collection[sprite.id]?.[v] && !isVariantLocked(sprite.id, v));
                }

                if (validVariants.length === 0) return null;
                return (
                  <div key={sprite.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                    <span className="text-sm font-black text-white uppercase italic mb-2 block">{sprite.name}</span>
                    <div className="grid grid-cols-6 gap-2">
                      {validVariants.map(v => (
                        <button key={v} onClick={() => { showTrophySelector ? handleSetTrophy(sprite.id, v) : handleSetTarget(sprite.id, v) }} className="flex flex-col items-center p-2 rounded-lg border border-slate-700 bg-black/40 hover:bg-slate-800 transition-colors">
                          <img src={sprite.images[v]} className="w-8 h-8 object-contain mb-1" alt="" />
                          <span className={`text-[7px] sm:text-[8px] font-black uppercase ${VARIANT_INFO[v]?.color}`}>{t(v)}</span>
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
            <button onClick={() => { setShowResetConfirm(false); playBeep(440, 'sine', 0.05); }} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg bg-black/40 border border-slate-800"><X className="w-4 h-4" /></button>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center mb-4"><AlertTriangle className="w-6 h-6 text-red-400" /></div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase italic">{t('reset_archive')}?</h3>
            <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">This action will completely wipe your checked archive configurations. Mastery counts and storage caches will revert back to 0%.</p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => { setShowResetConfirm(false); playBeep(440, 'sine', 0.05); }} className="py-2.5 text-sm font-black uppercase font-mono bg-black/40 text-slate-300 border border-slate-800 rounded-xl hover:bg-black/60">{t('cancel')}</button>
              <button onClick={handleAbsoluteReset} className="py-2.5 text-sm font-black uppercase font-mono bg-gradient-to-r from-red-600 to-rose-700 text-white border border-red-500/40 rounded-xl hover:brightness-110">CONFIRM WIPE</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MENU: THEMED UNFRIEND CONFIRMATION --- */}
      {showUnfriendConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12141f] border-2 border-amber-500/60 rounded-2xl p-6 max-w-sm w-full text-center relative">
            <button onClick={() => setShowUnfriendConfirm(null)} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg bg-black/40"><X className="w-4 h-4" /></button>
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-950/60 border border-amber-500/40 flex items-center justify-center mb-4"><UserMinus className="w-6 h-6 text-amber-400" /></div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase italic">REMOVE FRIEND?</h3>
            <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">Are you sure you want to remove <span className="text-amber-400 font-bold">@{showUnfriendConfirm.spriteId}</span>? This severs connection access across both profiles immediately.</p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setShowUnfriendConfirm(null)} className="py-2.5 text-sm font-black uppercase font-mono bg-black/40 text-slate-300 border border-slate-800 rounded-xl">{t('cancel')}</button>
              <button onClick={handleUnfriendExecution} className="py-2.5 text-sm font-black uppercase font-mono bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl">UNFRIEND</button>
            </div>
          </div>
        </div>
      )}

      {/* --- LAYER: NEW READ-ONLY FRIEND COLLECTION INSPECTOR (PROFILE) --- */}
      {activeViewingFriend && (
        <div className="fixed inset-0 z-50 bg-[#0b0c10] flex flex-col animate-in slide-in-from-bottom duration-300 overflow-y-auto pb-12">
          <header className="bg-[#0e1017]/95 backdrop-blur-md border-b-2 border-indigo-500 p-4 sticky top-0 z-50 shadow-[0_4px_20px_rgba(99,102,241,0.15)] flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-black italic uppercase text-white tracking-tight flex items-center gap-2"><UserIcon className="w-5 h-5 text-indigo-400" /> PROFILE</h2>
            <button onClick={() => setActiveViewingFriend(null)} className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black text-slate-300 hover:text-white transition-colors"><X className="w-4 h-4" /> CLOSE</button>
          </header>

          <div className="max-w-md w-full mx-auto p-4 flex flex-col gap-4 mt-2">
            {renderProfileCard(activeViewingFriend.spriteId, activeViewingFriend.profile, activeViewingFriend.completionRate, activeViewingFriend.masteryRate, activeViewingFriend.creationTime, false, activeViewingFriend.mastery)}

            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent my-2" />

            {/* Profile Filter & Search UI */}
            <section className="flex flex-col gap-2 bg-[#151722] p-3 rounded-xl border border-slate-800">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-indigo-400/70 absolute left-3 top-3" />
                  <input type="text" placeholder="Search Archive..." value={fSearchQuery} onChange={(e) => setFSearchQuery(e.target.value)} className="w-full bg-black/50 border-2 border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <button onClick={() => setShowFFilters(!showFFilters)} className={`px-4 flex items-center gap-2 rounded-xl border-2 transition-all font-black text-xs uppercase tracking-wider ${showFFilters ? 'bg-indigo-900/40 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}>
                  <Filter className="w-4 h-4" /> {t('filters')} {showFFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showFFilters && (
                <div className="flex flex-col gap-4 mt-3 pt-3 border-t border-slate-800/80 animate-in slide-in-from-top-2">
                  <div>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5 block">{t('sort_by')}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['A-Z', 'Z-A', 'Rarity (High to Low)', 'Rarity (Low to High)'].map(sort => (
                        <button key={sort} onClick={() => setFSortBy(sort)} className={`px-3 py-1.5 text-[10px] font-black tracking-wider rounded-lg border uppercase ${fSortBy === sort ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-black/40 text-slate-400 border-slate-800'}`}>
                          {sort === 'A-Z' ? t('az_order') : sort === 'Z-A' ? t('za_order') : sort === 'Rarity (High to Low)' ? t('rarity_desc') : t('rarity_asc')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5 block">{t('rarity')}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['All', 'Mythic', 'Legendary', 'Epic', 'Rare', 'Unknown'].map(rarity => (
                        <button key={rarity} onClick={() => setFRarityFilter(rarity)} className={`px-3 py-1.5 text-[10px] font-black tracking-wider rounded-lg border uppercase ${fRarityFilter === rarity ? 'bg-cyan-400 text-black border-cyan-300' : 'bg-black/40 text-slate-400 border-slate-800'}`}>
                          {t(rarity.toLowerCase())}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5 block">{t('variant_type')}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['All', 'Base', 'Gold', 'Gummy', 'Galaxy', 'Holofoil', 'Cube', 'Gem', 'Quack'].map(variant => (
                        <button key={variant} onClick={() => setFVariantFilter(variant)} className={`px-3 py-1.5 text-[10px] font-black tracking-wider rounded-lg border uppercase ${fVariantFilter === variant ? 'bg-purple-500 text-white border-purple-400' : 'bg-black/40 text-slate-400 border-slate-800'}`}>
                          {t(variant.toLowerCase())}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5 block">{t('collection_status')}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['All', 'Collected', 'Missing', 'I Need', 'They Need'].map(status => (
                        <button key={status} onClick={() => setFStatusFilter(status)} className={`px-3 py-1.5 text-[10px] font-black tracking-wider rounded-lg border uppercase ${fStatusFilter === status ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-black/40 text-slate-400 border-slate-800'}`}>
                          {t(status.replace(' ', '_').toLowerCase())}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {filteredFriendSprites.length === 0 && (
              <div className="text-center p-8 bg-[#12141f] rounded-2xl border border-slate-800">
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">No matching Sprites</p>
              </div>
            )}

            {filteredFriendSprites.map(sprite => {
              const friendStatus = activeViewingFriend.sprites[sprite.id] || {};
              const friendMastery = activeViewingFriend.mastery[sprite.id] || {};

              const displayVariant = fVariantFilter === 'All' ? 'base' : fVariantFilter.toLowerCase();
              const validInitialVariant = sprite.variants.includes(displayVariant) ? displayVariant : 'base';
              const hasAnyVariant = variantsList.some(v => friendStatus[v]);
              const isCardMatch = variantsList.some(v => extractionTargets.includes(`${sprite.id}_${v}`) && friendStatus[v]);

              const cardClass = isCardMatch
                ? 'bg-cyan-950/40 border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-pulse'
                : 'bg-[#151722] border border-slate-800/90 shadow-sm';

              const imageBoxClass = hasAnyVariant
                ? (isCardMatch ? 'bg-cyan-950/50 border-cyan-500/50' : 'bg-indigo-950/40 border-indigo-500/50')
                : 'bg-slate-900 border-slate-800 grayscale opacity-60';

              return (
                <div key={sprite.id} className={`flex items-center gap-4 rounded-2xl p-4 hover:bg-slate-800/80 transition-all ${cardClass}`}>
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl p-1.5 border-2 transition-all shrink-0 ${imageBoxClass}`}>
                    <img src={sprite.images[validInitialVariant]} className="w-full h-full object-contain drop-shadow-md" alt="" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex flex-col mb-2.5">
                      <span className="font-black text-base sm:text-lg text-white uppercase italic tracking-tight truncate">{sprite.name}</span>
                      <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${VARIANT_INFO[validInitialVariant]?.color}`}>{t(validInitialVariant)}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-2">
                      {variantsList.map(v => {
                        if (!sprite.variants.includes(v)) return null;
                        const isLocked = isVariantLocked(sprite.id, v);
                        const isCollected = friendStatus[v];
                        const isMastered = friendMastery[v];
                        const isMatch = extractionTargets.includes(`${sprite.id}_${v}`) && isCollected;

                        if (fStatusFilter === 'Missing' && isCollected) return null;
                        if (fStatusFilter === 'I Need' && (!isCollected || collection[sprite.id]?.[v])) return null;
                        if (fStatusFilter === 'They Need' && (isCollected || !collection[sprite.id]?.[v])) return null;

                        return (
                          <div key={v} className="flex flex-col items-center gap-1">
                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 transition-all relative ${isLocked ? 'bg-slate-950/80 border-slate-800/60 opacity-60' : isMastered ? 'bg-yellow-900/40 border-yellow-400' : isCollected ? `bg-slate-900 border-${VARIANT_INFO[v]?.color.split('-')[1]}-500/70` : 'bg-black border-slate-800'}`}>
                              {isLocked ? <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-600" /> : (
                                <>
                                  {isCollected && <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${VARIANT_INFO[v]?.bgColor} ${isMastered ? 'opacity-30' : 'opacity-100'}`} />}
                                  {isMastered && <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 drop-shadow-[0_0_2px_rgba(255,215,0,0.8)] absolute z-10" />}
                                </>
                              )}
                            </div>
                            <span className="text-[7px] sm:text-[8px] font-bold uppercase text-slate-500 tracking-wider whitespace-nowrap">{v === 'holofoil' ? 'Holo' : t(v)}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-[#0e1017]/95 backdrop-blur-md border-b-2 border-cyan-500/80 shadow-[0_4px_20px_rgba(0,240,255,0.15)] px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-yellow-400 to-pink-500 uppercase italic">
              SPRITEDEX
            </h1>
            {user && <p className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-widest mt-0.5">ID: {spriteId}</p>}
          </div>
          <div className="flex items-center gap-2.5">
            {user && (
              <button onClick={() => { setCurrentView('profile'); setActiveViewingFriend(null); }} className={`p-2 rounded-xl border-2 transition-colors shadow-sm ${currentView === 'profile' ? 'bg-indigo-900 border-indigo-500' : 'bg-slate-900 border-slate-700/60 hover:bg-slate-800'}`}>
                <UserIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${currentView === 'profile' ? 'text-indigo-400' : 'text-slate-300'}`} />
              </button>
            )}
            <button onClick={() => setShowSettingsModal(true)} className="p-2 rounded-xl bg-slate-900 border-2 border-slate-700/60 hover:bg-slate-800 transition-colors shadow-sm">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col gap-5 pb-24">

        {/* --- PROFILE VIEW --- */}
        {currentView === 'profile' && user && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">
            {renderProfileCard(spriteId, profileData, completionRate, masteryRate, user.metadata?.creationTime, true, mastery)}

            <div className="bg-[#12141f] rounded-2xl border border-slate-800 p-5 shadow-xl">
              <h3 className="text-sm font-black text-white uppercase italic tracking-wider mb-4 flex items-center gap-2"><Eye className="w-4 h-4 text-cyan-400" /> Milestone Unlocks</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">Grind Masteries and full collections to automatically unlock prestigious backgrounds for your Profile.</p>

              <div className="space-y-3">
                {MILESTONES.map((stone, idx) => {
                  let isUnlocked = false;
                  let progress = 0;

                  if (stone.isPercent) {
                    const currentRate = stone.type === 'mastery' ? masteryRate : completionRate;
                    isUnlocked = currentRate >= stone.count;
                    progress = currentRate;
                  } else {
                    isUnlocked = totalMastered >= stone.count;
                    progress = Math.min(totalMastered, stone.count);
                  }

                  return (
                    <div key={idx} className={`p-3 rounded-xl border ${isUnlocked ? stone.bg : 'bg-black/40 border-slate-800 opacity-60'} flex items-center gap-3 transition-all`}>
                      <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center shrink-0 border border-white/10">
                        {isUnlocked ? <CheckCircle className="w-5 h-5 text-white" /> : <Lock className="w-5 h-5 text-slate-500" />}
                      </div>
                      <div className="flex-1">
                        <span className={`block font-black text-sm uppercase ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>{stone.name}</span>
                        <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">{stone.isPercent ? `${stone.count}% ${stone.type}` : `${stone.count} Mastered`}</span>
                      </div>
                      {!isUnlocked && (
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-500 font-mono">{progress} / {stone.count}{stone.isPercent ? '%' : ''}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* --- MAIN VIEWS (SPRITES / MASTERY) --- */}
        {(currentView === 'sprites' || currentView === 'mastery') && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">

            {currentView === 'sprites' && (
              <section className="sticky top-[86px] sm:top-[94px] z-40 bg-[#151824]/95 backdrop-blur-md rounded-2xl p-4 border-2 border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm sm:text-base font-black text-gray-200 tracking-wider font-mono">{t('sprite_progress')}</span>
                  <button onClick={() => { setShowResetConfirm(true); playBeep(330, 'sine', 0.08); }} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 text-[9px] sm:text-[10px] font-mono font-black text-red-400 tracking-wider uppercase">
                    <RotateCcw className="w-3 h-3" /> {t('reset_archive')}
                  </button>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-xs text-slate-400 font-mono">{t('completion')}</span>
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
                  <h2 className="text-xl sm:text-2xl font-black text-yellow-400 uppercase italic">{t('mastery_vault')}</h2>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] sm:text-xs text-yellow-500/80 font-mono font-bold tracking-wider">{t('vault_completion')}</span>
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
                  <input type="text" placeholder={t('search')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black/50 border-2 border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-cyan-500" />
                </div>
                <button onClick={() => setShowFilters(!showFilters)} className={`px-4 flex items-center gap-2 rounded-xl border-2 transition-all font-black text-xs uppercase tracking-wider ${showFilters ? 'bg-cyan-900/40 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}>
                  <Filter className="w-4 h-4" /> {t('filters')} {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showFilters && (
                <div className="flex flex-col gap-4 mt-3 pt-3 border-t border-slate-800/80 animate-in slide-in-from-top-2">
                  <div>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5 block">{t('sort_by')}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['A-Z', 'Z-A', 'Rarity (High to Low)', 'Rarity (Low to High)'].map(sort => (
                        <button key={sort} onClick={() => setSortBy(sort)} className={`px-3 py-1.5 text-[10px] font-black tracking-wider rounded-lg border uppercase ${sortBy === sort ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-black/40 text-slate-400 border-slate-800'}`}>
                          {sort === 'A-Z' ? t('az_order') : sort === 'Z-A' ? t('za_order') : sort === 'Rarity (High to Low)' ? t('rarity_desc') : t('rarity_asc')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5 block">{t('rarity')}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['All', 'Mythic', 'Legendary', 'Epic', 'Rare', 'Unknown'].map(rarity => (
                        <button key={rarity} onClick={() => setRarityFilter(rarity)} className={`px-3 py-1.5 text-[10px] font-black tracking-wider rounded-lg border uppercase ${rarityFilter === rarity ? 'bg-cyan-400 text-black border-cyan-300' : 'bg-black/40 text-slate-400 border-slate-800'}`}>
                          {t(rarity.toLowerCase())}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5 block">{t('variant_type')}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['All', 'Base', 'Gold', 'Gummy', 'Galaxy', 'Holofoil', 'Cube', 'Gem', 'Quack'].map(variant => (
                        <button key={variant} onClick={() => setVariantFilter(variant)} className={`px-3 py-1.5 text-[10px] font-black tracking-wider rounded-lg border uppercase ${variantFilter === variant ? 'bg-purple-500 text-white border-purple-400' : 'bg-black/40 text-slate-400 border-slate-800'}`}>
                          {t(variant.toLowerCase())}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5 block">{t('collection_status')}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['All', isMasteryView ? 'Mastered' : 'Collected', isMasteryView ? 'Unmastered' : 'Missing'].map(status => (
                        <button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1.5 text-[10px] font-black tracking-wider rounded-lg border uppercase ${statusFilter === status ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-black/40 text-slate-400 border-slate-800'}`}>
                          {t(status.toLowerCase())}
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
                  <p className="text-sm sm:text-base text-slate-400 font-bold uppercase tracking-widest">{isMasteryView ? t('no_collectables') : t('no_sprites')}</p>
                </div>
              )}

              {/* LIST VIEW (CLEAN WRAPPING DOTS, REVERTED SIZES) */}
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                {filteredSprites.map(sprite => {
                  const displayVariant = variantFilter === 'All' ? 'base' : variantFilter.toLowerCase();
                  const validInitialVariant = sprite.variants.includes(displayVariant) ? displayVariant : 'base';
                  const hasAnyVariant = variantsList.some(v => collection[sprite.id]?.[v]);

                  return (
                    <div key={sprite.id} onClick={() => setSelectedSprite({ id: sprite.id, variant: validInitialVariant })} className="flex items-center gap-4 bg-[#151722] border border-slate-800/90 rounded-2xl p-4 hover:bg-slate-800/80 transition-colors cursor-pointer shadow-sm">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl p-1.5 border-2 transition-all shrink-0 ${hasAnyVariant ? 'bg-cyan-950/40 border-cyan-500/50' : 'bg-slate-900 border-slate-800 grayscale opacity-60'}`}>
                        <img src={sprite.images[validInitialVariant]} className="w-full h-full object-contain drop-shadow-md" alt="" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <div className="flex flex-col mb-2.5">
                          <span className="font-black text-base sm:text-lg text-white uppercase italic tracking-tight truncate">{sprite.name}</span>
                          <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${VARIANT_INFO[validInitialVariant]?.color}`}>{t(validInitialVariant)}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-2">
                          {variantsList.map(v => {
                            if (!sprite.variants.includes(v)) return null;
                            const isLocked = isVariantLocked(sprite.id, v);
                            const isCollected = collection[sprite.id]?.[v];
                            const isMastered = mastery[sprite.id]?.[v];
                            if (statusFilter === 'Missing' && isCollected && !isMasteryView) return null;

                            return (
                              <div key={v} className="flex flex-col items-center gap-1">
                                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 transition-all relative ${isLocked ? 'bg-slate-950/80 border-slate-800/60 opacity-60' : isMasteryView && isMastered ? 'bg-yellow-900/40 border-yellow-400' : isCollected ? `bg-slate-900 border-${VARIANT_INFO[v]?.color.split('-')[1]}-500/70` : 'bg-black border-slate-800'}`}>
                                  {isLocked ? <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-600" /> : (
                                    <>
                                      {isCollected && <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${VARIANT_INFO[v]?.bgColor} ${(isMasteryView && isMastered) ? 'opacity-30' : 'opacity-100'}`} />}
                                      {isMasteryView && isMastered && <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 drop-shadow-[0_0_2px_rgba(255,215,0,0.8)] absolute z-10" />}
                                    </>
                                  )}
                                </div>
                                <span className="text-[7px] sm:text-[8px] font-bold uppercase text-slate-500 tracking-wider whitespace-nowrap">{v === 'holofoil' ? 'Holo' : t(v)}</span>
                              </div>
                            )
                          })}
                        </div>
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
                <h2 className="text-xl sm:text-2xl font-black text-indigo-400 uppercase italic">{t('sprite_squad')}</h2>
              </div>
            </section>

            <section className="bg-[#12141f] rounded-2xl border border-slate-800 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2"><Target className="w-4 h-4 sm:w-5 sm:h-5" /> {t('extraction_targets')}</h3>
                <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase">{extractionTargets.filter(Boolean).length} / 3</span>
              </div>
              <div className="flex gap-2">
                {[0, 1, 2].map(index => renderTargetSlot(extractionTargets[index], index))}
              </div>
            </section>

            <section className="bg-[#12141f] rounded-2xl border border-slate-800 p-4">
              {!showAddFriendInput ? (
                <button onClick={() => setShowAddFriendInput(true)} className="w-full flex items-center justify-center gap-2 bg-indigo-900/40 hover:bg-indigo-900/60 border border-indigo-500/50 text-indigo-400 py-3 rounded-xl font-black uppercase tracking-wider transition-colors">
                  <Plus className="w-5 h-5" /> {t('add_friend')}
                </button>
              ) : (
                <div className="animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider">{t('add_friend')}</h3>
                    <button onClick={() => { setShowAddFriendInput(false); setFriendSearchQuery(''); setFriendSearchResult(null); setFriendSearchStatus(''); }} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 absolute left-3 top-3" />
                      <input type="text" value={friendSearchQuery} onChange={(e) => setFriendSearchQuery(e.target.value)} placeholder={t('search_id')} className="w-full bg-black border-2 border-slate-800 rounded-xl pl-9 sm:pl-10 pr-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                    <button onClick={handleSearchFriend} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-xl transition-colors"><Search className="w-5 h-5" /></button>
                  </div>
                  {friendSearchStatus === 'searching' && <p className="text-sm text-slate-400 mt-3">Searching...</p>}
                  {friendSearchStatus === 'not-found' && <p className="text-sm text-red-400 mt-3 font-bold">Sprite ID not found.</p>}
                  {friendSearchStatus === 'found' && friendSearchResult && (
                    <div className="mt-4 p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-xl flex justify-between items-center animate-in zoom-in-95">
                      <span className="text-base sm:text-lg font-bold text-white">@{friendSearchResult.spriteId}</span>
                      <button onClick={handleSendFriendRequest} className="bg-indigo-500 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-white flex items-center gap-1 hover:bg-indigo-400"><UserPlus className="w-4 h-4" /> {t('request')}</button>
                    </div>
                  )}
                </div>
              )}
            </section>

            {sentRequests.length > 0 && (
              <section className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">{t('sent_requests')}</h3>
                {sentRequests.map(req => (
                  <div key={req.id} className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-slate-800 mb-2">
                    <span className="text-sm sm:text-base font-bold text-slate-300 tracking-wider">To: @{req.receiverSpriteId}</span>
                    <button onClick={() => cancelFriendRequest(req.id)} className="bg-red-900/40 border border-red-800/50 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase text-red-400"><XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline" /> {t('cancel')}</button>
                  </div>
                ))}
              </section>
            )}

            {pendingRequests.length > 0 && (
              <section className="bg-indigo-950/20 rounded-2xl border border-indigo-500/30 p-4">
                <h3 className="text-sm font-black text-indigo-400 uppercase tracking-wider mb-3">{t('incoming_requests')}</h3>
                {pendingRequests.map(req => (
                  <div key={req.id} className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-slate-800 mb-2">
                    <span className="text-sm sm:text-base font-bold text-white tracking-wider">@{req.senderSpriteId}</span>
                    <button onClick={() => acceptFriendRequest(req)} className="bg-emerald-600 px-4 py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase text-white"><Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline" /> {t('accept')}</button>
                  </div>
                ))}
              </section>
            )}

            <section className="bg-[#12141f] rounded-2xl border border-slate-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider">{t('sprite_squad')} ({richFriends.length})</h3>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-indigo-500/70 absolute left-3 top-3" />
                  <input type="text" placeholder="Search Squad..." value={squadSearchQuery} onChange={(e) => setSquadSearchQuery(e.target.value)} className="w-full bg-black/50 border-2 border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
              </div>

              {filteredSquad.length === 0 ? (
                <div className="text-center py-6">
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">No Squad Members Found</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {filteredSquad.map((friend, index) => {
                    const matchFound = isMutualMatch(friend);
                    const cardClass = matchFound ? "bg-cyan-950/40 border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]" : "bg-slate-900 border border-slate-800/80";
                    return (
                      <div key={index} className={`p-3 rounded-xl flex items-center justify-between transition-all duration-300 ${cardClass}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black ${matchFound ? 'bg-cyan-900/50 border-cyan-400 text-cyan-400' : 'bg-indigo-900/50 border-indigo-500/50 text-indigo-400'}`}>#{index + 1}</div>
                          <div className="flex flex-col">
                            <span className="text-sm sm:text-base font-bold text-white tracking-wider flex items-center gap-1">@{friend.spriteId || 'Unknown'}</span>
                            {matchFound ? (
                              <span className="text-[9px] sm:text-[10px] font-black text-cyan-400 font-mono tracking-widest mt-0.5 animate-pulse uppercase flex items-center gap-1"><Target className="w-3 h-3" /> Extraction Match</span>
                            ) : (
                              <span className="text-[10px] sm:text-[11px] font-black text-indigo-400 font-mono tracking-widest">{friend.completionRate}% COMPLETE</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => inspectFriendLibrary(friend)} className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-colors ${matchFound ? 'bg-cyan-900/40 text-cyan-300 border-cyan-500/50' : 'bg-indigo-900/40 text-indigo-300 border-indigo-500/30'}`}>View</button>
                          <button onClick={() => setShowUnfriendConfirm(friend)} className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-950/30 transition-colors"><UserMinus className="w-4 h-4 sm:w-5 sm:h-5" /></button>
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
            <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900 border-2 border-emerald-500/50 rounded-2xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-emerald-950/80 rounded-full border border-emerald-400 flex items-center justify-center mb-3"><Smartphone className="w-6 h-6 text-emerald-400" /></div>
              <h4 className="text-lg font-black text-white uppercase italic mb-1 tracking-wider">Spritedex is on Android!</h4>
              <a href="https://play.google.com/store/apps/details?id=com.prosynctech.spritedex" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-lg mt-2">
                <span>Get it on Google Play</span>
              </a>
            </div>

            <div className="bg-[#12141f] border-2 border-emerald-500/40 rounded-2xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <h3 className="text-xl sm:text-2xl font-black text-emerald-400 uppercase italic mb-2">{t('feedback_title')}</h3>
              <p className="text-sm sm:text-base text-slate-400 mb-6">{t('feedback_prompt')}</p>

              <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-3">
                <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder={t('tell_us')} className="w-full bg-black/50 border-2 border-slate-800 rounded-xl p-3 text-sm sm:text-base text-white focus:outline-none focus:border-emerald-500 min-h-[120px] resize-y" required />
                <button type="submit" disabled={feedbackStatus === 'submitting'} className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white font-black uppercase tracking-wider py-3 rounded-xl transition-colors">
                  {feedbackStatus === 'submitting' ? t('sending') : feedbackStatus === 'success' ? <><CheckCircle className="w-5 h-5" /> {t('sent')}</> : <><Mail className="w-5 h-5" /> {t('send_feedback')}</>}
                </button>
              </form>
            </div>

            <div className="p-5 bg-gradient-to-r from-purple-900/30 to-fuchsia-900/20 border border-purple-500/40 rounded-2xl flex flex-col items-center text-center shadow-[0_0_15px_rgba(168,85,247,0.15)] animate-in fade-in duration-500">
              <div className="w-12 h-12 bg-purple-900/50 rounded-full border border-purple-400/50 flex items-center justify-center mb-3"><Info className="w-6 h-6 text-purple-400" /></div>
              <h4 className="text-lg font-black text-purple-400 uppercase italic mb-2 tracking-wider">{t('support_tracker')}</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 max-w-[280px]">{t('buy_merch')}</p>
              <div className="flex flex-col gap-2.5 w-full max-w-[280px]">
                <a href="https://amzn.to/3ThkM2y" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-purple-900/40 hover:bg-purple-600 border border-purple-500/50 text-white font-black uppercase tracking-widest py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md"><span>Mini Sprites</span><ShoppingCart className="w-4 h-4 opacity-70" /></a>
                <a href="https://amzn.to/4yzmyfD" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-purple-900/40 hover:bg-purple-600 border border-purple-500/50 text-white font-black uppercase tracking-widest py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md"><span>Sprite Plush</span><ShoppingCart className="w-4 h-4 opacity-70" /></a>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* --- EXTENDED BOTTOM NAVIGATION BAR --- */}
      <nav className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
        <div className="bg-[#0e1017]/95 backdrop-blur-md border border-slate-800 rounded-2xl w-full max-w-sm px-2 py-2 flex justify-between shadow-2xl">
          <button onClick={() => { setCurrentView('sprites'); setActiveViewingFriend(null); playBeep(440, 'sine', 0.05); }} className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${currentView === 'sprites' && !activeViewingFriend ? 'text-cyan-400' : 'text-slate-600'}`}>
            <List className="w-5 h-5 sm:w-6 sm:h-6" /><span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">{t('sprites')}</span>
          </button>
          <button onClick={() => { setCurrentView('mastery'); setActiveViewingFriend(null); playBeep(523, 'sine', 0.05); }} className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${currentView === 'mastery' && !activeViewingFriend ? 'text-yellow-400' : 'text-slate-600'}`}>
            <Crown className="w-5 h-5 sm:w-6 sm:h-6" /><span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">{t('mastery')}</span>
          </button>
          <button onClick={() => { setCurrentView('friends'); setActiveViewingFriend(null); playBeep(587, 'sine', 0.05); }} className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${currentView === 'friends' || activeViewingFriend ? 'text-indigo-400' : 'text-slate-600'}`}>
            <Users className="w-5 h-5 sm:w-6 sm:h-6" /><span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">{t('friends')}</span>
          </button>
          <button onClick={() => { setCurrentView('feedback'); setActiveViewingFriend(null); playBeep(659, 'sine', 0.05); }} className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${currentView === 'feedback' && !activeViewingFriend ? 'text-emerald-400' : 'text-slate-600'}`}>
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" /><span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">{t('support')}</span>
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