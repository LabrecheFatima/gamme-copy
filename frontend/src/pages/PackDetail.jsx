import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

import imageProduct1 from '../assets/pack-1.jpg';
import imageProduct2 from '../assets/pack-2.jpg';
import imageProduct3 from '../assets/pack-3.jpg';

const STATIC_PACKS = [
  {
    id: "pack-eclat",
    slug: "pack-eclat",
    name: "Pack Éclat & Jeunesse",
    original_price: 8000,
    promo_price: 6500,
    image_url: imageProduct1,
    images: [imageProduct1],
    description: "Un rituel de soin complet conçu pour raviver l'éclat naturel de votre teint et régénérer la peau en profondeur.",
    usage_instructions: "Appliquez le sérum matin et soir sur une peau propre, puis scellez l'hydratation avec la crème."
  },
  {
    id: "pack-hydratation",
    slug: "pack-hydratation",
    name: "Pack Hydratation Intense",
    original_price: 7500,
    promo_price: 5900,
    image_url: imageProduct2,
    images: [imageProduct2],
    description: "Une combinaison d'ingrédients hautement hydratants pour restaurer la barrière cutanée et apporter de la douceur.",
    usage_instructions: "Utilisez la gelée hydratante chaque matin et le masque réparateur 2 fois par semaine."
  },
  {
    id: "pack-purifiant",
    slug: "pack-purifiant",
    name: "Pack Rituel Purifiant",
    original_price: 6800,
    promo_price: 5200,
    image_url: imageProduct3,
    images: [imageProduct3],
    description: "Formulé pour purifier les pores en douceur, réguler le sébum et clarifier le grain de peau.",
    usage_instructions: "Nettoyez votre visage avec le nettoyant doux puis appliquez la lotion purifiante matin et soir."
  }
];

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
    setLoading(true);
    const foundPack = STATIC_PACKS.find(p => p.id === id || p.slug === id);
    setPack(foundPack || null);
    setLoading(false);
  }, [id]);

  const imagesList = pack ? (pack.images || [pack.image_url]) : [];

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
  const currentPrice = Number(hasPromo ? pack.promo_price : pack.original_price);

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
            <div className="relative bg-white rounded-3xl border border-stone-200/60 h-80 sm:h-96 md:h-[480px] p-4 flex items-center justify-center overflow-hidden shadow-xs group">
              <span className="absolute top-4 left-4 z-10 bg-apoteca-pink text-white text-[9px] font-medium tracking-widest uppercase px-3.5 py-1 rounded-full">
                Pack Promo
              </span>

              {imagesList.length > 0 ? (
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={imagesList[selectedImageIndex]}
                  alt={pack.name}
                  className="w-full h-full object-cover rounded-2xl"
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
                    className={`w-20 h-20 bg-white rounded-2xl border p-1 shrink-0 overflow-hidden transition-all ${
                      selectedImageIndex === index
                        ? 'border-stone-900 ring-2 ring-stone-900/10'
                        : 'border-stone-200/60 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
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
              {pack.description}
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
              <p>{pack.description}</p>
            </div>
          ) : (
            <div className="text-xs text-stone-600 font-light leading-relaxed space-y-3">
              <p>{pack.usage_instructions}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}