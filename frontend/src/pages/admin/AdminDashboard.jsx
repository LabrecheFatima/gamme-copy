import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  FolderTree, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  ArrowRight,
  AlertCircle,
  Crown,
  Flame,
  PieChart
} from 'lucide-react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordersRes, productsRes, categoriesRes] = await Promise.all([
          api.get('/admin/orders'),
          api.get('/products'),
          api.get('/categories')
        ]);

        setOrders(ordersRes.data || []);
        setProducts(productsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (err) {
        console.error('Erreur lors du chargement des données du tableau de bord :', err);
        setError(err.response?.data?.error || 'Impossible de charger les données du tableau de bord.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- CALCULS & ANALYTIQUES ---

  // 1. Statistiques Générales
  const stats = useMemo(() => {
    const activeOrders = orders.filter(o => o.status !== 'cancelled');
    
    const totalRevenue = activeOrders.reduce((sum, o) => sum + (Number(o.total_price) || 0), 0);

    const ordersByStatus = orders.reduce((acc, o) => {
      const status = o.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 });

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalCategories: categories.length,
      ordersByStatus
    };
  }, [orders, products, categories]);

  // 2. Produit le plus vendu (Best Seller) & Ventes par Catégorie
  const analytics = useMemo(() => {
    const productSales = {}; // { productId: { quantity: 0, revenue: 0, details: product } }
    const categorySales = {}; // { categoryId/Name: { quantity: 0, details: category } }

    const activeOrders = orders.filter(o => o.status !== 'cancelled');

    activeOrders.forEach(order => {
      // Parser items s'il est au format string JSON
      let items = order.items || [];
      if (typeof items === 'string') {
        try { items = JSON.parse(items); } catch (e) { items = []; }
      }

      items.forEach(item => {
        const pId = item.product_id || item.id;
        const qty = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;

        // Ventes de Produits
        if (!productSales[pId]) {
          const matchedProd = products.find(p => p.id === pId) || {};
          productSales[pId] = {
            id: pId,
            title: item.title || matchedProd.title || `Produit #${pId}`,
            image: matchedProd.image || item.image || null,
            category_id: matchedProd.category_id || item.category_id,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[pId].quantity += qty;
        productSales[pId].revenue += qty * price;

        // Ventes de Catégories
        const catId = productSales[pId].category_id || 'Autre';
        if (!categorySales[catId]) {
          const matchedCat = categories.find(c => c.id === catId);
          categorySales[catId] = {
            id: catId,
            name: matchedCat ? matchedCat.name : (typeof catId === 'string' ? catId : 'Non classé'),
            quantity: 0,
            revenue: 0
          };
        }
        categorySales[catId].quantity += qty;
        categorySales[catId].revenue += qty * price;
      });
    });

    // Trier les produits par quantité vendue
    const sortedProducts = Object.values(productSales).sort((a, b) => b.quantity - a.quantity);
    const bestProduct = sortedProducts[0] || null;

    // Trier les catégories par quantité vendue
    const sortedCategories = Object.values(categorySales).sort((a, b) => b.quantity - a.quantity);
    const bestCategory = sortedCategories[0] || null;

    return {
      bestProduct,
      bestCategory,
      sortedProducts: sortedProducts.slice(0, 5), // Top 5 Produits
      sortedCategories
    };
  }, [orders, products, categories]);

  const renderStatusBadge = (status) => {
    const config = {
      pending: { label: 'En attente', style: 'bg-amber-50 text-amber-700 border-amber-200' },
      confirmed: { label: 'Confirmée', style: 'bg-blue-50 text-blue-700 border-blue-200' },
      shipped: { label: 'Expédiée', style: 'bg-purple-50 text-purple-700 border-purple-200' },
      delivered: { label: 'Livrée', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      cancelled: { label: 'Annulée', style: 'bg-rose-50 text-rose-700 border-rose-200' }
    };
    const item = config[status] || config.pending;
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${item.style}`}>
        {item.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-stone-900 border-t-transparent"></div>
        <p className="text-sm text-stone-500 mt-3">Calcul des données du tableau de bord...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 flex items-center gap-3 text-sm">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <h2 className="text-2xl font-serif text-stone-900">Tableau de Bord</h2>
        <p className="text-xs text-stone-500 mt-1">Analyse des performances de vente, tops produits et état des commandes</p>
      </div>

      {/* Cartes KPIs principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Chiffre d'affaires</p>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mt-2 font-mono">
              {stats.totalRevenue.toLocaleString()} <span className="text-sm font-sans font-normal text-stone-500">DZD</span>
            </h3>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Commandes Totales</p>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mt-2 font-mono">
              {stats.totalOrders}
            </h3>
          </div>
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Catalogue Produits</p>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mt-2 font-mono">
              {stats.totalProducts}
            </h3>
          </div>
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <Package size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Catégories</p>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mt-2 font-mono">
              {stats.totalCategories}
            </h3>
          </div>
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100">
            <FolderTree size={24} />
          </div>
        </div>
      </div>

      {/* SECTION ANNALYSE : TOPS VENTES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Produit le plus vendu */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Crown size={14} /> Produit #1 le Plus Vendu
              </span>
              <Flame className="text-amber-500 animate-pulse" size={20} />
            </div>

            {analytics.bestProduct ? (
              <div className="flex items-center gap-4 mt-2">
                <div className="w-20 h-20 bg-stone-100 rounded-xl overflow-hidden border border-stone-200 shrink-0 flex items-center justify-center">
                  {analytics.bestProduct.image ? (
                    <img 
                      src={analytics.bestProduct.image.startsWith('http') ? analytics.bestProduct.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${analytics.bestProduct.image}`} 
                      alt={analytics.bestProduct.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="text-stone-400" size={32} />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-serif font-semibold text-stone-900 line-clamp-1">
                    {analytics.bestProduct.title}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    Total unités vendues : <strong className="text-stone-900 font-mono text-sm">{analytics.bestProduct.quantity}</strong>
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Revenu généré : <strong className="text-emerald-600 font-mono text-sm">{analytics.bestProduct.revenue.toLocaleString()} DZD</strong>
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-6 text-center">Aucune donnée de vente enregistrée.</p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Basé sur les commandes confirmées / livrées</span>
            <Link to="/admin/products" className="text-stone-900 font-medium hover:underline flex items-center gap-1">
              Voir tous les produits <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Catégorie la plus vendue */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                <PieChart size={14} /> Catégorie N°1
              </span>
            </div>

            {analytics.bestCategory ? (
              <div className="space-y-3 mt-2">
                <h4 className="text-2xl font-serif font-bold text-stone-900">
                  {analytics.bestCategory.name}
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-100">
                  <div>
                    <span className="text-[11px] text-stone-500 uppercase tracking-wider block">Articles Vendus</span>
                    <span className="text-xl font-bold font-mono text-stone-900">{analytics.bestCategory.quantity} pcs</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-500 uppercase tracking-wider block">Volume de Ventes</span>
                    <span className="text-xl font-bold font-mono text-purple-700">{analytics.bestCategory.revenue.toLocaleString()} DZD</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-6 text-center">Aucune catégorie identifiée.</p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Performance des catégories</span>
            <Link to="/admin/categories" className="text-stone-900 font-medium hover:underline flex items-center gap-1">
              Gérer les catégories <ArrowRight size={12} />
            </Link>
          </div>
        </div>

      </div>

      {/* ÉVOLUTION ET CHANGEMENT DES COMMANDES (Statuts) */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-serif text-stone-900">Statut et Flux des Commandes</h3>
          <p className="text-xs text-stone-500 mt-0.5">Suivi de la progression du traitement des commandes</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center gap-3">
            <Clock size={22} className="text-amber-600 shrink-0" />
            <div>
              <p className="text-xs text-amber-800 font-medium">En attente</p>
              <p className="text-xl font-bold font-mono text-amber-900">{stats.ordersByStatus.pending}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
            <CheckCircle2 size={22} className="text-blue-600 shrink-0" />
            <div>
              <p className="text-xs text-blue-800 font-medium">Confirmées</p>
              <p className="text-xl font-bold font-mono text-blue-900">{stats.ordersByStatus.confirmed}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center gap-3">
            <Truck size={22} className="text-purple-600 shrink-0" />
            <div>
              <p className="text-xs text-purple-800 font-medium">Expédiées</p>
              <p className="text-xl font-bold font-mono text-purple-900">{stats.ordersByStatus.shipped}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3">
            <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs text-emerald-800 font-medium">Livrées</p>
              <p className="text-xl font-bold font-mono text-emerald-900">{stats.ordersByStatus.delivered}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center gap-3 col-span-2 sm:col-span-1">
            <XCircle size={22} className="text-rose-600 shrink-0" />
            <div>
              <p className="text-xs text-rose-800 font-medium">Annulées</p>
              <p className="text-xl font-bold font-mono text-rose-900">{stats.ordersByStatus.cancelled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Récents Ventes / Dernières Commandes */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-serif text-stone-900">Commandes Récentes</h3>
            <p className="text-xs text-stone-500 mt-0.5">Les 5 dernières activités enregistrées</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-medium text-stone-900 hover:text-stone-700 flex items-center gap-1 transition-colors"
          >
            <span>Gérer toutes les commandes</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            Aucune commande enregistrée pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Client</th>
                  <th className="py-3.5 px-6">Téléphone</th>
                  <th className="py-3.5 px-6">Wilaya</th>
                  <th className="py-3.5 px-6">Montant Total</th>
                  <th className="py-3.5 px-6 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-stone-800">
                      #{order.id}
                    </td>
                    <td className="py-4 px-6 font-medium text-stone-900">
                      {order.client_name || order.full_name || 'Client Inconnu'}
                    </td>
                    <td className="py-4 px-6 font-mono text-stone-600 text-xs">
                      {order.phone || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-stone-700">
                      {order.wilaya || 'N/A'}
                    </td>
                    <td className="py-4 px-6 font-mono font-semibold text-stone-900">
                      {Number(order.total_price || 0).toLocaleString()} DZD
                    </td>
                    <td className="py-4 px-6 text-right">
                      {renderStatusBadge(order.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}