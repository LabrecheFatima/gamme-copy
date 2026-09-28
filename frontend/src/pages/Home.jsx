import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

// Importation des images du carrousel
import heroImg1 from '../assets/hero-1.png';
import heroImg2 from '../assets/hero-2.png';
import heroImg3 from '../assets/hero-3.png';

import CategoriesSection from '../components/CategoriesSection';
import AboutVideoSection from '../components/AboutVideoSection';
import GlowSection from '../components/GlowSection';
import PacksCarousel from '../components/PackCarousel';
import { API_URL } from '../config';

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

export default function HomeHero() {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { addToCart } = useCart();
  const serverBaseUrl = API_URL.replace(/\/api\/?$/, '');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Demande 10 produits au backend
        const response = await axios.get(`${API_URL}/products?limit=10`);
        const data = response.data.data || response.data || [];
        // Limite strictly aux 10 premiers produits reçus
        setProducts(data.slice(0, 10));
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder.png';
    if (imageUrl.startsWith('http')) return imageUrl;
    const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${serverBaseUrl}${cleanPath}`;
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
            {loading ? (
              <div className="text-center py-12 text-stone-500">Chargement des produits...</div>
            ) : (
              <motion.div 
                ref={scrollRef}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={staggerContainer}
                className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {products.map((product) => {
                  const productSlug = product.slug || product.id || product._id;

                  return (
                    <motion.div 
                      key={product.id || product._id}
                      variants={cardAnim}
                      className="min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-start"
                    >
                      <Link 
                        to={`/product/${productSlug}`}
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
                            src={getImageUrl(product.image_url)} 
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
                            <p className="text-xs text-stone-400 font-light truncate">Soins de la peau</p>
                          </div>
                          <div className="text-right shrink-0">
                            {product.has_promo ? (
                              <div className="flex flex-col items-end">
                                <span className="line-through text-[11px] text-stone-400">{product.original_price} DA</span>
                                <span className="text-sm font-semibold text-red-600">{product.final_price} DA</span>
                              </div>
                            ) : (
                              <span className="text-sm font-semibold text-stone-900">
                                {product.original_price || product.price} DA
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
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