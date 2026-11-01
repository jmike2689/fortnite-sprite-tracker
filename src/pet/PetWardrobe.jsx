import { PET_ACCESSORIES, PET_ROOMS } from './petItems';

const CHIP = 'px-2.5 py-1.5 text-[10px] font-bold rounded-lg border transition-colors';
const CHIP_ON = 'bg-pink-600 text-white border-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.4)]';
const CHIP_OFF = 'bg-black text-slate-400 border-slate-700 hover:border-slate-500';

function Row({ title, noneLabel, items, owned, current, onPick }) {
  const mine = items.filter((item) => owned.includes(item.id));
  return (
    <div>
      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{title}</span>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onPick(null)} className={`${CHIP} ${current ? CHIP_OFF : CHIP_ON}`}>{noneLabel}</button>
        {mine.map((item) => (
          <button key={item.id} type="button" onClick={() => onPick(item.id)} className={`${CHIP} ${current === item.id ? CHIP_ON : CHIP_OFF}`}>
            {item.name}
          </button>
        ))}
      </div>
      {mine.length === 0 && <p className="text-[11px] text-slate-500 mt-1.5">None yet. Find them in the Black Market, under Sprite Pet Closet.</p>}
    </div>
  );
}

// Choose what your Sprite wears and which room it lives in, from the things you have bought.
export default function PetWardrobe({ petItems, equippedAccessory, equippedRoom, onEquip }) {
  const owned = Array.isArray(petItems) ? petItems : [];
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 flex flex-col gap-3.5">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Wardrobe</h3>
      <Row title="Accessory" noneLabel="None" items={PET_ACCESSORIES} owned={owned} current={equippedAccessory?.id || null} onPick={(id) => onEquip('accessory', id)} />
      <Row title="Room" noneLabel="Cozy Room" items={PET_ROOMS} owned={owned} current={equippedRoom?.id || null} onPick={(id) => onEquip('room', id)} />
    </div>
  );
}
