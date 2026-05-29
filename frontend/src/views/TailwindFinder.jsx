import React, { useState, useEffect } from 'react';
import { Copy, Check, Search, Hash } from 'lucide-react';
import { findClosestTailwindColor } from '../utils/colorUtils';

const TailwindFinder = () => {
  const [customHex, setCustomHex] = useState('#6366F1');
  const [match, setMatch] = useState(null);
  const [copiedType, setCopiedType] = useState(null);

  useEffect(() => {
    if (/^#[0-9A-F]{6}$/i.test(customHex)) {
      const result = findClosestTailwindColor(customHex);
      setMatch(result);
    }
  }, [customHex]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto glass-premium rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-850 h-[calc(100vh-10rem)] flex flex-col justify-center">
      <div className="mb-8">
        <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-2">
          <Search className="text-brand-500" size={22} /> Tailwind Color Finder
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Find the closest standard Tailwind CSS v3 utility color for any custom hex code!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Input & Matches Column */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Hash size={14} className="text-brand-500" /> Enter Custom HEX
            </label>
            <div className="flex gap-2">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700 relative flex-shrink-0">
                <input
                  type="color"
                  value={customHex}
                  onChange={(e) => setCustomHex(e.target.value.toUpperCase())}
                  className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                />
              </div>
              <input
                type="text"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value.toUpperCase())}
                placeholder="#6366F1"
                maxLength="7"
                className="flex-grow px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {match && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">
                  Nearest Tailwind Shade Match
                </span>
                <span className="text-lg font-black text-slate-800 dark:text-slate-100 capitalize">
                  {match.tailwindName}
                </span>
              </div>

              {/* Clipboard Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => copyToClipboard(match.tailwindName, 'name')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-dark text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                >
                  <span>Utility Name: <code className="font-mono text-brand-600 dark:text-brand-400">{match.tailwindName}</code></span>
                  {copiedType === 'name' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                </button>
                
                <button
                  onClick={() => copyToClipboard(`bg-${match.tailwindName}`, 'bg')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-dark text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                >
                  <span>Background Class: <code className="font-mono text-brand-600 dark:text-brand-400">bg-{match.tailwindName}</code></span>
                  {copiedType === 'bg' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                </button>

                <button
                  onClick={() => copyToClipboard(`text-${match.tailwindName}`, 'text')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-dark text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                >
                  <span>Text Color Class: <code className="font-mono text-brand-600 dark:text-brand-400">text-{match.tailwindName}</code></span>
                  {copiedType === 'text' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Visual Swatch Comparison */}
        {match && (
          <div className="flex flex-col gap-4">
            <div className="flex h-56 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
              {/* Custom Color Area */}
              <div 
                className="w-1/2 h-full flex flex-col justify-end p-4 text-white font-bold"
                style={{ backgroundColor: customHex }}
              >
                <div className="p-2 bg-slate-950/70 backdrop-blur-sm rounded-lg text-[10px] w-max select-all font-mono">
                  Input: {customHex}
                </div>
              </div>

              {/* Tailwind Color Area */}
              <div 
                className="w-1/2 h-full flex flex-col justify-end p-4 text-white font-bold"
                style={{ backgroundColor: match.hex }}
              >
                <div className="p-2 bg-slate-950/70 backdrop-blur-sm rounded-lg text-[10px] w-max select-all font-mono uppercase">
                  Tailwind: {match.hex}
                </div>
              </div>
            </div>
            <div className="text-[10px] text-center font-medium text-slate-400 uppercase tracking-widest">
              Side-by-Side Spectrum Comparison
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TailwindFinder;
