import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';

export default function Checkout() {
  const { cart, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  // ÉTATS LIVRAISON
  const [shippingEnabled, setShippingEnabled] = useState(false);
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedShippingCost, setSelectedShippingCost] = useState(0);

  // FORMULAIRE
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    wilaya: '',
    commune: '',
    address: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Charger les paramètres de livraison au chargement
  useEffect(() => {
    fetch(`${API_URL}/shipping-rates`)
      .then(res => res.json())
      .then(data => {
        setShippingEnabled(data.shipping_enabled);
        setShippingRates(data.rates || []);
      })
      .catch(err => console.error("Erreur chargement frais de livraison:", err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Si changement de Wilaya et que la livraison est activée
    if (name === 'wilaya' && shippingEnabled) {
      const match = shippingRates.find(r => r.wilaya_name === value);
      setSelectedShippingCost(match ? Number(match.price) : 0);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder.png';
    if (imageUrl.startsWith('http')) return imageUrl;
    const baseUrl = API_URL.replace('/api', '');
    return `${baseUrl}/uploads/${imageUrl}`;
  };

  const subtotal = totalAmount || 0;
  const grandTotal = subtotal + selectedShippingCost;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || firstName;

      const orderPayload = {
        customer_first_name: firstName,
        customer_last_name: lastName,
        customer_phone: formData.phone,
        wilaya: formData.wilaya,
        commune: formData.commune || 'Centre',
        delivery_address: formData.address,
        notes: formData.notes,
        items: cart.map(item => ({ id: item.id, qty: item.qty || item.quantity || 1 }))
      };

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) throw new Error('Erreur réseau lors de la validation');

      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error("Erreur commande :", error);
      alert("Une erreur est survenue lors de la validation de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="w-full min-h-screen bg-[#FBF9F5] pt-28 pb-24 font-sans text-stone-800 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center">
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-200/60 shadow-xs">
            <h2 className="text-2xl font-serif text-stone-900 font-normal mb-3">Votre panier est vide</h2>
            <Link to="/shop" className="inline-flex items-center justify-center gap-2 w-full bg-stone-900 text-white py-3.5 px-6 rounded-full text-xs font-medium uppercase tracking-widest mt-4">
              Explorer la Boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="w-full min-h-screen bg-[#FBF9F5] pt-28 pb-24 font-sans text-stone-800 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-3xl border border-stone-200/60 shadow-xs">
            <h2 className="text-2xl font-serif text-stone-900 mb-3">Commande Confirmée</h2>
            <p className="text-stone-500 font-light text-xs mb-8">Nous vous contacterons par téléphone pour valider la livraison.</p>
            <button onClick={() => navigate('/shop')} className="w-full bg-stone-900 text-white py-3.5 px-6 rounded-full text-xs uppercase tracking-widest">
              Retour à la Boutique
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FBF9F5] pt-24 md:pt-28 pb-24 font-sans text-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Formulaire */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-stone-200/60 shadow-xs">
            <h2 className="font-serif text-xl text-stone-900 mb-6 pb-4 border-b border-stone-100">Informations de Livraison</h2>

            <form onSubmit={handleSubmitOrder} className="space-y-5">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1.5 font-medium">Nom & Prénom *</label>
                <input type="text" name="fullName" required placeholder="Ex: Amina Benali" value={formData.fullName} onChange={handleInputChange} className="w-full bg-[#FBF9F5] border border-stone-200 rounded-2xl px-4 py-3 text-xs focus:outline-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1.5 font-medium">Téléphone *</label>
                  <input type="tel" name="phone" required placeholder="06XX XX XX XX" value={formData.phone} onChange={handleInputChange} className="w-full bg-[#FBF9F5] border border-stone-200 rounded-2xl px-4 py-3 text-xs focus:outline-none" />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1.5 font-medium">Wilaya *</label>
                  {shippingEnabled && shippingRates.length > 0 ? (
                    <select
                      name="wilaya"
                      required
                      value={formData.wilaya}
                      onChange={handleInputChange}
                      className="w-full bg-[#FBF9F5] border border-stone-200 rounded-2xl px-4 py-3 text-xs text-stone-800 focus:outline-none"
                    >
                      <option value="">-- Sélectionner la Wilaya --</option>
                      {shippingRates.map(rate => (
                        <option key={rate.id} value={rate.wilaya_name}>
                          {rate.wilaya_name} ({rate.price} DA)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="wilaya"
                      required
                      placeholder="Ex: Alger"
                      value={formData.wilaya}
                      onChange={handleInputChange}
                      className="w-full bg-[#FBF9F5] border border-stone-200 rounded-2xl px-4 py-3 text-xs text-stone-800 focus:outline-none"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1.5 font-medium">Adresse exacte de livraison *</label>
                <input type="text" name="address" required placeholder="Rue, Bâtiment, Quartier..." value={formData.address} onChange={handleInputChange} className="w-full bg-[#FBF9F5] border border-stone-200 rounded-2xl px-4 py-3 text-xs focus:outline-none" />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-stone-900 text-white py-4 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xs">
                {isSubmitting ? 'Traitement...' : 'Confirmer la Commande'}
              </button>
            </form>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-stone-200/60 shadow-xs space-y-6">
            <h2 className="font-serif text-xl text-stone-900 pb-4 border-b border-stone-100">Récapitulatif</h2>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => {
                const itemPrice = Number(item.has_promo ? item.final_price : (item.promo_price ?? item.original_price ?? item.price ?? 0));
                const itemQty = item.qty || item.quantity || 1;
                return (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-stone-100">
                    <img src={getImageUrl(item.image_url)} alt={item.name} className="w-16 h-16 object-contain" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-stone-400">Qté : {itemQty}</p>
                    </div>
                    <span className="text-xs font-medium">{itemPrice * itemQty} DA</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-stone-100 pt-4 space-y-2">
              <div className="flex justify-between text-xs text-stone-500 font-light">
                <span>Sous-total</span>
                <span>{subtotal} DA</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500 font-light">
                <span>Frais de livraison</span>
                {shippingEnabled ? (
                  <span className="font-medium text-stone-900">{selectedShippingCost} DA</span>
                ) : (
                  <span className="text-stone-400 italic">Offerts / À définir</span>
                )}
              </div>
              <div className="flex justify-between text-base font-medium text-stone-900 pt-3 border-t border-stone-100">
                <span>Total</span>
                <span>{grandTotal} DA</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}