import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

import imageProduct1 from '../assets/image-product1.png';
import imageProduct2 from '../assets/image-product2.png';
import imageProduct3 from '../assets/image-product3.png';

const STATIC_CATEGORIES = [
  { id: 'serums', name: 'Sérums & Élixirs' },
  { id: 'cremes', name: 'Crèmes & Hydratation' },
  { id: 'masques', name: 'Masques & Soins' },
];

const STATIC_PRODUCTS = [
  { id: 1, slug: 'serum-eclat-vitamine-c', name: 'Sérum Éclat Vitamine C', category_id: 'serums', category_slug: 'serums', description: 'Sérum concentré illuminateur pour unifier le teint et estomper les taches.', original_price: 3800, final_price: 3200, has_promo: true, image_url: imageProduct1 },
  { id: 2, slug: 'creme-hydratante-apaisante', name: 'Crème Hydratante Apaisante', category_id: 'cremes', category_slug: 'cremes', description: 'Soin riche aux extraits botaniques pour réparer la barrière cutanée.', original_price: 2900, final_price: 2900, has_promo: false, image_url: imageProduct2 },
  { id: 3, slug: 'masque-purifiant-argile', name: 'Masque Purifiant Doux', category_id: 'masques', category_slug: 'masques', description: 'Désincruste les pores sans assécher et apporte un fini mat naturel.', original_price: 3100, final_price: 2500, has_promo: true, image_url: imageProduct3 },
];

