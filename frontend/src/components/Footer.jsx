import React from 'react';
import { motion } from 'framer-motion';

const COLUMNS = [
  { title: 'Boutique', links: ['Sérums & Huiles', 'Crèmes Visage', 'Nettoyants', 'Nouveautés'], href: '#shop' },
  { title: 'À propos', links: ['Notre Histoire', 'Engagements & Ingrédients', 'Avis Clients', 'Contact'], href: '#' },
  { title: 'Aide & FAQ', links: ['Livraison & Retours', 'Politique de Confidentialité', 'Conditions Générales', 'FAQ'], href: '#' },
];

const LINK = 'text-[#c9bfb5] hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#e9a3a0]';

export default function Footer() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <footer className="bg-[#2e2a2b] text-[#e6ddd3] border-t border-white/10 pt-14 md:pt-16 pb-8 px-5 sm:px-6 md:px-16 font-sans">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 pb-12 border-b border-white/10"
        >
          {/* Marque & newsletter */}
          <motion.div variants={fadeInUp} className="md:col-span-5">
            <span className="inline-block border border-white/30 rounded-full px-4 py-1 bg-white/5 font-serif tracking-widest text-white uppercase text-base mb-5">
              Apoteca
            </span>
            <p className="text-[13px] text-[#d8cfc6] leading-relaxed max-w-sm mb-6">
              Rejoignez notre communauté pour recevoir nos conseils beauté, des offres exclusives et l'actualité de nos formules naturelles.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                type="email"
                placeholder="Votre adresse email"
                aria-label="Adresse email"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-sm text-white placeholder-[#a89f97] focus:outline-none focus:border-[#e9a3a0] transition-colors rounded-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#e9a3a0] text-white font-semibold text-[11px] uppercase tracking-[0.08em] hover:brightness-105 transition whitespace-nowrap cursor-pointer"
              >
                S'abonner
              </button>
            </form>
          </motion.div>

          {/* Liens */}
          <motion.div variants={fadeInUp} className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {COLUMNS.map((col, i) => (
              <div key={col.title} className={i === 2 ? 'col-span-2 sm:col-span-1' : ''}>
                <h3 className="font-serif text-lg uppercase tracking-[0.04em] text-[#e9e1d8] mb-4">{col.title}</h3>
                <ul className="space-y-2.5 text-xs">
                  {col.links.map((label) => (
                    <li key={label}>
                      <a href={col.href} className={LINK}>{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bas de page */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#a89f97]">
          <p>© {new Date().getFullYear()} Apoteca. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            {['Instagram', 'Facebook', 'Pinterest'].map((name) => (
              <a key={name} href="#" className={LINK} aria-label={name}>{name}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}