
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { Sparkles, Mail, Lock, User, ArrowRight, AlertCircle, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthProps {
  mode: 'login' | 'register';
  onSuccess: () => void;
  onToggleMode: () => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ mode, onSuccess, onToggleMode, onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t, isRTL } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await authService.login(email, password);
      } else {
        if (!name) throw new Error("Name is required");
        await authService.register(name, email, password);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for Demo
  const fillAdmin = () => {
    setEmail('admin@nexus.ai');
    setPassword('admin');
  };

  return (
    <div className={`min-h-screen bg-cosmic-950 flex items-center justify-center p-6 relative overflow-hidden ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background Ambient */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-violet/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-cyan/10 rounded-full blur-[128px]" />

      {/* Back Button */}
      <div className={`absolute top-6 z-20 ${isRTL ? 'right-6' : 'left-6'}`}>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5 backdrop-blur-md"
        >
          <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
          <span className="text-sm font-medium">{t('auth.backToHome')}</span>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
             <div className="w-10 h-10 bg-gradient-to-br from-accent-cyan to-accent-violet rounded-xl flex items-center justify-center shadow-lg shadow-accent-cyan/20">
                <Sparkles size={20} className="text-white" />
             </div>
             <span className="text-2xl font-bold text-white font-display tracking-tight">{t('common.nexusAi')}</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {mode === 'login' ? t('auth.welcomeBack') : t('auth.createAccount')}
          </h2>
          <p className="text-slate-400">
            {mode === 'login' ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('auth.fullName')}</label>
                <div className="relative">
                  <User className={`absolute top-1/2 -translate-y-1/2 text-slate-500 ${isRTL ? 'right-4' : 'left-4'}`} size={20} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-black/20 border border-white/10 rounded-xl py-3 text-white focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan outline-none transition-all ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('auth.email')}</label>
              <div className="relative">
                <Mail className={`absolute top-1/2 -translate-y-1/2 text-slate-500 ${isRTL ? 'right-4' : 'left-4'}`} size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-black/20 border border-white/10 rounded-xl py-3 text-white focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan outline-none transition-all ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('auth.password')}</label>
              <div className="relative">
                <Lock className={`absolute top-1/2 -translate-y-1/2 text-slate-500 ${isRTL ? 'right-4' : 'left-4'}`} size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-black/20 border border-white/10 rounded-xl py-3 text-white focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan outline-none transition-all ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-accent-cyan to-accent-violet hover:opacity-90 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <span className="animate-pulse">{t('common.processing')}</span>
              ) : (
                <>
                  {mode === 'login' ? t('auth.signIn') : t('auth.createAccount')} 
                  <ArrowRight size={20} className={isRTL ? "rotate-180" : ""} />
                </>
              )}
            </button>
          </form>

          {mode === 'login' && (
             <button 
               onClick={fillAdmin}
               className="mt-4 w-full py-2 border border-white/5 hover:bg-white/5 rounded-lg text-xs text-slate-500 hover:text-slate-300 flex items-center justify-center gap-2 transition-colors"
             >
               <ShieldAlert size={12} /> {t('auth.adminDemo')}
             </button>
          )}

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}
              <button 
                onClick={onToggleMode}
                className="text-accent-cyan hover:text-white font-medium transition-colors mx-1"
              >
                {mode === 'login' ? t('auth.signUp') : t('auth.signIn')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
