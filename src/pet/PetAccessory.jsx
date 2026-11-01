import { useEffect, useState } from 'react';

// The accessory a Sprite wears, drawn over its picture. For show only.
//
// Sprites are all shaped differently, so a hat can't sit at one fixed spot. When the picture loads, its transparent
// edges are measured once (the top of the head, where the middle of it is, and how wide the Sprite is) and the hat is
// placed from that. If the picture can't be measured the hat goes where most heads are.

const MEASURE = 96;
const FALLBACK = { cx: 0.5, top: 0.12, width: 0.6 };
const cache = new Map();

function measure(src) {
  return new Promise((resolve) => {
    const done = (value) => { cache.set(src, value); resolve(value); };
    try {
      const img = new Image();
      img.onerror = () => done(FALLBACK);
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = MEASURE;
          canvas.height = MEASURE;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          // The same fit as the picture on the stage (object-contain in a square), so the numbers are fractions of that square.
          const scale = Math.min(MEASURE / img.naturalWidth, MEASURE / img.naturalHeight);
          const w = img.naturalWidth * scale;
          const h = img.naturalHeight * scale;
          ctx.drawImage(img, (MEASURE - w) / 2, (MEASURE - h) / 2, w, h);
          const { data } = ctx.getImageData(0, 0, MEASURE, MEASURE);
          let minX = MEASURE; let maxX = -1; let minY = MEASURE; let maxY = -1;
          for (let y = 0; y < MEASURE; y += 1) {
            for (let x = 0; x < MEASURE; x += 1) {
              if (data[(y * MEASURE + x) * 4 + 3] > 40) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
              }
            }
          }
          if (maxX < 0) { done(FALLBACK); return; }
          // The middle of the top slice of the Sprite is where the head is.
          const sliceEnd = minY + Math.max(3, Math.round((maxY - minY) * 0.18));
          let sum = 0; let count = 0;
          for (let y = minY; y <= sliceEnd; y += 1) {
            for (let x = 0; x < MEASURE; x += 1) {
              if (data[(y * MEASURE + x) * 4 + 3] > 40) { sum += x; count += 1; }
            }
          }
          done({ cx: (sum / count + 0.5) / MEASURE, top: minY / MEASURE, width: (maxX - minX + 1) / MEASURE });
        } catch {
          done(FALLBACK); // a picture the browser won't let us read
        }
      };
      img.src = src;
    } catch {
      done(FALLBACK);
    }
  });
}

function useAnchor(src) {
  const [found, setFound] = useState({ src: null, anchor: null });
  const cached = src ? cache.get(src) : null;
  useEffect(() => {
    if (!src || cache.has(src)) return undefined;
    let cancelled = false;
    measure(src).then((anchor) => { if (!cancelled) setFound({ src, anchor }); });
    return () => { cancelled = true; };
  }, [src]);
  return cached || (found.src === src && found.anchor) || FALLBACK;
}

function Flower({ cx, cy, petal, heart = '#fde047' }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((deg) => (
        <circle key={deg} cx={cx + 4.2 * Math.cos((deg * Math.PI) / 180)} cy={cy + 4.2 * Math.sin((deg * Math.PI) / 180)} r="3.4" fill={petal} />
      ))}
      <circle cx={cx} cy={cy} r="2.6" fill={heart} />
    </g>
  );
}

const STAR = 'M0 -9 L2.6 -2.8 L9 0 L2.6 2.8 L0 9 L-2.6 2.8 L-9 0 L-2.6 -2.8 Z';

