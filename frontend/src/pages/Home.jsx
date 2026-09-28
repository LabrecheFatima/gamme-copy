import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Importation des images du carrousel et des produits
import heroImg1 from '../assets/hero-1.png';
import heroImg2 from '../assets/hero-2.png';
import heroImg3 from '../assets/hero-3.png';

import imageProduct1 from '../assets/image-product1.png';
import imageProduct2 from '../assets/image-product2.png';
import imageProduct3 from '../assets/image-product3.png';
import imageProduct4 from '../assets/image-product4.png';

import CategoriesSection from '../components/CategoriesSection';
import AboutVideoSection from '../components/AboutVideoSection';
import GlowSection from '../components/GlowSection';
import PacksCarousel from '../components/PackCarousel';

const heroSlides = [
  {
    image: heroImg1,
    title: "Révélez Votre Éclat Naturel",
    description: "Des soins nourrissants conçus pour sublimer la beauté naturelle de votre peau avec des formules pures, douces et approuvées par les dermatologues."
  },
  {
    image: heroImg2,
    title: "Une Peau Saine & Lumineuse",
    description: "Restaurez la vitalité de votre épiderme grâce à des complexes botaniques aux vertus apaisantes et régénérantes."
  },
  {
    image: heroImg3,
    title: "Sensation de Fraîcheur Pure",
    description: "Offrez à votre visage une hydratation continue tout au long de la journée avec nos soins ultra-concentrés."
  }
];

// Produits statiques générés
const STATIC_PRODUCTS = [
  {
    id: "1",
    slug: "serum-hydratant-eclat",
    name: "Sérum Hydratant Éclat intense",
    category_name: "Sérums & Soins",
    image: imageProduct1,
    has_promo: true,
    original_price: 3800,
    final_price: 3200,
    price: 3200,
    description: "Formule concentrée à l'acide hyaluronique et à la vitamine C pour hydrater en profondeur et illuminer le teint instantanément."
  },
  {
    id: "2",
    slug: "creme-regenerante-nuit",
    name: "Crème Régénérante de Nuit",
    category_name: "Crèmes Hydratantes",
    image: imageProduct2,
    has_promo: false,
    original_price: 4200,
    final_price: 4200,
    price: 4200,
    description: "Soin de nuit nourrissant enrichi en huiles botaniques pour réparer la barrière cutanée pendant votre sommeil."
  },
  {
    id: "3",
    slug: "lotion-purifiante-botanique",
    name: "Lotion Purifiante Botanique",
    category_name: "Nettoyants & Lotions",
    image: imageProduct3,
    has_promo: true,
    original_price: 2900,
    final_price: 2400,
    price: 2400,
    description: "Lotion rééquilibrante à base d'extraits végétaux pour resserrer les pores et matifier le teint en douceur."
  },
  {
    id: "4",
    slug: "fluid-protecteur-uv",
    name: "Fluide Protecteur UV SPF50+",
    category_name: "Protection Solaire",
    image: imageProduct4,
    has_promo: false,
    original_price: 3500,
    final_price: 3500,
    price: 3500,
    description: "Protection solaire quotidienne invisible à fini mat qui protège contre les rayons UVA/UVB et la pollution."
  }
];

export default function HomeHero() {
  const scrollRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { addToCart } = useCart();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const offset = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const cardAnim = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    e.preventDefault();
    if (addToCart) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="w-full bg-apoteca-cream font-sans overflow-hidden">
      {/* SECTION HERO */}
      <section className="relative w-full h-[100dvh] md:h-[85vh] flex flex-col justify-end bg-black text-white overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-40 scale-110 hidden md:block"
              style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
            />
            <div 
              className="w-full h-full bg-cover md:bg-contain bg-center md:bg-right bg-no-repeat transition-all duration-700"
              style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent md:bg-gradient-to-r md:from-black md:via-black/70 md:to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 w-full flex flex-col justify-end px-6 md:px-16 pt-28 pb-12 sm:pb-16 md:pb-20 max-w-3xl">
          <motion.h1 
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight text-white leading-[1.1] mb-4"
          >
            {heroSlides[currentSlide].title}
          </motion.h1>
          
          <motion.p 
            key={`desc-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm sm:text-base text-stone-200 font-light leading-relaxed max-w-md mb-8"
          >
            {heroSlides[currentSlide].description}
          </motion.p>

          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <a
              href="#shop"
              className="inline-block px-8 py-3 border border-white/80 text-xs sm:text-sm tracking-widest uppercase text-white hover:bg-white hover:text-stone-900 transition-all duration-300 backdrop-blur-sm"
            >
              Découvrir
            </a>
          </motion.div>

          <div className="flex gap-2.5 mt-8 z-20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Diapositive ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  idx === currentSlide ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION BEST SELLERS */}
      <section id="shop" className="py-16 md:py-24 px-6 md:px-16 bg-stone-50 text-stone-900 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-end mb-10 md:mb-14"
          >
            <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-stone-900">
              Nos Meilleures Ventes
            </h2>
            
            <div className="hidden md:flex gap-3">
              <button 
                onClick={() => scroll('left')}
                className="w-12 h-12 border border-stone-300 flex items-center justify-center hover:border-stone-900 transition-colors cursor-pointer"
                aria-label="Précédent"
              >
                <svg className="w-5 h-5 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => scroll('right')}
                className="w-12 h-12 bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-opacity cursor-pointer"
                aria-label="Suivant"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>

          <div className="relative group">
            <motion.div 
              ref={scrollRef}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {STATIC_PRODUCTS.map((product) => (
                <motion.div 
                  key={product.id}
                  variants={cardAnim}
                  className="min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-start"
                >
                  <Link 
                    to={`/product/${product.slug}`}
                    className="group block bg-white border border-stone-200/80 rounded-xl overflow-hidden shadow-xs hover:shadow-xl hover:border-stone-300 transition-all duration-300 flex flex-col justify-between h-full"
                  >
                    {/* En-tête de la carte */}
                    <div className="p-4 flex justify-between items-start z-10">
                      <span className="bg-stone-100/90 backdrop-blur-xs px-3 py-1 text-[10px] tracking-widest uppercase text-stone-800 border border-stone-200/60 font-semibold rounded-full">
                        {product.has_promo ? 'PROMO' : 'Nouveauté'}
                      </span>
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        title="Ajouter au panier"
                        className="w-9 h-9 bg-stone-900 text-white rounded-full flex items-center justify-center hover:bg-stone-800 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer z-20"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    {/* Zone d'image du produit */}
                    <div className="w-full h-64 sm:h-72 bg-stone-50/50 flex items-center justify-center p-6 overflow-hidden relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>

                    {/* Informations du produit */}
                    <div className="p-5 bg-white border-t border-stone-100 flex justify-between items-end gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-stone-900 mb-1 truncate group-hover:text-stone-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-stone-400 font-light truncate">{product.category_name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {product.has_promo ? (
                          <div className="flex flex-col items-end">
                            <span className="line-through text-[11px] text-stone-400">{product.original_price} DA</span>
                            <span className="text-sm font-semibold text-red-600">{product.final_price} DA</span>
                          </div>
                        ) : (
                          <span className="text-sm font-semibold text-stone-900">
                            {product.original_price} DA
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* COMPOSANTS SECONDAIRES */}
      <PacksCarousel />
      <CategoriesSection /> 
      <AboutVideoSection />
      <GlowSection />
    </div>
  );
}