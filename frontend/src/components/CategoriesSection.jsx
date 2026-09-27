import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../config';

// Images statiques de fallback
import imageProduct1 from '../assets/product-category3.png';
import imageProduct2 from '../assets/product-category2.png';
import imageProduct3 from '../assets/product-category1.png';
import imageProduct4 from '../assets/product-category4.png';

const STATIC_ASSETS = [
  { image: imageProduct3, badge: 'Bestseller' },
  { image: imageProduct2, badge: 'Incontournable' },
  { image: imageProduct1, badge: 'Purifiant' },
  { image: imageProduct4, badge: 'Protection UV' },
];

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        const data = response.data.data || response.data || [];

        const formattedCategories = data.map((cat, index) => {
          const fallbackAsset = STATIC_ASSETS[index % STATIC_ASSETS.length];
          return {
            ...cat,
            badge: fallbackAsset.badge,
            image: fallbackAsset.image,
          };
        });

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Variantes Framer Motion pour le conteneur
  const containerAnim = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1,
      },
    },
  };

  // Variantes Framer Motion pour chaque carte
  const cardAnim = {
    hidden: { opacity: 0, y: 35, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1.0], // Courbe bézier pour un rendu très doux
      },
    },
  };

  if (loading) {
    return (
      <section className="py-10 md:py-14 px-6 md:px-16 bg-[#FDFBF7] text-neutral-900 text-center text-xs text-neutral-400">
        Chargement des catégories...
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-14 px-4 sm:px-6 md:px-16 bg-[#FDFBF7] text-neutral-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Titre de section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-5 md:mb-6"
        >
          <span className="text-[11px] uppercase tracking-widest text-neutral-500 mb-1 block">
            Exploration
          </span>
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-neutral-900">
            Nos Catégories
          </h2>
        </motion.div>

        {/* Grille des cartes (2 colonnes larges, non cliquables) */}
        <motion.div 
          variants={containerAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              variants={cardAnim}
              whileHover={{ 
                y: -8, 
                boxShadow: '0px 20px 30px -10px rgba(0, 0, 0, 0.08)' 
              }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 flex flex-col justify-between group select-none h-full relative overflow-hidden"
            >
              {/* En-tête de la carte */}
              <div className="mb-4 z-10">
                <div className="flex justify-start items-center mb-3">
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="bg-[#F5F2EC] px-3.5 py-1 rounded-md text-xs font-medium text-neutral-700 inline-block"
                  >
                    {cat.badge}
                  </motion.span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif text-neutral-900 mb-2 transition-colors duration-300 group-hover:text-[#8A9A86]">
                  {cat.name}
                </h3>
                <p className="text-sm text-neutral-500 font-light leading-relaxed line-clamp-2">
                  {cat.usage_method || 'Formules concentrées pour régénérer et apaiser la peau.'}
                </p>
              </div>

              {/* Image XXL avec animation au survol */}
              <div className="w-full h-96 md:h-[450px] rounded-2xl overflow-hidden bg-[#F8F6F0] relative mt-2">
                <motion.img 
                  src={cat.image} 
                  alt={cat.name}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover object-center" 
                />
                
                {/* Overlay subtil au survol */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}