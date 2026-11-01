import { PawPrint } from 'lucide-react';
import PetRoom from './PetRoom';
import { AccessoryPreview } from './PetAccessory';
import { PET_ACCESSORIES, PET_ROOMS } from './petItems';
import { PET_STYLES } from './petMoods';

// The Sprite Pet Closet in the Black Market: accessories and room themes, bought once and kept for every Sprite.
// `onBuy(item)` and `onEquip(kind, id)` are App.jsx's, which spend the fragments and save to the player's document.
function ItemCard({ item, owned, equipped, fragments, onBuy, onEquip }) {
  const button = owned
    ? (equipped ? 'EQUIPPED ✓' : 'EQUIP')
    : `${item.price.toLocaleString()} Fragments`;
  const style = owned
    ? (equipped ? 'bg-emerald-950/30 text-emerald-500 border border-emerald-500/50 cursor-default' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_10px_rgba(79,70,229,0.3)]')
    : (fragments < item.price ? 'bg-black/40 border border-slate-800 text-slate-600' : 'bg-black/40 border border-slate-700 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 hover:bg-cyan-950/30');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-black/40 p-2.5">
        {item.kind === 'room' ? (
          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-white/10">
            <PetRoom phase="day" theme={item} compact />
          </div>
        ) : (
          <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-950">
            <AccessoryPreview item={item} />
          </div>
        )}
        <div className="min-w-0">
          <span className="block text-sm font-black text-white uppercase italic leading-tight">{item.name}</span>
          <span className="block text-[10px] text-slate-400 mt-0.5">{item.blurb}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => (owned ? (!equipped && onEquip(item.kind, item.id)) : onBuy(item))}
        className={`w-full py-2.5 rounded-lg text-xs font-black tracking-wider transition-all duration-300 ${style}`}
      >
        {button}
      </button>
    </div>
  );
}

export default function PetClosetShop({ fragments, petItems, petLook, onBuy, onEquip }) {
  const owned = Array.isArray(petItems) ? petItems : [];
  return (
    <section>
      <style>{PET_STYLES}</style>
      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><PawPrint className="w-4 h-4" /> Sprite Pet Closet</h4>
      <div className="flex flex-col gap-4">
        {[['Accessories', PET_ACCESSORIES, 'accessory'], ['Room Themes', PET_ROOMS, 'room']].map(([title, items, kind]) => (
          <div key={kind} className="rounded-xl p-3 bg-slate-900/50 border border-slate-800">
            <span className="block text-[10px] font-black uppercase tracking-widest mb-3 border-b pb-2 text-pink-300 border-slate-800">{title}</span>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  owned={owned.includes(item.id)}
                  equipped={petLook?.[kind] === item.id}
                  fragments={fragments}
                  onBuy={onBuy}
                  onEquip={onEquip}
                />
              ))}
            </div>
          </div>
        ))}
        <p className="text-[10px] text-slate-500 leading-relaxed">Bought once, kept for every Sprite. Change them any time from the Wardrobe button on your Sprite Pet.</p>
      </div>
    </section>
  );
}
