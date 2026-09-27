// tailwind.config.js
import plugin from 'tailwindcss/plugin';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        apoteca: {
          cream: '#FDFBF7',      // Fond principal[cite: 31]
          charcoal: '#2B2A27',   // En-tête et titres[cite: 31]
          pink: {
            light: '#F6EAE7',    // Fond de la section Packs
            DEFAULT: '#C88880',  // Boutons secondaires / Accents[cite: 31]
            dark: '#A86C64',     // Hover
          },
          sage: {
            light: '#EBF2EE',    // Fond de badges légers
            DEFAULT: '#7A9A8B',  // Accent Fraîcheur / Botanique
          },
          terracotta: '#D48C70', // Prix promo / Badges d'urgence
          grey: '#E5E2DC',       // Bordures douces
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
      });
    }),
  ],
};