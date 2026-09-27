import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';

// Composant de compteur animé pour les statistiques
function Counter({ value, suffix = '' }) {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: '-50px' });
  const numericValue = parseInt(value, 10) || 0;

  useEffect(() => {
    if (!isInView || !nodeRef.current) return;

    const controls = animate(0, numericValue, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        if (nodeRef.current) {
          nodeRef.current.textContent = Math.round(latest) + suffix;
        }
      },
    });

    return () => controls.stop();
  }, [isInView, numericValue, suffix]);

  return <span ref={nodeRef}>0{suffix}</span>;
}

export default function AboutVideoSection() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Chemin de la vidéo
  const promoVideo = '/videos/promo.MP4';

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stats = [
    { target: 100, suffix: '%', label: 'Formules Professionnelles' },
    { target: 95, suffix: '%', label: 'Satisfaction Client' },
    { target: 15, suffix: '+', label: 'Années d’Expertise' },
    { target: 200, suffix: '+', label: 'Soins Essentiels' },
  ];

  // Variantes Framer Motion pour l'animation séquentielle du texte
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Décalage entre le badge, le titre et la description
        delayChildren: 0.1,
      },
    },
  };

  const textItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.1, 0.25, 1.0] 
      },
    },
  };

  return (
    <section id="about" className="py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-[#FDFBF7] text-neutral-900">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* En-tête textuel supérieur animé */}
        <motion.div
          variants={textContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-12 max-w-3xl flex flex-col items-center"
        >
          {/* Badge "À PROPOS" stylisé */}
          <motion.div variants={textItemVariants} className="inline-flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
            <span className="h-[1px] w-8 bg-neutral-300"></span>
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">
              À Propos
            </span>
            <span className="h-[1px] w-8 bg-neutral-300"></span>
            <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
          </motion.div>

          {/* Titre principal */}
          <motion.h2 
            variants={textItemVariants}
            className="text-3xl sm:text-5xl md:text-6xl font-serif tracking-tight text-neutral-900 leading-tight"
          >
            L'Excellence Professionnelle au Service de Votre Peau
          </motion.h2>

          {/* Texte de description */}
          <motion.p 
            variants={textItemVariants}
            className="mt-5 text-sm md:text-lg text-neutral-600 font-light max-w-2xl leading-relaxed"
          >
            Développés par des experts dermatologues, nos soins allient rigueur scientifique et ingrédients d'exception pour vous offrir une routine de qualité professionnelle à domicile.
          </motion.p>
        </motion.div>

        {/* Cadre Vidéo XL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl h-[500px] sm:h-[650px] rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-neutral-900 group cursor-pointer"
          onClick={togglePlay}
        >
          {/* Lecteur Vidéo */}
          <video
            ref={videoRef}
            src={promoVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-85 transition-opacity duration-500 group-hover:opacity-75"
          />

          {/* Calque de dégradé sombre */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

          {/* Bouton Play / Pause */}
          {!isPlaying && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/40 shadow-xl z-20">
              <svg className="w-8 h-8 fill-current translate-x-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}

          {/* Calque inférieur avec Statistiques & Marque APOTECA */}
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-12 z-10 flex flex-col gap-6 text-white text-center sm:text-left backdrop-blur-xs bg-black/15 pointer-events-none">
            
            {/* Titre APOTECA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="border-b border-white/20 pb-4"
            >
              <h3 className="text-3xl sm:text-4xl font-serif tracking-widest text-white uppercase">
                Apoteca
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-light mt-1">
                L'art de la cosmétique pure et naturelle.
              </p>
            </motion.div>

            {/* Grille des statistiques avec compteurs animés */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-3xl sm:text-5xl font-serif font-semibold tracking-tight text-white mb-1">
                    <Counter value={stat.target} suffix={stat.suffix} />
                  </span>
                  <span className="text-xs sm:text-sm text-neutral-300 font-light leading-snug">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}