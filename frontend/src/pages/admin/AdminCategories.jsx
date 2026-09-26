import React, { useState, useEffect, useMemo } from 'react';
import api from '../../../services/api';
import { 
  FolderTree, 
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
  BookOpen
} from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recherche & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modales d'ajout / modification
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', usage_method: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal de confirmation de suppression
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Charger les catégories depuis le backend
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      // Ajuste le chemin d'accès si tu utilises une sous-route d'administration ou générale (ex: /categories ou /admin/categories)
      const response = await api.get('/admin/categories');
      setCategories(response.data || []);
    } catch (err) {
      try {
        const fallbackRes = await api.get('/categories');
        setCategories(fallbackRes.data || []);
      } catch (fallbackErr) {
        console.error('Erreur lors du chargement des catégories :', fallbackErr);
        setError(err.response?.data?.error || fallbackErr.response?.data?.error || 'Impossible de charger les catégories.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Génération automatique du slug à partir du nom
  const handleNameChange = (e) => {
    const name = e.target.value;
    const generatedSlug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setFormData(prev => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : generatedSlug
    }));
  };

  // Ouvrir la modal pour créer
  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', usage_method: '' });
    setIsModalOpen(true);
  };

  // Ouvrir la modal pour modifier
  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      usage_method: category.usage_method || ''
    });
    setIsModalOpen(true);
  };

  // Soumission du formulaire (Création / Modification)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const endpoint = editingCategory 
        ? `/admin/categories/${editingCategory.id}` 
        : '/admin/categories';

      if (editingCategory) {
        await api.put(endpoint, formData);
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c));
      } else {
        const response = await api.post(endpoint, formData);
        setCategories(prev => [response.data, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      // Tentative fallback vers l'endpoint public si /admin/categories échoue
      try {
        const fallbackEndpoint = editingCategory 
          ? `/categories/${editingCategory.id}` 
          : '/categories';

        if (editingCategory) {
          await api.put(fallbackEndpoint, formData);
          setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c));
        } else {
          const response = await api.post(fallbackEndpoint, formData);
          setCategories(prev => [response.data, ...prev]);
        }
        setIsModalOpen(false);
      } catch (fallbackErr) {
        alert(err.response?.data?.error || fallbackErr.response?.data?.error || 'Erreur lors de l’enregistrement de la catégorie.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Suppression
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      try {
        await api.delete(`/admin/categories/${deletingCategory.id}`);
      } catch (err) {
        await api.delete(`/categories/${deletingCategory.id}`);
      }
      setCategories(prev => prev.filter(c => c.id !== deletingCategory.id));
      setDeletingCategory(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression de la catégorie.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Recherche & Pagination
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => 
      cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.usage_method?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(start, start + itemsPerPage);
  }, [filteredCategories, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-2xl font-serif text-stone-900">Gestion des Catégories</h2>
          <p className="text-xs text-stone-500 mt-1">Créez et organisez vos catégories ainsi que leurs conseils d'utilisation</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus size={16} />
          Nouvelle Catégorie
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
        <input
          type="text"
          placeholder="Rechercher par nom, slug ou mode d'emploi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-900 transition-colors"
        />
      </div>

      {/* Chargement / Tableau */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-stone-900 border-t-transparent"></div>
          <p className="text-sm text-stone-500 mt-3">Chargement des catégories...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 flex items-center gap-3 text-sm">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : paginatedCategories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <FolderTree className="mx-auto text-stone-300 mb-3" size={40} />
          <p className="text-stone-700 font-medium text-base">Aucune catégorie trouvée</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Nom</th>
                  <th className="py-3.5 px-6">Slug</th>
                  <th className="py-3.5 px-6">Mode d'utilisation</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {paginatedCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-stone-400">
                      #{category.id}
                    </td>

                    <td className="py-4 px-6 font-medium text-stone-900">
                      {category.name}
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-mono text-xs px-2.5 py-1 bg-stone-100 text-stone-600 rounded-md">
                        {category.slug}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-stone-600 text-xs max-w-sm">
                      {category.usage_method ? (
                        <div className="flex items-start gap-1.5 line-clamp-2">
                          <BookOpen size={14} className="text-stone-400 shrink-0 mt-0.5" />
                          <span>{category.usage_method}</span>
                        </div>
                      ) : (
                        <span className="text-stone-300 italic">Non renseigné</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(category)}
                          className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          title="Modifier"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingCategory(category)}
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

      {/* Modal d'Ajout / Modification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <h3 className="text-lg font-serif text-stone-900">
                {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Nom de la catégorie *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="ex: Soins du Visage"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Slug (URL) *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="ex: soins-du-visage"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm font-mono focus:outline-none focus:border-stone-900 bg-stone-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Mode d'utilisation (`usage_method`)</label>
                <textarea
                  value={formData.usage_method}
                  onChange={(e) => setFormData({ ...formData, usage_method: e.target.value })}
                  placeholder="Instructions d'application ou conseils d'utilisation..."
                  rows={3}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900 resize-none"
                />
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
                  {editingCategory ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmation de Suppression */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} />
              </div>
              
              <h3 className="text-lg font-serif font-medium text-stone-900 mb-2">
                Supprimer cette catégorie ?
              </h3>
              
              <p className="text-xs text-stone-500 leading-relaxed mb-6">
                Êtes-vous sûr de vouloir supprimer la catégorie <strong className="text-stone-800 font-semibold">{deletingCategory.name}</strong> ? Cette action est définitive.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingCategory(null)}
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