import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import {
  PawPrint, Utensils, Heart, Droplets, Zap, Moon, Sun, Pill, Gamepad2, Bath, Ghost, HeartPulse,
  TriangleAlert, Info, Sparkles, Bell, BellOff,
} from 'lucide-react';
import PlayHub from './games/PlayHub';
import { usePet, adoptPet, savePetFields } from './petData';
import { syncPetReminders, getReminderStatus, requestReminderPermission, setRemindersEnabled, scheduleTestReminder } from './petReminders';
import {
  NEEDS, PET_CONFIG, evaluatePet, planAction, planRelease, planDeathRecord, planSkipAhead, historyEntryFor,
  formatDuration, describeCause, petToolsEnabledFor,
} from './petLogic';

const PET_STYLES = `
@keyframes petfloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes petbounce { 0%,100% { transform: translateY(0) scale(1,1); } 35% { transform: translateY(-16px) scale(0.97,1.04); } 70% { transform: translateY(0) scale(1.05,0.95); } }
@keyframes petsway { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
@keyframes petshiver { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }
@keyframes petbreathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
@keyframes petzzz { 0% { opacity: 0; transform: translate(0,0) scale(0.7); } 25% { opacity: 1; } 100% { opacity: 0; transform: translate(16px,-36px) scale(1.2); } }
@keyframes petheart { 0% { opacity: 0; transform: translateY(0) scale(0.6); } 25% { opacity: 1; } 100% { opacity: 0; transform: translateY(-48px) scale(1.1); } }
@keyframes petpop { 0% { opacity: 0; transform: scale(0.6); } 100% { opacity: 1; transform: scale(1); } }
@keyframes petghost { 0%,100% { transform: translateY(0); opacity: 0.7; } 50% { transform: translateY(-10px); opacity: 1; } }
`;

const NEED_META = {
  hunger: { label: 'Hunger', Icon: Utensils, bar: 'bg-orange-400', text: 'text-orange-300' },
  happiness: { label: 'Happiness', Icon: Heart, bar: 'bg-pink-400', text: 'text-pink-300' },
  cleanliness: { label: 'Cleanliness', Icon: Droplets, bar: 'bg-cyan-400', text: 'text-cyan-300' },
  energy: { label: 'Energy', Icon: Zap, bar: 'bg-yellow-300', text: 'text-yellow-200' },
};

