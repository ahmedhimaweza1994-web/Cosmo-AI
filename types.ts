
export enum ViewState {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  PRICING = 'PRICING',
  CHECKOUT = 'CHECKOUT',
  ONBOARDING_CHOICE = 'ONBOARDING_CHOICE', // New View
  ONBOARDING_CHAT = 'ONBOARDING_CHAT',
  ANALYSIS_PRESENTATION = 'ANALYSIS_PRESENTATION',
  COMPANY_SELECT = 'COMPANY_SELECT',
  DASHBOARD = 'DASHBOARD',
  COMPANY_INFO = 'COMPANY_INFO',
  STUDIO = 'STUDIO',
  PLANNER = 'PLANNER',
  ADS = 'ADS',
  BRANDING = 'BRANDING',
  SOCIAL_ACCOUNTS = 'SOCIAL_ACCOUNTS',
  SETTINGS = 'SETTINGS',
  ADMIN_PANEL = 'ADMIN_PANEL',
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum ImageModel {
  NANO_BANANA = 'gemini-2.5-flash-image',
  NANO_BANANA_PRO = 'gemini-3-pro-image-preview',
  IMAGEN = 'imagen-4.0-generate-001',
}

export enum VideoModel {
  VEO_FAST = 'veo-3.1-fast-generate-preview',
  VEO_HQ = 'veo-3.1-generate-preview',
}

export enum TextModel {
  GEMINI_FLASH = 'gemini-2.5-flash',
  GEMINI_PRO = 'gemini-3-pro-preview',
}

export enum ChatStep {
  LANGUAGE_SELECT = 'LANGUAGE_SELECT',
  USER_INTRO = 'USER_INTRO',
  COMPANY_INTRO = 'COMPANY_INTRO',
  WEBSITE_VERIFY = 'WEBSITE_VERIFY',
  GOALS = 'GOALS',
  BRANDING_LOGO = 'BRANDING_LOGO',
  BRANDING_STYLE = 'BRANDING_STYLE',
  BRANDING_FILES = 'BRANDING_FILES',
  DESIGN_PREFS = 'DESIGN_PREFS',
  PLANNING = 'PLANNING',
  APPROVAL = 'APPROVAL'
}

export enum PlanTier {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  AGENCY = 'AGENCY'
}

export interface PlanConfig {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  isPopular?: boolean;
  stripeId?: string;
  paypalId?: string;
}

export interface GlobalTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
}

export interface PaymentConfig {
  gateway: 'PAYPAL' | 'STRIPE';
  mode: 'SANDBOX' | 'LIVE';
  paypalClientId?: string;
  stripePublicKey?: string;
}

export interface LandingContent {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  featuresTitle: string;
  featuresSubtitle: string;
  features: { title: string; desc: string; icon: string }[];
}

export interface AppSettings {
  theme: GlobalTheme;
  payment: PaymentConfig;
  content: LandingContent;
  plans: PlanConfig[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  plan: string;
  companyId?: string; // Keeps track of last accessed company
  createdAt: Date;
}

export interface UploadedAsset {
  id: string;
  url: string;
  type: 'image' | 'video' | 'doc' | 'pdf';
  name: string;
  description?: string; // New: What is this file?
  category?: 'Logo' | 'Product' | 'Team' | 'BrandGuide' | 'Other'; // New: File Category
  uploadDate: Date;
}

export interface WebsiteAnalysis {
  url: string;
  name?: string;
  summary: string;
  detectedColors: string[];
  detectedFonts: string[];
  services: string[];
}

export interface ChatAction {
  type: 'upload_request' | 'logo_approval' | 'plan_approval' | 'option_select' | 'website_preview' | 'website_verify' | 'language_select';
  data?: any;
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  type?: 'text' | 'image_preview' | 'file_request';
  action?: ChatAction;
  imageUrl?: string;
  websiteData?: WebsiteAnalysis;
  timestamp: Date;
}

export interface SocialMetrics {
  followers: number;
  engagementRate: number;
  reach: number;
  clicks: number;
  spend: number;
  impressions: number;
  history: { date: string; reach: number; engagement: number }[];
}

export interface SocialAccount {
  platform: 'Facebook' | 'Instagram' | 'TikTok' | 'LinkedIn' | 'Twitter' | 'YouTube';
  connected: boolean;
  handle?: string;
  avatarUrl?: string;
  metrics?: SocialMetrics;
  lastSync?: Date;
  adAccountStatus?: 'ACTIVE' | 'DISABLED' | 'NOT_FOUND';
  recentPost?: {
    imageUrl: string;
    caption: string;
    date: string;
    likes: number;
  };
}

export interface BrandIdentity {
  logoUrl?: string;
  logoDarkUrl?: string;
  logoLightUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  backgroundColor?: string;
  fontPairing: string;
  fontHeading?: string;
  fontBody?: string;
  coverImageUrl?: string;
  socialBannerUrl?: string;
  businessCardFrontUrl?: string;
  businessCardBackUrl?: string;
  styleGuide?: string;
  mood?: string;
  voiceTone?: string;
  brandValues?: string[];
  voiceDos?: string[];
  voiceDonts?: string[];
  stylePreferences?: string;
  tags?: string[];
}

export interface CompanyProfile {
  id: string;
  userId: string;
  language: 'en' | 'ar';
  userName?: string;
  userInterests?: string;
  name: string;
  industry: string;
  description: string;
  website?: string;
  targetAudience: string;
  competitors: string[];
  goals: string[];
  socialAccounts: SocialAccount[];
  branding: BrandIdentity;
  designPreferences?: string;
  assets: UploadedAsset[];
}

export interface Post {
  id: string;
  date: Date;
  platform: 'Instagram' | 'LinkedIn' | 'Twitter' | 'TikTok' | 'YouTube';
  type: 'image' | 'video' | 'carousel' | 'story';
  content: string;
  assetUrl?: string;
  status: 'draft' | 'scheduled' | 'published';
  metrics?: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface AdCampaign {
  id: string;
  name: string;
  platform: 'Meta' | 'Google' | 'TikTok';
  objective: 'Awareness' | 'Conversion' | 'Clicks';
  budget: number;
  status: 'active' | 'paused' | 'draft';
  adSets: {
    targetAudience: string;
    creativeUrl: string;
    copy: string;
  }[];
  roi?: number;
}

export interface MarketingPlan {
  id: string;
  companyId: string;
  weeklyThemes: string[];
  posts: Post[];
  ads: AdCampaign[];
  strategySummary: string;
}
