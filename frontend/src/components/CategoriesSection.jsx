import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

// Images statiques de fallback
import imageProduct1 from '../assets/product-category3.png';
import imageProduct2 from '../assets/product-category2.png';
import imageProduct3 from '../assets/product-category1.png';
import imageProduct4 from '../assets/product-category4.png';

// Tableau des assets par défaut à réattribuer dynamiquement
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

        // Associer dynamiquement chaque catégorie de l'API avec une image/badge statique
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

  const containerAnim = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const cardAnim = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 px-6 md:px-16 bg-[#FDFBF7] text-neutral-900 text-center text-xs text-neutral-400">
        Chargement des catégories...
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 px-6 md:px-16 bg-[#FDFBF7] text-neutral-900">
      <div className="max-w-7xl mx-auto">
        {/* Titre de section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <span className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">
            Exploration
          </span>
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-neutral-900">
            Nos Catégories
          </h2>
        </motion.div>

        {/* Grille des catégories dynamiques */}
        <motion.div 
          variants={containerAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((cat) => (
            <Link key={cat.id} to={`/shop?category=${cat.id}`}>
              <motion.div
                variants={cardAnim}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 flex flex-col justify-between group cursor-pointer transition-all duration-300 hover:shadow-md h-full"
              >
                {/* En-tête de la carte */}
                <div>
                  <div className="flex justify-start items-center mb-4">
                    <span className="bg-[#F5F2EC] px-3 py-1 rounded-md text-xs font-medium text-neutral-700">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif text-neutral-900 mb-2 group-hover:text-[#8A9A86] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed mb-6 line-clamp-2">
                    {cat.usage_method || 'Formules concentrées pour régénérer et apaiser la peau.'}
                  </p>
                </div>

                {/* Conteneur de l'image */}
                <div className="w-full h-60 rounded-xl overflow-hidden bg-[#F8F6F0] relative mt-auto">
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}