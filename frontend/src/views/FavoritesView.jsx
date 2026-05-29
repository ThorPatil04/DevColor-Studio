import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, Heart, Check, Hash, Code } from 'lucide-react';
import { getSavedPalettes, deletePalette } from '../services/paletteService';
import { getSavedGradients, deleteGradient } from '../services/gradientService';
import { useAuth } from '../context/AuthContext';

const FavoritesView = () => {
  const { isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState('palettes');
  const [palettes, setPalettes] = useState([]);
  const [gradients, setGradients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    setLoading(true);
    setError('');
    
    const paletteRes = await getSavedPalettes();
    const gradientRes = await getSavedGradients();

    if (paletteRes.success && gradientRes.success) {
      setPalettes(paletteRes.data);
      setGradients(gradientRes.data);
    } else {
      setError('Could not retrieve your favorites from database.');
    }
    setLoading(false);
  };

  const handleDeletePalette = async (id) => {
    const res = await deletePalette(id);
    if (res.success) {
      setPalettes(prev => prev.filter(p => p.id !== id));
    } else {
      alert(res.error);
    }
  };

  const handleDeleteGradient = async (id) => {
    const res = await deleteGradient(id);
    if (res.success) {
      setGradients(prev => prev.filter(g => g.id !== id));
    } else {
      alert(res.error);
    }
  };

  const copyPaletteHexes = (colors, id) => {
    const text = colors.join(', ');
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getGradientStyle = (gradient) => {
    if (gradient.type === 'linear') {
      return `linear-gradient(${gradient.angle}deg, ${gradient.colors.join(', ')})`;
    } else {
      return `radial-gradient(circle, ${gradient.colors.join(', ')})`;
    }
  };

  const copyGradientStyle = (gradient, id) => {
    const css = `background: ${getGradientStyle(gradient)};`;
    navigator.clipboard.writeText(css);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center max-w-md mx-auto">
        <Heart size={48} className="text-slate-300 dark:text-slate-700 mb-4 animate-pulse" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Access Locked</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Please log in or register a new developer account to save, view, and organize color configurations in your private vault!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)]">
      {/* Selector Tabs */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-shrink-0">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('palettes')}
            className={`pb-2.5 text-sm font-bold border-b-2 px-1 transition-all ${
              activeTab === 'palettes'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Saved Palettes ({palettes.length})
          </button>
          
          <button
            onClick={() => setActiveTab('gradients')}
            className={`pb-2.5 text-sm font-bold border-b-2 px-1 transition-all ${
              activeTab === 'gradients'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Saved Gradients ({gradients.length})
          </button>
        </div>

        <button
          onClick={fetchFavorites}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-all"
        >
          🔄 Refresh Gallery
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-slate-500 dark:text-slate-400">Loading your cloud repository...</div>
      ) : error ? (
        <div className="text-center py-12 text-sm text-red-500 font-semibold">{error}</div>
      ) : activeTab === 'palettes' ? (
        /* Palettes Gallery Grid */
        <div className="flex-grow overflow-y-auto pr-1">
          {palettes.length === 0 ? (
            <div className="text-center py-16 text-sm text-slate-400 dark:text-slate-600">No color palettes saved yet. Try creating one in the shuffler!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {palettes.map((palette) => (
                  <motion.div
                    key={palette.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-premium rounded-2xl border border-slate-100 dark:border-slate-850 p-4 flex flex-col justify-between h-48"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate pr-2">
                          {palette.name}
                        </h4>
                        
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => copyPaletteHexes(palette.colors, palette.id)}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-dark text-slate-600 dark:text-slate-350 rounded-lg transition-all"
                            title="Copy colors list"
                          >
                            {copiedId === palette.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                          </button>
                          
                          <button
                            onClick={() => handleDeletePalette(palette.id)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-lg transition-all"
                            title="Delete palette"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Visual Swatch Strip */}
                      <div className="flex h-16 rounded-xl overflow-hidden shadow-inner border border-slate-100 dark:border-slate-800">
                        {palette.colors.map((c, idx) => (
                          <div
                            key={idx}
                            className="flex-grow h-full"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-4">
                      <span>🎨 {palette.colors.length} color swatch</span>
                      <span>{new Date(palette.createdAt).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      ) : (
        /* Gradients Gallery Grid */
        <div className="flex-grow overflow-y-auto pr-1">
          {gradients.length === 0 ? (
            <div className="text-center py-16 text-sm text-slate-400 dark:text-slate-600">No gradients saved yet. Try creating one in the visual builder!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {gradients.map((gradient) => (
                  <motion.div
                    key={gradient.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-premium rounded-2xl border border-slate-100 dark:border-slate-850 p-4 flex flex-col justify-between h-48"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate pr-2">
                          {gradient.name}
                        </h4>
                        
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => copyGradientStyle(gradient, gradient.id)}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-dark text-slate-600 dark:text-slate-350 rounded-lg transition-all"
                            title="Copy CSS Background"
                          >
                            {copiedId === gradient.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteGradient(gradient.id)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-lg transition-all"
                            title="Delete gradient"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Visual Gradient Swatch Card */}
                      <div 
                        className="h-16 rounded-xl shadow-inner border border-slate-100 dark:border-slate-800"
                        style={{ background: getGradientStyle(gradient) }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-4">
                      <span className="capitalize">{gradient.type} ({gradient.angle}°) style</span>
                      <span>{new Date(gradient.createdAt).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritesView;
