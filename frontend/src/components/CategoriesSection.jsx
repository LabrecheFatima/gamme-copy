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

        setCategories(
          data.map((cat, index) => {
            const fallbackAsset = STATIC_ASSETS[index % STATIC_ASSETS.length];
            return { ...cat, badge: fallbackAsset.badge, image: fallbackAsset.image };
          })
        );
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const containerAnim = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
  };
  const cardAnim = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] } },
  };

  if (loading) {
    return (
      <section className="py-10 md:py-14 px-6 md:px-16 bg-[#f8f5f1] text-center text-xs text-stone-500">
        Chargement des catégories...
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 md:px-16 bg-[#f8f5f1] text-[#2b2626]">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8 md:mb-10 font-serif font-normal uppercase tracking-[0.04em] leading-tight text-[#2e2a2b] text-3xl md:text-5xl"
        >
          Nos catégories
        </motion.h2>

        <motion.div
          variants={containerAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {categories.map((cat) => (
            <motion.article key={cat.id} variants={cardAnim} className="group flex flex-col bg-[#2e2a2b] select-none">
              {/* Image */}
              <div className="relative h-72 sm:h-96 md:h-[420px] overflow-hidden bg-[#e6ddd3]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-[#e9a3a0] text-[#2b2626] text-[10px] font-bold uppercase tracking-wider px-3 py-1">
                  {cat.badge}
                </span>
              </div>

              {/* Texte, même panneau sombre que la bannière */}
              <div className="p-5 sm:p-6">
                <h3 className="font-serif font-normal uppercase tracking-[0.04em] text-[#e9e1d8] text-2xl sm:text-3xl mb-2">
                  {cat.name}
                </h3>
                <p className="text-[13px] text-[#d8cfc6] leading-relaxed line-clamp-2 max-w-md">
                  {cat.usage_method || 'Formules concentrées pour régénérer et apaiser la peau.'}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}