
import { User, CompanyProfile, MarketingPlan, AppSettings, Role, SocialAccount, SocialMetrics, UploadedAsset } from '../types';

const USERS_KEY = 'nexus_users';
const COMPANIES_KEY = 'nexus_companies';
const PLANS_KEY = 'nexus_plans';
const SESSION_KEY = 'nexus_session';
const SETTINGS_KEY = 'nexus_settings';

// --- Default Seeding Data ---
const DEFAULT_SETTINGS: AppSettings = {
  theme: {
    primaryColor: '#00d2ff', 
    secondaryColor: '#9d50bb', 
    backgroundColor: '#030014', 
    fontFamily: 'Outfit',
  },
  payment: {
    gateway: 'PAYPAL',
    mode: 'SANDBOX',
    paypalClientId: 'sb-sandbox-client-id',
  },
  content: {
    heroTitle: "Your AI Marketing Department",
    heroSubtitle: "Automate your entire brand strategy. From logo design to daily social posts and ad campaigns—all managed by autonomous AI agents.",
    heroButtonText: "Start Free Trial",
    featuresTitle: "The Full Stack",
    featuresSubtitle: "Replaces your entire marketing software suite.",
    features: [
      { title: "Instant Strategy", desc: "AI analyzes your market and builds a comprehensive monthly plan in seconds.", icon: "Zap" },
      { title: "Asset Generation", desc: "Create production-ready logos, images, and videos using Nano Banana & Veo.", icon: "Layers" },
      { title: "Auto-Optimization", desc: "Ads managed by AI agents that reallocate budget to top performers 24/7.", icon: "BarChart3" }
    ]
  },
  plans: [
    {
      id: 'starter',
      name: "Starter",
      price: 49,
      currency: '$',
      features: ["1 Company Profile", "Weekly AI Strategy", "100 AI Images/mo", "Standard Support"],
      isPopular: false
    },
    {
      id: 'pro',
      name: "Pro",
      price: 149,
      currency: '$',
      features: ["5 Company Profiles", "Daily Auto-Posting", "Unlimited AI Images", "Veo Video Gen", "Priority Support"],
      isPopular: true
    },
    {
      id: 'agency',
      name: "Agency",
      price: 499,
      currency: '$',
      features: ["Unlimited Companies", "Whitelabel Dashboard", "API Access", "Dedicated Account Mgr"],
      isPopular: false
    }
  ]
};

const generateSocialMetrics = (platform: string): SocialMetrics => {
  const baseFollowers = Math.floor(Math.random() * 50000) + 1000;
  const history = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  for (let i = 0; i < 7; i++) {
    history.push({
      date: days[i],
      reach: Math.floor(baseFollowers * (Math.random() * 0.3 + 0.1)),
      engagement: Math.floor(baseFollowers * (Math.random() * 0.05 + 0.01))
    });
  }

  return {
    followers: baseFollowers,
    engagementRate: parseFloat((Math.random() * 5 + 1).toFixed(2)),
    reach: history.reduce((a, b) => a + b.reach, 0),
    clicks: Math.floor(baseFollowers * 0.15),
    spend: Math.floor(Math.random() * 2000),
    impressions: Math.floor(baseFollowers * 4),
    history: history
  };
};

// --- DB Operations ---