const MOOD_META = {
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

const ACTION_STYLE = {
  feed: { Icon: Utensils, label: 'Feed', on: 'bg-orange-500/15 border-orange-400/60 text-orange-200 hover:bg-orange-500/25' },
  play: { Icon: Gamepad2, label: 'Play', on: 'bg-pink-500/15 border-pink-400/60 text-pink-200 hover:bg-pink-500/25' },
  bathe: { Icon: Bath, label: 'Bathe', on: 'bg-cyan-500/15 border-cyan-400/60 text-cyan-200 hover:bg-cyan-500/25' },
  sleep: { Icon: Moon, label: 'Lights Out', on: 'bg-indigo-500/15 border-indigo-400/60 text-indigo-200 hover:bg-indigo-500/25' },
  wake: { Icon: Sun, label: 'Wake Up', on: 'bg-amber-500/15 border-amber-400/60 text-amber-200 hover:bg-amber-500/25' },
  medicine: { Icon: Pill, label: 'Give Medicine', on: 'bg-lime-500/15 border-lime-400/60 text-lime-200 hover:bg-lime-500/25' },
};
const ACTION_OFF = 'bg-slate-900/60 border-slate-800 text-slate-600';

const REACTION_ICON = { feed: Utensils, play: Heart, bathe: Droplets, medicine: Pill, sleep: Moon, wake: Sun };
const REACTION_COLOR = { feed: 'text-orange-300', play: 'text-pink-300', bathe: 'text-cyan-300', medicine: 'text-lime-300', sleep: 'text-indigo-300', wake: 'text-amber-300' };

const RARITY_SCENE = {
  Mythic: 'from-yellow-500/40 via-amber-700/30 to-slate-950',
  Legendary: 'from-orange-500/40 via-orange-800/30 to-slate-950',
  Epic: 'from-purple-500/40 via-purple-800/30 to-slate-950',
  Rare: 'from-blue-500/40 via-blue-800/30 to-slate-950',
};
const FALLBACK_SCENE = 'from-slate-600/40 via-slate-800/30 to-slate-950';
const RARITY_WEIGHT = { Mythic: 4, Legendary: 3, Epic: 2, Rare: 1 };

const VARIANT_LABELS = {
  base: 'Base', gold: 'Gold', gummy: 'Gummy', galaxy: 'Galaxy', holofoil: 'Holo', cube: 'Cube', gem: 'Gem',
  quack: 'Quack', cheatmaster: 'Cheat', loothacker: 'Hacker', bountyhunter: 'Bounty', trickortreat: 'Treat',
};
const variantLabel = (v) => VARIANT_LABELS[v] || (v ? v.charAt(0).toUpperCase() + v.slice(1) : '');

const hoursLabel = (ms) => `${Math.round(ms / 3600000)}h`;
const spriteNameOf = (spritesDatabase, pet) => (pet ? spritesDatabase?.find((s) => s.id === pet.spriteId)?.name || 'Your Sprite' : null);
const spriteImage = (sprite, variant) => sprite?.images?.[variant] || sprite?.images?.base || null;
const healthBarClass = (h) => (h >= 60 ? 'bg-emerald-400' : h >= 30 ? 'bg-amber-400' : 'bg-red-500 animate-pulse');

function NeedBar({ need, info }) {
  const meta = NEED_META[need];
  const pct = Math.round(info.level * 100);
  const low = info.level < PET_CONFIG.warn.low;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${meta.text}`}>
          <meta.Icon className="w-3.5 h-3.5" /> {meta.label}
        </span>
        <span className="text-[10px] font-mono text-slate-400">
          {info.remainingMs > 0 ? `${pct}% - ${formatDuration(info.remainingMs)}` : 'EMPTY'}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={meta.label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80"
      >
        <div className={`h-full rounded-full transition-all duration-500 ${low ? 'bg-red-500 animate-pulse' : meta.bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function PetStage({ sprite, image, moodKey, reaction }) {
  const mood = MOOD_META[moodKey] || MOOD_META.ok;
  const Bubble = mood.bubble;
  const Reaction = reaction ? REACTION_ICON[reaction.type] : null;
  const scene = RARITY_SCENE[sprite?.rarity] || FALLBACK_SCENE;
  return (
    <div className={`relative rounded-3xl border-2 border-white/10 overflow-hidden bg-gradient-to-b ${scene}`}>
      <div className="relative flex items-end justify-center h-64 pb-10">
        <div className="absolute bottom-8 w-40 h-5 rounded-[50%] bg-black/50 blur-md" />
        {image ? (
          <img
            src={image}
            alt={sprite?.name || 'Sprite'}
            draggable={false}
            className={`relative z-10 w-44 h-44 object-contain select-none drop-shadow-[0_10px_18px_rgba(0,0,0,0.55)] ${mood.anim} ${mood.tone}`}
          />
        ) : (
          <PawPrint className="relative z-10 w-24 h-24 text-slate-500 mb-6" />
        )}

        {Bubble && (
          <div key={moodKey} className="absolute top-5 right-[22%] z-20 flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-slate-900 shadow-lg animate-[petpop_0.3s_ease-out]">
            <Bubble className="w-5 h-5" />
            <span className="absolute -bottom-1 left-2 w-3 h-3 bg-white rotate-45" />
          </div>
        )}
        {moodKey === 'sleeping' && (
          <div className="absolute top-8 right-[30%] z-20 text-indigo-200 font-black pointer-events-none">
            {[0, 1, 2].map((i) => (
              <span key={i} className="absolute text-xl opacity-0 animate-[petzzz_2.4s_ease-in-out_infinite] motion-reduce:animate-none" style={{ animationDelay: `${i * 0.8}s` }}>Z</span>
            ))}
          </div>
        )}
        {moodKey === 'happy' && [0, 1, 2].map((i) => (
          <Heart
            key={i}
            className="absolute z-20 w-4 h-4 text-pink-400 fill-pink-400 opacity-0 animate-[petheart_2.8s_ease-out_infinite] motion-reduce:animate-none"
            style={{ left: `${38 + i * 12}%`, bottom: '55%', animationDelay: `${i * 0.9}s` }}
          />
        ))}
        {moodKey === 'dead' && (
          <Ghost className="absolute top-8 right-[30%] z-20 w-9 h-9 text-slate-300 animate-[petghost_3s_ease-in-out_infinite] motion-reduce:animate-none" />
        )}
        {Reaction && (
          <Reaction
            key={reaction.id}
            className={`absolute z-30 w-8 h-8 opacity-0 animate-[petheart_1.1s_ease-out_forwards] ${REACTION_COLOR[reaction.type]}`}
            style={{ left: '48%', bottom: '58%' }}
          />
        )}
      </div>
    </div>
  );
}

function ActionButton({ action, plan, busy, onClick }) {
  const style = ACTION_STYLE[action];
  const enabled = plan.ok && !busy;
  const hint = plan.ok ? 'Ready' : plan.retryInMs > 0 ? `in ${formatDuration(plan.retryInMs)}` : plan.short;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!enabled}
      className={`w-full flex flex-col items-center justify-center gap-1 rounded-2xl border-2 py-3 px-2 transition-all active:scale-95 ${enabled ? style.on : ACTION_OFF}`}
    >
      <style.Icon className="w-6 h-6" />
      <span className="text-[10px] font-black uppercase tracking-wider">{style.label}</span>
      <span className="text-[9px] font-mono leading-tight min-h-[12px]">{hint}</span>
    </button>
  );
}

function CareGuide() {
  const c = PET_CONFIG;
  const lines = [
    `Hunger lasts ${hoursLabel(c.full.hunger)} when full, Happiness ${hoursLabel(c.full.happiness)}, Energy ${hoursLabel(c.full.energy)} and Cleanliness ${hoursLabel(c.full.cleanliness)}.`,
    'Feed, Play, Bathe and Lights Out refill a need, never past full.',
    'An empty need drains health, and health refills slowly once everything is looked after.',
    'A Sprite you ignore completely lasts about 3 days.',
    `A sick Sprite needs medicine within ${hoursLabel(c.sickness.deathMs)}, and a dirty one gets sick.`,
    'Play a mini-game for up to +8h of happiness, or a quick play for +4h. Either way it costs a little energy.',
    'Sleeping refills energy twice as fast as real time.',
    'If your Sprite passes away you can adopt another. Your longest life is remembered.',
  ];
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-300 mb-2">Care guide</h3>
      <ul className="flex flex-col gap-1.5">
        {lines.map((line) => (
          <li key={line} className="text-xs text-slate-400 leading-relaxed flex gap-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PastSprites({ history, spritesDatabase }) {
  if (!history || history.length === 0) return null;
  const rows = history
    .map((h) => ({ ...h, lifeMs: h.diedAt - h.bornAt }))
    .sort((a, b) => b.lifeMs - a.lifeMs)
    .slice(0, 10);
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-300 mb-3">Past Sprites</h3>
      <div className="flex flex-col gap-2">
        {rows.map((row, index) => {
          const sprite = spritesDatabase?.find((s) => s.id === row.spriteId);
          const image = spriteImage(sprite, row.variant);
          return (
            <div key={`${row.bornAt}-${index}`} className="flex items-center gap-3 rounded-xl bg-black/30 border border-white/5 p-2">
              <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center shrink-0">
                {image ? <img src={image} alt="" className="w-8 h-8 object-contain grayscale opacity-70" /> : <PawPrint className="w-5 h-5 text-slate-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate">{sprite?.name || 'Sprite'} <span className="text-[10px] text-slate-500 font-bold uppercase">{variantLabel(row.variant)}</span></p>
                <p className="text-[10px] font-mono text-slate-500">Lived {formatDuration(row.lifeMs)} - {describeCause(row.cause)}</p>
              </div>
              {index === 0 && <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 border border-amber-400/40 text-amber-300">Longest</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdoptPicker({ spritesDatabase, collection, busy, onAdopt, title, blurb }) {
  const [selected, setSelected] = useState(null);

  const rows = useMemo(() => {
    const out = [];
    for (const sprite of spritesDatabase || []) {
      const variants = (sprite.variants || []).filter((v) => collection?.[sprite.id]?.[v] && sprite.images?.[v]);
      if (variants.length > 0) out.push({ sprite, variants });
    }
    return out.sort((a, b) => (RARITY_WEIGHT[b.sprite.rarity] || 0) - (RARITY_WEIGHT[a.sprite.rarity] || 0) || a.sprite.name.localeCompare(b.sprite.name));
  }, [spritesDatabase, collection]);

  const chosen = selected ? spritesDatabase.find((s) => s.id === selected.spriteId) : null;

  return (
    <div className={`flex flex-col gap-4 ${selected ? 'pb-28' : ''}`}>
      <div className="rounded-2xl border-2 border-pink-500/30 bg-pink-950/10 p-4">
        <h3 className="text-lg font-black uppercase italic text-pink-300 flex items-center gap-2"><Sparkles className="w-5 h-5" /> {title}</h3>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed">{blurb}</p>
      </div>

      {rows.length === 0 ? (
        <div className="text-center p-8 bg-[#12141f] rounded-2xl border border-slate-800">
          <PawPrint className="w-10 h-10 text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">No collected Sprites yet</p>
          <p className="text-xs text-slate-500 mt-2">Mark a Sprite as collected on the Sprites tab, then come back to adopt it.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map(({ sprite, variants }) => (
            <div key={sprite.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-black uppercase italic text-white">{sprite.name}</span>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">{sprite.rarity}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => {
                  const active = selected?.spriteId === sprite.id && selected.variant === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelected({ spriteId: sprite.id, variant: v })}
                      aria-label={`${sprite.name} ${variantLabel(v)}`}
                      aria-pressed={active}
                      className={`flex flex-col items-center w-14 p-1.5 rounded-lg border-2 transition-colors ${active ? 'border-pink-400 bg-pink-500/15' : 'border-slate-700 bg-black/40 hover:bg-slate-800'}`}
                    >
                      <img src={sprite.images[v]} alt="" loading="lazy" className="w-9 h-9 object-contain" />
                      <span className="mt-0.5 w-full text-center truncate text-[7px] font-black uppercase tracking-wider text-slate-400">{variantLabel(v)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && chosen && (
        <div className="fixed bottom-24 left-0 right-0 z-40 px-4 flex justify-center">
          <div className="w-full max-w-md flex items-center gap-3 rounded-2xl border-2 border-pink-400/60 bg-[#12141f]/95 backdrop-blur-md p-3 shadow-2xl">
            <img src={spriteImage(chosen, selected.variant)} alt="" className="w-14 h-14 object-contain shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black uppercase italic text-white truncate">{chosen.name}</p>
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">{variantLabel(selected.variant)}</p>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => onAdopt(selected.spriteId, selected.variant)}
              className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider transition-colors"
            >
              Adopt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RemindersCard({ reminders, onToggle }) {
  const { supported, enabled, permission } = reminders;
  const blocked = supported && permission === 'denied';
  const active = supported && enabled && permission === 'granted';
  let hint = 'Get a heads up before your Sprite gets hungry, sick or runs out of time.';
  if (!supported) hint = 'Reminders work in the iOS and Android apps.';
  else if (blocked) hint = 'Notifications are blocked. Turn them on in your phone settings.';
  else if (active) hint = 'You will be told when your Sprite needs you. Quiet hours 10pm to 8am, at most 3 a day.';
  const Icon = active ? Bell : BellOff;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${active ? 'bg-pink-500/15 border-pink-400/50 text-pink-300' : 'bg-black/40 border-slate-700 text-slate-500'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black uppercase tracking-widest text-slate-200">Reminders</p>
        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={active}
        aria-label="Pet reminders"
        disabled={!supported || blocked}
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full border shrink-0 transition-colors disabled:opacity-40 ${active ? 'bg-pink-600 border-pink-400' : 'bg-slate-800 border-slate-600'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

function PreviewToolsCard({ tools }) {
  const button = 'flex-1 py-2 rounded-xl border border-dashed border-slate-600 bg-black/30 text-[10px] font-black uppercase tracking-wider text-slate-300 hover:bg-slate-800 transition-colors';
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-3.5">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preview tools</p>
      <p className="text-[11px] text-slate-500 leading-snug mt-0.5 mb-2.5">Only your account sees these. Skipping ahead makes the pet behave as if that much time passed with nobody around.</p>
      <div className="flex gap-2">
        <button type="button" className={button} onClick={tools.onTestReminder}>Test reminder</button>
        <button type="button" className={button} onClick={() => tools.onSkip(6)}>Skip 6h</button>
        <button type="button" className={button} onClick={() => tools.onSkip(24)}>Skip 24h</button>
      </div>
    </div>
  );
}

export function PetScreen({ pet, now, spritesDatabase, collection, busy, notice, reaction, reminders, tools, deathFailed, playBeep, onOverlayChange, onToggleReminders, onAction, onAdopt, onRelease, onDeath }) {
  const [showGuide, setShowGuide] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [playOpen, setPlayOpen] = useState(false);

  const bucket = Math.floor(now / 15000);
  const ev = useMemo(() => (pet ? evaluatePet(pet, bucket * 15000) : null), [pet, bucket]);

  useEffect(() => {
    if (ev && !ev.alive && !ev.ended && onDeath) onDeath(ev);
  }, [ev, onDeath]);

  // Tells App.jsx a full-screen layer is open, so the Android back button closes it first.
  useEffect(() => {
    if (!onOverlayChange) return undefined;
    onOverlayChange(playOpen);
    return () => onOverlayChange(false);
  }, [playOpen, onOverlayChange]);

  const sprite = pet ? spritesDatabase?.find((s) => s.id === pet.spriteId) : null;
  const image = pet ? spriteImage(sprite, pet.variant) : null;

  const adoptWithHistory = (spriteId, variant) => {
    const history = pet ? [...pet.history] : [];
    if (pet && ev && !ev.alive && !ev.released) history.push(historyEntryFor(pet, ev));
    onAdopt(spriteId, variant, history);
  };

  const noticeBanner = notice && (
    <div className={`rounded-xl border px-3 py-2 text-xs font-bold ${notice.kind === 'error' ? 'bg-red-950/50 border-red-500/50 text-red-300' : 'bg-slate-900 border-slate-700 text-slate-300'}`}>
      {notice.text}
    </div>
  );

  if (!pet || ev.released) {
    return (
      <div className="flex flex-col gap-4">
        <style>{PET_STYLES}</style>
        {noticeBanner}
        <AdoptPicker
          spritesDatabase={spritesDatabase}
          collection={collection}
          busy={busy}
          onAdopt={adoptWithHistory}
          title="Adopt a Sprite"
          blurb="Pick any Sprite you have collected to raise as your pet. Feed it, play with it, keep it clean and let it sleep. If you neglect it, it will not make it. Your longest-lived pet is remembered."
        />
        <PastSprites history={pet?.history} spritesDatabase={spritesDatabase} />
      </div>
    );
  }

  if (!ev.alive) {
    // A new pet can only replace one whose death the server has accepted. That also stops a
    // phone with the wrong clock from "killing" a living pet and starting over.
    const deathSaved = pet.endedAt != null;
    return (
      <div className="flex flex-col gap-4">
        <style>{PET_STYLES}</style>
        {noticeBanner}
        <PetStage sprite={sprite} image={image} moodKey="dead" />
        <div className="text-center">
          <h2 className="text-xl font-black uppercase italic text-slate-200">Rest in peace, {sprite?.name || 'Sprite'}</h2>
          <p className="text-xs font-mono text-slate-500 mt-1">Lived {formatDuration(ev.ageMs)} - {describeCause(ev.cause)}</p>
        </div>
        {deathFailed && !deathSaved && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-500/50 bg-amber-950/40 px-3 py-2.5 text-xs font-bold text-amber-300">
            <TriangleAlert className="w-4 h-4 shrink-0 mt-0.5" />
            Could not confirm this on the server. Check that your phone's date and time are correct, then reopen the app.
          </div>
        )}
        {showPicker && deathSaved ? (
          <AdoptPicker
            spritesDatabase={spritesDatabase}
            collection={collection}
            busy={busy}
            onAdopt={adoptWithHistory}
            title="Adopt a new Sprite"
            blurb="Every Sprite starts fresh. Beat your longest life."
          />
        ) : (
          <button
            type="button"
            disabled={!deathSaved}
            onClick={() => setShowPicker(true)}
            className="w-full py-3.5 rounded-2xl bg-pink-600 hover:bg-pink-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-black uppercase tracking-wider transition-colors"
          >
            {deathSaved ? 'Adopt a new Sprite' : deathFailed ? 'Could not confirm' : 'Saving...'}
          </button>
        )}
        <PastSprites history={pet.history} spritesDatabase={spritesDatabase} />
      </div>
    );
  }

  const mood = MOOD_META[ev.mood] || MOOD_META.ok;
  const hint = ev.sleeping
    ? `Sleeping. Wakes in ${formatDuration(ev.sleepEndMs - now)}.`
    : ev.nextEmpty
      ? `${NEED_META[ev.nextEmpty].label} runs out in ${formatDuration(ev.needs[ev.nextEmpty].remainingMs)}.`
      : 'Every need is empty. Act now!';

  const actionKeys = ev.sleeping ? ['feed', 'play', 'bathe', 'wake'] : ['feed', 'play', 'bathe', 'sleep'];
  const plans = {};
  for (const key of [...actionKeys, 'medicine']) plans[key] = planAction(pet, key, now, { evaluation: ev });

  return (
    <div className="flex flex-col gap-4">
      <style>{PET_STYLES}</style>

      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-black uppercase italic tracking-tight text-pink-300 flex items-center gap-2"><PawPrint className="w-5 h-5" /> Sprite Pet</h2>
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 truncate">
            {sprite?.name || 'Sprite'} - {variantLabel(pet.variant)} - Age {formatDuration(ev.ageMs)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowGuide((v) => !v)}
          aria-label="Care guide"
          aria-pressed={showGuide}
          className="p-2 rounded-xl bg-slate-900 border-2 border-slate-700/60 hover:bg-slate-800 transition-colors"
        >
          <Info className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      {showGuide && <CareGuide />}
      {noticeBanner}

      <PetStage sprite={sprite} image={image} moodKey={ev.mood} reaction={reaction} />

      <div className="text-center -mt-1">
        <p className={`text-sm font-black uppercase tracking-widest ${mood.text}`}>{mood.label}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{hint}</p>
      </div>

      {ev.lastChance ? (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/60 bg-red-950/50 px-3 py-2.5 text-xs font-bold text-red-300">
          <TriangleAlert className="w-4 h-4 shrink-0 mt-0.5" />
          Last chance! Without care, your Sprite may not survive another {formatDuration(ev.projectedDeathAtMs - now)}.
        </div>
      ) : ev.critical ? (
        <div className="flex items-start gap-2 rounded-xl border border-amber-500/50 bg-amber-950/40 px-3 py-2.5 text-xs font-bold text-amber-300">
          <TriangleAlert className="w-4 h-4 shrink-0 mt-0.5" />
          Health is critical. Look after your Sprite now.
        </div>
      ) : null}
      {ev.sick && (
        <div className="flex items-start gap-2 rounded-xl border border-lime-500/50 bg-lime-950/30 px-3 py-2.5 text-xs font-bold text-lime-300">
          <Pill className="w-4 h-4 shrink-0 mt-0.5" />
          Your Sprite is sick. Give medicine within {formatDuration(ev.sickDeadlineMs - now)}.
        </div>
      )}

      <section className="rounded-2xl border border-white/5 bg-black/30 p-4 flex flex-col gap-3.5">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-300"><HeartPulse className="w-3.5 h-3.5" /> Health</span>
            <span className="text-[10px] font-mono text-slate-400">{Math.round(ev.health)}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Health"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(ev.health)}
            className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80"
          >
            <div className={`h-full rounded-full transition-all duration-500 ${healthBarClass(ev.health)}`} style={{ width: `${Math.round(ev.health)}%` }} />
          </div>
        </div>
        {NEEDS.map((need) => <NeedBar key={need} need={need} info={ev.needs[need]} />)}
      </section>

      <section className="grid grid-cols-2 gap-2.5">
        {actionKeys.map((key) => (
          <ActionButton key={key} action={key} plan={plans[key]} busy={busy} onClick={() => (key === 'play' ? setPlayOpen(true) : onAction(key))} />
        ))}
        {ev.sick && (
          <div className="col-span-2">
            <ActionButton action="medicine" plan={plans.medicine} busy={busy} onClick={() => onAction('medicine')} />
          </div>
        )}
      </section>

      {reminders && <RemindersCard reminders={reminders} onToggle={onToggleReminders} />}
      {tools && <PreviewToolsCard tools={tools} />}

      <button
        type="button"
        onClick={onRelease}
        disabled={busy}
        className="self-center text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-red-400 transition-colors py-2"
      >
        Release this Sprite
      </button>

      {playOpen && (
        <PlayHub
          pet={pet}
          sprite={sprite}
          image={image}
          spritesDatabase={spritesDatabase}
          collection={collection}
          ageMs={ev.ageMs}
          beep={playBeep}
          onQuick={() => { setPlayOpen(false); onAction('play'); }}
          onCollect={(quality) => { setPlayOpen(false); onAction('play', { quality }); }}
          onClose={() => setPlayOpen(false)}
        />
      )}
    </div>
  );
}

const haptic = () => {
  try {
    Promise.resolve(Haptics.impact({ style: ImpactStyle.Light })).catch(() => {});
  } catch {
    // haptics are optional
  }
};

const ACTION_BEEP = {
  feed: [660, 'sine', 0.08], play: [784, 'triangle', 0.12], bathe: [523, 'sine', 0.1],
  sleep: [330, 'sine', 0.2], wake: [587, 'sine', 0.1], medicine: [880, 'sine', 0.1],
};

export default function PetView({ uid, spritesDatabase, collection, playBeep, onOverlayChange }) {
  const { pet, loading, error } = usePet(uid);
  const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [reminders, setReminders] = useState(null);
  const [deathFailedFor, setDeathFailedFor] = useState(null);
  const deathTried = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getReminderStatus().then((status) => { if (!cancelled) setReminders(status); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const id = setTimeout(() => setNotice(null), 4500);
    return () => clearTimeout(id);
  }, [notice]);

  useEffect(() => {
    if (!reaction) return undefined;
    const id = setTimeout(() => setReaction(null), 1300);
    return () => clearTimeout(id);
  }, [reaction]);

  const beep = (args) => { if (playBeep && args) playBeep(...args); };

  const run = async (task) => {
    setBusy(true);
    try {
      await task();
    } catch (e) {
      console.error('Sprite pet save failed', e);
      setNotice({ kind: 'error', text: `Could not save that (${e?.code || 'error'}). Check your connection and try again.` });
    } finally {
      setBusy(false);
    }
  };

  const handleAction = (action, options) => {
    if (!pet || busy) return;
    const plan = planAction(pet, action, Date.now(), options);
    if (!plan.ok) {
      setNotice({ kind: 'info', text: plan.reason });
      return;
    }
    haptic();
    beep(ACTION_BEEP[action]);
    setReaction({ type: action, id: Date.now() });
    if (plan.gain?.happinessMs > 0) setNotice({ kind: 'info', text: `Happiness +${formatDuration(plan.gain.happinessMs)}` });
    run(() => savePetFields(uid, plan.fields));
  };

  const handleAdopt = (spriteId, variant, history) => {
    const sprite = spritesDatabase?.find((s) => s.id === spriteId);
    const ok = window.confirm(`Adopt ${sprite?.name || 'this Sprite'} (${variantLabel(variant)})? You can not swap it for another one until it passes away or you release it.`);
    if (!ok) return;
    haptic();
    beep([1046, 'sine', 0.2]);
    run(async () => {
      // The phone's permission prompt belongs in the same tap that adopts the Sprite.
      if (reminders?.enabled) await requestReminderPermission();
      await adoptPet(uid, spriteId, variant, history);
      setReminders(await getReminderStatus());
    });
  };

  const handleToggleReminders = async () => {
    if (!reminders?.supported) return;
    if (reminders.enabled && reminders.permission === 'granted') {
      setRemindersEnabled(false);
    } else {
      setRemindersEnabled(true);
      const permission = await requestReminderPermission();
      if (permission !== 'granted') setNotice({ kind: 'info', text: 'Notifications are blocked. Turn them on in your phone settings to get reminders.' });
    }
    setReminders(await getReminderStatus());
    syncPetReminders(pet, spriteNameOf(spritesDatabase, pet));
  };

  const handleRelease = () => {
    if (!pet) return;
    const ok = window.confirm('Release this Sprite? It will leave for good and will not be added to your past Sprites.');
    if (!ok) return;
    beep([220, 'sawtooth', 0.2]);
    run(() => savePetFields(uid, planRelease(pet, Date.now())));
  };

  const handleSkip = (hours) => {
    if (!pet || busy) return;
    run(async () => {
      await savePetFields(uid, planSkipAhead(pet, hours * 3600000));
      setNotice({ kind: 'info', text: `Skipped ahead ${hours}h.` });
    });
  };

  const handleTestReminder = async () => {
    const message = await scheduleTestReminder(spriteNameOf(spritesDatabase, pet));
    setNotice({ kind: 'info', text: message });
  };

  // Tried once per death. If the server refuses it (a wrong phone clock), retrying would loop.
  const handleDeath = useCallback((ev) => {
    if (!pet || pet.endedAt != null) return;
    const key = `${pet.bornAt}:${Math.round(ev.deathAtMs)}`;
    if (deathTried.current === key) return;
    deathTried.current = key;
    savePetFields(uid, planDeathRecord(ev)).catch((e) => {
      console.error('Could not record Sprite death', e);
      setDeathFailedFor(pet.bornAt);
    });
  }, [pet, uid]);

  if (loading) {
    return <div className="text-center p-10 text-xs font-mono uppercase tracking-widest text-slate-500">Loading your Sprite...</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-5 text-center">
        <TriangleAlert className="w-8 h-8 text-red-400 mx-auto mb-2" />
        <p className="text-sm font-black text-red-300">Could not load your Sprite pet</p>
        <p className="text-xs text-red-300/70 mt-1">{error.code || error.message}</p>
        {error.code === 'permission-denied' && <p className="text-xs text-slate-400 mt-2">The Firestore rules for the pets collection may not be published yet.</p>}
      </div>
    );
  }

  return (
    <PetScreen
      pet={pet}
      now={now}
      spritesDatabase={spritesDatabase}
      collection={collection}
      busy={busy}
      notice={notice}
      reaction={reaction}
      reminders={reminders}
      tools={petToolsEnabledFor(uid) ? { onSkip: handleSkip, onTestReminder: handleTestReminder } : null}
      deathFailed={pet ? deathFailedFor === pet.bornAt : false}
      playBeep={playBeep}
      onOverlayChange={onOverlayChange}
      onToggleReminders={handleToggleReminders}
      onAction={handleAction}
      onAdopt={handleAdopt}
      onRelease={handleRelease}
      onDeath={handleDeath}
    />
  );
}

export function PetAttentionDot({ uid }) {
  const { pet } = usePet(uid);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const needsAttention = useMemo(() => {
    if (!pet || pet.endedAt != null) return false;
    const ev = evaluatePet(pet, now);
    return ev.alive && !ev.sleeping && (ev.sick || ev.critical || ev.urgent !== null);
  }, [pet, now]);

  if (!needsAttention) return null;
  return <div className="absolute top-1 right-[25%] sm:right-[35%] w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0e1017] animate-pulse"></div>;
}

// Renders nothing. Keeps the phone's scheduled reminders matching the pet's real state.
export function PetReminderSync({ uid, spritesDatabase, onOpenPet }) {
  const { pet, loading, error } = usePet(uid);
  const [resumeTick, setResumeTick] = useState(0);
  const openRef = useRef(onOpenPet);
  const spriteName = spriteNameOf(spritesDatabase, pet);

  useEffect(() => {
    openRef.current = onOpenPet;
  }, [onOpenPet]);

  useEffect(() => {
    if (loading || error) return;
    syncPetReminders(pet, spriteName);
  }, [pet, spriteName, loading, error, resumeTick]);

  // Logging out (or deleting the account) unmounts this, so clear the phone's pet reminders.
  useEffect(() => () => { syncPetReminders(null, null); }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return undefined;
    const handle = CapApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) setResumeTick((n) => n + 1);
    });
    return () => { handle.then((h) => h.remove()); };
  }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return undefined;
    const handle = LocalNotifications.addListener('localNotificationActionPerformed', (event) => {
      if (event?.notification?.extra?.route === 'pet' && openRef.current) openRef.current();
    });
    return () => { handle.then((h) => h.remove()); };
  }, []);

  return null;
}
