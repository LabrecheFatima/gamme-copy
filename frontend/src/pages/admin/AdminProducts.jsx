import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Upload, 
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

// Catégories statiques
const INITIAL_CATEGORIES = [
  { id: 1, name: 'Soins & Beauté' },
  { id: 2, name: 'Senteur & Bien-être' },
  { id: 3, name: 'Maison & Déco' },
  { id: 4, name: 'Art de la Table' }
];

// Produits statiques
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Lalucell - Crème Visage Intensive',
    slug: 'lalucell-creme-visage-intensive',
    category_id: 1,
    original_price: 3500,
    promo_price: 2900,
    stock_quantity: 25,
    description: 'Crème apaisante et hautement hydratante pour ravivier l’éclat du teint.',
    composition: 'Extraits végétaux, Acide hyaluronique',
    conseil_utilisation: 'Appliquer matin et soir sur le visage et le cou.',
    image_url: '/uploads/lalucell-creme.jpg',
    images: ['/uploads/lalucell-creme.jpg'],
    is_active: 1
  },
  {
    id: 2,
    name: 'Beloboka - Gommage Sucre & Papaye',
    slug: 'beloboka-gommage-sucre-papaye',
    category_id: 1,
    original_price: 1800,
    promo_price: null,
    stock_quantity: 40,
    description: 'Exfoliant corporel gourmand au sucre marin et enzymes.',
    composition: 'Sucre naturel, Sel marin, Extrait de Papaye',
    conseil_utilisation: 'Masser sur peau humide 1 à 2 fois par semaine.',
    image_url: '/uploads/beloboka-gommage.jpg',
    images: ['/uploads/beloboka-gommage.jpg'],
    is_active: 1
  },
  {
    id: 3,
    name: 'Sukriaa - Masque Nila Bleue',
    slug: 'sukriaa-masque-nila-bleue',
    category_id: 1,
    original_price: 2200,
    promo_price: 1950,
    stock_quantity: 30,
    description: 'Masque adoucissant et éclaircissant traditionnel à la Nila.',
    composition: 'Poudre de Nila, Gel d’Aloe Vera',
    conseil_utilisation: 'Laisser poser 10 à 15 minutes sur le corps ou le visage.',
    image_url: '/uploads/sukriaa-masque.jpg',
    images: ['/uploads/sukriaa-masque.jpg'],
    is_active: 1
  },
  {
    id: 4,
    name: 'Sérum Éclat Vitamine C 10%',
    slug: 'serum-eclat-vitamine-c-10',
    category_id: 1,
    original_price: 2800,
    promo_price: 2400,
    stock_quantity: 50,
    description: 'Sérum anti-oxydant pour raviver l’éclat du teint et unifier la peau.',
    composition: 'Vitamine C pure, Acide férulique',
    conseil_utilisation: 'Appliquer 3 à 4 gouttes le matin avant la crème.',
    image_url: '/uploads/serum-vitamine-c.jpg',
    images: ['/uploads/serum-vitamine-c.jpg'],
    is_active: 1
  },
  {
    id: 5,
    name: 'Huile d’Argan Pure Bio',
    slug: 'huile-d-argan-pure-bio',
    category_id: 2,
    original_price: 2500,
    promo_price: 2100,
    stock_quantity: 35,
    description: 'Huile multi-usages nourrissante pour le visage, le corps et les cheveux.',
    composition: '100% Huile d’Argan pressée à froid',
    conseil_utilisation: 'Appliquer quelques gouttes en massage sur peau propre.',
    image_url: '/uploads/argan-pure.jpg',
    images: ['/uploads/argan-pure.jpg'],
    is_active: 1
  }
];