export const db = {
  init: () => {
    const users = db.getUsers();
    if (!users.find(u => u.email === 'admin@nexus.ai')) {
      const admin: User = {
        id: 'admin-001',
        name: 'Super Admin',
        email: 'admin@nexus.ai',
        password: 'admin', 
        role: Role.ADMIN,
        plan: 'agency',
        createdAt: new Date()
      };
      users.push(admin);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    if (!localStorage.getItem(SETTINGS_KEY)) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    }
    
    const settings = db.getSettings();
    db.applyTheme(settings);
  },

  getSettings: (): AppSettings => {
    const s = localStorage.getItem(SETTINGS_KEY);
    return s ? JSON.parse(s) : DEFAULT_SETTINGS;
  },

  saveSettings: (settings: AppSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    db.applyTheme(settings); 
  },

  applyTheme: (settings: AppSettings) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', settings.theme.primaryColor);
    root.style.setProperty('--color-secondary', settings.theme.secondaryColor);
    root.style.setProperty('--color-bg', settings.theme.backgroundColor);
  },

  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  },
  
  saveUser: (user: User) => {
    const users = db.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return user;
  },

  findUserByEmail: (email: string): User | undefined => {
    const users = db.getUsers();
    return users.find(u => u.email === email);
  },

  findUserById: (id: string): User | undefined => {
    const users = db.getUsers();
    return users.find(u => u.id === id);
  },

  updateUserPlan: (userId: string, planId: string) => {
    const user = db.findUserById(userId);
    if (user) {
      user.plan = planId;
      db.saveUser(user);
      const session = db.getSession();
      if (session && session.id === userId) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      }
    }
  },

  getCompanies: (): CompanyProfile[] => {
    return JSON.parse(localStorage.getItem(COMPANIES_KEY) || '[]');
  },

  saveCompany: (company: CompanyProfile) => {
    const companies = db.getCompanies();
    const existingIndex = companies.findIndex(c => c.id === company.id);
    if (existingIndex >= 0) {
      companies[existingIndex] = company;
    } else {
      companies.push(company);
    }
    localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies));
    
    // Update user's last accessed company
    const user = db.findUserById(company.userId);
    if (user) {
      user.companyId = company.id;
      db.saveUser(user);
      // Update session if active
      const session = db.getSession();
      if (session && session.id === user.id) {
         db.setSession(user);
      }
    }
    
    return company;
  },

  // NEW: Get All companies for a specific user
  getCompaniesByUserId: (userId: string): CompanyProfile[] => {
    const companies = db.getCompanies();
    return companies.filter(c => c.userId === userId);
  },

  // Compatibility method for getting the "Active" company
  getActiveCompanyForUser: (userId: string): CompanyProfile | undefined => {
    const user = db.findUserById(userId);
    const companies = db.getCompaniesByUserId(userId);
    
    if (user?.companyId) {
      return companies.find(c => c.id === user.companyId);
    }
    return companies[0]; // Default to first if no last access
  },

  // --- Asset Management ---
  addAssetToCompany: (companyId: string, asset: UploadedAsset) => {
    const companies = db.getCompanies();
    const index = companies.findIndex(c => c.id === companyId);
    if (index >= 0) {
      if (!companies[index].assets) companies[index].assets = [];
      companies[index].assets.push(asset);
      db.saveCompany(companies[index]);
      return companies[index];
    }
    return null;
  },

  removeAssetFromCompany: (companyId: string, assetId: string) => {
    const companies = db.getCompanies();
    const index = companies.findIndex(c => c.id === companyId);
    if (index >= 0 && companies[index].assets) {
      companies[index].assets = companies[index].assets.filter(a => a.id !== assetId);
      db.saveCompany(companies[index]);
      return companies[index];
    }
    return null;
  },

  toggleSocialConnection: (companyId: string, platform: SocialAccount['platform']): CompanyProfile | null => {
    const companies = db.getCompanies();
    const company = companies.find(c => c.id === companyId);
    
    if (!company) return null;

    if (!company.socialAccounts) company.socialAccounts = [];

    const accountIndex = company.socialAccounts.findIndex(a => a.platform === platform);
    
    if (accountIndex >= 0) {
      if (company.socialAccounts[accountIndex].connected) {
        company.socialAccounts[accountIndex].connected = false;
        company.socialAccounts[accountIndex].metrics = undefined;
        company.socialAccounts[accountIndex].handle = undefined;
        company.socialAccounts[accountIndex].adAccountStatus = undefined;
        company.socialAccounts[accountIndex].recentPost = undefined;
      } else {
        company.socialAccounts[accountIndex].connected = true;
        company.socialAccounts[accountIndex].handle = `@${company.name.replace(/\s/g, '').toLowerCase()}_${platform.toLowerCase()}`;
        company.socialAccounts[accountIndex].metrics = generateSocialMetrics(platform);
        company.socialAccounts[accountIndex].lastSync = new Date();
        company.socialAccounts[accountIndex].adAccountStatus = Math.random() > 0.3 ? 'ACTIVE' : 'DISABLED';
        company.socialAccounts[accountIndex].recentPost = {
          imageUrl: `https://source.unsplash.com/random/300x300?sig=${Math.random()}`,
          caption: "Just launched our new summer collection! 🚀 #marketing #ai",
          date: new Date().toISOString(),
          likes: Math.floor(Math.random() * 500)
        };
      }
    } else {
      company.socialAccounts.push({
        platform: platform,
        connected: true,
        handle: `@${company.name.replace(/\s/g, '').toLowerCase()}_${platform.toLowerCase()}`,
        metrics: generateSocialMetrics(platform),
        lastSync: new Date(),
        adAccountStatus: 'ACTIVE',
        recentPost: {
          imageUrl: `https://source.unsplash.com/random/300x300?sig=${Math.random()}`,
          caption: "Just launched our new summer collection! 🚀 #marketing #ai",
          date: new Date().toISOString(),
          likes: Math.floor(Math.random() * 500)
        }
      });
    }

    db.saveCompany(company);
    return company;
  },

  getPlans: (): MarketingPlan[] => {
    return JSON.parse(localStorage.getItem(PLANS_KEY) || '[]');
  },

  savePlan: (plan: MarketingPlan) => {
    const plans = db.getPlans();
    const existingIndex = plans.findIndex(p => p.id === plan.id);
    if (existingIndex >= 0) {
      plans[existingIndex] = plan;
    } else {
      plans.push(plan);
    }
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
    return plan;
  },

  getPlanByCompanyId: (companyId: string): MarketingPlan | undefined => {
    const plans = db.getPlans();
    return plans.find(p => p.companyId === companyId);
  },

  setSession: (user: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  getSession: (): User | null => {
    const sess = localStorage.getItem(SESSION_KEY);
    return sess ? JSON.parse(sess) : null;
  },

  clearSession: () => {
    localStorage.removeItem(SESSION_KEY);
  }
};

db.init();
