import { useEffect, useState } from 'react';
import { PawPrint, Trophy } from 'lucide-react';
import { usePetBadge } from './petData';
import { describeBadge } from './petBadge';
import { formatDuration, isPetEnabledFor } from './petLogic';

// Presentational: what the card looks like for a described badge (see describeBadge).
export function PetBadgeCardView({ info, sprite, image }) {
  const name = sprite?.name || 'Sprite';
  return (
    <div
      className="bg-black/30 border border-pink-500/25 rounded-2xl p-3 mb-5 flex items-center gap-3 shadow-sm"
      data-html2canvas-ignore="true"
    >
      <div className="w-14 h-14 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
        {image
          ? <img src={image} alt="" draggable={false} className={`w-full h-full object-contain ${info.alive ? '' : 'grayscale opacity-60'}`} />
          : <PawPrint className="w-6 h-6 text-slate-500" />}
      </div>

      <div className="min-w-0 flex-1">
        <span className="block text-[9px] font-black uppercase tracking-widest text-pink-300/80">Sprite Pet</span>
        <p className="text-sm font-black uppercase italic text-white truncate">{info.alive ? name : 'No pet right now'}</p>
        <p className="text-[11px] text-slate-400 truncate">
          {info.alive ? `Age ${formatDuration(info.currentMs)}` : `${name} lasted longest`}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <Trophy className="w-4 h-4 text-amber-400 ml-auto" />
        <span className="block text-[8px] font-black uppercase tracking-widest text-amber-300/80">Best life</span>
        <span className="block text-sm font-black text-amber-300 leading-tight">{formatDuration(info.bestMs)}</span>
        {info.bestIsCurrent && <span className="block text-[8px] font-black uppercase tracking-wider text-emerald-300">Still going</span>}
      </div>
    </div>
  );
}

// A player's Sprite Pet on their profile: sprite, age and best life. Vitals are never shown.
// Hidden for anyone who does not have the Pet feature yet, and when there is nothing to show.
export default function PetBadgeCard({ viewerUid, ownerUid, spritesDatabase }) {
  const enabled = isPetEnabledFor(viewerUid);
  const { badge } = usePetBadge(enabled ? ownerUid : null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const info = enabled ? describeBadge(badge, now) : null;
  if (!info) return null;

  const sprite = spritesDatabase?.find((s) => s.id === info.spriteId);
  const image = sprite?.images?.[info.variant] || sprite?.images?.base;
  return <PetBadgeCardView info={info} sprite={sprite} image={image} />;
}
