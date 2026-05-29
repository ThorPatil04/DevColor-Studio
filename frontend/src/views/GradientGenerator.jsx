import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Copy, Check, Save, Sliders, ToggleLeft, ToggleRight, Plus, Trash } from 'lucide-react';
import { generateRandomHex } from '../utils/colorUtils';
import { saveGradient } from '../services/gradientService';
import { useAuth } from '../context/AuthContext';

const GradientGenerator = () => {
  const { isAuthenticated } = useAuth();
  
  const [colors, setColors] = useState(['#3b82f6', '#8b5cf6']); // Default gradient stops
  const [angle, setAngle] = useState(135);
  const [gradientType, setGradientType] = useState('linear'); // 'linear' or 'radial'
  const [gradientName, setGradientName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [copied, setCopied] = useState(false);

  const getGradientStyle = () => {
    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${colors.join(', ')})`;
    } else {
      return `radial-gradient(circle, ${colors.join(', ')})`;
    }
  };

  const getTailwindCode = () => {
    // Generate Tailwind approximate syntax
    if (gradientType === 'radial') {
      return `bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[${colors[0]}] ${colors.slice(1, -1).map(c => `via-[${c}]`).join(' ')} to-[${colors[colors.length - 1]}]`;
    }
    
    // Approximate directions
    let direction = 'r';
    if (angle >= 337.5 || angle < 22.5) direction = 'r';
    else if (angle >= 22.5 && angle < 67.5) direction = 'tr';
    else if (angle >= 67.5 && angle < 112.5) direction = 't';
    else if (angle >= 112.5 && angle < 157.5) direction = 'tl';
    else if (angle >= 157.5 && angle < 202.5) direction = 'l';
    else if (angle >= 202.5 && angle < 247.5) direction = 'bl';
    else if (angle >= 247.5 && angle < 292.5) direction = 'b';
    else if (angle >= 292.5 && angle < 337.5) direction = 'br';

    return `bg-gradient-to-${direction} from-[${colors[0]}] ${colors.slice(1, -1).map(c => `via-[${c}]`).join(' ')} to-[${colors[colors.length - 1]}]`;
  };

  const shuffleGradient = () => {
    const newColors = colors.map(() => generateRandomHex());
    setColors(newColors);
    if (gradientType === 'linear') {
      setAngle(Math.floor(Math.random() * 360));
    }
  };

  const updateStopColor = (index, hex) => {
    const updated = [...colors];
    updated[index] = hex;
    setColors(updated);
  };

  const addStop = () => {
    if (colors.length >= 5) return; // Cap at 5 stops
    setColors([...colors, generateRandomHex()]);
  };

  const removeStop = (index) => {
    if (colors.length <= 2) return; // Floor at 2 stops
    const updated = colors.filter((_, idx) => idx !== index);
    setColors(updated);
  };

  const copyCssToClipboard = () => {
    const css = `background: ${getGradientStyle()};`;
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!gradientName.trim()) return;
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });

    const result = await saveGradient(gradientName, colors, gradientType, angle);

    setIsSaving(false);
    if (result.success) {
      setSaveMessage({ type: 'success', text: 'Gradient saved to favorites!' });
      setGradientName('');
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
    } else {
      setSaveMessage({ type: 'error', text: result.error });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-6rem)]">
      {/* Visual Canvas Block */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div 
          className="relative flex-grow rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-900 overflow-hidden flex items-end justify-between p-6"
          style={{ background: getGradientStyle() }}
        >
          {/* Quick Info Badge */}
          <div className="p-3 bg-slate-950/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 text-white max-w-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
              CSS Style Rule
            </span>
            <code className="text-xs font-mono break-all leading-normal select-all">
              background: {getGradientStyle()};
            </code>
          </div>

          <button 
            onClick={shuffleGradient}
            className="p-3.5 bg-white/95 hover:bg-white text-slate-800 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all"
            title="Randomize Gradient"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {/* Save form (authenticated) */}
        <div className="p-4 rounded-2xl glass-premium">
          {isAuthenticated ? (
            <form onSubmit={handleSave} className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Save className="text-brand-500" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Save Gradient</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Save design parameters to favorite library</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-grow max-w-md">
                <input
                  type="text"
                  value={gradientName}
                  onChange={(e) => setGradientName(e.target.value)}
                  placeholder="Give a beautiful name..."
                  className="flex-grow px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all disabled:opacity-50 active:scale-95 shadow-md shadow-brand-500/10"
                >
                  {isSaving ? "Saving..." : "Save Gradient"}
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
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <span>🔒 Log in or Register user to save custom gradients in favorites cloud!</span>
            </div>
          )}
        </div>
      </div>

      {/* Editor Controls Block */}
      <div className="glass-premium p-6 rounded-3xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between overflow-y-auto max-h-[85vh] lg:max-h-none">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Sliders className="text-brand-500" size={20} />
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Gradient Controls</h3>
          </div>

          {/* Toggle Type */}
          <div className="mb-6">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-3">
              Gradient Direction Shape
            </span>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setGradientType('linear')}
                className={`flex-grow flex items-center justify-center gap-2 py-2 px-4 rounded-xl border text-sm font-bold transition-all ${
                  gradientType === 'linear'
                    ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/10'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-dark-lighter'
                }`}
              >
                Linear Style
              </button>
              
              <button
                onClick={() => setGradientType('radial')}
                className={`flex-grow flex items-center justify-center gap-2 py-2 px-4 rounded-xl border text-sm font-bold transition-all ${
                  gradientType === 'radial'
                    ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/10'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-dark-lighter'
                }`}
              >
                Radial Style
              </button>
            </div>
          </div>

          {/* Angle Input (only if linear) */}
          {gradientType === 'linear' && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Angle Angle: <strong className="text-brand-500">{angle}°</strong>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 dark:bg-dark border-none outline-none appearance-none cursor-pointer accent-brand-500"
              />
            </div>
          )}

          {/* Stops List */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Stops Colors ({colors.length}/5)
              </span>
              {colors.length < 5 && (
                <button
                  onClick={addStop}
                  className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 bg-transparent hover:underline"
                >
                  <Plus size={14} /> Add Color Stop
                </button>
              )}
            </div>

            <div className="space-y-3">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => updateStopColor(index, e.target.value)}
                      className="absolute inset-0 w-full h-full p-0 border-0 outline-none cursor-pointer scale-[1.5]"
                    />
                  </div>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => updateStopColor(index, e.target.value)}
                    placeholder="#HEX"
                    maxLength="7"
                    className="flex-grow px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  {colors.length > 2 && (
                    <button
                      onClick={() => removeStop(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                      title="Remove stop"
                    >
                      <Trash size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code Outputs */}
        <div className="mt-8 space-y-4">
          <button
            onClick={copyCssToClipboard}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 active:scale-[0.98] transition-all"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "CSS Copied!" : "Copy CSS background"}
          </button>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Tailwind CSS Config Rule
            </span>
            <div className="p-3 bg-slate-50 dark:bg-dark text-[11px] font-mono rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 select-all overflow-x-auto break-words leading-relaxed max-w-full">
              {getTailwindCode()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientGenerator;
