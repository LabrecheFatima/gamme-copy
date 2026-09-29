import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import logo from '../assets/image.png'; // Ajustez le chemin selon l'emplacement de votre fichier image

export default function Navbar({ cartCount: propCartCount = 0 }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartState = useCart();
  const totalItems = cartState?.totalItems ?? propCartCount;

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-[#f3efe9]/95 backdrop-blur-md border-b border-[#232021]/10 text-[#232021] transition-all duration-300">
      
      {/* Barre d'annonce supérieure (fond sombre d'origine avec texte en gris) */}
      <div className="w-full bg-[#232021] text-[10px] sm:text-[11px] tracking-[0.18em] text-stone-300 py-1.5 text-center uppercase border-b border-white/5 font-medium">
        Online handcrafted products shop
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-12 py-2">
        
        {/* Logo de la marque */}
        <Link to="/" className="flex items-center space-x-2 group">
          <img 
            src={logo} 
            alt="Apoteca Algérie Logo" 
            className="h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
          />
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center space-x-8 font-serif text-xs tracking-widest uppercase text-[#232021]/80 font-medium">
          <Link to="/" className="hover:text-[#232021] transition-colors">SHOP</Link>
          <Link to="/about" className="hover:text-[#232021] transition-colors">ABOUT</Link>
          <Link to="/handcrafted" className="hover:text-[#232021] transition-colors">HANDCRAFTED</Link>
          <Link to="/contact" className="hover:text-[#232021] transition-colors">CONTACT</Link>
        </nav>

        {/* Action Panier & Burger */}
        <div className="flex items-center space-x-5">
          <Link 
            to="/checkout" 
            className="flex items-center space-x-2 text-xs font-serif tracking-widest uppercase text-[#232021]/80 hover:text-[#232021] transition-colors font-medium"
          >
            <span className="hidden sm:inline">CART</span>
            <div className="relative">
              <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#232021] text-[#f3efe9] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </div>
          </Link>

          {/* Bouton Mobile Menu */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#232021] focus:outline-none p-1"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Déroulant Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#f3efe9] border-b border-[#232021]/10 px-8 py-6 flex flex-col space-y-4 font-serif text-sm tracking-widest text-[#232021] uppercase"
          >
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>HOME</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>SHOP</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}