export default function AdminProducts() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories] = useState(INITIAL_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState('');

  // États pour la modal de création / édition
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Gestion des images
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // État pour la modal de confirmation de suppression
  const [deletingProduct, setDeletingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    description: '',
    composition: '',         
    conseil_utilisation: '',
    original_price: '',
    promo_price: '',
    stock_quantity: '10',
    is_active: 1
  });

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
    setImageFiles([]);
    setExistingImages([]);
    setFormData({
      name: '',
      slug: '',
      category_id: '',
      description: '',
      composition: '',         
      conseil_utilisation: '',
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
    setImageFiles([]);

    const imgs = product.images || (product.image_url ? [product.image_url] : []);
    setExistingImages(imgs);

    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      category_id: product.category_id || '',
      description: product.description || '',
      composition: product.composition || '',                  
      conseil_utilisation: product.conseil_utilisation || '',
      original_price: product.original_price || '',
      promo_price: product.promo_price ?? '',
      stock_quantity: product.stock_quantity ?? 0,
      is_active: product.is_active ?? 1
    });
    setIsModalOpen(true);
  };

  // Sélection de nouvelles images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
    }
  };

  const handleRemoveNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (imageUrl) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
  };

  // Enregistrement (Création ou Modification statique)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newImageUrls = imageFiles.map(file => URL.createObjectURL(file));
    const allImages = [...existingImages, ...newImageUrls];

    if (editingProduct) {
      setProducts(prev => prev.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            ...formData,
            original_price: Number(formData.original_price),
            promo_price: formData.promo_price ? Number(formData.promo_price) : null,
            stock_quantity: Number(formData.stock_quantity),
            images: allImages,
            image_url: allImages[0] || null
          };
        }
        return p;
      }));
    } else {
      const newProduct = {
        id: Date.now(),
        ...formData,
        original_price: Number(formData.original_price),
        promo_price: formData.promo_price ? Number(formData.promo_price) : null,
        stock_quantity: Number(formData.stock_quantity),
        images: allImages,
        image_url: allImages[0] || null
      };
      setProducts(prev => [newProduct, ...prev]);
    }

    setIsModalOpen(false);
  };

  // Confirmer la suppression
  const handleConfirmDelete = () => {
    if (!deletingProduct) return;
    setProducts(prev => prev.filter(p => p.id !== deletingProduct.id));
    setDeletingProduct(null);
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
      {filteredProducts.length === 0 ? (
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
                {filteredProducts.map((product) => {
                  const mainImage = product.image_url || (product.images && product.images[0]);
                  return (
                    <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {mainImage ? (
                              <img
                                src={mainImage}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Confirmation de Suppression */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-stone-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} />
              </div>
              
              <h3 className="text-lg font-serif font-medium text-stone-900 mb-2">
                Supprimer ce produit ?
              </h3>
              
              <p className="text-xs text-stone-500 leading-relaxed mb-6">
                Êtes-vous sûr de vouloir supprimer définitivement <strong className="text-stone-800 font-semibold">"{deletingProduct.name}"</strong> ?
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingProduct(null)}
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

      {/* Modal Formulaire (Ajout / Édition) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs overflow-y-auto p-4 flex justify-center items-start sm:items-center">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-stone-200 my-8 flex flex-col max-h-[90vh]">
            
            {/* En-tête Modal */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-white rounded-t-2xl shrink-0">
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

            {/* Formulaire défilable */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              
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

              {/* Composition */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Composition / Ingrédients</label>
                <textarea
                  value={formData.composition}
                  onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                  rows={2}
                  placeholder="Ex: Aqua, Glycerin, Huile d'Argan..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900"
                />
              </div>

              {/* Conseils d'utilisation */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Conseils d'utilisation</label>
                <textarea
                  value={formData.conseil_utilisation}
                  onChange={(e) => setFormData({ ...formData, conseil_utilisation: e.target.value })}
                  rows={2}
                  placeholder="Ex: Appliquer quotidiennement matin et soir sur une peau propre."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900"
                />
              </div>

              {/* Section Multi-Images */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Images du Produit (Galerie)
                </label>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-3">
                  {existingImages.map((imgUrl, idx) => (
                    <div key={`existing-${idx}`} className="relative group aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
                      <img
                        src={imgUrl}
                        alt={`Existante ${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(imgUrl)}
                        className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
                        title="Supprimer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}

                  {imageFiles.map((file, idx) => (
                    <div key={`new-${idx}`} className="relative group aspect-square rounded-lg overflow-hidden border border-emerald-300 bg-emerald-50">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Nouvelle ${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(idx)}
                        className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
                        title="Supprimer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>

                <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-stone-300 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors text-xs text-stone-600 font-medium">
                  <Upload size={16} />
                  <span>Ajouter une ou plusieurs images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
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
              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100 bg-white sticky bottom-0">
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