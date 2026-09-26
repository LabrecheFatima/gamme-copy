import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Upload, 
  AlertCircle,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // États pour la modal de création / édition
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  // État pour la modal de confirmation de suppression
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    description: '',
    original_price: '',
    promo_price: '',
    stock_quantity: '',
    is_active: 1
  });

  // Charger les produits et les catégories
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resProducts, resCategories] = await Promise.all([
        api.get('/products?limit=1000'),
        api.get('/categories').catch(() => ({ data: [] }))
      ]);

      setProducts(resProducts.data.data || resProducts.data || []);
      setCategories(resCategories.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des données :', err);
      setError('Impossible de charger la liste des produits.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Génération automatique du slug
  const handleNameChange = (e) => {
    const name = e.target.value;
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData(prev => ({
      ...prev,
      name,
      slug: editingProduct ? prev.slug : generatedSlug
    }));
  };

  // Ouvrir modal pour ajout
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview(null);
    setRemoveExistingImage(false);
    setFormData({
      name: '',
      slug: '',
      category_id: '',
      description: '',
      original_price: '',
      promo_price: '',
      stock_quantity: '10',
      is_active: 1
    });
    setIsModalOpen(true);
  };

  // Ouvrir modal pour édition
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setImageFile(null);
    setRemoveExistingImage(false);
    setImagePreview(product.image_url ? `${api.defaults.baseURL.replace('/api', '')}${product.image_url}` : null);
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      category_id: product.category_id || '',
      description: product.description || '',
      original_price: product.original_price || '',
      promo_price: product.promo_price ?? '',
      stock_quantity: product.stock_quantity ?? 0,
      is_active: product.is_active ?? 1
    });
    setIsModalOpen(true);
  };

  // Sélection d'une nouvelle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveExistingImage(false);
    }
  };

  // Supprimer / Retirer l'image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveExistingImage(true);
  };

  // Enregistrement (Création ou Modification)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('slug', formData.slug);
    data.append('category_id', formData.category_id);
    data.append('description', formData.description);
    data.append('original_price', formData.original_price);
    data.append('promo_price', formData.promo_price ? formData.promo_price : '');
    data.append('stock_quantity', formData.stock_quantity);
    data.append('is_active', formData.is_active);

    if (imageFile) {
      data.append('image', imageFile);
    } else if (removeExistingImage) {
      data.append('delete_image', 'true');
    }

    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de l’enregistrement du produit.');
    }
  };

  // Confirmer l'exécution de la suppression
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/admin/products/${deletingProduct.id}`);
      setProducts(prev => prev.filter(p => p.id !== deletingProduct.id));
      setDeletingProduct(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-2xl font-serif text-stone-900">Gestion du Catalogue</h2>
          <p className="text-xs text-stone-500 mt-1">Ajoutez, modifiez et gérez les produits de votre boutique</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-medium hover:bg-stone-800 transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          Nouveau Produit
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
        <input
          type="text"
          placeholder="Rechercher un produit par nom ou slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-900 transition-colors"
        />
      </div>

      {/* Tableau des Produits */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-stone-900 border-t-transparent"></div>
          <p className="text-sm text-stone-500 mt-3">Chargement des produits...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 flex items-center gap-3 text-sm">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <Package className="mx-auto text-stone-300 mb-3" size={40} />
          <p className="text-stone-700 font-medium text-base">Aucun produit trouvé</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Produit</th>
                  <th className="py-3.5 px-6">Prix</th>
                  <th className="py-3.5 px-6">Stock</th>
                  <th className="py-3.5 px-6">Visibilité</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {product.image_url ? (
                            <img
                              src={`${api.defaults.baseURL.replace('/api', '')}${product.image_url}`}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package size={20} className="text-stone-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-stone-900">{product.name}</p>
                          <p className="text-xs text-stone-400 font-mono">{product.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {product.promo_price ? (
                        <div>
                          <span className="font-semibold text-emerald-700">{product.promo_price} DA</span>
                          <span className="text-xs text-stone-400 line-through ml-2">{product.original_price} DA</span>
                        </div>
                      ) : (
                        <span className="font-semibold text-stone-900">{product.original_price} DA</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                        product.stock_quantity > 5 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : product.stock_quantity > 0 
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {product.stock_quantity} en stock
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      {product.is_active ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                          <Eye size={14} /> Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-400">
                          <EyeOff size={14} /> Masqué
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          title="Modifier"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(product)}
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
        </div>
      )}

      {/* Modal de Confirmation de Suppression */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} />
              </div>
              
              <h3 className="text-lg font-serif font-medium text-stone-900 mb-2">
                Supprimer ce produit ?
              </h3>
              
              <p className="text-xs text-stone-500 leading-relaxed mb-6">
                Êtes-vous sûr de vouloir supprimer définitivement <strong className="text-stone-800 font-semibold">"{deletingProduct.name}"</strong> ? Cette action est irréversible.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingProduct(null)}
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

      {/* Modal Formulaire (Ajout / Édition) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-stone-200 my-8">
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <h3 className="text-lg font-serif text-stone-900">
                {editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nom & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Nom du produit *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
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
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm font-mono focus:outline-none focus:border-stone-900"
                    required
                  />
                </div>
              </div>

              {/* Catégorie & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Catégorie</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900"
                  >
                    <option value="">Aucune catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Quantité en Stock *</label>
                  <input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Prix de base & Prix Promo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Prix de base (DA) *</label>
                  <input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Prix Promotionnel (DA)</label>
                  <input
                    type="number"
                    value={formData.promo_price}
                    onChange={(e) => setFormData({ ...formData, promo_price: e.target.value })}
                    placeholder="Facultatif"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900"
                    min="0"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900"
                />
              </div>

              {/* Upload Image + Suppression */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Image du Produit</label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative group shrink-0">
                      <img
                        src={imagePreview}
                        alt="Aperçu"
                        className="w-16 h-16 rounded-lg object-cover border border-stone-200"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white p-1 rounded-full hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
                        title="Supprimer l'image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : removeExistingImage ? (
                    <span className="text-xs text-rose-600 italic">Image supprimée (le produit n'aura aucune image)</span>
                  ) : null}

                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-stone-300 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors text-xs text-stone-600 font-medium">
                    <Upload size={16} />
                    <span>{imageFile ? imageFile.name : 'Choisir une image WebP / PNG / JPG'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Statut Visibilité */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={Boolean(formData.is_active)}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 rounded-md text-stone-900 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="is_active" className="text-xs font-medium text-stone-700 cursor-pointer">
                  Produit visible dans la boutique
                </label>
              </div>

              {/* Boutons d'action */}
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
                  {editingProduct ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}