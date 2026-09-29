// Remplace image: null par tes photos, ex: import soap1 from "../assets/soap1.jpg"  ->  image: soap1
import imageone from '../assets/image-product1.png';
import imagetwo from '../assets/image-product2.png';
import imagethree from '../assets/image-product3.png';
import imagefour from '../assets/image-product4.png';

const defaultProducts = [
  { id: 1, name: "Botanical Soap", price: 25, image1: imageone, tint: "#d9a6a3", button: { label: "Warm Pink", tone: "pink" } },
  { id: 2, name: "Ceramic Mug", price: 12, image: imagetwo, tint: "#e2c3b6", button: { label: "Cool Grey", tone: "grey" } },
  { id: 3, name: "Herbal Tea Blend", price: 15, image: imagethree, tint: "#d7cabb", button: { label: "Warm Pink", tone: "sand" } },
  { id: 4, name: "Botanical Soap", price: 25, image: imagefour, tint: "#dcc7b5", button: { label: "Warm Pink", tone: "pink" } },
  { id: 5, name: "Botanical Soap", price: 16, image: null, tint: "#d8cdc0", button: { label: "Warm Pink", tone: "pink" } },
  { id: 6, name: "Ceramic Mug", price: 12, image: null, tint: "#c98f78", button: { label: "Cool Grey", tone: "grey" } },
  { id: 7, name: "Herbal Tea Blend", price: 15, image: null, tint: "#c9a897", button: { label: "Add to cart", tone: "dark" } },
  { id: 8, name: "Motanic Tote", price: 66, image: null, tint: "#d9b8a8", button: { label: "Add to cart", tone: "dark" } },
];

export default function ProductGrid({ products = defaultProducts, title, onAddToCart }) {
  return (
    <section className="pg">
      <style>{css}</style>
      {title && <h2 className="pg-title">{title}</h2>}
      <ul className="pg-grid">
        {products.map((p) => (
          <li key={p.id} className="pg-card">
            <div className="pg-img" style={{ background: p.tint }}>
              {p.image && <img src={p.image} alt={p.name} loading="lazy" />}
            </div>
            <h3 className="pg-name">{p.name}</h3>
            <p className="pg-price">${Number(p.price).toFixed(2)}</p>
            <button type="button" className={`pg-btn pg-${p.button.tone}`} onClick={() => onAddToCart?.(p)}>
              {p.button.label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

const css = `
.pg{background:#f8f5f1;padding:clamp(20px,4vw,48px) clamp(14px,4vw,60px);font-family:'Helvetica Neue',Arial,sans-serif;color:#2b2626}
.pg *{box-sizing:border-box}
.pg-title{margin:0 0 24px;text-align:center;font:400 clamp(22px,3vw,32px) Georgia,serif;letter-spacing:.06em;text-transform:uppercase}
.pg-grid{list-style:none;margin:0 auto;padding:0;max-width:1100px;display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(18px,3vw,36px) clamp(12px,2.4vw,28px)}
.pg-card{display:flex;flex-direction:column;align-items:center;text-align:center}
.pg-img{position:relative;width:100%;aspect-ratio:24/25;overflow:hidden;margin-bottom:12px}
.pg-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.pg-name{margin:0;font-size:clamp(10.5px,1.2vw,12.5px);font-weight:700;text-transform:uppercase;letter-spacing:.01em;line-height:1.25}
.pg-price{margin:4px 0 10px;font-size:clamp(10.5px,1.2vw,12.5px);font-weight:700}
.pg-btn{width:clamp(84px,72%,112px);padding:6px 0;border:0;border-radius:4px;color:#fff;font:600 clamp(9.5px,1.05vw,11px) 'Helvetica Neue',Arial,sans-serif;text-transform:uppercase;letter-spacing:.03em;cursor:pointer;transition:filter .2s,transform .2s}
.pg-btn:hover{filter:brightness(1.08);transform:translateY(-1px)}
.pg-btn:focus-visible{outline:2px solid #2b2626;outline-offset:2px}
.pg-pink{background:#d9788d}
.pg-grey{background:#8e8e8e}
.pg-sand{background:#cdb5a6}
.pg-dark{background:#1f1f1f}
@media (max-width:560px){
  .pg-grid{grid-template-columns:repeat(2,1fr)}
  .pg-btn{width:min(70%,120px);font-size:10.5px}
  .pg-name,.pg-price{font-size:11.5px}
}
@media (prefers-reduced-motion:reduce){.pg-btn{transition:none}.pg-btn:hover{transform:none}}
`;