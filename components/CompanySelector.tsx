
import React, { useEffect, useState } from 'react';
import { CompanyProfile, User, BrandIdentity, ViewState } from '../types';
import { db } from '../services/dbService';
import { Plus, Building2, ArrowRight, Briefcase, Globe, X, UploadCloud, Check, Palette, Home, LogOut, Sparkles, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  user: User;
  onSelect: (company: CompanyProfile) => void;
  onCreateNew: () => void; 
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

export const CompanySelector: React.FC<Props> = ({ user, onSelect, onNavigate, onLogout }) => {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { t, isRTL } = useLanguage();
  
  // Creation Form State
  const [newCompany, setNewCompany] = useState<Partial<CompanyProfile>>({
    name: '',
    industry: '',
    description: '',
    website: '',
    goals: [],
    language: 'en',
    branding: {
      primaryColor: '#00d2ff',
      secondaryColor: '#9d50bb',
      fontPairing: 'Modern Sans',
      logoUrl: ''
    } as BrandIdentity
  });

  // Load companies on mount
  useEffect(() => {
    const userCompanies = db.getCompaniesByUserId(user.id);
    setCompanies(userCompanies);
  }, [user.id]);

  const handleSaveNewCompany = () => {
    if (!newCompany.name || !newCompany.industry) {
      alert("Please enter at least a Company Name and Industry.");
      return;
    }

    // Create full profile object
    const fullProfile: CompanyProfile = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      name: newCompany.name,
      industry: newCompany.industry,
      description: newCompany.description || '',
      website: newCompany.website || '',
      language: newCompany.language as 'en' | 'ar',
      targetAudience: 'General Audience', 
      competitors: [],
      goals: newCompany.goals || [],
      socialAccounts: [],
      branding: newCompany.branding as BrandIdentity,
      assets: [],
      designPreferences: 'Modern, Clean'
    };

    // Save to DB
    db.saveCompany(fullProfile);
    
    // Trigger Select
    onSelect(fullProfile);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
       const url = URL.createObjectURL(file);
       setNewCompany(prev => ({
          ...prev,
          branding: { ...prev.branding, logoUrl: url } as BrandIdentity
       }));
     }
  };

  return (
    <div className={`min-h-screen bg-cosmic-950 flex flex-col items-center justify-center p-6 relative overflow-hidden ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
       <div className="absolute inset-0 bg-grid-pattern opacity-20" />
       
       {/* Navigation Header */}
       <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center">
               <Sparkles size={16} className="text-white" />
             </div>
             <span className="font-bold text-white font-display text-lg">{t('common.nexusAi')}</span>
           </div>
           <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate(ViewState.LANDING)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
              >
                <Home size={16} /> {t('common.home')}
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm font-medium"
              >
                <LogOut size={16} className={isRTL ? "rotate-180" : ""} /> {t('common.logout')}
              </button>
           </div>
       </div>
       
       <div className="relative z-10 max-w-5xl w-full pt-16">
         
         {/* Title Section */}
         {!isCreating && (
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl font-bold text-white font-display mb-4">{t('companySelect.title')}</h1>
              <p className="text-slate-400">{t('companySelect.subtitle')}</p>
            </div>
         )}

         {/* Grid List */}
         {!isCreating && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                
                {/* Existing Companies */}
                {companies.map((company) => (
                  <div 
                    key={company.id}
                    onClick={() => onSelect(company)}
                    className="group glass-panel p-6 rounded-2xl border border-white/10 hover:border-primary-500/50 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden shadow-lg"
                  >
                     <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-500 to-accent-violet opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold text-xl font-display border border-white/5 group-hover:scale-110 transition-transform overflow-hidden p-1">
                           {company.branding?.logoUrl ? (
                              <img src={company.branding.logoUrl} className="w-full h-full object-contain rounded-lg" alt="logo" />
                           ) : (
                              company.name.charAt(0).toUpperCase()
                           )}
                        </div>
                        <div className="p-2 bg-white/5 rounded-full text-slate-400 group-hover:text-primary-400 transition-colors">
                           <ArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
                        </div>
                     </div>

                     <h3 className="text-xl font-bold text-white mb-2">{company.name}</h3>
                     <div className="flex flex-col gap-2 text-sm text-slate-400">
                        <div className="flex items-center gap-2"><Briefcase size={14} /> {company.industry}</div>
                        {company.website && <div className="flex items-center gap-2"><Globe size={14} /> {company.website}</div>}
                     </div>
                  </div>
                ))}

                {/* Create Manual Card */}
                <div 
                  onClick={() => setIsCreating(true)}
                  className="group border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary-500 hover:bg-primary-500/5 transition-all cursor-pointer min-h-[220px]"
                >
                   <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all mb-4">
                      <Plus size={24} />
                   </div>
                   <h3 className="text-lg font-bold text-white mb-1">{t('companySelect.createProfile')}</h3>
                   <p className="text-slate-500 text-sm">{t('companySelect.createProfileDesc')}</p>
                </div>

                {/* Cosmo AI Card */}
                <div 
                  onClick={() => onNavigate(ViewState.ONBOARDING_CHAT)}
                  className="group border-2 border-dashed border-accent-cyan/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-accent-cyan hover:bg-accent-cyan/5 transition-all cursor-pointer min-h-[220px]"
                >
                   <div className="w-14 h-14 rounded-full bg-accent-cyan/10 flex items-center justify-center text-accent-cyan group-hover:scale-110 transition-all mb-4 shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                      <MessageSquare size={24} className={isRTL ? "-scale-x-100" : ""} />
                   </div>
                   <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                     {t('companySelect.aiInterview')} <Sparkles size={14} className="text-yellow-400" />
                   </h3>
                   <p className="text-slate-500 text-sm">{t('companySelect.aiInterviewDesc')}</p>
                </div>
             </div>
         )}

         {/* Creation Modal / Form */}
         {isCreating && (
             <div className="animate-fade-in max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-white/10 relative shadow-2xl">
                <button 
                  onClick={() => setIsCreating(false)}
                  className={`absolute top-6 text-slate-400 hover:text-white bg-white/5 p-2 rounded-lg transition-colors ${isRTL ? 'left-6' : 'right-6'}`}
                >
                   <X size={20} />
                </button>

                <div className="mb-8">
                   <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <div className="p-2 bg-primary-600 rounded-lg text-white"><Building2 size={20} /></div>
                      {t('companySelect.modalTitle')}
                   </h2>
                   <p className="text-slate-400 mt-2">{t('companySelect.modalSubtitle')}</p>
                </div>

                <div className="space-y-6">
                   
                   {/* Basic Info */}
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400 uppercase">{t('companySelect.companyName')} *</label>
                         <input 
                            className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none"
                            placeholder="e.g. Acme Corp"
                            value={newCompany.name}
                            onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400 uppercase">{t('companySelect.industry')} *</label>
                         <input 
                            className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none"
                            placeholder="e.g. SaaS, Fashion"
                            value={newCompany.industry}
                            onChange={(e) => setNewCompany({...newCompany, industry: e.target.value})}
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">{t('companySelect.description')}</label>
                      <textarea 
                         className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none h-24 resize-none"
                         placeholder="What does your company do?"
                         value={newCompany.description}
                         onChange={(e) => setNewCompany({...newCompany, description: e.target.value})}
                      />
                   </div>
                   
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">{t('companySelect.website')}</label>
                      <div className="relative">
                        <Globe className={`absolute top-1/2 -translate-y-1/2 text-slate-500 ${isRTL ? 'right-3' : 'left-3'}`} size={16} />
                        <input 
                           className={`w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none ${isRTL ? 'pr-10' : 'pl-10'}`}
                           placeholder="https://"
                           value={newCompany.website}
                           onChange={(e) => setNewCompany({...newCompany, website: e.target.value})}
                        />
                      </div>
                   </div>

                   <div className="h-px bg-white/10 my-6"></div>
                   
                   {/* Branding */}
                   <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Palette size={18} className="text-accent-pink" /> {t('companySelect.brandIdentity')}
                   </h3>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400 uppercase">{t('companySelect.uploadLogo')}</label>
                         <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:bg-white/5 hover:border-primary-500/50 transition-all group">
                            {newCompany.branding?.logoUrl ? (
                               <img src={newCompany.branding.logoUrl} alt="Logo Preview" className="h-20 object-contain" />
                            ) : (
                               <>
                                  <UploadCloud className="text-slate-500 group-hover:text-primary-400 mb-2" size={24} />
                                  <span className="text-xs text-slate-500">Click to upload PNG/JPG</span>
                               </>
                            )}
                            <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                         </label>
                      </div>
                      
                      <div className="space-y-4">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">{t('companySelect.brandColors')}</label>
                            <div className="flex gap-4">
                               <div className="flex-1">
                                  <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg border border-white/10">
                                     <input 
                                        type="color" 
                                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                                        value={newCompany.branding?.primaryColor}
                                        onChange={(e) => setNewCompany({
                                           ...newCompany, 
                                           branding: { ...newCompany.branding!, primaryColor: e.target.value }
                                        })}
                                     />
                                     <span className="text-xs text-slate-300 font-mono">{t('companySelect.primary')}</span>
                                  </div>
                               </div>
                               <div className="flex-1">
                                  <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg border border-white/10">
                                     <input 
                                        type="color" 
                                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                                        value={newCompany.branding?.secondaryColor}
                                        onChange={(e) => setNewCompany({
                                           ...newCompany, 
                                           branding: { ...newCompany.branding!, secondaryColor: e.target.value }
                                        })}
                                     />
                                     <span className="text-xs text-slate-300 font-mono">{t('companySelect.secondary')}</span>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <button 
                      onClick={handleSaveNewCompany}
                      className="w-full py-4 mt-4 bg-gradient-to-r from-primary-600 to-accent-violet hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2"
                   >
                      <Check size={20} /> {t('companySelect.createAction')}
                   </button>

                </div>
             </div>
         )}

       </div>
    </div>
  );
};
