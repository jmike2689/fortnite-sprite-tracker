import { useCallback, useEffect, useRef, useState } from 'react';
import { PawPrint, Heart, Ghost } from 'lucide-react';
import { MOOD_META, REACTION_ICON, REACTION_COLOR } from './petMoods';
import {
  MOVES, ACTION_MOVE, TAP_MOVE, TAP_HEARTS, TIMING, SPEECH, between,
  canWander, canIdle, nextWander, nextIdleMove, pickSpeech,
} from './petLife';

const RARITY_SCENE = {
  Mythic: 'from-yellow-500/40 via-amber-700/30 to-slate-950',
  Legendary: 'from-orange-500/40 via-orange-800/30 to-slate-950',
  Epic: 'from-purple-500/40 via-purple-800/30 to-slate-950',
  Rare: 'from-blue-500/40 via-blue-800/30 to-slate-950',
};
const FALLBACK_SCENE = 'from-slate-600/40 via-slate-800/30 to-slate-950';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
function useReducedMotion() {
  const [reduce, setReduce] = useState(() => typeof window !== 'undefined' && Boolean(window.matchMedia?.(REDUCED_MOTION).matches));
  useEffect(() => {
    const query = window.matchMedia?.(REDUCED_MOTION);
    if (!query) return undefined;
    const onChange = (event) => setReduce(event.matches);
    query.addEventListener?.('change', onChange);
    return () => query.removeEventListener?.('change', onChange);
  }, []);
  return reduce;
}

