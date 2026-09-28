import React, { useState } from 'react';
import { Truck, Edit3, Check } from 'lucide-react';

const INITIAL_SHIPPING = [
  { id: 1, wilaya: '01 - Adrar', price: 1000 },
  { id: 2, wilaya: '02 - Chlef', price: 600 },
  { id: 16, wilaya: '16 - Alger', price: 400 },
  { id: 25, wilaya: '25 - Constantine', price: 600 },
  { id: 31, wilaya: '31 - Oran', price: 600 }
];

export default function AdminShipping() {
  const [rates, setRates] = useState(INITIAL_SHIPPING);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  const handleEdit = (rate) => {
    setEditingId(rate.id);
    setEditPrice(rate.price);
  };

  const handleSave = (id) => {
    setRates(rates.map(r => r.id === id ? { ...r, price: Number(editPrice) } : r));
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <h2 className="text-2xl font-serif text-stone-900">Frais de Livraison par Wilaya</h2>
        <p className="text-xs text-stone-500 mt-1">Ajustez les frais d'expédition pour chaque région</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              <th className="py-3.5 px-6">Wilaya</th>
              <th className="py-3.5 px-6">Frais d'expédition</th>
              <th className="py-3.5 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-sm">
            {rates.map((rate) => (
              <tr key={rate.id} className="hover:bg-stone-50/50">
                <td className="py-4 px-6 font-medium text-stone-900">{rate.wilaya}</td>
                <td className="py-4 px-6 font-semibold text-stone-800">
                  {editingId === rate.id ? (
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-28 px-3 py-1 border border-stone-300 rounded-lg text-xs"
                    />
                  ) : (
                    `${rate.price} DA`
                  )}
                </td>
                <td className="py-4 px-6 text-right">
                  {editingId === rate.id ? (
                    <button onClick={() => handleSave(rate.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                      <Check size={16} />
                    </button>
                  ) : (
                    <button onClick={() => handleEdit(rate)} className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg">
                      <Edit3 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}