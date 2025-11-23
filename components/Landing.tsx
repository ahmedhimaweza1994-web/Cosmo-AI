
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Zap, BarChart3, Layers, ArrowRight, Check, PlayCircle, LogOut, LayoutDashboard, Settings, MessageSquare, Globe, ArrowLeft } from 'lucide-react';
import { db } from '../services/dbService';
import { AppSettings, User as UserType, ViewState, Role } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingProps {
  onGetStarted: () => void;
  onLogin: () => void;
  currentUser: UserType | null;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onGetStarted, onLogin, currentUser, onNavigate, onLogout }) => {
  const [settings, setSettings] = useState<AppSettings>(db.getSettings());
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { content, plans } = settings;
  const { t, language, setLanguage, isRTL } = useLanguage();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Map icon string name to component
  const getIcon = (name: string) => {
    switch(name) {
      case 'Zap': return Zap;
      case 'Layers': return Layers;
      case 'BarChart3': return BarChart3;
      default: return Sparkles;
    }
  };

  const handleDashboardClick = () => {
    if (currentUser?.role === Role.ADMIN) {
      onNavigate(ViewState.ADMIN_PANEL);
    } else {
      onNavigate(ViewState.DASHBOARD);
    }
  };

  return (
    <div className={`min-h-screen bg-cosmic-950 text-white overflow-x-hidden selection:bg-primary-500 selection:text-cosmic-950 relative ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* --- NEW BACKGROUND SYSTEM (Restricted to Hero) --- */}
      <div className="absolute top-0 left-0 w-full h-[120vh] overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[128px] animate-blob opacity-60 mix-blend-screen" />
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-accent-pink/10 rounded-full blur-[128px] animate-blob animation-delay-2000 opacity-50 mix-blend-screen" />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
            <Sparkles size={20} className="text-primary-500" />
          </div>
          <span className="text-xl font-bold font-display tracking-tight">{t('common.nexusAi')}</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-slate-400 text-sm font-medium items-center">
          <a href="#features" className="hover:text-white transition-colors">{t('nav.features')}</a>
          <a href="#pricing" className="hover:text-white transition-colors">{t('nav.pricing')}</a>
          <button className="hover:text-white transition-colors">{t('nav.showcase')}</button>
          
          {/* Language Switcher */}
          <button 
             onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
             className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
          >
             <Globe size={14} />
             <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>

        {/* Auth Buttons / User Menu */}
        <div className="relative" ref={menuRef}>
          {currentUser ? (
            <div>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 px-2 py-1.5 pr-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-violet flex items-center justify-center text-xs font-bold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:block">{currentUser.name}</span>
              </button>

              {/* Dropdown */}
              {isUserMenuOpen && (
                <div className={`absolute top-full mt-2 w-56 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in z-50 ${isRTL ? 'left-0' : 'right-0'}`}>
                  <div className="p-4 border-b border-white/5">
                    <p className="text-sm font-bold text-white">{currentUser.name}</p>
                    <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                  <div className="p-2">
                    <button onClick={handleDashboardClick} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                      <LayoutDashboard size={16} /> {t('common.dashboard')}
                    </button>
                    <button onClick={() => onNavigate(ViewState.ONBOARDING_CHAT)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                      <MessageSquare size={16} /> {t('onboarding.optionChat')}
                    </button>
                    <button onClick={() => onNavigate(ViewState.SETTINGS)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                      <Settings size={16} /> {t('common.settings')}
                    </button>
                  </div>
                  <div className="border-t border-white/5 p-2">
                    <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <LogOut size={16} className={isRTL ? "rotate-180" : ""} /> {t('common.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md rounded-full font-medium text-sm text-white transition-all"
            >
              {t('nav.login')}
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 pt-24 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-primary-500 mb-8 backdrop-blur-md animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span className="font-medium tracking-wide">{t('hero.poweredBy')}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 font-display text-white drop-shadow-xl animate-fade-in-up whitespace-pre-line" style={{animationDelay: '0.2s'}}>
             {language === 'ar' ? t('hero.title') : content.heroTitle}
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.3s'}}>
             {language === 'ar' ? t('hero.subtitle') : content.heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <button 
              onClick={currentUser ? handleDashboardClick : onGetStarted}
              className="group px-8 py-4 bg-white text-black hover:bg-slate-200 rounded-xl font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2"
            >
              {currentUser ? t('hero.ctaDashboard') : (language === 'ar' ? t('hero.ctaStart') : content.heroButtonText)} 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </button>
            <button className="px-8 py-4 bg-transparent border border-white/20 text-white hover:bg-white/5 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2">
              <PlayCircle size={20} /> {t('hero.viewDemo')}
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">{language === 'ar' ? t('nav.features') : content.featuresTitle}</h2>
            <p className="text-slate-400">{language === 'ar' ? 'أدوات متكاملة لنجاحك' : content.featuresSubtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {content.features.map((f, i) => {
              const Icon = getIcon(f.icon);
              return (
                <div key={i} className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/10 shadow-lg">
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary-500 mb-6 group-hover:scale-110 transition-transform border border-white/5`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 font-display text-slate-200">{language === 'ar' ? 'ميزة رائعة' : f.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{language === 'ar' ? 'هذا وصف توضيحي للميزة باللغة العربية' : f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <footer className="relative z-10 border-t border-white/5 py-12 text-center text-slate-600 text-sm">
        <p>&copy; 2025 Nexus AI Marketing Platform. Built with Google Gemini.</p>
      </footer>
    </div>
  );
};
