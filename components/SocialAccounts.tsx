
import React, { useState, useEffect } from 'react';
import { CompanyProfile, SocialAccount } from '../types';
import { db } from '../services/dbService';
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Loader2, CheckCircle2, ExternalLink, AlertCircle, Plus, Image, Heart, TrendingUp, Lock, RefreshCw } from 'lucide-react';

interface Props {
   company?: CompanyProfile; // Made optional to handle Admin/Demo cases
   onUpdate: (company: CompanyProfile) => void;
}

export const SocialAccounts: React.FC<Props> = ({ company, onUpdate }) => {
   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
   const [authStep, setAuthStep] = useState<'login' | 'permissions' | 'success'>('login');
   const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

   // Local state for Demo mode (when no company exists)
   const [demoAccounts, setDemoAccounts] = useState<SocialAccount[]>([]);

   // Use either real company accounts or local demo accounts
   const accounts = company?.socialAccounts || demoAccounts;
   const isDemo = !company;

   const platforms = [
      { id: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10' },
      { id: 'Facebook', icon: Facebook, color: 'text-blue-500', bg: 'bg-blue-500/10' },
      { id: 'TikTok', icon: ({ className }: any) => <span className={`font-bold ${className}`}>TikTok</span>, color: 'text-white', bg: 'bg-slate-800' },
      { id: 'LinkedIn', icon: Linkedin, color: 'text-blue-400', bg: 'bg-blue-400/10' },
      { id: 'Twitter', icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-500/10' },
      { id: 'YouTube', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10' },
   ];

   const initiateConnection = (platformId: string) => {
      setSelectedPlatform(platformId);
      setAuthStep('login');
      setIsAuthModalOpen(true);
   };

   const confirmConnection = () => {
      if (!selectedPlatform) return;
      setAuthStep('permissions');

      // Simulate network delay for Permissions check
      setTimeout(() => {
         setAuthStep('success');

         // Simulate Final Success and Data Fetch
         setTimeout(async () => {
            if (!isDemo && company) {
               const updated = await db.toggleSocialConnection(company.id, selectedPlatform as any);
               if (updated) onUpdate(updated);
            } else {
               // Demo Mode: Create a fake account locally
               const newAccount: SocialAccount = {
                  platform: selectedPlatform as any,
                  connected: true,
                  handle: `@demo_${selectedPlatform.toLowerCase()}`,
                  adAccountStatus: 'ACTIVE',
                  metrics: { followers: 12050, engagementRate: 3.2, reach: 45000, clicks: 1200, spend: 500, impressions: 60000, history: [] },
                  recentPost: {
                     imageUrl: "https://source.unsplash.com/random/300x300?marketing",
                     caption: "Demo post for visualization #nexus",
                     date: new Date().toISOString(),
                     likes: 342
                  }
               };
               setDemoAccounts(prev => [...prev.filter(p => p.platform !== selectedPlatform), newAccount]);
            }

            setIsAuthModalOpen(false);
            setSelectedPlatform(null);
         }, 1000);
      }, 1500);
   };

   const disconnect = async (platformId: string) => {
      if (!isDemo && company) {
         const updated = await db.toggleSocialConnection(company.id, platformId as any);
         if (updated) onUpdate(updated);
      } else {
         setDemoAccounts(prev => prev.filter(p => p.platform !== platformId));
      }
   };

   const isConnected = (id: string) => {
      return accounts.find(a => a.platform === id && a.connected);
   };

   return (
      <div className="space-y-8 animate-fade-in relative">

         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
               <h1 className="text-3xl font-bold text-white font-display">Social Accounts</h1>
               <p className="text-slate-400 mt-2 max-w-2xl">
                  Connect your profiles to enable Nexus AI to auto-post, read analytics, and manage ads.
                  {isDemo && <span className="text-amber-400 block mt-1 font-bold">⚠️ Demo Mode: Changes are local and will reset.</span>}
               </p>
            </div>
            <button className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm font-medium hover:bg-white/10 border border-white/5 flex items-center gap-2">
               <RefreshCw size={16} /> Refresh Data
            </button>
         </div>

         {/* Grid */}
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {platforms.map((p) => {
               const account = isConnected(p.id);
               const Icon = p.icon;

               return (
                  <div key={p.id} className={`group relative glass-panel p-0 rounded-2xl border transition-all overflow-hidden ${account ? 'border-emerald-500/30 bg-slate-900/50' : 'border-white/5 hover:border-white/10'}`}>

                     {/* Top Bar */}
                     <div className="p-6 flex justify-between items-start">
                        <div className="flex items-center gap-4">
                           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${p.bg} ${p.color}`}>
                              <Icon size={32} />
                           </div>
                           <div>
                              <h3 className="text-xl font-bold text-white">{p.id}</h3>
                              {account ? (
                                 <div className="flex items-center gap-2 mt-1">
                                    <span className="text-white font-medium text-sm bg-black/30 px-2 py-0.5 rounded">{account.handle}</span>
                                    <CheckCircle2 size={16} className="text-emerald-400" />
                                 </div>
                              ) : (
                                 <p className="text-slate-500 text-sm mt-1">Not Connected</p>
                              )}
                           </div>
                        </div>

                        <button
                           onClick={() => account ? disconnect(p.id) : initiateConnection(p.id)}
                           className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${account
                                 ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                                 : 'bg-white text-black border-white hover:bg-slate-200'
                              }`}
                        >
                           {account ? 'Disconnect' : 'Connect'}
                        </button>
                     </div>

                     {/* Expanded Data View if Connected */}
                     {account && (
                        <div className="border-t border-white/5 bg-black/20 p-6 animate-fade-in">
                           {/* Metrics Row */}
                           <div className="grid grid-cols-3 gap-4 mb-6">
                              <div className="bg-slate-800/50 p-3 rounded-xl">
                                 <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Followers</div>
                                 <div className="text-white font-bold text-lg">{account.metrics?.followers.toLocaleString()}</div>
                              </div>
                              <div className="bg-slate-800/50 p-3 rounded-xl">
                                 <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Eng. Rate</div>
                                 <div className="text-emerald-400 font-bold text-lg flex items-center gap-1">
                                    <TrendingUp size={14} /> {account.metrics?.engagementRate}%
                                 </div>
                              </div>
                              <div className="bg-slate-800/50 p-3 rounded-xl">
                                 <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Ad Status</div>
                                 <div className={`font-bold text-lg text-xs px-2 py-1 rounded w-fit ${account.adAccountStatus === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {account.adAccountStatus || 'UNKNOWN'}
                                 </div>
                              </div>
                           </div>

                           {/* Recent Post Preview */}
                           {account.recentPost && (
                              <div className="flex gap-4 items-center bg-slate-800/30 p-3 rounded-xl border border-white/5">
                                 <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700 shrink-0">
                                    {/* Placeholder image logic */}
                                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
                                       <Image size={20} className="text-slate-400" />
                                    </div>
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <div className="text-xs text-slate-400 mb-1">Latest Post • {new Date(account.recentPost.date).toLocaleDateString()}</div>
                                    <p className="text-slate-200 text-sm truncate">{account.recentPost.caption}</p>
                                    <div className="flex items-center gap-1 text-pink-400 text-xs mt-1 font-medium">
                                       <Heart size={12} fill="currentColor" /> {account.recentPost.likes} Likes
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>
                     )}

                     {/* Empty State Info */}
                     {!account && (
                        <div className="px-6 pb-6">
                           <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/5 p-3 rounded-lg">
                              <Lock size={12} />
                              <span>Nexus AI needs permission to read analytics and publish posts.</span>
                           </div>
                        </div>
                     )}

                  </div>
               );
            })}
         </div>

         {/* --- AUTH SIMULATION MODAL --- */}
         {isAuthModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
               <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">

                  {/* Fake Browser Header */}
                  <div className="bg-slate-100 border-b border-slate-200 p-3 flex items-center gap-2">
                     <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                     </div>
                     <div className="flex-1 text-center text-xs font-medium text-slate-500 bg-white py-1 rounded border border-slate-200 mx-4 flex items-center justify-center gap-1">
                        <Lock size={10} /> api.{selectedPlatform?.toLowerCase()}.com/oauth/authorize
                     </div>
                  </div>

                  <div className="p-8 text-center min-h-[300px] flex flex-col items-center justify-center">

                     {authStep === 'login' && (
                        <div className="animate-fade-in w-full">
                           <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto mb-4 flex items-center justify-center text-slate-600">
                              {/* Quick Icon Hack */}
                              <span className="font-bold text-2xl">{selectedPlatform?.[0]}</span>
                           </div>
                           <h3 className="text-xl font-bold mb-2">Log in to {selectedPlatform}</h3>
                           <p className="text-slate-500 text-sm mb-6">Allow Nexus AI to access your account?</p>

                           <input type="text" value="user@company.com" disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 mb-3 text-sm" />
                           <input type="password" value="••••••••" disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 mb-6 text-sm" />

                           <button onClick={confirmConnection} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                              Log In & Authorize
                           </button>
                        </div>
                     )}

                     {authStep === 'permissions' && (
                        <div className="animate-fade-in">
                           <Loader2 size={40} className="text-blue-600 animate-spin mx-auto mb-4" />
                           <h3 className="text-lg font-bold mb-2">Verifying Permissions...</h3>
                           <ul className="text-left text-sm text-slate-600 space-y-2 bg-slate-50 p-4 rounded-lg mb-4">
                              <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-500" /> Read User Profile</li>
                              <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-500" /> Manage Ads</li>
                              <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-500" /> Read Posts & Analytics</li>
                           </ul>
                        </div>
                     )}

                     {authStep === 'success' && (
                        <div className="animate-bounce-slight">
                           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                              <CheckCircle2 size={32} />
                           </div>
                           <h3 className="text-xl font-bold text-slate-900">Connected!</h3>
                           <p className="text-slate-500">Redirecting back to Nexus AI...</p>
                        </div>
                     )}

                  </div>

                  {/* Close Button for Demo cancellation */}
                  <button
                     onClick={() => setIsAuthModalOpen(false)}
                     className="absolute top-14 right-4 text-slate-400 hover:text-slate-600"
                  >
                     ✕
                  </button>

               </div>
            </div>
         )}

      </div>
   );
};
