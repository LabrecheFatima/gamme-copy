import soap from "../assets/image-banner.png";
import ProductCard from "../components/ProductCard";
import PacksCarousel from "../components/PackCarousel";
import CategoriesSection from "../components/CategoriesSection";
import Footer from "../components/Footer";

const Leaf = () => (
  <svg viewBox="0 0 60 200" className="hb-orn" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M30 200V20" />
    {[40, 75, 110, 145].map((y) => (
      <g key={y}>
        <path d={`M30 ${y + 25}C10 ${y + 20} 8 ${y} 12 ${y - 8}C26 ${y - 4} 32 ${y + 10} 30 ${y + 25}Z`} />
        <path d={`M30 ${y + 10}C50 ${y + 5} 52 ${y - 15} 48 ${y - 23}C34 ${y - 19} 28 ${y - 5} 30 ${y + 10}Z`} />
      </g>
    ))}
  </svg>
);

const icons = {
  lotus: <path d="M24 38c-8-2-14-8-14-16 6 0 11 3 14 8 3-5 8-8 14-8 0 8-6 14-14 16zm0 0c-4-6-4-14 0-22 4 8 4 16 0 22zM8 40h32" />,
  lamp: <path d="M17 12h14l6 16H11zM24 28v10M16 40h16M24 8v4" />,
  sprout: <path d="M24 40V22M24 24c-8 0-12-5-12-11 8 0 12 4 12 11zm0 4c6 0 10-4 10-10-7 0-10 4-10 10zM14 40h20" />,
  candle: <path d="M24 8c4 6 6 9 6 13a6 6 0 0 1-12 0c0-4 2-7 6-13zM24 30v10M18 40h12" />,
  linen: <path d="M10 18l14-6 14 6-14 6zM10 26l14 6 14-6M10 33l14 6 14-6" />,
};

const items = [
  { icon: "lotus", label: "Bien-être" },
  { icon: "lamp", label: "Art Déco" },
  { icon: "sprout", label: "Soins du Corps" },
  { icon: "linen", label: "Maison & Art de la Table" },
  { icon: "candle", label: "Bougies" },
];

export default function HandcraftedBanner({
  title = "Handcrafted with care",
  text = "Artisanal soaps, naturally scented, wrapped by hand in warm and earthy tones.",
  cta = "Warm Pink",
  image = soap,
  onCtaClick,
}) {
  return (
    <section className="hb">
      <style>{css}</style>

      <div className="hb-hero">
        <div className="hb-copy">
          <Leaf />
          <div className="hb-copy-inner">
            <h1>{title}</h1>
            <p>{text}</p>
            <button type="button" onClick={onCtaClick}>{cta}</button>
          </div>
        </div>
        <div className="hb-photo">
          <img src={image} alt="Savons artisanaux emballés à la main" />
        </div>
        <div className="hb-edge"><Leaf /></div>
      </div>

      <ul className="hb-cats">
        {items.map(({ icon, label }) => (
          <li key={label}>
            <a href="#" className="hb-cat">
              <span className="hb-circle">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {icons[icon]}
                </svg>
              </span>
              <span className="hb-label">{label}</span>
            </a>
          </li>
        ))}
      </ul>
      <ProductCard></ProductCard>
      <PacksCarousel></PacksCarousel>
      
      <Footer></Footer>
      
    
    </section>
  );
}

const css = `
.hb{--dark:#2e2a2b;--cream:#f1ede7;--pink:#e9a3a0;--ink:#3a3536;--sand:#e6ddd3;
  font-family:'Cormorant Garamond','Playfair Display',Georgia,serif;width:100%;background:var(--cream);overflow:hidden}
.hb *{box-sizing:border-box}
.hb-hero{display:grid;grid-template-columns:1fr 1.05fr 5%;min-height:340px;background:var(--dark)}
.hb-copy{position:relative;display:flex;align-items:center;padding:clamp(28px,5vw,64px);color:var(--sand)}
.hb-copy .hb-orn{position:absolute;left:0;top:0;height:100%;width:auto;opacity:.12;color:#fff}
.hb-copy-inner{position:relative;max-width:420px}
.hb h1{margin:0 0 18px;font-weight:400;text-transform:uppercase;letter-spacing:.04em;line-height:1.12;font-size:clamp(30px,4.2vw,56px);color:#e9e1d8}
.hb p{margin:0 0 22px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:clamp(13px,1.3vw,15px);line-height:1.55;color:#d8cfc6;max-width:34ch}
.hb button{background:var(--pink);color:#fff;border:0;padding:9px 20px;font:600 12px 'Helvetica Neue',Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:filter .2s}
.hb button:hover{filter:brightness(1.07)}
.hb button:focus-visible,.hb-cat:focus-visible{outline:2px solid var(--pink);outline-offset:3px}
.hb-photo{position:relative;min-height:240px}
.hb-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.hb-edge{position:relative;background:var(--dark);color:#fff}
.hb-edge .hb-orn{position:absolute;inset:0;margin:auto;height:100%;width:100%;opacity:.12}
.hb-cats{list-style:none;margin:0;padding:0 clamp(12px,4vw,60px);display:flex;justify-content:center;gap:clamp(16px,6vw,90px);position:relative;top:-38px;margin-bottom:-38px;z-index:1}
.hb-cats li{flex:0 1 150px}
.hb-cat{display:flex;flex-direction:column;align-items:center;gap:10px;text-decoration:none;color:var(--ink)}
.hb-circle{display:grid;place-items:center;width:76px;height:76px;border-radius:50%;background:var(--cream);border:6px solid #e3dcd3;box-shadow:0 2px 8px rgba(0,0,0,.12);color:#6b6463;transition:transform .2s}
.hb-circle svg{width:34px;height:34px}
.hb-cat:hover .hb-circle{transform:translateY(-3px)}
.hb-label{font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;text-align:center;line-height:1.25}
.hb-cats+*{margin:0}
.hb{padding-bottom:22px}

@media (max-width:760px){
  .hb-hero{grid-template-columns:1.1fr 1fr 4%;min-height:250px}
  .hb-copy{padding:22px 12px 40px 16px}
  .hb h1{font-size:clamp(20px,6.4vw,32px);margin-bottom:10px}
  .hb p{font-size:11px;line-height:1.45;margin-bottom:14px}
  .hb button{padding:7px 12px;font-size:10px}
  .hb-photo{min-height:0}
  .hb-photo img{object-position:50% 55%}
  .hb-cats{gap:2px;padding:0 4px;top:-26px;margin-bottom:-26px;justify-content:space-between}
  .hb-cats li{flex:1 1 0;min-width:0}
  .hb-cat{gap:6px}
  .hb-circle{width:50px;height:50px;border-width:4px}
  .hb-circle svg{width:22px;height:22px}
  .hb-label{font-size:9.5px;overflow-wrap:anywhere}
}
@media (prefers-reduced-motion:reduce){.hb *{transition:none!important}}
`;