// Styles partagés (même palette que la page d'accueil)
const INPUT = 'w-full bg-white border border-[#ddd3c8] px-4 py-3 text-xs text-[#2b2626] placeholder-stone-400 focus:outline-none focus:border-[#2e2a2b] transition-colors';
const LABEL = 'block mb-1.5 text-[11px] font-medium text-stone-500';
const BTN = 'text-[11px] font-semibold uppercase tracking-[0.08em] transition cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9a3a0]';
const BTN_PINK = `${BTN} bg-[#e9a3a0] text-white hover:brightness-105`;
const BTN_DARK = `${BTN} bg-[#2e2a2b] text-[#e9e1d8] hover:bg-[#3a3536]`;
const fmt = (n) => `${Number(n).toLocaleString('fr-FR')} DA`;
const priceOf = (p) => Number(p.has_promo ? p.final_price : p.original_price);

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default function Shop() {
  const { addToCart } = useCart();
  const [products] = useState(STATIC_PRODUCTS);
  const [categories] = useState(STATIC_CATEGORIES);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const initialMaxPrice = Math.ceil(Math.max(...products.map(priceOf)) / 1000) * 1000 || 10000;
  const [priceRange, setPriceRange] = useState(initialMaxPrice);
  const [sortBy, setSortBy] = useState('default');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchName = p.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchCategory = selectedCategory === 'all' || p.category_id === selectedCategory || p.category_slug === selectedCategory;
        return matchName && matchCategory && priceOf(p) <= priceRange;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return priceOf(a) - priceOf(b);
        if (sortBy === 'price-desc') return priceOf(b) - priceOf(a);
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        return 0;
      });
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange(initialMaxPrice);
    setSortBy('default');
  };

  const chip = (active) =>
    `px-4 py-2.5 text-xs whitespace-nowrap transition-colors border ${
      active ? 'bg-[#2e2a2b] text-[#e9e1d8] border-[#2e2a2b]' : 'bg-white text-stone-600 border-[#ddd3c8] hover:border-[#2e2a2b]'
    }`;

  // JSX (et non composant interne) : évite de perdre le focus du champ de recherche à chaque frappe
  const filterContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8">
          <label className={LABEL}>Recherche</label>
          <div className="relative">
            <input type="text" placeholder="Rechercher un soin (Sérum, Crème, Masque)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`${INPUT} pl-10`} />
            <SearchIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          </div>
        </div>
        <div className="md:col-span-4">
          <label className={LABEL}>Trier par</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={`${INPUT} cursor-pointer`}>
            <option value="default">Sélection & Pertinence</option>
            <option value="price-asc">Prix : Croissant</option>
            <option value="price-desc">Prix : Décroissant</option>
            <option value="name-asc">Nom : A à Z</option>
            <option value="name-desc">Nom : Z à A</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-end">
        <div className="md:col-span-8">
          <div className="flex justify-between items-center mb-2 text-[11px] text-stone-500">
            <span>Budget max : <strong className="text-[#2e2a2b]">{fmt(priceRange)}</strong></span>
            <span>Plafond : {fmt(initialMaxPrice)}</span>
          </div>
          <input type="range" min="0" max={initialMaxPrice} step="100" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full accent-[#e9a3a0] cursor-pointer" />
        </div>
        <div className="md:col-span-4 flex md:justify-end">
          <button onClick={handleResetFilters} className="text-xs text-stone-500 hover:text-[#2e2a2b] underline underline-offset-4 transition-colors">
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      <div>
        <span className={LABEL}>Catégories</span>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSelectedCategory('all')} className={chip(selectedCategory === 'all')}>Toutes ({products.length})</button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={chip(selectedCategory === cat.id)}>{cat.name}</button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    // Navbar en sticky : plus besoin de padding-top pour la compenser
    <div className="w-full min-h-screen bg-[#f8f5f1] pb-20 font-sans text-[#2b2626]">
      {/* Bandeau titre, même ton que la bannière d'accueil */}
      <div className="bg-[#2e2a2b] px-4 sm:px-6 md:px-12 py-10 md:py-14">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif font-normal uppercase tracking-[0.04em] leading-tight text-[#e9e1d8] text-3xl md:text-5xl mb-3">
            Boutique & Soins
          </h1>
          <p className="text-[#d8cfc6] text-xs md:text-sm max-w-md leading-relaxed">
            Des formulations d'exception conçues pour révéler la beauté naturelle de votre peau.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-8 md:pt-10">
        {/* Recherche & filtres mobile */}
        <div className="md:hidden mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`${INPUT} pl-9 py-2.5`} />
            <SearchIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </div>
          <button onClick={() => setIsMobileFilterOpen(true)} className={`${BTN_DARK} px-4 py-3 shrink-0`}>Filtres</button>
        </div>

        {/* Filtres desktop */}
        <div className="hidden md:block bg-[#f1ede7] p-6 border border-[#e3dcd3] mb-10">{filterContent}</div>

        {/* Filtres mobile (tiroir) */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-[60] md:hidden flex justify-end">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileFilterOpen(false)} className="absolute inset-0 bg-[#2e2a2b]/60" />
              <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full bg-[#f8f5f1] mt-auto max-h-[85vh] overflow-y-auto z-10"
              >
                <div className="flex justify-between items-center px-6 py-4 bg-[#2e2a2b] text-[#e9e1d8]">
                  <h3 className="font-serif text-lg uppercase tracking-[0.04em]">Filtres</h3>
                  <button onClick={() => setIsMobileFilterOpen(false)} aria-label="Fermer" className="p-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="p-6">{filterContent}</div>
                <div className="px-6 pb-6">
                  <button onClick={() => setIsMobileFilterOpen(false)} className={`${BTN_PINK} w-full py-3.5`}>
                    Voir les {filteredProducts.length} résultats
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <p className="mb-6 text-xs text-stone-500">
          <span className="font-semibold text-[#2b2626]">{filteredProducts.length}</span> produit(s) disponible(s)
        </p>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-6 bg-[#f1ede7] border border-[#e3dcd3]">
            <p className="text-stone-500 text-sm mb-6">Aucun soin ne correspond à ces critères de recherche.</p>
            <button onClick={handleResetFilters} className={`${BTN_PINK} px-6 py-3`}>Effacer les filtres</button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-8 md:gap-y-10">
            <AnimatePresence>
              {filteredProducts.map((product) => {
                const to = `/product/${product.slug || product.id}`;
                return (
                  <motion.article
                    layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                    key={product.id} className="flex flex-col items-center text-center group"
                  >
                    <Link to={to} className="relative block w-full aspect-[24/25] overflow-hidden bg-[#e6ddd3] mb-3">
                      <img src={product.image_url} alt={product.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                      {product.has_promo && (
                        <span className="absolute top-3 left-3 bg-[#e9a3a0] text-[#2b2626] text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                          Promo
                        </span>
                      )}
                    </Link>

                    <h3 className="text-[11px] sm:text-xs font-bold uppercase leading-tight">
                      <Link to={to} className="hover:text-stone-600 transition-colors">{product.name}</Link>
                    </h3>
                    <p className="hidden sm:block mt-1.5 text-[11px] text-stone-500 leading-relaxed line-clamp-2 max-w-[28ch]">{product.description}</p>

                    <p className="mt-2 mb-3 flex items-baseline justify-center gap-2 text-[11px] sm:text-xs font-bold">
                      {fmt(priceOf(product))}
                      {product.has_promo && <s className="font-normal text-stone-400">{fmt(product.original_price)}</s>}
                    </p>

                    <button onClick={() => addToCart(product, 1)} className={`${BTN_PINK} w-full max-w-[150px] py-2 rounded-[4px]`}>
                      Ajouter au panier
                    </button>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}