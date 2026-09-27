import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';

export default function PackDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
  const fetchPack = async () => {
        try {
        setLoading(true);
        // Fait la requête GET vers /api/packs/pack-eclat
        const res = await axios.get(`${API_URL}/packs/${id}`);
        const data = res.data.data || res.data;
        setPack(data);
        } catch (error) {
        console.error("Erreur de chargement du pack :", error);
        } finally {
        setLoading(false);
        }
    };

    fetchPack();
    }, [id]);

  const getImagesList = () => {
    if (!pack) return [];
    
    let list = [];
    if (pack.images && Array.isArray(pack.images) && pack.images.length > 0) {
      list = pack.images.map(img => typeof img === 'string' ? img : (img.url || img.path));
    } else if (pack.image_url) {
      list = [pack.image_url];
    }

    return list.filter(Boolean);
  };

  const imagesList = getImagesList();

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder.png';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;

    const cleanBaseUrl = API_URL.replace(/\/(api|uploads)\/?$/, '');
    const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${cleanBaseUrl}${cleanPath}`;
  };

  const handleAddToCart = () => {
    if (pack) {
      addToCart({ ...pack, isPack: true }, quantity);
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#FBF9F5] pt-32 pb-24 flex items-center justify-center font-sans text-stone-400 text-xs uppercase tracking-widest">
        Chargement de votre pack...
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="w-full min-h-screen bg-[#FBF9F5] pt-32 pb-24 font-sans text-stone-800 flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-3xl border border-stone-200/60 max-w-md mx-auto">
          <h2 className="font-serif text-2xl font-normal text-stone-900 mb-3">Pack introuvable</h2>
          <p className="text-xs text-stone-500 font-light mb-6">Le pack demandé n'existe pas ou a été retiré.</p>
          <Link
            to="/"
            className="inline-block bg-stone-900 text-white text-xs px-6 py-3 rounded-full uppercase tracking-widest hover:bg-stone-800 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const hasPromo = pack.promo_price && Number(pack.promo_price) > 0;
  const currentPrice = Number(hasPromo ? pack.promo_price : (pack.original_price || pack.price || 0));

  return (
    <div className="w-full min-h-screen bg-[#FBF9F5] pt-24 md:pt-28 pb-24 font-sans text-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Fil d'Ariane */}
        <div className="mb-8 flex items-center gap-2 text-xs font-light text-stone-400">
          <Link to="/" className="hover:text-stone-800 transition-colors">Accueil</Link>
          <span>/</span>
          <span className="text-stone-400">Packs Exclusifs</span>
          <span>/</span>
          <span className="text-stone-800 truncate font-normal">{pack.name}</span>
        </div>

        {/* SECTION PRINCIPALE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start mb-16">
          
          {/* GALERIE IMAGES */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative bg-white rounded-3xl border border-stone-200/60 h-80 sm:h-96 md:h-[480px] p-8 flex items-center justify-center overflow-hidden shadow-xs group">
              <span className="absolute top-4 left-4 z-10 bg-apoteca-pink text-white text-[9px] font-medium tracking-widest uppercase px-3.5 py-1 rounded-full">
                Pack Promo
              </span>

              {imagesList.length > 0 ? (
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={getImageUrl(imagesList[selectedImageIndex])}
                  alt={pack.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-center text-stone-300">
                  <span className="text-[10px] uppercase tracking-widest">Image non disponible</span>
                </div>
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

          {/* INFORMATIONS ET ACHAT */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-stone-200/60 shadow-xs space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-apoteca-sage font-semibold block mb-2">
                Offre Complète Soin
              </span>
              
              <h1 className="text-2xl md:text-3xl font-serif text-stone-900 font-normal tracking-tight mb-3">
                {pack.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-2">
                {hasPromo ? (
                  <>
                    <span className="text-xl md:text-2xl font-medium text-stone-900">{pack.promo_price} DA</span>
                    <span className="line-through text-sm text-stone-400">{pack.original_price} DA</span>
                  </>
                ) : (
                  <span className="text-xl md:text-2xl font-medium text-stone-900">
                    {pack.original_price} DA
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-stone-600 font-light leading-relaxed border-t border-stone-100 pt-4">
              {pack.description || 'Profitez d’une routine soin complète soigneusement sélectionnée pour vous offrir des résultats optimaux à un prix préférentiel.'}
            </p>

            {/* AVANTAGES LIVRAISON */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-stone-100 text-[11px] text-stone-500 font-light">
              <div className="flex items-center gap-2">
                <span>🚚</span>
                <span>Livraison 58 Wilayas</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🎁</span>
                <span>Économie garantie</span>
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
                <span>Ajouter le pack au panier</span>
                <span>•</span>
                <span>{currentPrice * quantity} DA</span>
              </button>

              {addedNotice && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-emerald-700 text-center font-medium"
                >
                  ✓ Pack ajouté au panier avec succès !
                </motion.p>
              )}
            </div>

          </div>

        </div>

        {/* INFORMATIONS SUR LE CONTENU DU PACK */}
        <div className="bg-white rounded-3xl border border-stone-200/60 p-6 md:p-10 mb-16">
          <div className="flex items-center gap-8 border-b border-stone-100 pb-4 mb-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`text-xs uppercase tracking-widest font-medium transition-colors pb-1 ${
                activeTab === 'description' ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Description du Pack
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`text-xs uppercase tracking-widest font-medium transition-colors pb-1 ${
                activeTab === 'details' ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Conseils & Rituel
            </button>
          </div>

          {activeTab === 'description' ? (
            <div className="text-xs text-stone-600 font-light leading-relaxed space-y-3">
              <p>
                {pack.description || 'Ce pack associe plusieurs soins complémentaires pour maximiser les bienfaits sur votre peau au quotidien.'}
              </p>
            </div>
          ) : (
            <div className="text-xs text-stone-600 font-light leading-relaxed space-y-3">
              <p>
                {pack.usage_instructions || 'Utilisez les produits inclus selon la routine recommandée : nettoyez la peau, appliquez le sérum puis scellez avec la crème hydratante.'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}