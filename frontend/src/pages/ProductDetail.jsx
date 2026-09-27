import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // État local pour les avis clients
  const [reviews, setReviews] = useState([
    { id: 1, author: 'Amel B.', rating: 5, date: '14 Septembre 2026', comment: 'Résultats visibles dès les premières applications. Ma peau est nettement plus douce et hydratée.' },
    { id: 2, author: 'Sarra M.', rating: 4, date: '02 Septembre 2026', comment: 'Très bonne texture, pénètre rapidement sans laisser de film gras. Je recommande !' }
  ]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState('');

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);
        setSelectedImageIndex(0);

        // 1. Récupération du produit
        const res = await axios.get(`${API_URL}/products/${id}`);
        const data = res.data.data || res.data;
        setProduct(data);

        // 2. Récupération des produits suggérés
        const allRes = await axios.get(`${API_URL}/products`);
        const allProds = allRes.data.data || allRes.data || [];
        const related = allProds.filter(p => p.id !== data.id && (p.category_id === data.category_id || p.category === data.category));
        setRelatedProducts(related.slice(0, 4));

      } catch (error) {
        console.error("Erreur de chargement du produit :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndRelated();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Extraction de la liste complète d'images
  const getImagesList = () => {
    if (!product) return [];
    
    let list = [];
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      list = product.images.map(img => typeof img === 'string' ? img : (img.url || img.path));
    } else if (product.image_url) {
      list = [product.image_url];
    }

    if (product.gallery && Array.isArray(product.gallery)) {
      list = [...list, ...product.gallery];
    }

    return list.filter(Boolean);
  };

  const imagesList = getImagesList();

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder.png';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;

    const filename = imageUrl.split('/').pop();
    const cleanBaseUrl = API_URL.replace(/\/(api|uploads)\/?$/, '');
    return `${cleanBaseUrl}/uploads/${filename}`;
  };

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

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#FBF9F5] pt-32 pb-24 flex items-center justify-center font-sans text-stone-400 text-xs uppercase tracking-widest">
        Chargement de l'expérience soin...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-[#FBF9F5] pt-32 pb-24 font-sans text-stone-800 flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-3xl border border-stone-200/60 max-w-md mx-auto">
          <h2 className="font-serif text-2xl font-normal text-stone-900 mb-3">Soin introuvable</h2>
          <p className="text-xs text-stone-500 font-light mb-6">Le produit recherché n'existe pas ou a été retiré.</p>
          <Link
            to="/shop"
            className="inline-block bg-stone-900 text-white text-xs px-6 py-3 rounded-full uppercase tracking-widest hover:bg-stone-800 transition-colors"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  const categoryName = product.category_name || product.category?.name || product.category;
  const currentPrice = Number(product.has_promo ? product.final_price : (product.original_price || product.price || 0));

  return (
    <div className="w-full min-h-screen bg-[#FBF9F5] pt-24 md:pt-28 pb-24 font-sans text-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Fil d'Ariane */}
        <div className="mb-8 flex items-center gap-2 text-xs font-light text-stone-400">
          <Link to="/" className="hover:text-stone-800 transition-colors">Accueil</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-stone-800 transition-colors">Boutique</Link>
          {categoryName && (
            <>
              <span>/</span>
              <span className="text-stone-400">{categoryName}</span>
            </>
          )}
          <span>/</span>
          <span className="text-stone-800 truncate font-normal">{product.name}</span>
        </div>

        {/* SECTION PRINCIPALE PRODUIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start mb-16">
          
          {/* GALERIE PHOTOS MULTIPLES */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative bg-white rounded-3xl border border-stone-200/60 h-80 sm:h-96 md:h-[480px] p-8 flex items-center justify-center overflow-hidden shadow-xs group">
              {product.has_promo && (
                <span className="absolute top-4 left-4 z-10 bg-stone-900 text-white text-[9px] font-medium tracking-widest uppercase px-3.5 py-1 rounded-full">
                  Promo
                </span>
              )}

              {imagesList.length > 0 ? (
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={getImageUrl(imagesList[selectedImageIndex])}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-center text-stone-300">
                  <span className="text-[10px] uppercase tracking-widest">Aucune image disponible</span>
                </div>
              )}

              {imagesList.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-stone-200 flex items-center justify-center text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-stone-200 flex items-center justify-center text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity"
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
                    className={`w-20 h-20 bg-white rounded-2xl border p-2 shrink-0 transition-all ${
                      selectedImageIndex === index
                        ? 'border-stone-900 ring-2 ring-stone-900/10'
                        : 'border-stone-200/60 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFORMATIONS & ACHAT */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-stone-200/60 shadow-xs space-y-6">
            <div>
              {categoryName && (
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium block mb-2">
                  Catégorie : {categoryName}
                </span>
              )}
              
              <h1 className="text-2xl md:text-3xl font-serif text-stone-900 font-normal tracking-tight mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400 text-xs">
                  {'★'.repeat(5)}
                </div>
                <span className="text-[11px] text-stone-400 font-light">({reviews.length} avis clients)</span>
              </div>

              <div className="flex items-baseline gap-3">
                {product.has_promo ? (
                  <>
                    <span className="text-xl md:text-2xl font-medium text-stone-900">{product.final_price} DA</span>
                    <span className="line-through text-sm text-stone-400">{product.original_price} DA</span>
                  </>
                ) : (
                  <span className="text-xl md:text-2xl font-medium text-stone-900">
                    {product.original_price || product.price} DA
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-stone-600 font-light leading-relaxed border-t border-stone-100 pt-4">
              {product.description || 'Formule concentrée élaborée à partir d\'ingrédients rigoureusement sélectionnés pour apporter équilibre et vitalité.'}
            </p>

            {/* AVANTAGES LIVRAISON & QUALITÉ */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-stone-100 text-[11px] text-stone-500 font-light">
              <div className="flex items-center gap-2">
                <span>🚚</span>
                <span>Livraison 58 Wilayas</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🌿</span>
                <span>Ingrédients 100% testés</span>
              </div>
            </div>

            {/* BOUTON D'AJOUT AU PANIER */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Quantité</span>
                <div className="flex items-center border border-stone-200 rounded-full bg-[#FBF9F5] px-3 py-1">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-900 text-sm font-medium"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-medium text-stone-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-900 text-sm font-medium"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-stone-900 text-white py-4 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span>Ajouter au panier</span>
                <span>•</span>
                <span>{currentPrice * quantity} DA</span>
              </button>

              {addedNotice && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-emerald-700 text-center font-medium"
                >
                  ✓ Produit ajouté au panier avec succès !
                </motion.p>
              )}
            </div>

          </div>

        </div>

        {/* SECTION ONGLETS : CONSEILS D'UTILISATION ET COMPOSITION */}
        <div className="bg-white rounded-3xl border border-stone-200/60 p-6 md:p-10 mb-16">
          <div className="flex items-center gap-8 border-b border-stone-100 pb-4 mb-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`text-xs uppercase tracking-widest font-medium transition-colors pb-1 ${
                activeTab === 'description' ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Conseils d'utilisation
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`text-xs uppercase tracking-widest font-medium transition-colors pb-1 ${
                activeTab === 'ingredients' ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Composition
            </button>
          </div>

          {activeTab === 'description' ? (
            <div className="text-xs text-stone-600 font-light leading-relaxed space-y-3">
              <p>
                {product.conseil_utilisation || product.usage_instructions || product.how_to_use || 'Appliquer quotidiennement sur une peau propre et sèche. Masser délicatement par mouvements circulaires jusqu’à absorption complète.'}
              </p>
            </div>
          ) : (
            <div className="text-xs text-stone-600 font-light leading-relaxed space-y-3">
              <p>
                {product.composition || product.ingredients || 'Aqua, Glycerin, Botanical Extracts, Natural Oils, Tocopherol (Vitamin E).'}
              </p>
            </div>
          )}
        </div>

        {/* SECTION AVIS CLIENTS */}
        <div className="bg-white rounded-3xl border border-stone-200/60 p-6 md:p-10 mb-16">
          <h3 className="font-serif text-2xl font-normal text-stone-900 mb-6">Avis & Expériences</h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form onSubmit={handleAddReview} className="lg:col-span-5 bg-[#FBF9F5] p-6 rounded-2xl border border-stone-100 space-y-4">
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block">
                Partagez votre avis
              </span>

              <input
                type="text"
                placeholder="Votre nom"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-stone-900"
                required
              />

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500">Note :</span>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(e.target.value)}
                  className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none"
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
                className="w-full bg-white border border-stone-200 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-stone-900"
                required
              />

              <button
                type="submit"
                className="w-full bg-stone-900 text-white py-3 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-stone-800 transition-colors"
              >
                Publier mon avis
              </button>
            </form>

            <div className="lg:col-span-7 space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="border-b border-stone-100 pb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-stone-900">{rev.author}</span>
                    <span className="text-[10px] text-stone-400">{rev.date}</span>
                  </div>
                  <div className="text-amber-400 text-xs mb-1">
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </div>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION PRODUITS SIMILAIRES */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400 block mb-2">
                Complétez votre rituel
              </span>
              <h3 className="font-serif text-2xl font-normal text-stone-900">Produits suggérés</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/product/${rel.slug || rel.id}`}
                  className="bg-white rounded-3xl border border-stone-200/60 p-5 flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div className="h-48 bg-[#FDFBF7] rounded-2xl p-4 flex items-center justify-center mb-4 overflow-hidden">
                    <img
                      src={getImageUrl(rel.image_url || (rel.images && rel.images[0]))}
                      alt={rel.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm text-stone-900 mb-1 line-clamp-1">{rel.name}</h4>
                    <p className="text-xs font-medium text-stone-900">
                      {rel.has_promo ? rel.final_price : (rel.original_price || rel.price)} DA
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