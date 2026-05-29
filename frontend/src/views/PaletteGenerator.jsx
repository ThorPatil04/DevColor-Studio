import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, RefreshCw, Copy, Check, Save, Code } from 'lucide-react';
import { generateRandomHex, generateHarmony } from '../utils/colorUtils';
import { savePalette } from '../services/paletteService';
import { useAuth } from '../context/AuthContext';

const PaletteGenerator = () => {
  const { isAuthenticated } = useAuth();
  
  // Default to a 5-color palette
  const [colors, setColors] = useState([
    { hex: '#6366F1', locked: false },
    { hex: '#A855F7', locked: false },
    { hex: '#EC4899', locked: false },
    { hex: '#F43F5E', locked: false },
    { hex: '#EAB308', locked: false }
  ]);
  
  const [harmonyType, setHarmonyType] = useState('random');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [paletteName, setPaletteName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [showExportModal, setShowExportModal] = useState(false);

  // Generate initial colors
  useEffect(() => {
    shufflePalette(true);
  }, [harmonyType]);

  // Handle Spacebar keypress to shuffle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && !showExportModal) {
        e.preventDefault();
        shufflePalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [colors, harmonyType, showExportModal]);

  const shufflePalette = (force = false) => {
    if (harmonyType === 'random') {
      setColors(prevColors =>
        prevColors.map(c => (c.locked && !force ? c : { hex: generateRandomHex(), locked: false }))
      );
    } else {
      // For harmony generators, we pick a base color (either locked or random)
      const baseIndex = colors.findIndex(c => c.locked) !== -1 ? colors.findIndex(c => c.locked) : 2;
      const baseHex = colors[baseIndex]?.hex || generateRandomHex();
      const harmonies = generateHarmony(baseHex, harmonyType);
      
      setColors(prevColors =>
        prevColors.map((c, i) => {
          if (c.locked && !force) return c;
          return { hex: harmonies[i] || generateRandomHex(), locked: false };
        })
      );
    }
  };

  const toggleLock = (index) => {
    setColors(prevColors =>
      prevColors.map((c, i) => (i === index ? { ...c, locked: !c.locked } : c))
    );
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!paletteName.trim()) return;
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });

    const colorHexes = colors.map(c => c.hex);
    const result = await savePalette(paletteName, colorHexes);

    setIsSaving(false);
    if (result.success) {
      setSaveMessage({ type: 'success', text: 'Palette saved to favorites!' });
      setPaletteName('');
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
    } else {
      setSaveMessage({ type: 'error', text: result.error });
    }
  };

  // Code Export Code Generation
  const getCssExport = () => {
    let css = ':root {\n';
    colors.forEach((c, idx) => {
      css += `  --color-primary-${idx + 1}: ${c.hex};\n`;
    });
    css += '}';
    return css;
  };

  const getTailwindExport = () => {
    let tw = 'colors: {\n';
    colors.forEach((c, idx) => {
      tw += `  'palette-color-${idx + 1}': '${c.hex}',\n`;
    });
    tw += '}';
    return tw;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Settings bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-6 rounded-2xl glass-premium">
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Generator Mode:</label>
          <select
            value={harmonyType}
            onChange={(e) => setHarmonyType(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-lighter text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
          >
            <option value="random">Random Shuffler</option>
            <option value="complementary">Complementary Harmony</option>
            <option value="analogous">Analogous Harmony</option>
            <option value="triadic">Triadic Harmony</option>
            <option value="monochromatic">Monochromatic Scheme</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:block">
          💡 Tip: Press <kbd className="px-1.5 py-0.5 border dark:border-slate-600 rounded bg-slate-100 dark:bg-dark-accent text-slate-800 dark:text-slate-200 font-semibold shadow-sm">Spacebar</kbd> to shuffle colors!
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => shufflePalette(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-lg shadow-brand-500/20 active:scale-95"
          >
            <RefreshCw size={16} />
            Shuffle Palette
          </button>
          
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-lighter rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
          >
            <Code size={16} />
            Export Code
          </button>
        </div>
      </div>

      {/* Palette swatches */}
      <div className="flex flex-col md:flex-row flex-grow rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-900 bg-white dark:bg-dark">
        {colors.map((color, index) => (
          <motion.div
            key={index}
            className="relative flex-grow flex flex-col items-center justify-end p-6 group cursor-pointer transition-all duration-300 min-h-[120px] md:min-h-0"
            style={{ backgroundColor: color.hex }}
            layout
          >
            {/* Quick Actions */}
            <div className="absolute inset-0 flex md:flex-col items-center justify-center gap-3 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLock(index);
                }}
                className="p-3 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
                title={color.locked ? "Unlock Color" : "Lock Color"}
              >
                {color.locked ? <Lock size={18} className="text-brand-600" /> : <Unlock size={18} />}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(color.hex, index);
                }}
                className="p-3 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
                title="Copy HEX"
              >
                {copiedIndex === index ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
              </button>
            </div>

            {/* Swatch Label */}
            <div className="z-10 flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/95 dark:bg-slate-950/80 shadow-xl backdrop-blur-md">
              <span className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 tracking-wider">
                {color.hex}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest flex items-center gap-1">
                {color.locked ? (
                  <>
                    <Lock size={10} className="text-brand-500" /> Locked
                  </>
                ) : (
                  "Click to Copy"
                )}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Save to DB bar */}
      <div className="mt-6 p-4 rounded-2xl glass-premium">
        {isAuthenticated ? (
          <form onSubmit={handleSave} className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Save className="text-brand-500" size={20} />
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Save this palette</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Add to your favorite dashboard gallery</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-grow max-w-md">
              <input
                type="text"
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value)}
                placeholder="Name your masterpiece..."
                className="flex-grow px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all disabled:opacity-50 active:scale-95 shadow-md shadow-brand-500/10"
              >
                {isSaving ? "Saving..." : "Save Palette"}
              </button>
            </div>
            
            {saveMessage.text && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                saveMessage.type === 'success' 
                  ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400' 
                  : 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400'
              }`}>
                {saveMessage.text}
              </span>
            )}
          </form>
        ) : (
          <div className="flex items-center justify-between gap-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <span>🔒 Authenticate (Login or Register) to save favorite color palettes to your private cloud storage!</span>
          </div>
        )}
      </div>

      {/* Export Code Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl rounded-3xl bg-white dark:bg-dark-lighter p-6 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Export Palette Configurations</h3>
              <button 
                onClick={() => setShowExportModal(false)}
                className="px-3 py-1 border rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-dark bg-transparent"
              >
                Close
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CSS Variables</span>
                  <button 
                    onClick={() => copyToClipboard(getCssExport(), 'css')}
                    className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 font-semibold"
                  >
                    {copiedIndex === 'css' ? <Check size={12} /> : <Copy size={12} />}
                    Copy Code
                  </button>
                </div>
                <pre className="p-4 bg-slate-50 dark:bg-dark rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto h-48 border border-slate-100 dark:border-slate-800">
                  {getCssExport()}
                </pre>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tailwind config extend</span>
                  <button 
                    onClick={() => copyToClipboard(getTailwindExport(), 'tw')}
                    className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 font-semibold"
                  >
                    {copiedIndex === 'tw' ? <Check size={12} /> : <Copy size={12} />}
                    Copy Code
                  </button>
                </div>
                <pre className="p-4 bg-slate-50 dark:bg-dark rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto h-48 border border-slate-100 dark:border-slate-800">
                  {getTailwindExport()}
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PaletteGenerator;
