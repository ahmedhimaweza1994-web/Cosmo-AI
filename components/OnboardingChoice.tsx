
import React, { useState, useEffect } from 'react';
import { NeoCosmoAvatar } from './NeoCosmoAvatar';
import { MessageSquare, FileText, ArrowRight, Sparkles, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  onManual: () => void;
  onChat: () => void;
  onLogout: () => void;
}

export const OnboardingChoice: React.FC<Props> = ({ onManual, onChat, onLogout }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredOption, setHoveredOption] = useState<'none' | 'manual' | 'chat'>('none');
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className={`min-h-screen bg-cosmic-950 flex flex-col items-center justify-center p-6 relative overflow-hidden ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
       
       {/* Background Ambient */}
       <div className="absolute inset-0 bg-grid-pattern opacity-20" />
       <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent-violet/20 rounded-full blur-[128px] animate-blob" />
       <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent-cyan/10 rounded-full blur-[128px] animate-blob animation-delay-2000" />

       {/* Header */}
       <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
           <div className="flex items-center gap-2">
             <Sparkles size={20} className="text-accent-cyan" />
             <span className="font-bold text-white font-display text-lg">{t('common.nexusAi')}</span>
           </div>
           <button 
             onClick={onLogout}
             className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors px-4 py-2 rounded-full hover:bg-white/5"
           >
             <LogOut size={16} className={isRTL ? "rotate-180" : ""} />
             <span className="text-sm font-medium">{t('common.logout')}</span>
           </button>
       </div>

       <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
          
          {/* Avatar Section */}
          <div className="mb-8 transition-transform duration-500 hover:scale-110 cursor-pointer" onClick={onChat}>
             <NeoCosmoAvatar 
                mousePos={mousePos} 
                mood={hoveredOption === 'chat' ? 'happy' : hoveredOption === 'manual' ? 'thinking' : 'neutral'}
                isThinking={hoveredOption === 'manual'}
                scale={1.5}
             />
          </div>

          <div className="text-center mb-12 animate-fade-in-up">
             <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-4 drop-shadow-xl">
                {t('onboarding.howToStart')}
             </h1>
             <p className="text-slate-400 text-lg max-w-xl mx-auto">
                {t('onboarding.startSubtitle')}
             </p>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
             
             {/* Option 1: Chat */}
             <button 
                onClick={onChat}
                onMouseEnter={() => setHoveredOption('chat')}
                onMouseLeave={() => setHoveredOption('none')}
                className="group relative glass-panel p-8 rounded-3xl border border-white/10 text-left transition-all hover:border-accent-cyan hover:bg-white/10 hover:-translate-y-2 shadow-2xl"
             >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                
                <div className="relative z-10">
                   <div className="w-16 h-16 rounded-2xl bg-accent-cyan/20 flex items-center justify-center text-accent-cyan mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,210,255,0.3)]">
                      <MessageSquare size={32} className={isRTL ? "-scale-x-100" : ""} />
                   </div>
                   <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      {t('onboarding.optionChat')} <Sparkles size={18} className="text-yellow-400 animate-pulse"/>
                   </h2>
                   <p className="text-slate-400 mb-6 leading-relaxed">
                      {t('onboarding.optionChatDesc')}
                   </p>
                   <div className="flex items-center gap-2 text-accent-cyan font-bold text-sm group-hover:translate-x-2 transition-transform rtl:group-hover:-translate-x-2">
                      {t('onboarding.startInterview')} <ArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
                   </div>
                </div>
             </button>

             {/* Option 2: Manual */}
             <button 
                onClick={onManual}
                onMouseEnter={() => setHoveredOption('manual')}
                onMouseLeave={() => setHoveredOption('none')}
                className="group relative glass-panel p-8 rounded-3xl border border-white/10 text-left transition-all hover:border-primary-500 hover:bg-white/10 hover:-translate-y-2 shadow-xl"
             >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                
                <div className="relative z-10">
                   <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-300 mb-6 group-hover:scale-110 transition-transform border border-white/10">
                      <FileText size={32} />
                   </div>
                   <h2 className="text-2xl font-bold text-white mb-2">
                      {t('onboarding.optionManual')}
                   </h2>
                   <p className="text-slate-400 mb-6 leading-relaxed">
                      {t('onboarding.optionManualDesc')}
                   </p>
                   <div className="flex items-center gap-2 text-slate-300 font-bold text-sm group-hover:text-white group-hover:translate-x-2 transition-transform rtl:group-hover:-translate-x-2">
                      {t('onboarding.fillForm')} <ArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
                   </div>
                </div>
             </button>

          </div>

       </div>
    </div>
  );
};
