import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { 
  TrendingUp, 
  ShoppingBag, 
  FolderTree, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  ArrowRight,
  AlertCircle,
  Package,
  Search,
  ChevronRight,
  ShieldAlert,
  Calendar,
  LineChart,
  Filter
} from 'lucide-react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtre temporel pour le graphique (month | day | season)
  const [timePeriod, setTimePeriod] = useState('month');

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

        const rawProducts = Array.isArray(productsRes.data) 
          ? productsRes.data 
          : (productsRes.data?.data || []);

        setOrders(ordersRes.data || []);
        setProducts(rawProducts);
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

  // --- STATISTIQUES & KPI ---
  const stats = useMemo(() => {
    const activeOrders = orders.filter(o => o.status !== 'annulee' && o.status !== 'cancelled');
    const totalRevenue = activeOrders.reduce((sum, o) => sum + (Number(o.total_amount) || Number(o.total_price) || 0), 0);

    const ordersByStatus = orders.reduce((acc, o) => {
      const st = (o.status || '').toLowerCase();
      if (st === 'en_attente' || st === 'pending') acc.pending += 1;
      else if (st === 'confirmee' || st === 'confirmed') acc.confirmed += 1;
      else if (st === 'expediee' || st === 'shipped') acc.shipped += 1;
      else if (st === 'livree' || st === 'delivered') acc.delivered += 1;
      else if (st === 'annulee' || st === 'cancelled') acc.cancelled += 1;
      else acc.pending += 1;
      return acc;
    }, { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 });

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalCategories: categories.length,
      totalProducts: products.length,
      ordersByStatus
    };
  }, [orders, categories, products]);

  // --- CALCUL DES DONNÉES TEMPORELLES ---
  const chartData = useMemo(() => {
    if (timePeriod === 'day') {
      const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      const counts = Array(7).fill(0);
      orders.forEach(o => {
        if (!o.created_at) return;
        const d = new Date(o.created_at);
        let dayIdx = d.getDay() - 1; 
        if (dayIdx === -1) dayIdx = 6;
        counts[dayIdx] += 1;
      });
      return days.map((label, i) => ({ label, count: counts[i] }));
    }

    if (timePeriod === 'season') {
      const seasons = [
        { label: 'Hiver', count: 0 },
        { label: 'Printemps', count: 0 },
        { label: 'Été', count: 0 },
        { label: 'Automne', count: 0 }
      ];
      orders.forEach(o => {
        if (!o.created_at) return;
        const month = new Date(o.created_at).getMonth();
        if (month === 11 || month === 0 || month === 1) seasons[0].count += 1;
        else if (month >= 2 && month <= 4) seasons[1].count += 1;
        else if (month >= 5 && month <= 7) seasons[2].count += 1;
        else seasons[3].count += 1;
      });
      return seasons;
    }

    // Par défaut : Mois de l'année
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const counts = Array(12).fill(0);
    orders.forEach(o => {
      if (!o.created_at) return;
      const monthIdx = new Date(o.created_at).getMonth();
      counts[monthIdx] += 1;
    });
    return months.map((label, i) => ({ label, count: counts[i] }));
  }, [orders, timePeriod]);

  // --- CALCUL DES POINTS SVG POUR LE GRAPH LINE ---
  const { pathD, areaD, points } = useMemo(() => {
    const width = 300;
    const height = 150;
    const padding = 20;

    const maxVal = Math.max(...chartData.map(d => d.count), 1);
    const count = chartData.length;

    const coords = chartData.map((d, i) => {
      const x = padding + (i / Math.max(count - 1, 1)) * (width - 2 * padding);
      const y = height - padding - (d.count / maxVal) * (height - 2 * padding);
      return { x, y, ...d };
    });

    if (coords.length === 0) return { pathD: '', areaD: '', points: [] };

    // Construction de la ligne SVG
    let linePath = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      // Courbe douce avec bézier
      const prev = coords[i - 1];
      const curr = coords[i];
      const cx1 = prev.x + (curr.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (curr.x - prev.x) / 2;
      const cy2 = curr.y;
      linePath += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
    }

    // Zone d'ombrage sous le graphique
    const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;

    return { pathD: linePath, areaD: areaPath, points: coords };
  }, [chartData]);

  // Commandes filtrées selon la recherche
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders.slice(0, 6);
    const q = searchQuery.toLowerCase();
    return orders.filter(o => {
      const name = `${o.customer_first_name || ''} ${o.customer_last_name || ''}`.toLowerCase();
      const phone = (o.customer_phone || o.phone || '').toLowerCase();
      const id = (o.id || '').toString();
      return name.includes(q) || phone.includes(q) || id.includes(q);
    }).slice(0, 6);
  }, [orders, searchQuery]);

  const renderStatusBadge = (status) => {
    const config = {
      en_attente: { label: 'En attente', style: 'bg-amber-50 text-amber-800 border-amber-200' },
      pending: { label: 'En attente', style: 'bg-amber-50 text-amber-800 border-amber-200' },
      confirmee: { label: 'Confirmée', style: 'bg-stone-100 text-stone-800 border-stone-300' },
      confirmed: { label: 'Confirmée', style: 'bg-stone-100 text-stone-800 border-stone-300' },
      expediee: { label: 'Expédiée', style: 'bg-amber-100 text-amber-900 border-amber-300' },
      shipped: { label: 'Expédiée', style: 'bg-amber-100 text-amber-900 border-amber-300' },
      livree: { label: 'Livrée', style: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
      delivered: { label: 'Livrée', style: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
      annulee: { label: 'Annulée', style: 'bg-rose-50 text-rose-700 border-rose-200' },
      cancelled: { label: 'Annulée', style: 'bg-rose-50 text-rose-700 border-rose-200' }
    };
    const item = config[status] || config.en_attente;
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${item.style}`}>
        {item.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-24 bg-stone-50/50 rounded-3xl border border-stone-200">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-stone-900 border-t-transparent"></div>
        <p className="text-xs font-medium text-stone-500 mt-3 uppercase tracking-wider">Chargement du tableau de bord...</p>
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
    <div className="space-y-6 pb-12">
      {/* 1. EN-TÊTE */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif text-stone-900 font-bold tracking-tight">
            Tableau de Bord Administration
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Gamme d'Hiver • Analyse des tendances et suivi des commandes
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <input
              type="text"
              placeholder="Chercher commande, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
            />
          </div>
          <Link
            to="/admin/orders"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-medium hover:bg-stone-800 transition-colors shrink-0"
          >
            <span>Commandes</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* 2. CARTES KPI */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        <div className="min-w-[260px] flex-1 bg-stone-900 text-white p-5 rounded-2xl sm:rounded-3xl border border-stone-800 shadow-sm snap-start flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-stone-400">Chiffre d'Affaires</span>
            <div className="p-2 bg-stone-800 rounded-xl text-stone-200">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-serif font-bold font-mono tracking-tight text-white">
              {stats.totalRevenue.toLocaleString()} <span className="text-xs font-sans text-stone-400">DZD</span>
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
            <span>Revenu cumulé</span>
            <ChevronRight size={14} />
          </div>
        </div>

        <div className="min-w-[260px] flex-1 bg-amber-50/70 p-5 rounded-2xl sm:rounded-3xl border border-amber-200/80 shadow-xs snap-start flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-amber-800">En Attente</span>
            <div className="p-2 bg-amber-100 rounded-xl text-amber-800">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-serif font-bold font-mono text-amber-950">
              {stats.ordersByStatus.pending} <span className="text-xs font-sans text-amber-800">commandes</span>
            </h3>
          </div>
          <Link to="/admin/orders" className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-900 font-medium hover:underline">
            <span>Traiter les demandes</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="min-w-[260px] flex-1 bg-white p-5 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-xs snap-start flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500">Confirmées</span>
            <div className="p-2 bg-stone-100 rounded-xl text-stone-700">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-serif font-bold font-mono text-stone-900">
              {stats.ordersByStatus.confirmed} <span className="text-xs font-sans text-stone-500">en préparation</span>
            </h3>
          </div>
          <Link to="/admin/orders" className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-800 font-medium hover:underline">
            <span>Gérer le flux</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="min-w-[260px] flex-1 bg-white p-5 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-xs snap-start flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500">Livrées</span>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
              <Truck size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-serif font-bold font-mono text-stone-900">
              {stats.ordersByStatus.delivered} <span className="text-xs font-sans text-stone-500">abouties</span>
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Taux de livraison</span>
            <ChevronRight size={14} />
          </div>
        </div>
      </div>

      {/* 3. DISPOSITION PRINCIPALE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* GAUCHE (2 cols) : TABLEAU DES COMMANDES RECENTES */}
        <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-serif font-semibold text-stone-900">
                  Commandes Récentes
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Dernières transactions enregistrées sur la boutique
                </p>
              </div>
              <Link 
                to="/admin/orders"
                className="text-xs font-medium text-stone-900 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Voir tout</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 text-stone-400 text-xs">
                Aucune commande ne correspond à votre recherche.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50/70 border-b border-stone-100 text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                      <th className="py-3 px-5">ID</th>
                      <th className="py-3 px-5">Client</th>
                      <th className="py-3 px-5">Wilaya</th>
                      <th className="py-3 px-5">Montant</th>
                      <th className="py-3 px-5 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs">
                    {filteredOrders.map((order) => {
                      const clientName = order.customer_first_name 
                        ? `${order.customer_first_name} ${order.customer_last_name || ''}`.trim()
                        : (order.client_name || order.full_name || 'Client');

                      return (
                        <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3.5 px-5 font-mono font-bold text-stone-900">
                            #{order.id}
                          </td>
                          <td className="py-3.5 px-5 font-medium text-stone-800">
                            <div>{clientName}</div>
                            <div className="text-[10px] text-stone-400 font-mono">{order.customer_phone || order.phone || 'N/A'}</div>
                          </td>
                          <td className="py-3.5 px-5 text-stone-600">
                            {order.wilaya || 'Alger'}
                          </td>
                          <td className="py-3.5 px-5 font-mono font-semibold text-stone-900">
                            {Number(order.total_amount || order.total_price || 0).toLocaleString()} DZD
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            {renderStatusBadge(order.status)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="p-4 bg-stone-50/50 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>{orders.length} commandes enregistrées</span>
            <Link to="/admin/orders" className="text-stone-900 font-medium hover:underline">Mettre à jour les statuts</Link>
          </div>
        </div>

        {/* DROITE (1 col) : GRAPHIQUE EN LIGNE (LINE CHART SVG) */}
        <div className="space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              {/* En-tête du Graphique avec Sélecteur Temporel */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-serif font-semibold text-stone-900 flex items-center gap-2">
                    <LineChart size={18} className="text-stone-800" />
                    Évolution des Ventes
                  </h2>
                  <p className="text-[11px] text-stone-500 mt-0.5">Courbe de progression des commandes</p>
                </div>

                {/* Filtres Temporels */}
                <div className="inline-flex p-1 bg-stone-100 rounded-xl text-stone-600 self-start sm:self-auto">
                  <button
                    onClick={() => setTimePeriod('month')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
                      timePeriod === 'month' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'hover:text-stone-900'
                    }`}
                  >
                    Mois
                  </button>
                  <button
                    onClick={() => setTimePeriod('day')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
                      timePeriod === 'day' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'hover:text-stone-900'
                    }`}
                  >
                    Jours
                  </button>
                  <button
                    onClick={() => setTimePeriod('season')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
                      timePeriod === 'season' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'hover:text-stone-900'
                    }`}
                  >
                    Saisons
                  </button>
                </div>
              </div>

              {/* RENDER DU GRAPHIQUE EN LIGNE (LINE CHART SVG) */}
              <div className="relative w-full h-52 pt-4 pb-2">
                <svg viewBox="0 0 300 150" className="w-full h-full overflow-visible">
                  <defs>
                    {/* Dégradé sous la courbe */}
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1c1917" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#1c1917" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Lignes de grille en arrière-plan */}
                  <line x1="20" y1="20" x2="280" y2="20" stroke="#f5f5f4" strokeWidth="1" />
                  <line x1="20" y1="75" x2="280" y2="75" stroke="#f5f5f4" strokeWidth="1" />
                  <line x1="20" y1="130" x2="280" y2="130" stroke="#e7e5e4" strokeWidth="1" />

                  {/* Zone de remplissage sous la courbe */}
                  {areaD && <path d={areaD} fill="url(#lineGrad)" />}

                  {/* Courbe Ligne SVG */}
                  {pathD && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#1c1917"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Points interactifs sur la courbe */}
                  {points.map((pt, idx) => (
                    <g key={idx} className="group cursor-pointer">
                      {/* Cercle d'effet au survol */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="6"
                        className="fill-stone-900 opacity-0 group-hover:opacity-30 transition-opacity"
                      />
                      {/* Point principal */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="3.5"
                        className="fill-white stroke-stone-900 stroke-2 group-hover:scale-125 transition-transform origin-center"
                      />
                    </g>
                  ))}
                </svg>

                {/* Libellés de l'axe X sous le graphique */}
                <div className="flex justify-between items-center px-2 mt-1 text-[10px] text-stone-500 font-medium">
                  {chartData.map((d, i) => (
                    <span key={i} className="truncate text-center flex-1">
                      {d.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Légende bas du Graphique */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1.5 text-[11px]">
                <Calendar size={13} className="text-stone-400" />
                Affichage : <strong className="text-stone-900 uppercase">{timePeriod}</strong>
              </span>
              <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60 text-[11px]">
                Total: {orders.length}
              </span>
            </div>
          </div>

          {/* Recommandation */}
          <div className="bg-amber-50/50 p-5 rounded-2xl sm:rounded-3xl border border-amber-200/70 text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-xs text-amber-900">
              <ShieldAlert size={16} className="text-amber-700" />
              <span>Analyse Saisonnière</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Utilisez la courbe temporelle pour anticiper le réapprovisionnement des pièces de la collection d'hiver lors des pics de demandes.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}