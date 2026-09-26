import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  FolderTree,
  Truck, 
  X, 
  Menu, 
  LogOut, 
  User,
  ArrowLeft
} from 'lucide-react';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Éléments de navigation du menu latéral
  const navItems = [
    { label: 'Tableau de bord', path: '/admin', icon: LayoutDashboard },
    { label: 'Commandes', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Produits', path: '/admin/products', icon: Package },
    { label: 'Catégories', path: '/admin/categories', icon: FolderTree },
    { label: 'Frais de livraison', path: '/admin/shipping', icon: Truck },
  ];

  const handleLogout = () => {
    // Suppression du token de session et redirection vers la page login
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-900 flex">
      {/* 1. Overlay mobile sombre lors de l'ouverture du menu */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. Sidebar / Menu latéral */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-stone-900 text-stone-100 
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* En-tête de la Sidebar */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-stone-800">
          <Link to="/admin" className="flex items-center gap-3">
            <span className="text-xl font-serif tracking-wide text-stone-100">
              APOTECA <span className="text-[10px] uppercase tracking-widest font-sans px-2 py-0.5 bg-stone-800 text-stone-300 rounded border border-stone-700">Admin</span>
            </span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded text-stone-400 hover:text-white lg:hidden"
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Liens de Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Vérification de la route active
            const isActive = item.path === '/admin' 
              ? location.pathname === '/admin' 
              : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-medium uppercase tracking-wider transition-all duration-200
                  ${isActive 
                    ? 'bg-stone-100 text-stone-900 shadow-sm font-semibold' 
                    : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'}
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Pied de la Sidebar */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-medium text-stone-300 bg-stone-800/80 hover:bg-stone-800 rounded-lg transition-colors border border-stone-700/50"
          >
            <ArrowLeft size={14} />
            <span>Voir la boutique</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* 3. Conteneur Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Supérieur */}
        <header className="h-20 bg-white border-b border-stone-200 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-stone-700 hover:bg-stone-100 lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-xl font-serif text-stone-900 hidden sm:block">
              Gestion de la boutique
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-stone-900 uppercase tracking-wider">Administrateur</p>
              <p className="text-[11px] text-stone-500">Apoteca Store</p>
            </div>
            <div className="w-10 h-10 bg-stone-100 border border-stone-300 rounded-full flex items-center justify-center text-stone-700">
              <User size={18} />
            </div>
          </div>
        </header>

        {/* Zone dynamique des pages Admin (<Outlet />) */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}