import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

// Importation des images locales
import imageProduct1 from '../assets/image-product1.png';
import imageProduct2 from '../assets/image-product2.png';
import imageProduct3 from '../assets/image-product3.png';
import imageProduct4 from '../assets/image-product4.png';

const PRODUCTS_DATABASE = [
  {
    id: "1",
    slug: "serum-hydratant-eclat",
    name: "Sérum Hydratant Éclat intense",
    category_name: "Sérums & Soins",
    images: [imageProduct1, imageProduct2],
    has_promo: true,
    original_price: 3800,
    final_price: 3200,
    price: 3200,
    description: "Formule concentrée à l'acide hyaluronique et à la vitamine C pour hydrater en profondeur et illuminer le teint instantanément.",
    conseil_utilisation: "Appliquer 3 à 4 gouttes matin et soir sur une peau préalablement nettoyée. Masser doucement de l'intérieur vers l'extérieur du visage.",
    composition: "Aqua, Hyaluronic Acid, Vitamin C Extract, Botanical Glycerin, Tocopherol (Vitamin E)."
  },
  {
    id: "2",
    slug: "creme-regenerante-nuit",
    name: "Crème Régénérante de Nuit",
    category_name: "Crèmes Hydratantes",
    images: [imageProduct2, imageProduct3],
    has_promo: false,
    original_price: 4200,
    final_price: 4200,
    price: 4200,
    description: "Soin de nuit nourrissant enrichi en huiles botaniques pour réparer la barrière cutanée pendant votre sommeil.",
    conseil_utilisation: "Appliquer chaque soir sur le visage et le cou parfaitement nettoyés en effectuant de légers massages circulaires.",
    composition: "Aqua, Shea Butter, Rosehip Seed Oil, Jojoba Oil, Cetearyl Alcohol, Essential Oils."
  },
  {
    id: "3",
    slug: "lotion-purifiante-botanique",
    name: "Lotion Purifiante Botanique",
    category_name: "Nettoyants & Lotions",
    images: [imageProduct3, imageProduct4],
    has_promo: true,
    original_price: 2900,
    final_price: 2400,
    price: 2400,
    description: "Lotion rééquilibrante à base d'extraits végétaux pour resserrer les pores et matifier le teint en douceur.",
    conseil_utilisation: "Biberonner un coton de lotion et appliquer délicatement sur l'ensemble du visage le matin avant votre routine de soin.",
    composition: "Aqua, Witch Hazel Water, Green Tea Leaf Extract, Zinc PCA, Salicylic Acid, Glycerin."
  },
  {
    id: "4",
    slug: "fluid-protecteur-uv",
    name: "Fluide Protecteur UV SPF50+",
    category_name: "Protection Solaire",
    images: [imageProduct4, imageProduct1],
    has_promo: false,
    original_price: 3500,
    final_price: 3500,
    price: 3500,
    description: "Protection solaire quotidienne invisible à fini mat qui protège contre les rayons UVA/UVB et la pollution.",
    conseil_utilisation: "Appliquer généreusement 15 minutes avant l'exposition au soleil. Renouveler toutes les 2 heures.",
    composition: "Aqua, Zinc Oxide, Titanium Dioxide, Niacinamide, Glycerin, Aloe Vera Extract."
  }
];

