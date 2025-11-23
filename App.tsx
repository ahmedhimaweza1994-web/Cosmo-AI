
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Landing } from './components/Landing';
import { Auth } from './components/Auth';
import { Pricing } from './components/Pricing';
import { Checkout } from './components/Checkout';
import { OnboardingChat } from './components/OnboardingChat';
import { OnboardingChoice } from './components/OnboardingChoice';
import { AnalysisPresentation } from './components/AnalysisPresentation';
import { Dashboard } from './components/Dashboard';
import { ContentStudio } from './components/ContentStudio';
import { Scheduler } from './components/Scheduler';
import { AdsManager } from './components/AdsManager';
import { BrandIdentity } from './components/BrandIdentity';
import { AdminPanel } from './components/AdminPanel';
import { SocialAccounts } from './components/SocialAccounts';
import { CompanySelector } from './components/CompanySelector';
import { CompanyInfo } from './components/CompanyInfo';
import { ViewState, CompanyProfile, MarketingPlan, User, Role } from './types';
import { Sparkles } from 'lucide-react';
import { authService } from './services/authService';
import { db } from './services/dbService';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// Global Transition Component
const TransitionOverlay = ({ isActive }: { isActive: boolean }) => {
  const { t } = useLanguage();
  if (!isActive) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-cosmic-950 flex flex-col items-center justify-center animate-fade-in">
      <div className="relative w-32 h-32 mb-8">
         <div className="absolute inset-0 border-4 border-accent-violet/20 rounded-full"></div>
         <div className="absolute inset-0 border-t-4 border-primary-500 rounded-full animate-spin"></div>
         <div className="absolute inset-4 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(157,80,187,0.3)]">
            <Sparkles className="text-white animate-pulse" size={40} />
         </div>
      </div>
      <h2 className="text-2xl font-display font-bold text-white mb-2">{t('common.processing')}</h2>
      <p className="text-slate-400 animate-pulse">Nexus AI is syncing</p>
    </div>
  );
};

