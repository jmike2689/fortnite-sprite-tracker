import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, PawPrint, X } from 'lucide-react';
import { LEFT_RIGHT_ROUNDS, makeLeftRightAnswers } from './gameLogic';
import { tap } from './gameKit';

export default function LeftOrRight({ image, name, onDone, rng = Math.random, timeScale = 1, beep }) {
  const [answers] = useState(() => makeLeftRightAnswers(rng));
  const [round, setRound] = useState(0);
  const [guess, setGuess] = useState(null);
  const [wins, setWins] = useState(0);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  const answer = answers[round];
  const revealed = guess !== null;
  const correct = revealed && guess === answer;

  useEffect(() => {
    if (!revealed) return undefined;
    const timer = setTimeout(() => {
      if (round + 1 < LEFT_RIGHT_ROUNDS) {
        setRound(round + 1);
        setGuess(null);
      } else {
        doneRef.current(wins / LEFT_RIGHT_ROUNDS, `You guessed ${wins} of ${LEFT_RIGHT_ROUNDS}.`);
      }
    }, 1200 * timeScale);
    return () => clearTimeout(timer);
  }, [revealed, round, wins, timeScale]);

  const choose = (side) => {
    if (revealed) return;
    tap();
    const won = side === answer;
    if (beep) beep(won ? [880, 'triangle', 0.15] : [196, 'sawtooth', 0.15]);
    setGuess(side);
    if (won) setWins((w) => w + 1);
  };

  const shift = revealed ? (answer === 'L' ? -84 : 84) : 0;
  const flip = revealed && answer === 'L' ? -1 : 1;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
        <span className="text-slate-400">Round {round + 1} of {LEFT_RIGHT_ROUNDS}</span>
        <span className="text-emerald-300">Right {wins}</span>
      </div>

      <div className="relative h-52 rounded-3xl border-2 border-white/10 bg-gradient-to-b from-slate-800/60 to-slate-950 overflow-hidden">
        <ArrowLeft className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-600" />
        <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-600" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-4 rounded-[50%] bg-black/50 blur-md" />
        <div
          className="absolute left-1/2 bottom-8 -ml-[52px] w-[104px] h-[104px] transition-transform duration-500 ease-out"
          style={{ transform: `translateX(${shift}px)` }}
        >
          <div
            className={revealed ? '' : 'animate-[pg-bob_1.4s_ease-in-out_infinite]'}
            style={{ transform: `scaleX(${flip})` }}
          >
            {image
              ? <img src={image} alt={name} draggable={false} className="w-[104px] h-[104px] object-contain select-none drop-shadow-[0_8px_14px_rgba(0,0,0,0.55)]" />
              : <PawPrint className="w-20 h-20 text-slate-400" />}
          </div>
        </div>
        {revealed && (
          <div
            key={round}
            className={`absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider animate-[pg-pop_0.25s_ease-out] ${correct ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-200' : 'bg-red-500/20 border border-red-400 text-red-200'}`}
          >
            {correct ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            {correct ? 'Right!' : 'Nope!'}
          </div>
        )}
      </div>

      <p className="text-center text-sm font-black uppercase tracking-widest text-slate-300 min-h-[20px]">
        {revealed ? `${name} went ${answer === 'L' ? 'left' : 'right'}.` : `Which way will ${name} go?`}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={revealed}
          onClick={() => choose('L')}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-cyan-400/60 bg-cyan-500/15 text-cyan-100 text-sm font-black uppercase tracking-wider hover:bg-cyan-500/25 disabled:opacity-40 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" /> Left
        </button>
        <button
          type="button"
          disabled={revealed}
          onClick={() => choose('R')}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-pink-400/60 bg-pink-500/15 text-pink-100 text-sm font-black uppercase tracking-wider hover:bg-pink-500/25 disabled:opacity-40 active:scale-95 transition-all"
        >
          Right <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
