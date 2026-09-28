import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Importation des images des packs
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
  },
  {
    id: "pack-hydratation",
    slug: "pack-hydratation",
    name: "Pack Hydratation Intense",
    original_price: 7500,
    promo_price: 5900,
    image_url: imageProduct2,
  },
  {
    id: "pack-purifiant",
    slug: "pack-purifiant",
    name: "Pack Rituel Purifiant",
    original_price: 6800,
    promo_price: 5200,
    image_url: imageProduct3,
  }
];

export default function PacksCarousel() {
  const packs = STATIC_PACKS;
  const infinitePacks = [...packs, ...packs];

  return (
    <section className="relative bg-[#F6EAE7] pt-20 pb-20 overflow-hidden">
      {/* Vague ondulée du HAUT */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-20">
        <svg
          className="relative block w-full h-8 sm:h-12 md:h-16 text-apoteca-cream"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,40 L1200,0 L0,0 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-6 mb-8 relative z-10">
        <div>
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-stone-900">
            Nos Packs Exclusifs
          </h2>
          <p className="text-stone-600 text-sm mt-1 font-medium">
            Profitez de nos combinaisons de soins à prix réduits
          </p>
        </div>
      </div>

      {/* Conteneur du défilement fluide infini */}
      <div className="w-full overflow-hidden py-4 flex relative z-10">
        <motion.div
          className="flex gap-6 shrink-0"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: Math.max(15, packs.length * 5),
          }}
          whileHover={{ animationPlayState: 'paused' }}
        >
          {infinitePacks.map((pack, index) => {
            const hasPromo = pack.promo_price && Number(pack.promo_price) > 0;

            return (
              <Link
                key={`${pack.id}-${index}`}
                to={`/pack/${pack.slug || pack.id}`}
                className="w-[280px] sm:w-[320px] md:w-[350px] h-[460px] sm:h-[500px] relative rounded-3xl overflow-hidden shadow-xl border border-white/50 flex-shrink-0 cursor-pointer group block"
              >
                {/* Image de fond du Pack */}
                <div className="absolute inset-0 w-full h-full bg-stone-200">
                  <img
                    src={pack.image_url}
                    alt={pack.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Dégradé en haut pour la lisibilité du texte */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Contenu du Pack (Écriture en haut) */}
                <div className="relative z-10 p-6 flex flex-col justify-start h-full text-center">
                  <h3 className="text-xl sm:text-2xl font-serif font-medium tracking-wide text-white drop-shadow-md mb-2">
                    {pack.name}
                  </h3>

                  <div className="flex flex-col items-center justify-center gap-1">
                    {hasPromo ? (
                      <>
                        <span className="text-xs sm:text-sm font-light text-white/80 line-through tracking-wider">
                          {pack.original_price} DA
                        </span>
                        <span className="text-xl sm:text-2xl font-serif font-semibold text-white tracking-tight drop-shadow-md">
                          {pack.promo_price} DA
                        </span>
                      </>
                    ) : (
                      <span className="text-xl sm:text-2xl font-serif font-semibold text-white tracking-tight drop-shadow-md">
                        {pack.original_price} DA
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </motion.div>
      </div>

      {/* Vague ondulée du BAS */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-20">
        <svg
          className="relative block w-full h-8 sm:h-12 md:h-16 text-apoteca-cream rotate-180"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,40 L1200,0 L0,0 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}