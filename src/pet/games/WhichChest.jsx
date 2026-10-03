import { useEffect, useRef, useState } from 'react';
import { PawPrint } from 'lucide-react';
import { CHEST, makeChestRound, slotsAfter } from './gameLogic';
import { tap } from './gameKit';

function Chest({ open, showPet, image, name, ring, disabled, label, onClick }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} className="relative block w-full h-36 disabled:cursor-default">
      {showPet && (
        image
          ? <img src={image} alt={name} draggable={false} className="absolute left-1/2 -translate-x-1/2 bottom-10 w-16 h-16 object-contain select-none animate-[pg-pop_0.3s_ease-out]" />
          : <PawPrint className="absolute left-1/2 -translate-x-1/2 bottom-10 w-12 h-12 text-slate-300" />
      )}
      <div className={`absolute inset-x-1 bottom-0 h-16 rounded-b-xl border-2 bg-gradient-to-b from-amber-700 to-amber-900 ${ring}`}>
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-3 bg-yellow-400/80" />
        <div className="absolute left-1/2 -translate-x-1/2 top-2 w-5 h-5 rounded border border-yellow-600 bg-yellow-300" />
      </div>
      <div className={`absolute inset-x-1 bottom-14 h-9 rounded-t-3xl border-2 border-amber-950 bg-gradient-to-b from-amber-500 to-amber-700 origin-bottom-left transition-transform duration-300 ${open ? '-rotate-[38deg] -translate-y-1' : ''}`}>
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-3 bg-yellow-400/80" />
      </div>
    </button>
  );
}

const RING_IDLE = 'border-amber-950';
const RING_FOUND = 'border-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.7)]';
const RING_WRONG = 'border-red-500 shadow-[0_0_16px_rgba(239,68,68,0.6)]';

export default function WhichChest({ image, name, tier, onDone, rng = Math.random, timeScale = 1, beep }) {
  const [plans] = useState(() => Array.from({ length: CHEST.rounds }, () => makeChestRound(tier, rng)));
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState('show');
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(null);
  const [wins, setWins] = useState(0);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  const plan = plans[round];
  const stepMs = CHEST.stepMs[tier];
  const slideMs = Math.round(stepMs * 0.85 * timeScale);
  const slots = slotsAfter(plan.swaps, step);
  const before = slotsAfter(plan.swaps, Math.max(0, step - 1));
  const shuffling = phase === 'shuffle' && step > 0;

  useEffect(() => {
    const wait = (ms) => Math.max(0, ms * timeScale);
    let timer;
    if (phase === 'show') {
      timer = setTimeout(() => setPhase('hide'), wait(1100));
    } else if (phase === 'hide') {
      timer = setTimeout(() => setPhase('shuffle'), wait(450));
    } else if (phase === 'shuffle') {
      const finished = step >= plan.swaps.length;
      // After the last swap, give the slide extra time to finish before asking for a pick.
      timer = setTimeout(() => (finished ? setPhase('pick') : setStep((s) => s + 1)), wait(step === 0 ? 300 : stepMs + (finished ? 250 : 0)));
    } else if (phase === 'reveal') {
      timer = setTimeout(() => {
        if (round + 1 < CHEST.rounds) {
          setRound(round + 1);
          setPicked(null);
          setStep(0);
          setPhase('show');
        } else {
          doneRef.current(wins / CHEST.rounds, `Found ${name} ${wins} of ${CHEST.rounds} times.`);
        }
      }, wait(1200));
    }
    return () => clearTimeout(timer);
  }, [phase, step, round, wins, plan, stepMs, timeScale, name]);

  const pick = (id) => {
    if (phase !== 'pick') return;
    tap();
    const won = id === plan.target;
    if (beep) beep(won ? [880, 'triangle', 0.15] : [196, 'sawtooth', 0.15]);
    setPicked(id);
    if (won) setWins((w) => w + 1);
    setPhase('reveal');
  };

  const found = picked === plan.target;
  const headline = {
    show: `Watch where ${name} hides!`,
    hide: 'Here it goes...',
    shuffle: 'Keep your eyes on it!',
    pick: `Tap the chest hiding ${name}.`,
    reveal: found ? 'Found it!' : 'Not that one!',
  }[phase];
  const tone = phase === 'reveal' ? (found ? 'text-emerald-300' : 'text-red-300') : 'text-slate-300';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
        <span className="text-slate-400">Round {round + 1} of {CHEST.rounds}</span>
        <span className="text-emerald-300">Found {wins}</span>
      </div>

      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-b from-slate-800/60 to-slate-950 px-2 pt-8 pb-4">
        <div className="relative h-36">
          {[0, 1, 2].map((id) => {
            const slot = slots.indexOf(id);
            const from = before.indexOf(id);
            const lift = shuffling ? (from < slot ? 'up' : from > slot ? 'down' : null) : null;
            const revealed = phase === 'reveal';
            const isTarget = id === plan.target;
            const open = (phase === 'show' && isTarget) || (revealed && (isTarget || id === picked));
            let ring = RING_IDLE;
            if (revealed && isTarget) ring = RING_FOUND;
            else if (revealed && id === picked) ring = RING_WRONG;
            return (
              <div
                key={id}
                className="absolute top-0 px-1.5 transition-[left] ease-in-out"
                style={{ left: `${slot * 33.3333}%`, width: '33.3333%', transitionDuration: `${slideMs}ms` }}
              >
                <div key={`${id}-${step}`} style={lift ? { animation: `pg-${lift} ${slideMs}ms ease-in-out` } : undefined}>
                  <Chest
                    open={open}
                    showPet={(phase === 'show' || revealed) && isTarget}
                    image={image}
                    name={name}
                    ring={ring}
                    disabled={phase !== 'pick'}
                    label={`Chest ${slot + 1}`}
                    onClick={() => pick(id)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className={`text-center text-sm font-black uppercase tracking-widest min-h-[20px] ${tone}`}>{headline}</p>
    </div>
  );
}