// The drawing of each hat, on a canvas 100 wide (the height is `h` in petItems.js).
const ART = {
  acc_party_hat: (
    <>
      <defs>
        <linearGradient id="gPartyHat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f472b6" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path d="M50 8 L88 92 Q50 102 12 92 Z" fill="url(#gPartyHat)" />
      <path d="M38 46 L62 34 M30 64 L70 48 M22 82 L80 62" stroke="#fde047" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
      <circle cx="50" cy="8" r="7" fill="#fde047" />
    </>
  ),
  acc_flower_crown: (
    <>
      <path d="M3 28 Q50 -4 97 28" stroke="#16a34a" strokeWidth="5" fill="none" strokeLinecap="round" />
      <Flower cx={13} cy={21} petal="#f9a8d4" />
      <Flower cx={31} cy={11} petal="#ffffff" />
      <Flower cx={50} cy={8} petal="#fb7185" />
      <Flower cx={69} cy={11} petal="#ffffff" />
      <Flower cx={87} cy={21} petal="#f9a8d4" />
    </>
  ),
  acc_cowboy_hat: (
    <>
      <path d="M27 38 C24 16 30 4 40 6 Q50 14 60 6 C70 4 76 16 73 38 Z" fill="#a16207" />
      <rect x="26" y="29" width="48" height="9" fill="#451a03" />
      <path d="M1 36 Q3 44 14 46 Q50 52 86 46 Q97 44 99 36 Q78 42 50 42 Q22 42 1 36 Z" fill="#92400e" />
      <path d="M1 36 Q22 42 50 42 Q78 42 99 36" stroke="#78350f" strokeWidth="2" fill="none" />
    </>
  ),
  acc_wizard_hat: (
    <>
      <defs>
        <linearGradient id="gWizHat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#7e22ce" />
        </linearGradient>
      </defs>
      <ellipse cx="51" cy="96" rx="49" ry="10" fill="#4338ca" />
      <path d="M24 95 Q38 46 56 22 Q66 8 84 12 Q68 20 70 52 Q74 74 78 95 Z" fill="url(#gWizHat)" />
      <path d="M25 86 Q52 94 77 86 L78 96 Q52 104 24 96 Z" fill="#fbbf24" />
      <path transform="translate(52 62) scale(0.7)" d={STAR} fill="#fde047" />
      <path transform="translate(62 40) scale(0.5)" d={STAR} fill="#fde047" />
      <path transform="translate(44 78) scale(0.45)" d={STAR} fill="#fde047" />
    </>
  ),
  acc_halo: (
    <>
      <ellipse cx="50" cy="13" rx="44" ry="8" fill="none" stroke="#fef08a" strokeWidth="9" opacity="0.35" />
      <ellipse cx="50" cy="13" rx="44" ry="8" fill="none" stroke="#fde047" strokeWidth="5" />
    </>
  ),
  acc_royal_crown: (
    <>
      <path d="M8 56 L8 22 L30 40 L50 10 L70 40 L92 22 L92 56 Z" fill="#facc15" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
      <rect x="8" y="48" width="84" height="12" rx="3" fill="#eab308" stroke="#b45309" strokeWidth="2.5" />
      <circle cx="8" cy="20" r="4.5" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
      <circle cx="50" cy="8" r="4.5" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
      <circle cx="92" cy="20" r="4.5" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
      <circle cx="26" cy="54" r="3.5" fill="#60a5fa" />
      <circle cx="50" cy="54" r="3.5" fill="#ef4444" />
      <circle cx="74" cy="54" r="3.5" fill="#34d399" />
    </>
  ),
};

// Three little stars that circle the Sprite. `still` is the version for a small picture in the shop.
function Orbit({ still = false }) {
  const colors = ['#fde047', '#f9a8d4', '#67e8f9'];
  return (
    <div className={`absolute inset-0 ${still ? '' : 'animate-[petorbit_7s_linear_infinite] motion-reduce:animate-none'}`}>
      {colors.map((fill, i) => (
        <div key={fill} className="absolute inset-0" style={{ transform: `rotate(${i * 120}deg)` }}>
          <svg viewBox="-10 -10 20 20" className="absolute left-1/2 top-[3%] h-[14%] w-[14%] -translate-x-1/2 drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]">
            <path d={STAR} fill={fill} />
          </svg>
        </div>
      ))}
    </div>
  );
}

// A small picture of an item for the shop and wardrobe.
export function AccessoryPreview({ item }) {
  if (item.orbit) {
    return <div className="relative h-14 w-14"><Orbit still /></div>;
  }
  return (
    <svg viewBox={`0 0 100 ${item.h}`} className="h-14 w-14 overflow-visible" style={item.bob ? { filter: 'drop-shadow(0 0 5px rgba(253,224,71,0.8))' } : undefined} aria-hidden="true">
      {ART[item.id]}
    </svg>
  );
}

// `size` is the side of the square the Sprite's picture fills.
export default function PetAccessory({ item, image, size = 176 }) {
  const anchor = useAnchor(image);
  if (!item) return null;
  if (item.orbit) {
    return <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10"><Orbit /></div>;
  }

  // Wide enough for the head, no taller than the room above it, so a hat never gets cut off.
  const headTop = anchor.top * size;
  const roomAbove = headTop + 30;
  const wide = Math.min(Math.max(anchor.width * size * item.w, 26), 120);
  const high = Math.min((wide * item.h) / 100, roomAbove / (1 - item.sink));
  const width = (high * 100) / item.h;
  const left = anchor.cx * size - width / 2;
  const top = headTop + item.sink * high - high;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      <svg
        viewBox={`0 0 100 ${item.h}`}
        className={`absolute overflow-visible ${item.bob ? 'animate-[petfloat_2.8s_ease-in-out_infinite] motion-reduce:animate-none' : ''}`}
        style={{ left, top, width, height: high, ...(item.bob ? { filter: 'drop-shadow(0 0 6px rgba(253,224,71,0.85))' } : { filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.4))' }) }}
      >
        {ART[item.id]}
      </svg>
    </div>
  );
}
