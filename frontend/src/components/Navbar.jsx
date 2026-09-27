import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';

export default function Navbar({ cartCount: propCartCount = 0 }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Récupération dynamique du nombre d'articles du panier
  const cartState = useCart();
  const totalItems = cartState?.totalItems ?? propCartCount;

  // Récupération des catégories créées depuis l'administration
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/categories`);
        const data = res.data?.data || res.data || [];
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        // En cas de différence de préfixe de route backend, essai du chemin direct /categories
        try {
          const fallbackRes = await axios.get(`${API_URL}/categories`);
          const fallbackData = fallbackRes.data?.data || fallbackRes.data || [];
          setCategories(Array.isArray(fallbackData) ? fallbackData : []);
        } catch (fallbackError) {
          console.error("Erreur de chargement des catégories dans la barre de navigation :", fallbackError);
        }
      }
    };

    fetchCategories();
  }, []);

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

          {/* Menu Déroulant des Catégories (Desktop) */}
          {categories.length > 0 && (
            <div 
              className="relative"
              onMouseEnter={() => setIsDesktopDropdownOpen(true)}
              onMouseLeave={() => setIsDesktopDropdownOpen(false)}
            >
              <button 
                type="button" 
                className="flex items-center gap-1.5 hover:text-white transition-colors py-2 cursor-pointer"
              >
                <span>Catégories</span>
                <svg 
                  className={`w-3 h-3 text-stone-400 transition-transform duration-200 ${isDesktopDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Sous-menu au survol */}
              {isDesktopDropdownOpen && (
                <div className="absolute top-full left-0 w-56 bg-stone-900/95 border border-white/10 rounded-2xl shadow-xl py-2 my-1 backdrop-blur-lg animate-in fade-in zoom-in-95 duration-150">
                  <Link
                    to="/shop"
                    className="block px-5 py-2 text-xs text-stone-400 hover:text-white hover:bg-white/10 transition-colors font-light border-b border-white/5 mb-1"
                    onClick={() => setIsDesktopDropdownOpen(false)}
                  >
                    Toutes les catégories
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id || cat.slug}
                      to={`/shop?category=${cat.slug || cat.id}`}
                      className="block px-5 py-2 text-xs text-stone-300 hover:text-white hover:bg-white/10 transition-colors font-light"
                      onClick={() => setIsDesktopDropdownOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
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

        {/* Panier (Droite) */}
        <div className="flex items-center font-light text-stone-200">
          <Link to="/checkout" className="hover:text-white transition-colors flex items-center gap-2">
            <span>Mon Panier</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold text-white">
              ({totalItems})
            </span>
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

          {/* Accordéon Catégories en Mobile */}
          {categories.length > 0 && (
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                className="w-full flex items-center justify-between py-2 text-stone-300 font-light hover:text-white"
              >
                <span>Catégories</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Sous-liste mobile */}
              {isMobileCategoriesOpen && (
                <div className="pl-4 pt-2 space-y-3 pb-2 border-l border-white/10 my-1">
                  <Link
                    to="/shop"
                    className="block text-xs text-stone-300 hover:text-white transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    • Toutes les catégories
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id || cat.slug}
                      to={`/shop?category=${cat.slug || cat.id}`}
                      className="block text-xs text-stone-400 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      • {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}