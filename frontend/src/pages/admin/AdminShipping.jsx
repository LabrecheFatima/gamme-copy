import React, { useState, useEffect, useMemo } from 'react';
import api from '../../../services/api';
import { 
  Truck, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  AlertCircle, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Power
} from 'lucide-react';

export default function AdminShipping() {
  const [shippingEnabled, setShippingEnabled] = useState(false);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState(null);

  // Recherche & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modales d'ajout / modification (Upsert)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [formData, setFormData] = useState({ wilaya_name: '', price: 0, is_active: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal de confirmation de suppression
  const [deletingRate, setDeletingRate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Charger la configuration globale + la liste des tarifs
  const fetchShippingData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Récupérer le statut global de livraison (route publique)
      const publicInfo = await api.get('/shipping-rates');
      setShippingEnabled(publicInfo.data?.shipping_enabled || false);

      // 2. Récupérer tous les tarifs (route admin: GET /admin/shipping)
      const ratesRes = await api.get('/admin/shipping');
      setRates(ratesRes.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des frais de livraison :', err);
      setError(err.response?.data?.error || 'Impossible de charger la configuration des livraisons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippingData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Basculer le Toggle ON/OFF global (route admin: PUT /admin/shipping/toggle)
  const handleToggleShipping = async () => {
    setToggling(true);
    const targetState = !shippingEnabled;
    try {
      await api.put('/admin/shipping/toggle', { enabled: targetState });
      setShippingEnabled(targetState);
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors du changement d’état de la livraison.');
    } finally {
      setToggling(false);
    }
  };

  // Ouvrir la modal pour créer
  const handleOpenCreateModal = () => {
    setEditingRate(null);
    setFormData({ wilaya_name: '', price: 0, is_active: true });
    setIsModalOpen(true);
  };

  // Ouvrir la modal pour modifier
  const handleOpenEditModal = (rate) => {
    setEditingRate(rate);
    setFormData({
      wilaya_name: rate.wilaya_name || '',
      price: rate.price || 0,
      is_active: rate.is_active !== undefined ? Boolean(rate.is_active) : true
    });
    setIsModalOpen(true);
  };

  // Soumission du formulaire (route admin: POST /admin/shipping)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.wilaya_name.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post('/admin/shipping', formData);
      await fetchShippingData(); // Recharger pour tout synchroniser
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de l’enregistrement du tarif.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Suppression d'un tarif (route admin: DELETE /admin/shipping/:id)
  const handleConfirmDelete = async () => {
    if (!deletingRate) return;
    setIsDeleting(true);
    try {
      await api.delete(`/admin/shipping/${deletingRate.id}`);
      setRates(prev => prev.filter(r => r.id !== deletingRate.id));
      setDeletingRate(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression du tarif.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Recherche & Pagination
  const filteredRates = useMemo(() => {
    return rates.filter(rate => 
      rate.wilaya_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rates, searchTerm]);

  const totalItems = filteredRates.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedRates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRates.slice(start, start + itemsPerPage);
  }, [filteredRates, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* En-tête + Bouton d'action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-2xl font-serif text-stone-900">Frais de Livraison</h2>
          <p className="text-xs text-stone-500 mt-1">Gérez le commutateur global et le tarif de livraison par Wilaya</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus size={16} />
          Ajouter une Wilaya
        </button>
      </div>

      {/* Carte du Switch ON/OFF Global */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl border ${shippingEnabled ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-stone-100 text-stone-400 border-stone-200'}`}>
            <Truck size={24} />
          </div>
          <div>
            <h3 className="text-base font-serif text-stone-900">Livraison par Wilaya</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {shippingEnabled 
                ? 'Le système de livraison est actuellement ACTIF sur le site public.' 
                : 'Le système de livraison est DÉSACTIVÉ. Les clients ne pourront pas choisir de livraison.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleShipping}
          disabled={toggling || loading}
          className={`px-5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
            shippingEnabled 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs' 
              : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
          }`}
        >
          {toggling ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Power size={16} />
          )}
          <span>{shippingEnabled ? 'Activé' : 'Désactivé'}</span>
        </button>
      </div>

      {/* Barre de Recherche */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
        <input
          type="text"
          placeholder="Rechercher une Wilaya..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-900 transition-colors"
        />
      </div>

      {/* Tableau des Tarifs */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-stone-900 border-t-transparent"></div>
          <p className="text-sm text-stone-500 mt-3">Chargement des tarifs de livraison...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 flex items-center gap-3 text-sm">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : paginatedRates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <Truck className="mx-auto text-stone-300 mb-3" size={40} />
          <p className="text-stone-700 font-medium text-base">Aucun tarif trouvé</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Wilaya</th>
                  <th className="py-3.5 px-6">Prix (DZD)</th>
                  <th className="py-3.5 px-6">Statut</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {paginatedRates.map((rate) => (
                  <tr key={rate.id || rate.wilaya_name} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-stone-900">
                      {rate.wilaya_name}
                    </td>

                    <td className="py-4 px-6 font-mono text-stone-700 font-semibold">
                      {Number(rate.price).toLocaleString()} DZD
                    </td>

                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        rate.is_active 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-stone-100 text-stone-500 border border-stone-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${rate.is_active ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                        {rate.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(rate)}
                          className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          title="Modifier"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingRate(rate)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer"
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

          {/* Controls de Pagination */}
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
                <option value={58}>58 (Toutes)</option>
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
                className="p-1.5 border border-stone-200 rounded-lg hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    currentPage === page ? 'bg-stone-900 text-white' : 'hover:bg-stone-200/60 text-stone-700'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-stone-200 rounded-lg hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'Ajout / Modification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <h3 className="text-lg font-serif text-stone-900">
                {editingRate ? 'Modifier la Wilaya' : 'Ajouter une Wilaya'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Nom de la Wilaya *</label>
                <input
                  type="text"
                  value={formData.wilaya_name}
                  onChange={(e) => setFormData({ ...formData, wilaya_name: e.target.value })}
                  placeholder="ex: Alger"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Prix de livraison (DZD) *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="ex: 600"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900 font-mono"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-stone-900 focus:ring-stone-900 border-stone-300 cursor-pointer"
                />
                <label htmlFor="is_active" className="text-xs text-stone-700 font-medium cursor-pointer">
                  Activer la livraison pour cette wilaya
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {deletingRate && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} />
              </div>
              
              <h3 className="text-lg font-serif font-medium text-stone-900 mb-2">
                Supprimer le tarif de livraison ?
              </h3>
              
              <p className="text-xs text-stone-500 leading-relaxed mb-6">
                Êtes-vous sûr de vouloir supprimer le tarif pour la wilaya <strong className="text-stone-800 font-semibold">{deletingRate.wilaya_name}</strong> ?
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingRate(null)}
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
    </div>
  );
}