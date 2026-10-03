import { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Gamepad2, Zap } from 'lucide-react';
import { PET_CONFIG } from '../petLogic';
import { GAME_STYLES, readLastGame, saveLastGame } from './gameKit';
import { difficultyTier, pickNextGame, qualityFromScore } from './gameLogic';
import { GameFrame, ResultPanel } from './GameFrame';
import WhichChest from './WhichChest';
import LeftOrRight from './LeftOrRight';
import MemoryMatch from './MemoryMatch';

const GAME_INFO = {
  chest: { title: 'Which Chest?', subtitle: 'Watch where it hides, then find it.' },
  leftright: { title: 'Left or Right', subtitle: 'Guess which way it will go.' },
  memory: { title: 'Memory Match', subtitle: 'Find every matching pair.' },
};

const hoursFor = (quality) => Math.round(((PET_CONFIG.refill.play * quality) / 3600000) * 10) / 10;
const headlineFor = (score) => (score >= 0.99 ? 'Perfect!' : score >= 0.6 ? 'Nice play!' : 'Good try!');

function Choose({ name, onGame, onQuick, onClose }) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border-2 border-pink-400/40 bg-[#12141f] p-5">
      <div>
        <h3 className="text-xl font-black uppercase italic text-pink-300">Play with {name}</h3>
        <p className="text-xs text-slate-500 mt-1">Playing costs a little energy.</p>
      </div>
      <button
        type="button"
        onClick={onGame}
        className="flex items-center gap-3 rounded-2xl border-2 border-pink-400/60 bg-pink-500/15 p-4 text-left hover:bg-pink-500/25 transition-colors active:scale-[0.98]"
      >
        <Gamepad2 className="w-8 h-8 text-pink-300 shrink-0" />
        <span>
          <span className="block text-sm font-black uppercase tracking-wider text-pink-100">Mini-game</span>
          <span className="block text-[11px] text-slate-400">A random game. Up to +{hoursFor(1)}h of happiness.</span>
        </span>
      </button>
      <button
        type="button"
        onClick={onQuick}
        className="flex items-center gap-3 rounded-2xl border-2 border-slate-600 bg-slate-900/60 p-4 text-left hover:bg-slate-800 transition-colors active:scale-[0.98]"
      >
        <Zap className="w-8 h-8 text-slate-300 shrink-0" />
        <span>
          <span className="block text-sm font-black uppercase tracking-wider text-slate-100">Quick play</span>
          <span className="block text-[11px] text-slate-400">Just a tap. +{hoursFor(PET_CONFIG.quickPlayQuality)}h of happiness.</span>
        </span>
      </button>
      <button type="button" onClick={onClose} className="self-center py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors">
        Cancel
      </button>
    </div>
  );
}

export default function PlayHub({ pet, sprite, image, spritesDatabase, collection, ageMs, beep, onQuick, onCollect, onClose }) {
  const [stage, setStage] = useState('choose');
  const [game, setGame] = useState(null);
  const [result, setResult] = useState(null);
  const [tier] = useState(() => difficultyTier(ageMs));
  const closeRef = useRef(onClose);
  const name = sprite?.name || 'your Sprite';

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  // The Android back button is routed here by App.jsx while this is open.
  useEffect(() => {
    const handleBack = () => closeRef.current();
    window.addEventListener('spritedex-pet-back', handleBack);
    return () => window.removeEventListener('spritedex-pet-back', handleBack);
  }, []);

  const start = () => {
    const next = pickNextGame(readLastGame());
    saveLastGame(next);
    setGame(next);
    setStage('game');
  };

  const finish = (score, detail) => {
    setResult({ score, detail });
    setStage('result');
  };

  let body;
  if (stage === 'choose') {
    body = <Choose name={name} onGame={start} onQuick={onQuick} onClose={onClose} />;
  } else if (stage === 'game') {
    const info = GAME_INFO[game];
    body = (
      <GameFrame title={info.title} subtitle={info.subtitle} onQuit={onClose}>
        {game === 'chest' && <WhichChest image={image} name={name} tier={tier} onDone={finish} beep={beep} />}
        {game === 'leftright' && <LeftOrRight image={image} name={name} onDone={finish} beep={beep} />}
        {game === 'memory' && <MemoryMatch spritesDatabase={spritesDatabase} collection={collection} pet={pet} tier={tier} onDone={finish} beep={beep} />}
      </GameFrame>
    );
  } else {
    const quality = qualityFromScore(result.score);
    body = <ResultPanel headline={headlineFor(result.score)} detail={result.detail} hours={hoursFor(quality)} onCollect={() => onCollect(quality)} />;
  }

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-[#0b0c10]/95 backdrop-blur-sm">
      <style>{GAME_STYLES}</style>
      <div className={`max-w-md mx-auto px-4 pb-10 ${Capacitor.getPlatform() === 'ios' ? 'pt-14' : 'pt-6'}`}>{body}</div>
    </div>
  );
}