// The Sprite on its little stage. When `interactive` it wanders, does small idle moves, chats now and then,
// reacts to care actions and can be tapped. All of that is for show: nothing here changes a stat.
export default function PetStage({ sprite, image, moodKey, reaction, interactive = false, onTap }) {
  const mood = MOOD_META[moodKey] || MOOD_META.ok;
  const Bubble = mood.bubble;
  const Reaction = reaction ? REACTION_ICON[reaction.type] : null;
  const scene = RARITY_SCENE[sprite?.rarity] || FALLBACK_SCENE;
  const reduceMotion = useReducedMotion();

  const moverRef = useRef(null);
  const xRef = useRef(0);
  const lastSpeech = useRef(null);
  const lastMove = useRef(null);
  const lastTap = useRef(-Infinity);
  const speechTimer = useRef(null);
  const counter = useRef(0);
  const [stance, setStance] = useState({ x: 0, left: false, mood: null });
  const [speech, setSpeech] = useState(null);
  const [burst, setBurst] = useState(null);

  const playMove = useCallback((name) => {
    const el = moverRef.current;
    const move = MOVES[name];
    if (reduceMotion || !el || !move || typeof el.animate !== 'function') return;
    el.animate(move.frames, { duration: move.duration, easing: move.easing });
  }, [reduceMotion]);

  const say = useCallback((text, forMood) => {
    clearTimeout(speechTimer.current);
    counter.current += 1;
    setSpeech({ id: counter.current, text, mood: forMood });
    speechTimer.current = setTimeout(() => setSpeech(null), TIMING.chatterShows);
  }, []);
  useEffect(() => () => clearTimeout(speechTimer.current), []);

  // Strolls left and right while it is feeling well enough to.
  const wanders = interactive && !reduceMotion && canWander(moodKey);
  useEffect(() => {
    if (!wanders) return undefined;
    xRef.current = 0;
    let timer;
    const step = () => {
      if (document.hidden) { timer = setTimeout(step, 4000); return; }
      const next = nextWander({ mood: moodKey, x: xRef.current });
      xRef.current = next.x;
      setStance({ x: next.x, left: next.left, mood: moodKey });
      timer = setTimeout(step, next.afterMs);
    };
    timer = setTimeout(step, between(TIMING.wanderFirst));
    return () => clearTimeout(timer);
  }, [wanders, moodKey]);

  // A little move every so often: a hop, a tilt, a yawn...
  const moves = interactive && !reduceMotion && canIdle(moodKey);
  useEffect(() => {
    if (!moves) return undefined;
    let timer;
    const run = () => {
      if (!document.hidden) {
        const next = nextIdleMove({ mood: moodKey, last: lastMove.current });
        if (next) {
          lastMove.current = next.move;
          playMove(next.move);
          timer = setTimeout(run, next.afterMs);
          return;
        }
      }
      timer = setTimeout(run, 5000);
    };
    timer = setTimeout(run, between(TIMING.moveFirst));
    return () => clearTimeout(timer);
  }, [moves, moodKey, playMove]);

  // Says something now and then.
  const chats = interactive && Boolean(SPEECH.idle[moodKey]);
  useEffect(() => {
    if (!chats) return undefined;
    let timer;
    const talk = () => {
      if (!document.hidden) {
        const line = pickSpeech('idle', moodKey, Math.random, lastSpeech.current);
        if (line) { lastSpeech.current = line; say(line, moodKey); }
      }
      timer = setTimeout(talk, between(TIMING.chatter));
    };
    timer = setTimeout(talk, between(TIMING.chatterFirst));
    return () => clearTimeout(timer);
  }, [chats, moodKey, say]);

  // Each care action gets its own bit of body language.
  const reactionId = reaction?.id;
  const reactionType = reaction?.type;
  useEffect(() => {
    if (reactionType && ACTION_MOVE[reactionType]) playMove(ACTION_MOVE[reactionType]);
  }, [reactionId, reactionType, playMove]);

  const handleTap = () => {
    if (!interactive) return;
    const now = performance.now();
    if (now - lastTap.current < TIMING.tapGap) return;
    lastTap.current = now;
    playMove(TAP_MOVE[moodKey] ?? 'hop');
    const line = pickSpeech('tap', moodKey, Math.random, lastSpeech.current);
    if (line) { lastSpeech.current = line; say(line, moodKey); }
    const hearts = TAP_HEARTS[moodKey] ?? 0;
    counter.current += 1;
    setBurst(hearts > 0 ? { id: counter.current, count: hearts } : null);
    if (onTap) onTap(moodKey);
  };

  const here = wanders && stance.mood === moodKey;
  const x = here ? stance.x : 0;
  const facingLeft = here && stance.left;
  const visibleSpeech = speech && speech.mood === moodKey ? speech : null;
  const glide = reduceMotion ? 'none' : `transform ${TIMING.wanderGlide}ms ease-in-out`;

  const figure = image ? (
    <img
      src={image}
      alt={sprite?.name || 'Sprite'}
      draggable={false}
      className={`block w-44 h-44 object-contain select-none drop-shadow-[0_10px_18px_rgba(0,0,0,0.55)] ${mood.anim} ${mood.tone}`}
    />
  ) : (
    <PawPrint className="w-24 h-24 text-slate-500 mb-6" />
  );

  return (
    <div className={`relative rounded-3xl border-2 border-white/10 overflow-hidden bg-gradient-to-b ${scene}`}>
      <div className="relative flex items-end justify-center h-64 pb-10">
        <div
          className="absolute bottom-8 w-40 h-5 rounded-[50%] bg-black/50 blur-md"
          style={{ transform: `translateX(${x}px)`, transition: glide }}
        />

        <div className="relative z-10" style={{ transform: `translateX(${x}px)`, transition: glide }}>
          <div style={{ transform: facingLeft ? 'scaleX(-1)' : 'none' }}>
            <div ref={moverRef}>
              {interactive && image ? (
                <button
                  type="button"
                  onClick={handleTap}
                  aria-label={`Tap ${sprite?.name || 'your Sprite'}`}
                  className="block touch-manipulation cursor-pointer rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-pink-300/70"
                >
                  {figure}
                </button>
              ) : figure}
            </div>
          </div>
        </div>

        {Bubble && (
          <div key={moodKey} className="absolute top-5 right-[22%] z-20 flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-slate-900 shadow-lg animate-[petpop_0.3s_ease-out]">
            <Bubble className="w-5 h-5" />
            <span className="absolute -bottom-1 left-2 w-3 h-3 bg-white rotate-45" />
          </div>
        )}
        {visibleSpeech && (
          <div
            key={visibleSpeech.id}
            aria-hidden="true"
            className="absolute top-3 left-3 z-30 max-w-[58%] origin-bottom-right rounded-2xl bg-white px-3 py-2 text-[11px] font-bold leading-snug text-slate-900 shadow-lg animate-[petpop_0.25s_ease-out] motion-reduce:animate-none"
          >
            {visibleSpeech.text}
            <span className="absolute -bottom-1 right-6 w-3 h-3 bg-white rotate-45" />
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
            className="absolute z-20 w-4 h-4 text-pink-400 fill-pink-400 opacity-0 animate-[petheart_2.8s_ease-out_infinite] motion-reduce:animate-none pointer-events-none"
            style={{ left: `${38 + i * 12}%`, bottom: '55%', animationDelay: `${i * 0.9}s` }}
          />
        ))}
        {moodKey === 'dead' && (
          <Ghost className="absolute top-8 right-[30%] z-20 w-9 h-9 text-slate-300 animate-[petghost_3s_ease-in-out_infinite] motion-reduce:animate-none" />
        )}
        {burst && Array.from({ length: burst.count }, (_, i) => (
          <Heart
            key={`${burst.id}-${i}`}
            className="absolute z-30 w-5 h-5 text-pink-400 fill-pink-400 opacity-0 animate-[petheart_1.1s_ease-out_forwards] motion-reduce:animate-none pointer-events-none"
            style={{ left: `${42 + i * 8}%`, bottom: '56%', animationDelay: `${i * 0.12}s` }}
          />
        ))}
        {reaction?.type === 'bathe' && Array.from({ length: 7 }, (_, i) => (
          <span
            key={`${reaction.id}-bubble-${i}`}
            className="absolute z-20 rounded-full border border-white/80 bg-white/25 opacity-0 animate-[petbubble_1.1s_ease-out_forwards] motion-reduce:animate-none pointer-events-none"
            style={{ width: 8 + (i % 3) * 5, height: 8 + (i % 3) * 5, left: `${32 + i * 6}%`, bottom: `${26 + (i % 3) * 9}%`, animationDelay: `${i * 0.08}s` }}
          />
        ))}
        {reaction?.type === 'medicine' && (
          <span
            key={`${reaction.id}-glow`}
            className="absolute inset-x-0 bottom-[18%] mx-auto w-52 h-52 rounded-full bg-lime-300/40 blur-2xl opacity-0 animate-[petglow_1.1s_ease-out_forwards] motion-reduce:animate-none pointer-events-none"
          />
        )}
        {Reaction && (
          <Reaction
            key={reaction.id}
            className={`absolute z-30 w-8 h-8 opacity-0 animate-[petheart_1.1s_ease-out_forwards] pointer-events-none ${REACTION_COLOR[reaction.type]}`}
            style={{ left: '48%', bottom: '58%' }}
          />
        )}
      </div>
    </div>
  );
}
