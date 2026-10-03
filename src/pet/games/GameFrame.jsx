import { X, Sparkles } from 'lucide-react';

export function GameFrame({ title, subtitle, onQuit, children }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-black uppercase italic tracking-tight text-pink-300">{title}</h3>
          <p className="text-[11px] text-slate-500">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onQuit}
          aria-label="Quit game"
          className="p-2 rounded-xl bg-slate-900 border-2 border-slate-700/60 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5 text-slate-300" />
        </button>
      </div>
      {children}
    </div>
  );
}

export function ResultPanel({ headline, detail, hours, onCollect }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-pink-400/50 bg-[#12141f] p-6 text-center animate-[pg-pop_0.3s_ease-out]">
      <div className="w-14 h-14 rounded-2xl bg-pink-500/15 border border-pink-400/50 flex items-center justify-center text-pink-300">
        <Sparkles className="w-7 h-7" />
      </div>
      <div>
        <h3 className="text-2xl font-black uppercase italic text-white">{headline}</h3>
        <p className="text-sm text-slate-400 mt-1">{detail}</p>
      </div>
      <p className="text-sm font-black uppercase tracking-widest text-pink-300">Happiness +{hours}h</p>
      <button
        type="button"
        onClick={onCollect}
        className="w-full py-3.5 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white text-sm font-black uppercase tracking-wider transition-colors"
      >
        Collect
      </button>
    </div>
  );
}
