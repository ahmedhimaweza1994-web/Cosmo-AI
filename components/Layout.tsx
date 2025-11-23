
import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, PenTool, CalendarClock, Settings, LogOut, Sparkles, Megaphone, Palette, Home, Share2, Building2, RefreshCcw, MessageSquare, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLogout: () => void;
  children: React.ReactNode;
  companyName?: string;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, setView, onLogout, children, companyName }) => {
  const { t, language, setLanguage, isRTL } = useLanguage();

  const NavItem = ({ view, icon: Icon, label }: any) => (
    <button
      onClick={() => setView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 group relative overflow-hidden ${
        currentView === view 
        ? 'text-white shadow-lg shadow-accent-violet/20' 
        : 'text-slate-400 hover:text-white'
      }`}
    >
      {currentView === view && (
        <div className="absolute inset-0 bg-gradient-to-r from-accent-violet to-accent-pink opacity-20" />
      )}
      <div className={`absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity ${currentView === view ? 'hidden' : ''}`} />
      
      <Icon size={20} className={`relative z-10 ${currentView === view ? 'text-accent-cyan' : 'group-hover:scale-110 transition-transform rtl:group-hover:-scale-x-110'}`} />
      <span className="font-medium relative z-10">{label}</span>
    </button>
  );

  return (
    <div className={`flex h-screen bg-cosmic-950 overflow-hidden text-slate-200 ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background Ambient Blobs */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent-violet/20 rounded-full blur-[100px] pointer-events-none animate-blob" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent-cyan/10 rounded-full blur-[100px] pointer-events-none animate-blob animation-delay-2000" />

      {/* Sidebar */}
      <div className="w-64 glass-panel-strong border-r-0 flex flex-col p-4 hidden md:flex z-20 m-4 rounded-2xl">
        <div className="flex items-center gap-3 px-2 mb-8 mt-2 cursor-pointer" onClick={() => setView(ViewState.LANDING)}>
          <div className="w-10 h-10 bg-gradient-to-br from-accent-cyan to-accent-violet rounded-xl flex items-center justify-center shadow-lg shadow-accent-cyan/20">
            <Sparkles className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight font-display">{t('common.nexusAi')}</span>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-4 mb-2 mt-2">{t('sidebar.manage')}</div>
          <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label={t('common.dashboard')} />
          <NavItem view={ViewState.PLANNER} icon={CalendarClock} label={t('sidebar.planner')} />
          <NavItem view={ViewState.ADS} icon={Megaphone} label={t('sidebar.adsManager')} />
          
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-4 mb-2 mt-6">{t('sidebar.create')}</div>
          <NavItem view={ViewState.STUDIO} icon={PenTool} label={t('sidebar.contentStudio')} />
          <NavItem view={ViewState.BRANDING} icon={Palette} label={t('sidebar.brandIdentity')} />
          <button
             onClick={() => setView(ViewState.ONBOARDING_CHAT)}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-accent-cyan hover:text-white hover:bg-accent-cyan/10 transition-all mb-1 group"
          >
             <MessageSquare size={20} className="group-hover:scale-110 transition-transform rtl:group-hover:-scale-x-110" />
             <span className="font-medium">{t('nav.aiLaunchpad')}</span>
          </button>
          
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-4 mb-2 mt-6">{t('sidebar.system')}</div>
          <NavItem view={ViewState.COMPANY_INFO} icon={Building2} label={t('sidebar.companyInfo')} />
          <NavItem view={ViewState.SOCIAL_ACCOUNTS} icon={Share2} label={t('sidebar.socialAccounts')} />
          <NavItem view={ViewState.SETTINGS} icon={Settings} label={t('common.settings')} />
          
           {/* Home Link */}
           <button
            onClick={() => setView(ViewState.LANDING)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white transition-all mb-1 hover:bg-white/5"
          >
            <Home size={20} />
            <span className="font-medium">{t('common.home')}</span>
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-white/10">
          
          {/* Active Workspace Card */}
          <div className="bg-white/5 rounded-xl p-3 mb-3 border border-white/5">
             <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-pink to-accent-violet flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {companyName ? companyName.charAt(0).toUpperCase() : <Building2 size={14} />}
               </div>
               <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-bold text-white truncate">{companyName || 'Workspace'}</p>
                 <p className="text-xs text-slate-400">Pro Plan</p>
               </div>
             </div>
             <button 
               onClick={() => setView(ViewState.COMPANY_SELECT)}
               className="w-full py-1.5 flex items-center justify-center gap-2 bg-black/30 hover:bg-black/50 text-xs font-medium text-slate-300 rounded-lg transition-colors"
             >
               <RefreshCcw size={12} className={isRTL ? "rotate-180" : ""} /> {t('nav.switchWorkspace')}
             </button>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={onLogout}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-slate-400 hover:text-red-400 transition-colors hover:bg-white/5 rounded-lg"
            >
              <LogOut size={18} className={isRTL ? "rotate-180" : ""} />
              <span className="text-sm">{t('common.logout')}</span>
            </button>
            <button 
               onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
               className="w-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg font-bold"
               title="Switch Language"
            >
               {language === 'en' ? 'AR' : 'EN'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10">
        {/* Mobile Header */}
        <div className="sticky top-0 z-20 glass-panel-strong px-6 py-4 flex items-center justify-between md:hidden border-b border-white/10">
           <div className="flex items-center gap-2" onClick={() => setView(ViewState.LANDING)}>
             <Sparkles className="text-accent-cyan" size={20} />
             <span className="font-bold text-white font-display">{t('common.nexusAi')}</span>
           </div>
           <button className="text-white" onClick={() => setView(ViewState.SETTINGS)}><Settings size={20} /></button>
        </div>
        
        <div className="p-6 md:p-8 max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};
