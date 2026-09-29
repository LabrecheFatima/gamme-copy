import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function Navbar({ cartCount: propCartCount = 0 }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartState = useCart();
  const totalItems = cartState?.totalItems ?? propCartCount;

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-[#2e2a2b]/95 backdrop-blur-md border-b border-white/10 text-[#e8e4de] transition-all duration-300">
      
      {/* Barre d'annonce supérieure */}
      <div className="w-full bg-[#232021] text-[10px] sm:text-[11px] tracking-[0.18em] text-stone-300 py-1.5 text-center uppercase border-b border-white/5">
        Online handcrafted products shop
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-12 py-2.5 md:py-3">
        
        {/* Logo de la marque */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="border border-white/30 rounded-full px-3 py-1 bg-white/5 group-hover:border-white/60 transition-colors">
            <span className="text-sm md:text-base font-serif tracking-widest text-white uppercase font-medium">
              APOTECA
            </span>
          </div>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center space-x-8 font-serif text-xs tracking-widest uppercase text-stone-300">
          <Link to="/" className="hover:text-white transition-colors">SHOP</Link>
          <Link to="/about" className="hover:text-white transition-colors">ABOUT</Link>
          <Link to="/handcrafted" className="hover:text-white transition-colors">HANDCRAFTED</Link>
          <Link to="/contact" className="hover:text-white transition-colors">CONTACT</Link>
        </nav>

        {/* Action Panier & Burger */}
        <div className="flex items-center space-x-5">
          <Link 
            to="/checkout" 
            className="flex items-center space-x-2 text-xs font-serif tracking-widest uppercase hover:text-white transition-colors"
          >
            <span className="hidden sm:inline">CART</span>
            <div className="relative">
              <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#e9a3a0] text-[#232021] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </div>
          </Link>

          {/* Bouton Mobile Menu */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white focus:outline-none p-1"
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
            className="md:hidden bg-[#262223] border-b border-white/10 px-8 py-6 flex flex-col space-y-4 font-serif text-sm tracking-widest text-stone-200 uppercase"
          >
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>HOME</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>SHOP</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}