const AppContent = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [plan, setPlan] = useState<MarketingPlan | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Initialize User Session & Theme
  useEffect(() => {
    // 1. Load Theme
    const settings = db.getSettings();
    db.applyTheme(settings);

    // 2. Check Session
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      if (user.role === Role.USER) {
         // Try to get last active company
         const activeCompany = db.getActiveCompanyForUser(user.id);
         if (activeCompany) {
            setCompany(activeCompany);
            const userPlan = db.getPlanByCompanyId(activeCompany.id);
            if (userPlan) setPlan(userPlan);
         } else {
            // No active company? Ensure we don't land on dashboard
            setCompany(null);
         }
      }
    }
  }, []);

  // Transition Helper
  const transitionTo = (newView: ViewState) => {
    if (view === newView) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setView(newView);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }, 1000);
  };

  // --- AUTH HANDLERS ---
  
  const handleAuthSuccess = () => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      
      if (user.role === Role.ADMIN) {
        transitionTo(ViewState.ADMIN_PANEL);
        return;
      }

      // Determine where to go based on company existence
      const userCompanies = db.getCompaniesByUserId(user.id);
      if (userCompanies.length > 0) {
         // If they have a last accessed company, go there, otherwise select
         const active = db.getActiveCompanyForUser(user.id);
         if (active) {
             setCompany(active);
             transitionTo(ViewState.DASHBOARD);
         } else {
             transitionTo(ViewState.COMPANY_SELECT);
         }
      } else {
         // No companies -> Redirect to Onboarding Choice for new users
         transitionTo(ViewState.ONBOARDING_CHOICE);
      }
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setCompany(null);
    setPlan(null);
    transitionTo(ViewState.LANDING);
  };

  // --- FLOW HANDLERS ---

  const handleCompanySelect = (selected: CompanyProfile) => {
     setCompany(selected);
     // Update active company in DB for session persistence
     const updatedUser = { ...currentUser!, companyId: selected.id };
     db.saveUser(updatedUser); 
     setCurrentUser(updatedUser); // Update local user state

     const p = db.getPlanByCompanyId(selected.id);
     setPlan(p || null);
     transitionTo(ViewState.DASHBOARD);
  };

  // Note: This is now handled internally by CompanySelector, but kept for compatibility
  const handleCreateNewCompany = () => {
     setCompany(null); // Clear current context
     transitionTo(ViewState.ONBOARDING_CHAT);
  };

  const handleOnboardingComplete = (profileData: Partial<CompanyProfile>) => {
    if (!currentUser) return;

    // Save to "DB"
    const newCompany: CompanyProfile = {
      ...profileData as CompanyProfile,
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      assets: [] // Initialize empty assets
    };
    
    db.saveCompany(newCompany);
    setCompany(newCompany);
    
    // Update active company pointer
    const updatedUser = { ...currentUser, companyId: newCompany.id };
    db.saveUser(updatedUser);
    setCurrentUser(updatedUser);

    transitionTo(ViewState.ANALYSIS_PRESENTATION);
  };

  const handleAnalysisComplete = (generatedPlan: MarketingPlan) => {
    if (!company) return;
    
    const finalPlan: MarketingPlan = {
      ...generatedPlan,
      id: Math.random().toString(36).substr(2, 9),
      companyId: company.id
    };

    db.savePlan(finalPlan);
    setPlan(finalPlan);
    transitionTo(ViewState.DASHBOARD);
  };

  const handlePlanSelection = (planId: string) => {
    setSelectedPlanId(planId);
    transitionTo(ViewState.CHECKOUT);
  };

  const handlePaymentSuccess = () => {
    if (currentUser && selectedPlanId) {
      db.updateUserPlan(currentUser.id, selectedPlanId);
      setCurrentUser({ ...currentUser, plan: selectedPlanId });
      transitionTo(ViewState.DASHBOARD);
    }
  };
  
  const handleCompanyUpdate = (updatedCompany: CompanyProfile) => {
    setCompany(updatedCompany);
  };

  // Wrap in Layout only for app views
  const isAppView = [
    ViewState.DASHBOARD, 
    ViewState.STUDIO, 
    ViewState.PLANNER, 
    ViewState.ADS, 
    ViewState.BRANDING, 
    ViewState.SOCIAL_ACCOUNTS, 
    ViewState.COMPANY_INFO,
    ViewState.SETTINGS
  ].includes(view);

  // --- ROUTE GUARD ---
  // If we are in an App View, but NO company is selected, force the Company Selector
  // unless we are specifically in the process of creating/selecting one.
  if (isAppView && !company && currentUser && currentUser.role !== Role.ADMIN) {
      return (
        <CompanySelector 
            user={currentUser} 
            onSelect={handleCompanySelect} 
            onCreateNew={handleCreateNewCompany}
            onNavigate={transitionTo}
            onLogout={handleLogout}
        />
      );
  }

  // View Router
  const renderContent = () => {
    switch (view) {
      case ViewState.ADMIN_PANEL:
        return currentUser?.role === Role.ADMIN 
          ? <AdminPanel onNavigate={transitionTo} onLogout={handleLogout} /> 
          : <Dashboard />;

      case ViewState.LANDING:
        return <Landing 
          onGetStarted={() => transitionTo(ViewState.REGISTER)} 
          onLogin={() => transitionTo(ViewState.LOGIN)} 
          currentUser={currentUser}
          onNavigate={transitionTo}
          onLogout={handleLogout}
        />;
      
      case ViewState.LOGIN:
        return <Auth mode="login" onSuccess={handleAuthSuccess} onToggleMode={() => transitionTo(ViewState.REGISTER)} onBack={() => transitionTo(ViewState.LANDING)} />;

      case ViewState.REGISTER:
        return <Auth mode="register" onSuccess={handleAuthSuccess} onToggleMode={() => transitionTo(ViewState.LOGIN)} onBack={() => transitionTo(ViewState.LANDING)} />;
      
      case ViewState.ONBOARDING_CHOICE:
        return <OnboardingChoice 
          onManual={() => transitionTo(ViewState.COMPANY_SELECT)}
          onChat={() => transitionTo(ViewState.ONBOARDING_CHAT)}
          onLogout={handleLogout}
        />;

      case ViewState.COMPANY_SELECT:
        return currentUser ? (
          <CompanySelector 
            user={currentUser} 
            onSelect={handleCompanySelect} 
            onCreateNew={handleCreateNewCompany} 
            onNavigate={transitionTo}
            onLogout={handleLogout}
          />
        ) : null;

      case ViewState.ONBOARDING_CHAT:
        return currentUser 
          ? <OnboardingChat onComplete={handleOnboardingComplete} onNavigate={transitionTo} /> 
          : <Auth mode="login" onSuccess={handleAuthSuccess} onToggleMode={() => transitionTo(ViewState.REGISTER)} onBack={() => transitionTo(ViewState.LANDING)} />;

      case ViewState.ANALYSIS_PRESENTATION:
        return company ? <AnalysisPresentation company={company} onComplete={handleAnalysisComplete} /> : null;

      case ViewState.PRICING:
        return <Pricing onSelectPlan={handlePlanSelection} onBack={() => transitionTo(ViewState.LANDING)} />;

      case ViewState.CHECKOUT:
        return selectedPlanId ? <Checkout planId={selectedPlanId} onSuccess={handlePaymentSuccess} onCancel={() => transitionTo(ViewState.PRICING)} /> : null;

      // Main App Views (wrapped in Layout)
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.STUDIO:
        return <ContentStudio />;
      case ViewState.PLANNER:
        return <Scheduler posts={plan?.posts || []} />;
      case ViewState.ADS:
        return <AdsManager campaigns={plan?.ads || []} />;
      case ViewState.BRANDING:
        return company ? <BrandIdentity brand={company.branding} /> : null;
      case ViewState.SOCIAL_ACCOUNTS:
        return <SocialAccounts company={company || undefined} onUpdate={handleCompanyUpdate} />;
      case ViewState.COMPANY_INFO:
        return company ? <CompanyInfo company={company} onUpdate={handleCompanyUpdate} /> : null;
      case ViewState.SETTINGS:
        return (
          <div className="glass-panel p-8 rounded-2xl animate-fade-in">
             <h2 className="text-2xl text-white mb-4">Account Settings</h2>
             <div className="mb-4">
               <label className="text-slate-400">Current Plan</label>
               <div className="text-xl text-primary-500 font-bold uppercase">{currentUser?.plan}</div>
             </div>
             <button onClick={() => transitionTo(ViewState.PRICING)} className="px-4 py-2 bg-white/10 text-white rounded-lg mr-4">Upgrade Plan</button>
          </div>
        );
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <TransitionOverlay isActive={isTransitioning} />
      {isAppView && company ? (
        <Layout 
          currentView={view} 
          setView={transitionTo} 
          onLogout={handleLogout} 
          companyName={company.name} 
        >
          {renderContent()}
        </Layout>
      ) : (
        renderContent()
      )}
    </>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
