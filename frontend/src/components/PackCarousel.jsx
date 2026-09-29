import React from "react";
import { Link } from "react-router-dom";

import imageProduct1 from "../assets/pack-1.jpg";
import imageProduct2 from "../assets/pack-2.jpg";
import imageProduct3 from "../assets/pack-3.jpg";

const STATIC_PACKS = [
  { id: "pack-eclat", slug: "pack-eclat", name: "Pack Éclat & Jeunesse", original_price: 8000, promo_price: 6500, image_url: imageProduct1 },
  { id: "pack-hydratation", slug: "pack-hydratation", name: "Pack Hydratation Intense", original_price: 7500, promo_price: 5900, image_url: imageProduct2 },
  { id: "pack-purifiant", slug: "pack-purifiant", name: "Pack Rituel Purifiant", original_price: 6800, promo_price: 5200, image_url: imageProduct3 },
];

const fmt = (n) => `${Number(n).toLocaleString("fr-FR")} DA`;

const Leaf = () => (
  <svg viewBox="0 0 60 200" className="pc-orn" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M30 200V20" />
    {[40, 75, 110, 145].map((y) => (
      <g key={y}>
        <path d={`M30 ${y + 25}C10 ${y + 20} 8 ${y} 12 ${y - 8}C26 ${y - 4} 32 ${y + 10} 30 ${y + 25}Z`} />
        <path d={`M30 ${y + 10}C50 ${y + 5} 52 ${y - 15} 48 ${y - 23}C34 ${y - 19} 28 ${y - 5} 30 ${y + 10}Z`} />
      </g>
    ))}
  </svg>
);

export default function PacksCarousel({ packs = STATIC_PACKS }) {
  // Deux copies : la piste défile de -50% pour une boucle sans saut
  const track = [...packs, ...packs];

  return (
    <section className="pc">
      <style>{css}</style>
      <Leaf />

      <header className="pc-head">
        <h2>Nos packs exclusifs</h2>
        <p>Nos combinaisons de soins à prix réduits</p>
      </header>

      <div className="pc-viewport">
        <ul className="pc-track">
          {track.map((pack, i) => {
            const hasPromo = Number(pack.promo_price) > 0 && Number(pack.promo_price) < Number(pack.original_price);
            const discount = hasPromo ? Math.round((1 - pack.promo_price / pack.original_price) * 100) : 0;
            const isClone = i >= packs.length;

            return (
              <li key={`${pack.id}-${i}`} className="pc-item" aria-hidden={isClone || undefined}>
                <Link to={`/pack/${pack.slug || pack.id}`} className="pc-card" tabIndex={isClone ? -1 : undefined}>
                  <div className="pc-img">
                    <img src={pack.image_url} alt={isClone ? "" : pack.name} loading="lazy" />
                    {hasPromo && <span className="pc-badge">-{discount}%</span>}
                  </div>
                  <div className="pc-body">
                    <h3>{pack.name}</h3>
                    <p className="pc-prices">
                      {hasPromo && <s>{fmt(pack.original_price)}</s>}
                      <strong>{fmt(hasPromo ? pack.promo_price : pack.original_price)}</strong>
                    </p>
                    <span className="pc-btn">Voir le pack</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const css = `
.pc{--dark:#2e2a2b;--panel:#373233;--pink:#e9a3a0;--sand:#e6ddd3;
  position:relative;background:var(--dark);color:var(--sand);overflow:hidden;
  padding:clamp(36px,6vw,72px) 0 clamp(40px,6vw,72px);font-family:'Helvetica Neue',Arial,sans-serif}
.pc *{box-sizing:border-box}
.pc-orn{position:absolute;left:0;top:0;height:100%;width:auto;opacity:.08;color:#fff;pointer-events:none}
.pc-head{position:relative;padding:0 clamp(16px,5vw,64px);margin-bottom:clamp(22px,4vw,40px);max-width:1200px;margin-inline:auto}
.pc-head h2{margin:0 0 8px;font:400 clamp(28px,4.2vw,52px)/1.1 'Cormorant Garamond','Playfair Display',Georgia,serif;text-transform:uppercase;letter-spacing:.04em;color:#e9e1d8}
.pc-head p{margin:0;font-size:clamp(12px,1.3vw,15px);color:#d8cfc6}
.pc-viewport{position:relative;overflow:hidden;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);
  mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.pc-track{list-style:none;margin:0;padding:0;display:flex;width:max-content;animation:pc-scroll 32s linear infinite}
.pc-viewport:hover .pc-track,.pc-viewport:focus-within .pc-track{animation-play-state:paused}
.pc-item{flex:none;width:clamp(230px,28vw,320px);margin-right:clamp(14px,2vw,26px)}
.pc-card{display:block;text-decoration:none;color:inherit;background:var(--panel)}
.pc-card:focus-visible{outline:2px solid var(--pink);outline-offset:3px}
.pc-img{position:relative;aspect-ratio:4/5;overflow:hidden;background:#4a4344}
.pc-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}
.pc-card:hover .pc-img img{transform:scale(1.04)}
.pc-badge{position:absolute;top:12px;left:12px;background:var(--pink);color:#2b2626;font:700 11px 'Helvetica Neue',Arial,sans-serif;padding:4px 8px;letter-spacing:.04em}
.pc-body{padding:16px 14px 18px;text-align:center}
.pc-body h3{margin:0 0 8px;font:400 clamp(17px,1.9vw,21px)/1.2 'Cormorant Garamond','Playfair Display',Georgia,serif;text-transform:uppercase;letter-spacing:.04em;color:#e9e1d8}
.pc-prices{margin:0 0 14px;display:flex;justify-content:center;align-items:baseline;gap:10px;font-size:13px}
.pc-prices s{color:#a89f97;font-size:12px}
.pc-prices strong{color:#fff;font-weight:700;font-size:15px}
.pc-btn{display:inline-block;background:var(--pink);color:#fff;padding:8px 18px;font:600 11px 'Helvetica Neue',Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;transition:filter .2s}
.pc-card:hover .pc-btn{filter:brightness(1.07)}
@keyframes pc-scroll{to{transform:translateX(-50%)}}
@media (max-width:560px){
  .pc-item{width:clamp(210px,68vw,250px)}
  .pc-track{animation-duration:26s}
}
@media (prefers-reduced-motion:reduce){
  .pc-viewport{overflow-x:auto;-webkit-mask-image:none;mask-image:none}
  .pc-track{animation:none}
  .pc-img img,.pc-btn{transition:none}
}
`;