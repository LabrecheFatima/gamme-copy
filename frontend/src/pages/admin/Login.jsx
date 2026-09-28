import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulation d'une connexion statique
    setTimeout(() => {
      if (username && password) {
        localStorage.setItem('token', 'fake-jwt-token-static');
        navigate('/admin');
      } else {
        setError('Veuillez remplir tous les champs.');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-apoteca-cream flex flex-col justify-center items-center px-4 py-12">
      {/* Container de la carte */}
      <div className="w-full max-w-md bg-white border border-apoteca-grey/40 rounded-2xl shadow-sm p-8 md:p-10">
        
        {/* En-tête / Logo & Titre */}
        <div className="text-center mb-8">
          <span className="text-xs font-sans tracking-widest text-apoteca-charcoal/60 uppercase">
            Espace Restreint
          </span>
          <h1 className="font-serif text-3xl font-normal text-apoteca-charcoal mt-2 mb-3">
            Apoteca-dz
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-apoteca-pink"></span>
            <p className="text-sm font-sans text-apoteca-charcoal/70">
              Connexion Administration
            </p>
            <span className="w-2 h-2 rounded-full bg-apoteca-pink"></span>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg text-center font-sans">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-apoteca-charcoal mb-2">
              Identifiant
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nom d'utilisateur"
              required
              className="w-full px-4 py-3 text-sm bg-apoteca-cream/50 border border-apoteca-grey/60 rounded-xl focus:outline-none focus:border-apoteca-charcoal transition-colors font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-apoteca-charcoal mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 text-sm bg-apoteca-cream/50 border border-apoteca-grey/60 rounded-xl focus:outline-none focus:border-apoteca-charcoal transition-colors font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 px-6 bg-apoteca-charcoal hover:bg-black text-white font-sans text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? 'Connexion en cours...' : 'Se Connecter'}
          </button>
        </form>

        {/* Footer de la carte */}
        <div className="mt-8 text-center border-t border-apoteca-grey/30 pt-6">
          <a
            href="/"
            className="text-xs font-sans text-apoteca-charcoal/60 hover:text-apoteca-charcoal transition-colors underline underline-offset-4"
          >
            ← Retourner sur le site public
          </a>
        </div>
      </div>
    </div>
  );
}