const fmt = (n) => `${Number(n).toLocaleString('fr-FR')} DA`;

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const [reviews, setReviews] = useState([
    { id: 1, author: 'Amel B.', rating: 5, date: '14 Septembre 2026', comment: 'Résultats visibles dès les premières applications. Ma peau est nettement plus douce et hydratée.' },
    { id: 2, author: 'Sarra M.', rating: 4, date: '02 Septembre 2026', comment: 'Très bonne texture, pénètre rapidement sans laisser de film gras. Je recommande !' }
  ]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState('');

  useEffect(() => {
    // Recherche du produit dans la base statique
    const found = PRODUCTS_DATABASE.find(p => p.id === id || p.slug === id) || PRODUCTS_DATABASE[0];
    setProduct(found);
    setSelectedImageIndex(0);

    const related = PRODUCTS_DATABASE.filter(p => p.id !== found.id);
    setRelatedProducts(related);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !newAuthor.trim()) return;

    const reviewObj = {
      id: Date.now(),
      author: newAuthor,
      rating: Number(newRating),
      date: 'Aujourd\'hui',
      comment: newComment
    };

    setReviews([reviewObj, ...reviews]);
    setNewComment('');
    setNewAuthor('');
    setNewRating(5);
  };

  if (!product) return null;

  const currentPrice = Number(product.has_promo ? product.final_price : product.original_price);
  const imagesList = product.images || [product.image];

  return (
    <div className="w-full min-h-screen bg-[#f8f5f1] pb-20 font-sans text-[#2b2626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-6 md:pt-8">
        
        {/* Fil d'Ariane */}
        <div className="mb-8 flex items-center gap-2 text-xs font-light text-stone-400">
          <Link to="/" className="hover:text-stone-800 transition-colors">Accueil</Link>
          <span>/</span>
          <span className="text-stone-400">{product.category_name}</span>
          <span>/</span>
          <span className="text-stone-800 truncate font-normal">{product.name}</span>
        </div>

        {/* SECTION PRINCIPALE PRODUIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start mb-16">
          
          {/* GALERIE PHOTOS MULTIPLES */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative bg-[#e6ddd3] h-80 sm:h-96 md:h-[520px] flex items-center justify-center overflow-hidden group">
              {product.has_promo && (
                <span className="absolute top-4 left-4 z-10 bg-[#e9a3a0] text-[#2b2626] text-[10px] font-bold tracking-wider uppercase px-3 py-1">
                  Promo
                </span>
              )}

              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={imagesList[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {imagesList.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#2e2a2b]/85 text-[#e9e1d8] flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#2e2a2b]/85 text-[#e9e1d8] flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {imagesList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {imagesList.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 bg-[#e6ddd3] border shrink-0 overflow-hidden transition-all ${
                      selectedImageIndex === index
                        ? 'border-[#e9a3a0] ring-1 ring-[#e9a3a0]'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFORMATIONS & ACHAT */}
          <div className="lg:col-span-5 bg-[#2e2a2b] text-[#e6ddd3] p-6 md:p-8 space-y-6">
            <div>
              <span className="text-[11px] text-[#a89f97] block mb-2">
                Catégorie : {product.category_name}
              </span>
              
              <h1 className="text-2xl md:text-4xl font-serif font-normal uppercase tracking-[0.04em] leading-tight text-[#e9e1d8] mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-[#e9a3a0] text-xs">
                  {'★'.repeat(5)}
                </div>
                <span className="text-[11px] text-[#a89f97]">({reviews.length} avis clients)</span>
              </div>

              <div className="flex items-baseline gap-3">
                {product.has_promo ? (
                  <>
                    <span className="text-xl md:text-2xl font-bold text-white">{fmt(product.final_price)}</span>
                    <span className="line-through text-sm text-[#a89f97]">{fmt(product.original_price)}</span>
                  </>
                ) : (
                  <span className="text-xl md:text-2xl font-bold text-white">
                    {fmt(product.original_price)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-[13px] text-[#d8cfc6] leading-relaxed border-t border-white/10 pt-4">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10 text-[11px] text-[#c9bfb5]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e9a3a0] shrink-0" />
                <span>Livraison 58 Wilayas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e9a3a0] shrink-0" />
                <span>Ingrédients 100% testés</span>
              </div>
            </div>

            {/* BOUTON D'AJOUT AU PANIER */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#a89f97] font-medium">Quantité</span>
                <div className="flex items-center border border-white/25 px-3 py-1">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-6 h-6 flex items-center justify-center text-[#c9bfb5] hover:text-white text-sm font-medium"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-medium text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="w-6 h-6 flex items-center justify-center text-[#c9bfb5] hover:text-white text-sm font-medium"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-[#e9a3a0] text-white py-4 text-xs font-semibold uppercase tracking-[0.08em] hover:brightness-105 transition-all flex items-center justify-center gap-2"
              >
                <span>Ajouter au panier</span>
                <span>•</span>
                <span>{fmt(currentPrice * quantity)}</span>
              </button>

              {addedNotice && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-[#e9a3a0] text-center font-medium"
                >
                  ✓ Produit ajouté au panier avec succès !
                </motion.p>
              )}
            </div>
          </div>
        </div>

        {/* CONSEILS D'UTILISATION ET COMPOSITION */}
        <div className="bg-[#f1ede7] border border-[#e3dcd3] p-6 md:p-10 mb-16">
          <div className="flex items-center gap-8 border-b border-[#ddd3c8] pb-4 mb-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`text-xs uppercase tracking-[0.08em] font-semibold transition-colors pb-1 ${
                activeTab === 'description' ? 'text-[#2e2a2b] border-b-2 border-[#e9a3a0]' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Conseils d'utilisation
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`text-xs uppercase tracking-[0.08em] font-semibold transition-colors pb-1 ${
                activeTab === 'ingredients' ? 'text-[#2e2a2b] border-b-2 border-[#e9a3a0]' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Composition
            </button>
          </div>

          {activeTab === 'description' ? (
            <p className="text-[13px] text-stone-600 leading-relaxed">
              {product.conseil_utilisation}
            </p>
          ) : (
            <p className="text-[13px] text-stone-600 leading-relaxed">
              {product.composition}
            </p>
          )}
        </div>

        {/* SECTION AVIS CLIENTS */}
        <div className="bg-[#f1ede7] border border-[#e3dcd3] p-6 md:p-10 mb-16">
          <h3 className="font-serif text-2xl font-normal uppercase tracking-[0.04em] text-[#2e2a2b] mb-6">Avis & Expériences</h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form onSubmit={handleAddReview} className="lg:col-span-5 bg-white p-6 border border-[#e3dcd3] space-y-4">
              <span className="text-[11px] text-stone-500 font-medium block">
                Partagez votre avis
              </span>

              <input
                type="text"
                placeholder="Votre nom"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full bg-white border border-[#ddd3c8] px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-[#2e2a2b]"
                required
              />

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500">Note :</span>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(e.target.value)}
                  className="bg-white border border-[#ddd3c8] px-3 py-1.5 text-xs text-stone-800 focus:outline-none"
                >
                  <option value={5}>★★★★★ (5/5)</option>
                  <option value={4}>★★★★☆ (4/5)</option>
                  <option value={3}>★★★☆☆ (3/5)</option>
                </select>
              </div>

              <textarea
                placeholder="Votre commentaire sur l'efficacité, la texture..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full bg-white border border-[#ddd3c8] p-3 text-xs text-stone-800 focus:outline-none focus:border-[#2e2a2b]"
                required
              />

              <button
                type="submit"
                className="w-full bg-[#e9a3a0] text-white py-3 text-xs uppercase tracking-[0.08em] font-semibold hover:brightness-105 transition"
              >
                Publier mon avis
              </button>
            </form>

            <div className="lg:col-span-7 space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="border-b border-[#e3dcd3] pb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#2b2626]">{rev.author}</span>
                    <span className="text-[10px] text-stone-400">{rev.date}</span>
                  </div>
                  <div className="text-[#d9788d] text-xs mb-1">
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </div>
                  <p className="text-[13px] text-stone-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRODUITS SUGGÉRÉS */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-[11px] text-stone-500 block mb-2">
                Complétez votre rituel
              </span>
              <h3 className="font-serif text-2xl font-normal uppercase tracking-[0.04em] text-[#2e2a2b]">Produits suggérés</h3>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/product/${rel.slug}`}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-full aspect-[24/25] bg-[#e6ddd3] mb-3 overflow-hidden">
                    <img
                      src={rel.images ? rel.images[0] : rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-[#2b2626] mb-1 line-clamp-1">{rel.name}</h4>
                    <p className="text-xs font-bold text-[#2b2626]">
                      {fmt(rel.has_promo ? rel.final_price : rel.original_price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}