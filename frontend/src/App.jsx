import React, { useState } from 'react';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { 
  Palette, 
  Layers, 
  RefreshCw, 
  Eye, 
  Search, 
  Heart, 
  User, 
  Sun, 
  Moon, 
  Menu,
  X
} from 'lucide-react';

// View Imports
import PaletteGenerator from './views/PaletteGenerator';
import GradientGenerator from './views/GradientGenerator';
import ColorConverter from './views/ColorConverter';
import AccessibilityChecker from './views/AccessibilityChecker';
import TailwindFinder from './views/TailwindFinder';
import FavoritesView from './views/FavoritesView';
import AuthView from './views/AuthView';

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('palette');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'palette', label: 'Palette Generator', icon: Palette },
    { id: 'gradient', label: 'Gradient Builder', icon: Layers },
    { id: 'converter', label: 'Color Converter', icon: RefreshCw },
    { id: 'contrast', label: 'Contrast Checker', icon: Eye },
    { id: 'tailwind', label: 'Tailwind Finder', icon: Search },
    { id: 'favorites', label: 'Favorites Vault', icon: Heart, badge: true },
    { id: 'auth', label: isAuthenticated ? 'Developer Profile' : 'Authenticate', icon: User, accent: true },
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'palette':
        return <PaletteGenerator />;
      case 'gradient':
        return <GradientGenerator />;
      case 'converter':
        return <ColorConverter />;
      case 'contrast':
        return <AccessibilityChecker />;
      case 'tailwind':
        return <TailwindFinder />;
      case 'favorites':
        return <FavoritesView />;
      case 'auth':
        return <AuthView />;
      default:
        return <PaletteGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 bg-grid flex transition-colors duration-300">
      
      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 glass-premium border-r border-slate-200 dark:border-slate-850 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col gap-8">
          {/* Logo & Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
                <Palette size={20} />
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  DevColor Studio
                </h1>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">v1.0.0</span>
              </div>
            </div>
            
            {/* Close button on mobile sidebar */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 bg-slate-100 hover:bg-slate-200 dark:bg-dark-accent dark:hover:bg-slate-700 rounded-lg text-slate-500 bg-transparent border-none"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all border-none outline-none cursor-pointer
                    ${isActive 
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' 
                      : 'hover:bg-slate-100/50 dark:hover:bg-dark-lighter/50 text-slate-600 dark:text-slate-400 bg-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  
                  {item.badge && isAuthenticated && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                    }`}>
                      Live
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer profile info (in sidebar) */}
        {isAuthenticated && (
          <div className="p-3 bg-slate-100/50 dark:bg-dark-lighter/50 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-xs font-extrabold text-brand-600 uppercase border border-brand-200">
              {user?.username?.substring(0, 2)}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black text-slate-700 dark:text-slate-350 block truncate capitalize">
                {user?.username}
              </span>
              <span className="text-[9px] font-medium text-slate-400 block truncate">
                Cloud Vault Connected
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Workspace Area */}
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Header toolbar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-900 px-6 flex items-center justify-between glass-premium flex-shrink-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-accent dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 bg-transparent border-none"
            >
              <Menu size={20} />
            </button>
            
            <h2 className="text-sm font-extrabold capitalize text-slate-800 dark:text-slate-100 hidden lg:block tracking-wide">
              {activeTab.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Authenticated indicator badge */}
            {isAuthenticated ? (
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full border border-green-200 dark:border-green-950/30 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Cloud Connected
              </span>
            ) : (
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-dark-accent text-slate-500 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-800 text-[10px] font-semibold">
                🔒 Offline Sandbox
              </span>
            )}

            {/* Dark Mode toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-dark-accent dark:hover:bg-slate-750 text-slate-600 dark:text-slate-200 rounded-xl transition-all border-none outline-none cursor-pointer hover:scale-105 active:scale-95"
              title={theme === 'dark' ? 'Activate light mode' : 'Activate dark mode'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        {/* Dynamic active view viewport */}
        <main className="flex-grow overflow-hidden p-6 relative">
          <div className="h-full w-full overflow-y-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
