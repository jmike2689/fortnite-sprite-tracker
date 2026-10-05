import { useEffect, useId, useRef } from 'react';
import { PawPrint, TriangleAlert } from 'lucide-react';
import { NICKNAME_MAX, cleanNickname, limitNickname } from './petName';

// Where a Sprite gets its name: now or never. The Firestore rules refuse any later change or addition, so the
// warning is plain and the main button says exactly what will be saved. The name is private to its owner.
export default function AdoptDialog({ sprite, variantLabel, image, name, onNameChange, busy, onConfirm, onCancel, onOverlayChange }) {
  const titleId = useId();
  const inputId = useId();
  const warningId = useId();
  const formRef = useRef(null);
  const clean = cleanNickname(name);

  // Keyboard and screen reader focus moves into the dialog (onto the dialog itself, so no on-screen keyboard
  // pops up) and goes back to where it was when the dialog closes.
  useEffect(() => {
    const previous = document.activeElement;
    formRef.current?.focus();
    return () => { if (previous && previous.isConnected) previous.focus(); };
  }, []);

  // Tells App.jsx a full-screen layer is open, so the Android back button closes it first.
  useEffect(() => {
    if (!onOverlayChange) return undefined;
    onOverlayChange(true);
    return () => onOverlayChange(false);
  }, [onOverlayChange]);

  useEffect(() => {
    const close = () => onCancel();
    const onKey = (event) => { if (event.key === 'Escape') close(); };
    window.addEventListener('spritedex-pet-back', close);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('spritedex-pet-back', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [onCancel]);

  const submit = (event) => {
    event.preventDefault();
    if (!busy) onConfirm(clean);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onCancel}>
      <form
        ref={formRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl border-t-2 sm:border-2 border-pink-400/40 bg-[#12141f] p-5 shadow-2xl outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
            {image ? <img src={image} alt="" className="w-14 h-14 object-contain" /> : <PawPrint className="w-8 h-8 text-slate-600" />}
          </div>
          <div className="min-w-0">
            <h3 id={titleId} className="text-lg font-black uppercase italic leading-tight text-pink-300 line-clamp-2 break-words">Adopt {sprite?.name || 'this Sprite'}?</h3>
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">{variantLabel}</p>
          </div>
        </div>

        <label htmlFor={inputId} className="mt-4 mb-1.5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-300">
          <span>Name it (optional)</span>
          <span className="font-mono text-slate-500">{Array.from(name).length}/{NICKNAME_MAX}</span>
        </label>
        <input
          id={inputId}
          type="text"
          value={name}
          onChange={(event) => onNameChange(limitNickname(event.target.value))}
          placeholder="e.g. Biscuit"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="words"
          spellCheck={false}
          enterKeyHint="done"
          aria-describedby={warningId}
          className="w-full rounded-xl border-2 border-slate-700 bg-black/40 px-3 py-2.5 text-sm font-bold text-white placeholder:text-slate-600 outline-none focus:border-pink-400/70"
        />

        <div id={warningId} className="mt-3 flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-950/30 px-3 py-2.5 text-[11px] font-bold leading-snug text-amber-300">
          <TriangleAlert className="w-4 h-4 shrink-0 mt-px" />
          <span>A name is permanent. You can only choose it now. It can not be changed or added later.</span>
        </div>
        <p className="mt-2.5 text-[11px] leading-snug text-slate-500">
          Only you can see it. You can not swap this Sprite for another until it passes away or you release it.
        </p>

        <div className="mt-4 flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 rounded-2xl border-2 border-slate-700 bg-slate-900/60 text-xs font-black uppercase tracking-wider text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="flex-1 min-w-0 px-3 py-3 rounded-2xl bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider transition-colors"
          >
            <span className="block truncate">{clean ? `Adopt as "${clean}"` : 'Adopt without a name'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
