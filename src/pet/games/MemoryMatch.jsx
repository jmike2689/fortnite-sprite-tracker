import { useEffect, useRef, useState } from 'react';
import { PawPrint } from 'lucide-react';
import { MEMORY_PAIRS, buildMemoryDeck, memoryScore } from './gameLogic';
import { tap } from './gameKit';

export default function MemoryMatch({ spritesDatabase, collection, pet, tier, onDone, rng = Math.random, timeScale = 1, beep }) {
  const [deck] = useState(() => buildMemoryDeck({ spritesDatabase, collection, pet, pairs: MEMORY_PAIRS[tier], rng }));
  const pairs = deck.length / 2;
  const [faceUp, setFaceUp] = useState([]);
  const [matched, setMatched] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [locked, setLocked] = useState(false);
  const timers = useRef([]);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms * timeScale));
  };

  const flip = (index) => {
    if (locked || faceUp.includes(index) || matched.includes(deck[index].key)) return;
    tap();
    if (beep) beep([660, 'sine', 0.05]);
    const next = [...faceUp, index];
    setFaceUp(next);
    if (next.length < 2) return;

    setLocked(true);
    const [a, b] = next;
    if (deck[a].key === deck[b].key) {
      later(() => {
        const nowMatched = [...matched, deck[a].key];
        setMatched(nowMatched);
        setFaceUp([]);
        setLocked(false);
        if (beep) beep([880, 'triangle', 0.12]);
        if (nowMatched.length === pairs) {
          later(() => doneRef.current(memoryScore(mistakes, pairs), mistakes === 0 ? 'Not a single mistake.' : `${mistakes} ${mistakes === 1 ? 'mistake' : 'mistakes'}.`), 600);
        }
      }, 450);
    } else {
      setMistakes((m) => m + 1);
      later(() => {
        setFaceUp([]);
        setLocked(false);
      }, 800);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
        <span className="text-emerald-300">Pairs {matched.length} of {pairs}</span>
        <span className="text-slate-400">Mistakes {mistakes}</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {deck.map((card, index) => {
          const isMatched = matched.includes(card.key);
          const shown = isMatched || faceUp.includes(index);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => flip(index)}
              aria-label={shown ? card.name : 'Hidden card'}
              className="relative aspect-[3/4] w-full"
              style={{ perspective: 600 }}
            >
              <div
                className="absolute inset-0 transition-transform duration-300"
                style={{ transformStyle: 'preserve-3d', transform: shown ? 'rotateY(180deg)' : 'none' }}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-xl border-2 border-pink-400/60 bg-gradient-to-br from-pink-700 to-indigo-800"
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                  <PawPrint className="w-6 h-6 text-pink-200/80" />
                </div>
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-xl border-2 bg-slate-900 p-1 ${isMatched ? 'border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]' : 'border-slate-600'}`}
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <img src={card.image} alt="" draggable={false} className="w-full h-full object-contain select-none" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
