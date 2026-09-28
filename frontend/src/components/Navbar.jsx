import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar({ cartCount: propCartCount = 0 }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Récupération dynamique du nombre d'articles du panier
  const cartState = useCart();
  const totalItems = cartState?.totalItems ?? propCartCount;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-stone-900/80 backdrop-blur-md border-b border-white/10 text-white transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4 text-sm tracking-wide">
        
        {/* Navigation Gauche (Desktop) */}
        <nav className="hidden md:flex items-center space-x-8 font-light text-stone-200">
          <Link to="/" className="hover:text-white transition-colors">
            Accueil
          </Link>
          <Link to="/shop" className="hover:text-white transition-colors">
            Boutique
          </Link>
        </nav>

        {/* Bouton Menu Burger (Mobile) */}
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

        {/* Logo / Nom du Site */}
        <Link to="/" className="text-xl md:text-2xl tracking-wider font-serif font-medium text-white">
          Apoteca-dz
        </Link>

        {/* Icône du Panier (Droite) */}
        <div className="flex items-center font-light text-stone-200">
          <Link 
            to="/checkout" 
            className="relative p-2 hover:text-white transition-colors flex items-center justify-center"
            aria-label="Voir le panier"
          >
            {/* Icône Panier SVG */}
            <svg 
              className="w-6 h-6 stroke-stone-200 hover:stroke-white transition-colors" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="1.5"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" 
              />
            </svg>

            {/* Badge de notification du nombre d'articles */}
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-apoteca-pink text-stone-900 font-semibold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-150">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Menu Déroulant (Mobile) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-stone-900/95 backdrop-blur-xl border-b border-white/10 px-8 py-6 flex flex-col space-y-4 text-stone-200 text-sm">
          <Link 
            to="/" 
            className="hover:text-white transition-colors py-1" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Accueil
          </Link>
          
          <Link 
            to="/shop" 
            className="hover:text-white transition-colors py-1" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Boutique
          </Link>
        </div>
      )}
    </header>
  );
}