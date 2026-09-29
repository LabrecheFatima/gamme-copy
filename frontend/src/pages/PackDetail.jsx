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

const fmt = (n) => `${Number(n).toLocaleString('fr-FR')} DA`;

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
      <div className="w-full min-h-screen bg-[#f8f5f1] pb-24 flex items-center justify-center font-sans text-stone-400 text-xs uppercase tracking-widest">
        Chargement de votre pack...
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="w-full min-h-screen bg-[#f8f5f1] pb-24 font-sans text-[#2b2626] flex items-center justify-center">
        <div className="text-center bg-white p-10 border border-[#e3dcd3] max-w-md mx-auto">
          <h2 className="font-serif text-2xl font-normal uppercase tracking-[0.04em] text-[#2e2a2b] mb-3">Pack introuvable</h2>
          <p className="text-xs text-stone-500 font-light mb-6">Le pack demandé n'existe pas ou a été retiré.</p>
          <Link
            to="/"
            className="inline-block bg-[#e9a3a0] text-white text-xs font-semibold px-6 py-3 uppercase tracking-[0.08em] hover:brightness-105 transition"
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
    <div className="w-full min-h-screen bg-[#f8f5f1] pb-20 font-sans text-[#2b2626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-6 md:pt-8">
        
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
            <div className="relative bg-[#e6ddd3] h-80 sm:h-96 md:h-[520px] flex items-center justify-center overflow-hidden group">
              <span className="absolute top-4 left-4 z-10 bg-[#e9a3a0] text-[#2b2626] text-[10px] font-bold tracking-wider uppercase px-3 py-1">
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
                  className="w-full h-full object-cover"
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

          {/* INFORMATIONS ET ACHAT */}
          <div className="lg:col-span-5 bg-[#2e2a2b] text-[#e6ddd3] p-6 md:p-8 space-y-6">
            <div>
              <span className="text-[11px] text-[#a89f97] block mb-2">
                Offre Complète Soin
              </span>
              
              <h1 className="text-2xl md:text-4xl font-serif font-normal uppercase tracking-[0.04em] leading-tight text-[#e9e1d8] mb-3">
                {pack.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-2">
                {hasPromo ? (
                  <>
                    <span className="text-xl md:text-2xl font-bold text-white">{fmt(pack.promo_price)}</span>
                    <span className="line-through text-sm text-[#a89f97]">{fmt(pack.original_price)}</span>
                  </>
                ) : (
                  <span className="text-xl md:text-2xl font-bold text-white">
                    {fmt(pack.original_price)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-[13px] text-[#d8cfc6] leading-relaxed border-t border-white/10 pt-4">
              {pack.description}
            </p>

            {/* AVANTAGES LIVRAISON */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10 text-[11px] text-[#c9bfb5]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e9a3a0] shrink-0" />
                <span>Livraison 58 Wilayas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e9a3a0] shrink-0" />
                <span>Économie garantie</span>
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
                <span>Ajouter le pack au panier</span>
                <span>•</span>
                <span>{fmt(currentPrice * quantity)}</span>
              </button>

              {addedNotice && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-[#e9a3a0] text-center font-medium"
                >
                  ✓ Pack ajouté au panier avec succès !
                </motion.p>
              )}
            </div>

          </div>

        </div>

        {/* INFORMATIONS SUR LE CONTENU DU PACK */}
        <div className="bg-[#f1ede7] border border-[#e3dcd3] p-6 md:p-10 mb-16">
          <div className="flex items-center gap-8 border-b border-[#ddd3c8] pb-4 mb-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`text-xs uppercase tracking-[0.08em] font-semibold transition-colors pb-1 ${
                activeTab === 'description' ? 'text-[#2e2a2b] border-b-2 border-[#e9a3a0]' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Description du Pack
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`text-xs uppercase tracking-[0.08em] font-semibold transition-colors pb-1 ${
                activeTab === 'details' ? 'text-[#2e2a2b] border-b-2 border-[#e9a3a0]' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Conseils & Rituel
            </button>
          </div>

          {activeTab === 'description' ? (
            <div className="text-[13px] text-stone-600 leading-relaxed space-y-3">
              <p>{pack.description}</p>
            </div>
          ) : (
            <div className="text-[13px] text-stone-600 leading-relaxed space-y-3">
              <p>{pack.usage_instructions}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}