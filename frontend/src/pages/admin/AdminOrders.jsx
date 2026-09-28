import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  Calendar, 
  ChevronDown, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  AlertCircle,
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  FileText
} from 'lucide-react';

// Données statiques de démonstration
const INITIAL_ORDERS = [
  {
    id: 1001,
    created_at: '2026-03-25T10:30:00Z',
    customer_first_name: 'Amine',
    customer_last_name: 'Benali',
    customer_phone: '0550123456',
    wilaya: 'Alger',
    commune: 'Hydra',
    delivery_address: '12 Rue Didouche Mourad',
    total_amount: 8500,
    status: 'en_attente',
    notes: 'Veuillez appeler avant la livraison svp.',
    items: [
      {
        product_id: 1,
        product_name: 'Robe Traditionnelle Moderne',
        unit_price: 8500,
        quantity: 1,
        image_url: null
      }
    ]
  },
  {
    id: 1002,
    created_at: '2026-03-24T14:15:00Z',
    customer_first_name: 'Sara',
    customer_last_name: 'Khelifi',
    customer_phone: '0661987654',
    wilaya: 'Oran',
    commune: 'Es Senia',
    delivery_address: 'Cité 500 logements, Bloc B',
    total_amount: 14200,
    status: 'confirmee',
    notes: '',
    items: [
      {
        product_id: 2,
        product_name: 'Ensemble Caftan Soie',
        unit_price: 14200,
        quantity: 1,
        image_url: null
      }
    ]
  },
  {
    id: 1003,
    created_at: '2026-03-23T09:00:00Z',
    customer_first_name: 'Karim',
    customer_last_name: 'Meziani',
    customer_phone: '0770456789',
    wilaya: 'Constantine',
    commune: 'El Khroub',
    delivery_address: 'N° 45 Quartier Bellevue',
    total_amount: 6000,
    status: 'en_livraison',
    notes: 'Livraison souhaitée l\'après-midi.',
    items: [
      {
        product_id: 3,
        product_name: 'Polo en Coton Premium',
        unit_price: 3000,
        quantity: 2,
        image_url: null
      }
    ]
  },
  {
    id: 1004,
    created_at: '2026-03-22T18:45:00Z',
    customer_first_name: 'Yasmine',
    customer_last_name: 'Brahimi',
    customer_phone: '0555334455',
    wilaya: 'Blida',
    commune: 'Ouled Yaïch',
    delivery_address: 'Résidence les Roses, Appt 12',
    total_amount: 11000,
    status: 'livree',
    notes: '',
    items: [
      {
        product_id: 4,
        product_name: 'Sac à main en cuir',
        unit_price: 11000,
        quantity: 1,
        image_url: null
      }
    ]
  },
  {
    id: 1005,
    created_at: '2026-03-21T11:20:00Z',
    customer_first_name: 'Othmane',
    customer_last_name: 'Saidi',
    customer_phone: '0662112233',
    wilaya: 'Tlemcen',
    commune: 'Mansourah',
    delivery_address: 'Boulevard de l\'Université',
    total_amount: 4500,
    status: 'annulee',
    notes: 'Commande annulée par le client.',
    items: [
      {
        product_id: 5,
        product_name: 'Ceinture Artisanale',
        unit_price: 4500,
        quantity: 1,
        image_url: null
      }
    ]
  }
];

