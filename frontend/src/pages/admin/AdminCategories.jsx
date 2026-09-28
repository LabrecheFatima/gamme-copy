import React, { useState, useMemo } from 'react';
import { 
  FolderTree, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';

// Données statiques par défaut
const STATIC_CATEGORIES = [
  {
    id: 1,
    name: "Soins du Visage",
    slug: "soins-du-visage",
    usage_method: "Appliquer matin et soir sur une peau propre et séchée en effectuant de doux mouvements circulaires."
  },
  {
    id: 2,
    name: "Soins du Corps",
    slug: "soins-du-corps",
    usage_method: "Utiliser quotidiennement après la douche sur l'ensemble du corps en insistant sur les zones sèches."
  },
  {
    id: 3,
    name: "Sérums & Huiles",
    slug: "serums-et-huiles",
    usage_method: "Déposer 2 à 3 gouttes sur le visage avant votre crème hydratante habituelle."
  },
  {
    id: 4,
    name: "Cheveux & Cuir Chevelu",
    slug: "cheveux-et-cuir-chevelu",
    usage_method: "Appliquer sur cheveux humides, masser doucement puis rincer abondamment à l'eau tiède."
  },
  {
    id: 5,
    name: "Solaire & Protection",
    slug: "solaire-et-protection",
    usage_method: "Appliquer généreusement 15 minutes avant l'exposition au soleil. Renouveler toutes les 2 heures."
  }
];

export default function AdminCategories() {
  const [categories, setCategories] = useState(STATIC_CATEGORIES);

  // Recherche & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modales d'ajout / modification
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', usage_method: '' });

  // Modal de confirmation de suppression
  const [deletingCategory, setDeletingCategory] = useState(null);

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

  // Soumission du formulaire (Création / Modification en local)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(prev =>
        prev.map(c => (c.id === editingCategory.id ? { ...c, ...formData } : c))
      );
    } else {
      const newCategory = {
        id: Date.now(),
        ...formData
      };
      setCategories(prev => [newCategory, ...prev]);
    }
    setIsModalOpen(false);
  };

  // Suppression en local
  const handleConfirmDelete = () => {
    if (!deletingCategory) return;
    setCategories(prev => prev.filter(c => c.id !== deletingCategory.id));
    setDeletingCategory(null);
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
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-900 transition-colors"
        />
      </div>

      {/* Tableau des catégories */}
      {paginatedCategories.length === 0 ? (
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

          {/* Contrôles de Pagination */}
          <div className="px-6 py-4 bg-stone-50/50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <span>Afficher</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
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
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} />
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
                Êtes-vous sûr de vouloir supprimer la catégorie <strong className="text-stone-800 font-semibold">{deletingCategory.name}</strong> ?
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingCategory(null)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Trash2 size={14} />
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