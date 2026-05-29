import React, { useState } from 'react';
import { Eye, HelpCircle, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { getContrastRatio, getWcagGrades } from '../utils/colorUtils';

const AccessibilityChecker = () => {
  const [fgColor, setFgColor] = useState('#FFFFFF');
  const [bgColor, setBgColor] = useState('#6366F1');

  const ratio = getContrastRatio(fgColor, bgColor);
  const grades = getWcagGrades(ratio);

  const swapColors = () => {
    setFgColor(bgColor);
    setBgColor(fgColor);
  };

  const getPassFailBadge = (pass) => {
    return pass ? (
      <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/20 px-2.5 py-1 rounded-full border border-green-200 dark:border-green-900">
        <CheckCircle size={12} /> PASS
      </span>
    ) : (
      <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/20 px-2.5 py-1 rounded-full border border-red-200 dark:border-red-900">
        <AlertCircle size={12} /> FAIL
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-6rem)]">
      {/* Configuration & Scores Panel */}
      <div className="flex flex-col gap-6">
        <div className="glass-premium p-6 rounded-3xl border border-slate-100 dark:border-slate-850">
          <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">Contrast Checker</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">WCAG 2.1 compliance utility for web accessibility standardizations.</p>

          <div className="grid grid-cols-2 gap-4 items-center mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Foreground Text</label>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700 relative flex-shrink-0">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value.toUpperCase())}
                    className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                  />
                </div>
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value.toUpperCase())}
                  placeholder="#FFFFFF"
                  maxLength="7"
                  className="flex-grow px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Background Area</label>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700 relative flex-shrink-0">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value.toUpperCase())}
                    className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                  />
                </div>
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value.toUpperCase())}
                  placeholder="#000000"
                  maxLength="7"
                  className="flex-grow px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            onClick={swapColors}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-250 text-xs font-bold hover:bg-slate-50 dark:hover:bg-dark-lighter active:scale-98 transition-all"
          >
            <RefreshCw size={14} /> Swap Foreground & Background
          </button>
        </div>

        {/* WCAG Criteria Details */}
        <div className="glass-premium p-6 rounded-3xl border border-slate-100 dark:border-slate-850 flex-grow flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Eye size={16} className="text-brand-500" /> WCAG compliance score grades
            </h4>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Normal Text AA */}
              <div className="flex items-center justify-between py-3.5">
                <div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">Normal Text (Level AA)</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Requires a minimum contrast ratio of 4.5:1</p>
                </div>
                {getPassFailBadge(grades.normalAA)}
              </div>

              {/* Normal Text AAA */}
              <div className="flex items-center justify-between py-3.5">
                <div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">Normal Text (Level AAA)</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Requires a minimum contrast ratio of 7.0:1</p>
                </div>
                {getPassFailBadge(grades.normalAAA)}
              </div>

              {/* Large Text AA */}
              <div className="flex items-center justify-between py-3.5">
                <div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">Large Text (Level AA)</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Requires a minimum contrast ratio of 3.0:1</p>
                </div>
                {getPassFailBadge(grades.largeAA)}
              </div>

              {/* Large Text AAA */}
              <div className="flex items-center justify-between py-3.5">
                <div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">Large Text (Level AAA)</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Requires a minimum contrast ratio of 4.5:1</p>
                </div>
                {getPassFailBadge(grades.largeAAA)}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-start gap-1.5 mt-4">
            <HelpCircle size={14} className="flex-shrink-0 text-slate-400" />
            <span>Note: Large text is defined as 14pt (approx. 18.6px) bold and larger, or 18pt (approx. 24px) regular and larger.</span>
          </div>
        </div>
      </div>

      {/* Visual Canvas Block */}
      <div 
        className="rounded-3xl shadow-2xl overflow-hidden p-8 flex flex-col justify-between border transition-all duration-300 h-full"
        style={{ backgroundColor: bgColor }}
      >
        <div className="space-y-6">
          <span 
            className="text-[10px] uppercase font-bold px-3 py-1 rounded-full border shadow-sm backdrop-blur-md inline-block tracking-widest"
            style={{ color: fgColor, borderColor: `${fgColor}25`, backgroundColor: `${fgColor}10` }}
          >
            Live specimen specimen
          </span>

          <div className="space-y-4">
            {/* Normal text spec */}
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest block opacity-60 mb-1" style={{ color: fgColor }}>
                Normal Text (16px)
              </span>
              <p className="text-base font-medium leading-relaxed" style={{ color: fgColor }}>
                DevColor Studio gives developers super powers to generate beautiful palettes and inspect contrast standardizations in one cohesive workspace.
              </p>
            </div>

            {/* Large text spec */}
            <div className="pt-4 border-t" style={{ borderColor: `${fgColor}15` }}>
              <span className="text-xs uppercase font-extrabold tracking-widest block opacity-60 mb-1.5" style={{ color: fgColor }}>
                Large Headline (24px)
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: fgColor }}>
                Stunning Aesthetics. Pure Accessibility.
              </h2>
            </div>
          </div>
        </div>

        {/* Large Score Indicator */}
        <div className="flex items-baseline gap-2 mt-8">
          <span className="text-5xl font-black tracking-tighter" style={{ color: fgColor }}>
            {ratio.toFixed(2)}
          </span>
          <span className="text-sm font-bold opacity-75" style={{ color: fgColor }}>
            contrast ratio
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityChecker;
