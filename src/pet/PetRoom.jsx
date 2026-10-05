import {
  PHASES, WALL, SKY, SUN, MOON, STARS, RARITY_RUG, FALLBACK_RUG, RARITY_AURA, FALLBACK_AURA, lampLit,
} from './roomLogic';

// What changes with the hour fades over a couple of seconds, and not at all with "reduce motion" on.
const FADE = 'transition-opacity duration-[2500ms] motion-reduce:transition-none';
const SLIDE = 'transition-transform duration-[2500ms] motion-reduce:transition-none';

function Window({ phase, dim }) {
  const [sunX, sunY] = SUN[phase];
  const [moonX, moonY] = MOON[phase];
  return (
    <div className="absolute left-4 top-4 h-[72px] w-14 overflow-hidden rounded-t-full border-[3px] border-slate-300/35 bg-slate-950 shadow-[0_0_18px_rgba(0,0,0,0.35)]">
      {PHASES.map((p) => (
        <div key={p} className={`absolute inset-0 bg-gradient-to-b ${SKY[p]} ${FADE} ${p === phase ? 'opacity-100' : 'opacity-0'}`} />
      ))}
      {STARS.map(([left, top, delay]) => (
        <span
          key={`${left}-${top}`}
          className={`absolute h-[2px] w-[2px] rounded-full bg-white ${FADE} ${phase === 'night' ? 'opacity-100 animate-[pettwinkle_3.2s_ease-in-out_infinite] motion-reduce:animate-none' : 'opacity-0'}`}
          style={{ left, top, animationDelay: `${delay}s` }}
        />
      ))}
      <span
        className={`absolute left-0 top-0 h-5 w-5 rounded-full bg-yellow-200 shadow-[0_0_12px_5px_rgba(253,224,71,0.55)] ${SLIDE}`}
        style={{ transform: `translate(${sunX}px, ${sunY}px)` }}
      />
      <span
        className={`absolute left-0 top-0 h-4 w-4 rounded-full shadow-[-4px_3px_0_0_#fde68a] ${SLIDE}`}
        style={{ transform: `translate(${moonX}px, ${moonY}px)` }}
      />
      <span className="absolute inset-x-0 top-1/2 h-[2px] bg-slate-950/55" />
      <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-slate-950/55" />
      <div className={`absolute inset-0 bg-indigo-950/90 transition-opacity duration-[1500ms] motion-reduce:transition-none ${dim ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
}

function Lamp({ lit }) {
  return (
    <div className="absolute bottom-14 right-4 w-10">
      <div className={`absolute -left-14 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(253,224,71,0.22),transparent_65%)] ${FADE} ${lit ? 'opacity-100' : 'opacity-0'}`} />
      <div className="relative mx-auto h-5 w-9 rounded-b-sm rounded-t-xl bg-amber-100/30">
        <div className={`absolute inset-0 rounded-b-sm rounded-t-xl bg-amber-200 shadow-[0_0_22px_8px_rgba(251,191,36,0.5)] ${FADE} ${lit ? 'opacity-100' : 'opacity-0'}`} />
      </div>
      <div className="mx-auto h-9 w-[3px] bg-slate-400/45" />
      <div className="mx-auto h-1.5 w-8 rounded-[50%] bg-slate-500/40" />
    </div>
  );
}

// The backdrop of the Sprite's stage: wall, window, lamp, floor and rug. Purely decorative.
// `dim` is "lights out": the curtain closes, the lamp goes off and the room darkens.
export default function PetRoom({ phase, rarity, dim }) {
  return (
    <div aria-hidden="true" data-phase={phase} data-dim={dim ? 'true' : 'false'} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950" />
      {PHASES.map((p) => (
        <div key={p} className={`absolute inset-0 bg-gradient-to-b ${WALL[p]} ${FADE} ${p === phase ? 'opacity-100' : 'opacity-0'}`} />
      ))}
      <div className={`absolute left-1/2 top-[14%] h-48 w-48 -translate-x-1/2 rounded-full ${RARITY_AURA[rarity] || FALLBACK_AURA}`} />
      <Window phase={phase} dim={dim} />
      <Lamp lit={lampLit(phase, dim)} />
      <div className="absolute inset-x-0 bottom-0 h-[28%] border-t-4 border-white/[0.07] bg-gradient-to-b from-black/30 to-black/55" />
      <div className="absolute inset-x-0 bottom-0 h-[28%] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.035)_0_2px,transparent_2px_44px)]" />
      <div className={`absolute bottom-[18px] left-1/2 h-9 w-56 -translate-x-1/2 rounded-[50%] border ${RARITY_RUG[rarity] || FALLBACK_RUG}`} />
      <div className={`absolute inset-0 bg-slate-950/55 transition-opacity duration-[1500ms] motion-reduce:transition-none ${dim ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
}