export default function AdminOrders() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  // Tri
  const [sortField, setSortField] = useState('created_at'); // 'created_at' | 'total_amount' | 'id'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modales
  const [viewingOrder, setViewingOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Réinitialiser la page courante quand on filtre ou recherche
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  // Changement de statut (statique)
  const handleStatusChange = (orderId, newStatus) => {
    setUpdatingId(orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (viewingOrder && viewingOrder.id === orderId) {
      setViewingOrder(prev => ({ ...prev, status: newStatus }));
    }
    setUpdatingId(null);
  };

  // Suppression (statique)
  const handleConfirmDelete = () => {
    if (!deletingOrder) return;
    setIsDeleting(true);
    setOrders(prev => prev.filter(o => o.id !== deletingOrder.id));
    if (viewingOrder?.id === deletingOrder.id) setViewingOrder(null);
    setDeletingOrder(null);
    setIsDeleting(false);
  };

  // Édition
  const handleStartEdit = (order) => {
    setEditingOrder(order);
    setEditFormData({
      customer_first_name: order.customer_first_name || '',
      customer_last_name: order.customer_last_name || '',
      customer_phone: order.customer_phone || '',
      wilaya: order.wilaya || '',
      commune: order.commune || '',
      delivery_address: order.delivery_address || '',
      notes: order.notes || ''
    });
  };

  // Sauvegarde édition (statique)
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setOrders(prev => prev.map(o => o.id === editingOrder.id ? { ...o, ...editFormData } : o));
    if (viewingOrder && viewingOrder.id === editingOrder.id) {
      setViewingOrder(prev => ({ ...prev, ...editFormData }));
    }
    setEditingOrder(null);
  };

  // Gérer le changement de colonne de tri
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // 1. Filtrage + 2. Tri + 3. Pagination
  const processedOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      const fullName = `${order.customer_first_name || ''} ${order.customer_last_name || ''}`.toLowerCase();
      const phone = order.customer_phone || '';
      const wilaya = (order.wilaya || '').toLowerCase();
      const orderId = order.id.toString();

      const matchesSearch = 
        fullName.includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm) ||
        wilaya.includes(searchTerm.toLowerCase()) ||
        orderId.includes(searchTerm);

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'created_at') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (sortField === 'total_amount' || sortField === 'id') {
        valA = Number(valA || 0);
        valB = Number(valB || 0);
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, sortField, sortOrder]);

  const totalItems = processedOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedOrders.slice(start, start + itemsPerPage);
  }, [processedOrders, currentPage, itemsPerPage]);

  const renderSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown size={13} className="text-stone-300 group-hover:text-stone-500 transition-colors" />;
    return sortOrder === 'asc' ? <ArrowUp size={13} className="text-stone-900" /> : <ArrowDown size={13} className="text-stone-900" />;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmee': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'en_livraison': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'livree': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'annulee': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-2xl font-serif text-stone-900">Gestion des Commandes</h2>
          <p className="text-xs text-stone-500 mt-1">Consultez, détaillez et gérez les commandes de la boutique</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg border border-stone-200 self-start sm:self-auto">
          Total : {orders.length}
        </span>
      </div>

      {/* Barre de Recherche & Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher par client, téléphone, wilaya ou N°..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-900 transition-colors"
          />
        </div>

        <div className="relative w-full sm:w-56">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-900 appearance-none transition-colors cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="confirmee">Confirmée</option>
            <option value="en_livraison">En livraison</option>
            <option value="livree">Livrée</option>
            <option value="annulee">Annulée</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Table & État */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-stone-900 border-t-transparent"></div>
          <p className="text-sm text-stone-500 mt-3">Chargement des commandes...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 flex items-center gap-3 text-sm">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : paginatedOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <ShoppingBag className="mx-auto text-stone-300 mb-3" size={40} />
          <p className="text-stone-700 font-medium text-base">Aucune commande trouvée</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th 
                    onClick={() => handleSort('id')}
                    className="py-3.5 px-6 cursor-pointer select-none group hover:bg-stone-100/60 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>N° / Date</span>
                      {renderSortIcon('id')}
                    </div>
                  </th>
                  <th className="py-3.5 px-6">Client & Contact</th>
                  <th className="py-3.5 px-6">Adresse & Wilaya</th>
                  <th 
                    onClick={() => handleSort('total_amount')}
                    className="py-3.5 px-6 cursor-pointer select-none group hover:bg-stone-100/60 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Montant</span>
                      {renderSortIcon('total_amount')}
                    </div>
                  </th>
                  <th className="py-3.5 px-6">Statut</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono font-semibold text-stone-900">#{order.id}</span>
                      {order.created_at && (
                        <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                          <Calendar size={12} />
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-medium text-stone-900">
                        {order.customer_first_name} {order.customer_last_name}
                      </p>
                      <a href={`tel:${order.customer_phone}`} className="text-xs text-stone-500 flex items-center gap-1 mt-0.5 hover:text-stone-900 transition-colors">
                        <Phone size={12} />
                        {order.customer_phone}
                      </a>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-start gap-1">
                        <MapPin size={14} className="text-stone-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-stone-800">{order.wilaya} {order.commune && `(${order.commune})`}</p>
                          <p className="text-xs text-stone-500 line-clamp-1">{order.delivery_address}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-semibold text-stone-900">{order.total_amount} DA</p>
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 py-1.5 px-2.5 rounded-lg border border-stone-300 focus:outline-none cursor-pointer transition-colors"
                      >
                        <option value="en_attente">En attente</option>
                        <option value="confirmee">Confirmée</option>
                        <option value="en_livraison">En livraison</option>
                        <option value="livree">Livrée</option>
                        <option value="annulee">Annulée</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingOrder(order)}
                          className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          title="Détails de la commande"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleStartEdit(order)}
                          className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          title="Modifier les coordonnées"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingOrder(order)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer la commande"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Barre de Pagination */}
          <div className="px-6 py-4 bg-stone-50/50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <span>Afficher</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2 py-1 bg-white border border-stone-200 rounded-lg font-medium focus:outline-none cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>par page</span>
              <span className="text-stone-400 ml-2">
                ({(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} sur {totalItems})
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-stone-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-stone-900 text-white'
                      : 'hover:bg-stone-200/60 text-stone-700'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-stone-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Consultation / Détails de la commande */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-stone-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-stone-50/50">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-serif text-stone-900">Commande #{viewingOrder.id}</h3>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${getStatusBadgeClass(viewingOrder.status)}`}>
                    {viewingOrder.status.replace('_', ' ')}
                  </span>
                </div>
                {viewingOrder.created_at && (
                  <p className="text-xs text-stone-500 mt-1">
                    Passée le {new Date(viewingOrder.created_at).toLocaleString('fr-FR')}
                  </p>
                )}
              </div>
              <button 
                onClick={() => setViewingOrder(null)} 
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
              {/* Infos Client & Livraison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200/80">
                <div>
                  <p className="text-[11px] font-semibold uppercase text-stone-400 mb-1.5">Informations Client</p>
                  <p className="font-medium text-stone-900 text-sm">
                    {viewingOrder.customer_first_name} {viewingOrder.customer_last_name}
                  </p>
                  <a href={`tel:${viewingOrder.customer_phone}`} className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-900 mt-1">
                    <Phone size={13} />
                    {viewingOrder.customer_phone}
                  </a>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase text-stone-400 mb-1.5">Adresse de Livraison</p>
                  <p className="font-medium text-stone-900">
                    {viewingOrder.wilaya} {viewingOrder.commune && `(${viewingOrder.commune})`}
                  </p>
                  <p className="text-stone-600 mt-0.5">{viewingOrder.delivery_address}</p>
                </div>
              </div>

              {/* Remarques / Notes */}
              {viewingOrder.notes && (
                <div className="p-3.5 bg-amber-50/50 border border-amber-200/60 rounded-xl text-amber-900">
                  <p className="font-semibold text-[11px] uppercase text-amber-700 mb-0.5 flex items-center gap-1">
                    <FileText size={13} /> Note du client
                  </p>
                  <p className="text-xs">{viewingOrder.notes}</p>
                </div>
              )}

              {/* Articles Commandés */}
              <div>
                <h4 className="font-serif text-sm text-stone-900 mb-3 font-semibold">Produits Commandés</h4>
                
                {viewingOrder.items && viewingOrder.items.length > 0 ? (
                  <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 overflow-hidden">
                    {viewingOrder.items.map((item, idx) => {
                      const itemImage = item.image_url || item.product?.image_url;
                      return (
                        <div key={idx} className="p-3 flex items-center justify-between gap-4 bg-white hover:bg-stone-50/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-stone-100 rounded-lg border border-stone-200 shrink-0 overflow-hidden flex items-center justify-center">
                              {itemImage ? (
                                <img
                                  src={itemImage}
                                  alt={item.product_name || item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package size={20} className="text-stone-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-stone-900 text-sm">
                                {item.product_name || item.name || `Produit #${item.product_id}`}
                              </p>
                              <p className="text-stone-500 text-xs">
                                Prix unitaire : {item.unit_price || item.price} DA
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-stone-500 font-mono text-xs">x{item.quantity}</p>
                            <p className="font-semibold text-stone-900 mt-0.5">
                              {Number(item.unit_price || item.price || 0) * Number(item.quantity || 1)} DA
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center text-stone-500">
                    Aucun détail sur les articles n'est disponible pour cette commande.
                  </div>
                )}
              </div>

              {/* Récapitulatif du total */}
              <div className="pt-4 border-t border-stone-200 flex justify-between items-center text-base">
                <span className="font-medium text-stone-700">Total de la commande :</span>
                <span className="font-serif font-bold text-stone-900 text-xl">{viewingOrder.total_amount} DA</span>
              </div>
            </div>

            <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  handleStartEdit(viewingOrder);
                  setViewingOrder(null);
                }}
                className="px-4 py-2 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-medium rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 size={14} /> Modifier coordonnées
              </button>
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmation de Suppression */}
      {deletingOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-stone-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} />
              </div>
              
              <h3 className="text-lg font-serif font-medium text-stone-900 mb-2">
                Supprimer cette commande ?
              </h3>
              
              <p className="text-xs text-stone-500 leading-relaxed mb-6">
                Êtes-vous sûr de vouloir supprimer définitivement la commande <strong className="text-stone-800 font-semibold">#{deletingOrder.id}</strong> ({deletingOrder.customer_first_name} {deletingOrder.customer_last_name}) ? Cette action est irréversible.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingOrder(null)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Modification */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-stone-200">
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <h3 className="text-lg font-serif text-stone-900">
                Modifier la commande #{editingOrder.id}
              </h3>
              <button 
                onClick={() => setEditingOrder(null)} 
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={editFormData.customer_first_name}
                    onChange={(e) => setEditFormData({ ...editFormData, customer_first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={editFormData.customer_last_name}
                    onChange={(e) => setEditFormData({ ...editFormData, customer_last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={editFormData.customer_phone}
                  onChange={(e) => setEditFormData({ ...editFormData, customer_phone: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Wilaya</label>
                  <input
                    type="text"
                    value={editFormData.wilaya}
                    onChange={(e) => setEditFormData({ ...editFormData, wilaya: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Commune</label>
                  <input
                    type="text"
                    value={editFormData.commune}
                    onChange={(e) => setEditFormData({ ...editFormData, commune: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Adresse de livraison</label>
                <textarea
                  value={editFormData.delivery_address}
                  onChange={(e) => setEditFormData({ ...editFormData, delivery_address: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} />
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}