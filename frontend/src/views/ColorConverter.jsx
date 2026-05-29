import React, { useState } from 'react';
import { Copy, Check, Hash, Sliders } from 'lucide-react';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from '../utils/colorUtils';

const ColorConverter = () => {
  const [hex, setHex] = useState('#6366F1');
  const [rgb, setRgb] = useState('99, 102, 241');
  const [hsl, setHsl] = useState('239, 84%, 66%');
  
  const [copiedType, setCopiedType] = useState(null);

  const handleHexChange = (value) => {
    setHex(value);
    
    // Validate and update others
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      const parsedRgb = hexToRgb(value);
      if (parsedRgb) {
        setRgb(`${parsedRgb.r}, ${parsedRgb.g}, ${parsedRgb.b}`);
        const parsedHsl = rgbToHsl(parsedRgb.r, parsedRgb.g, parsedRgb.b);
        setHsl(`${parsedHsl.h}, ${parsedHsl.s}%, ${parsedHsl.l}%`);
      }
    }
  };

  const handleRgbChange = (value) => {
    setRgb(value);
    
    // Validate e.g. "255, 255, 255" or "255 255 255"
    const parts = value.split(/[,\s]+/).map(p => parseInt(p.trim(), 10));
    if (parts.length === 3 && parts.every(p => !isNaN(p) && p >= 0 && p <= 255)) {
      const generatedHex = rgbToHex(parts[0], parts[1], parts[2]);
      setHex(generatedHex);
      const parsedHsl = rgbToHsl(parts[0], parts[1], parts[2]);
      setHsl(`${parsedHsl.h}, ${parsedHsl.s}%, ${parsedHsl.l}%`);
    }
  };

  const handleHslChange = (value) => {
    setHsl(value);
    
    // Validate e.g. "360, 100%, 100%" or "360 100 100"
    const parts = value.split(/[,\s%]+/).map(p => parseInt(p.trim(), 10));
    if (parts.length === 3 && 
        !isNaN(parts[0]) && parts[0] >= 0 && parts[0] <= 360 &&
        !isNaN(parts[1]) && parts[1] >= 0 && parts[1] <= 100 &&
        !isNaN(parts[2]) && parts[2] >= 0 && parts[2] <= 100) {
      
      const parsedRgb = hslToRgb(parts[0], parts[1], parts[2]);
      setRgb(`${parsedRgb.r}, ${parsedRgb.g}, ${parsedRgb.b}`);
      const generatedHex = rgbToHex(parsedRgb.r, parsedRgb.g, parsedRgb.b);
      setHex(generatedHex);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto glass-premium rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-850 h-[calc(100vh-10rem)] flex flex-col md:flex-row items-center gap-8 justify-center">
      {/* Visual Color Swatch */}
      <div 
        className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-full rounded-2xl shadow-xl flex items-end p-6 border border-slate-200 dark:border-slate-800 transition-all duration-300"
        style={{ backgroundColor: /^#[0-9A-F]{6}$/i.test(hex) ? hex : '#6366F1' }}
      >
        <div className="px-4 py-2 bg-slate-950/80 backdrop-blur-md rounded-xl text-white font-mono text-xs font-bold border border-white/10 shadow-lg tracking-wider">
          Visual Canvas Specimen
        </div>
      </div>

      {/* Conversion Fields */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">HEX/RGB/HSL Converter</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Convert color models reactively in real time.</p>
        </div>

        {/* HEX Field */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Hash size={14} className="text-brand-500" /> Hex Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={hex}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#FFFFFF"
              maxLength="7"
              className="flex-grow px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              onClick={() => copyToClipboard(hex, 'hex')}
              className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-dark-accent dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all"
              title="Copy HEX"
            >
              {copiedType === 'hex' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* RGB Field */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders size={14} className="text-brand-500" /> RGB Parameters
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={rgb}
              onChange={(e) => handleRgbChange(e.target.value)}
              placeholder="R, G, B"
              className="flex-grow px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              onClick={() => copyToClipboard(`rgb(${rgb})`, 'rgb')}
              className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-dark-accent dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all"
              title="Copy CSS RGB"
            >
              {copiedType === 'rgb' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* HSL Field */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders size={14} className="text-brand-500" /> HSL Parameters
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={hsl}
              onChange={(e) => handleHslChange(e.target.value)}
              placeholder="H, S%, L%"
              className="flex-grow px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              onClick={() => copyToClipboard(`hsl(${hsl})`, 'hsl')}
              className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-dark-accent dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all"
              title="Copy CSS HSL"
            >
              {copiedType === 'hsl' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorConverter;
