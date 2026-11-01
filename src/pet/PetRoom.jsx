import {
  PHASES, WALL, SKY, SUN, MOON, STARS, RARITY_RUG, FALLBACK_RUG, RARITY_AURA, FALLBACK_AURA, lampLit,
} from './roomLogic';
import { THEME_TINT, SPACE_STARS } from './petItems';

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

// What a room theme adds to the wall (and the floor). Each is a plain layer of shapes.
function ThemeDeco({ deco }) {
  switch (deco) {
    case 'hills':
      return (
        <>
          <div className="absolute -left-12 bottom-[22%] h-28 w-72 rounded-[50%] bg-emerald-500/45" />
          <div className="absolute -right-16 bottom-[20%] h-24 w-64 rounded-[50%] bg-emerald-600/45" />
          {[[12, 30], [34, 24], [60, 28], [82, 22]].map(([left, bottom]) => (
            <span key={left} className="absolute h-1.5 w-1.5 rounded-full bg-pink-200/90" style={{ left: `${left}%`, bottom: `${bottom}%` }} />
          ))}
        </>
      );
    case 'waves':
      return (
        <>
          <div className="absolute inset-x-0 bottom-[26%] h-8 bg-gradient-to-b from-cyan-400/60 to-cyan-600/40" />
          <div className="absolute inset-x-0 bottom-[26%] h-1 bg-white/40" />
          <div className="absolute inset-x-0 bottom-[30%] h-px bg-white/30" />
        </>
      );
    case 'stripes':
      return <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.13)_0_14px,transparent_14px_28px)]" />;
    case 'planks':
      return <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.28)_0_2px,transparent_2px_38px)]" />;
    case 'stars':
      return (
        <>
          {SPACE_STARS.map(([left, top, size, delay]) => (
            <span
              key={`${left}-${top}`}
              className="absolute rounded-full bg-white animate-[pettwinkle_3.2s_ease-in-out_infinite] motion-reduce:animate-none"
              style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${delay}s` }}
            />
          ))}
        </>
      );
    case 'grid':
      return (
        <>
          <div className="absolute inset-x-0 bottom-0 h-[28%] bg-[linear-gradient(rgba(217,70,239,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.45)_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-x-0 bottom-[27%] h-[3px] bg-fuchsia-400/80 shadow-[0_0_12px_3px_rgba(217,70,239,0.6)]" />
        </>
      );
    default:
      return null;
  }
}

// The backdrop of the Sprite's stage: wall, window, lamp, floor and rug. Purely decorative.
// `dim` is "lights out": the curtain closes, the lamp goes off and the room darkens.
// `theme` is a room theme from the shop; without one it is the Cozy Room, whose wall changes colour through the day.
// `compact` leaves out the window, lamp and rug, for the small previews in the shop.
export default function PetRoom({ phase, rarity, dim, theme = null, compact = false }) {
  return (
    <div aria-hidden="true" data-phase={phase} data-dim={dim ? 'true' : 'false'} data-theme={theme ? theme.id : 'cozy'} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950" />
      {theme ? (
        <>
          <div className={`absolute inset-0 bg-gradient-to-b ${theme.wall}`} />
          <ThemeDeco deco={theme.deco} />
          {PHASES.map((p) => (
            <div key={p} className={`absolute inset-0 ${THEME_TINT[p]} ${FADE} ${p === phase ? 'opacity-100' : 'opacity-0'}`} />
          ))}
        </>
      ) : (
        PHASES.map((p) => (
          <div key={p} className={`absolute inset-0 bg-gradient-to-b ${WALL[p]} ${FADE} ${p === phase ? 'opacity-100' : 'opacity-0'}`} />
        ))
      )}
      {!compact && <div className={`absolute left-1/2 top-[14%] h-48 w-48 -translate-x-1/2 rounded-full ${RARITY_AURA[rarity] || FALLBACK_AURA}`} />}
      {!compact && <Window phase={phase} dim={dim} />}
      {!compact && <Lamp lit={lampLit(phase, dim)} />}
      <div className={`absolute inset-x-0 bottom-0 h-[28%] border-t-4 border-white/[0.07] bg-gradient-to-b ${theme ? theme.floor : 'from-black/30 to-black/55'}`} />
      <div className="absolute inset-x-0 bottom-0 h-[28%] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.035)_0_2px,transparent_2px_44px)]" />
      {!compact && <div className={`absolute bottom-[18px] left-1/2 h-9 w-56 -translate-x-1/2 rounded-[50%] border ${RARITY_RUG[rarity] || FALLBACK_RUG}`} />}
      <div className={`absolute inset-0 bg-slate-950/55 transition-opacity duration-[1500ms] motion-reduce:transition-none ${dim ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
}
