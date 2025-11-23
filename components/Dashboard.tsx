
import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, MousePointerClick, DollarSign, Filter, AlertTriangle } from 'lucide-react';
import { CompanyProfile, SocialAccount } from '../types';
import { db } from '../services/dbService';
import { useLanguage } from '../contexts/LanguageContext';

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="glass-panel p-6 rounded-2xl group hover:bg-white/5 transition-colors border border-white/5">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="flex items-baseline gap-3">
      <span className="text-3xl font-bold text-white font-display">{value}</span>
      {trend !== undefined && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend >= 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [currentUser] = useState(db.getSession());
  const [company] = useState<CompanyProfile | undefined>(
    currentUser ? db.getActiveCompanyForUser(currentUser.id) : undefined
  );
  const { t, isRTL } = useLanguage();

  const accounts = company?.socialAccounts?.filter(a => a.connected && a.metrics) || [];
  const hasConnections = accounts.length > 0;

  // --- Aggregate Metrics based on Filter ---
  const aggregatedStats = useMemo(() => {
    const filteredAccounts = selectedPlatform === 'ALL' 
      ? accounts 
      : accounts.filter(a => a.platform === selectedPlatform);

    if (filteredAccounts.length === 0) {
       return null;
    }

    const totalReach = filteredAccounts.reduce((acc, curr) => acc + (curr.metrics?.reach || 0), 0);
    const totalFollowers = filteredAccounts.reduce((acc, curr) => acc + (curr.metrics?.followers || 0), 0);
    const totalClicks = filteredAccounts.reduce((acc, curr) => acc + (curr.metrics?.clicks || 0), 0);
    const totalSpend = filteredAccounts.reduce((acc, curr) => acc + (curr.metrics?.spend || 0), 0);
    const avgEngagement = filteredAccounts.reduce((acc, curr) => acc + (curr.metrics?.engagementRate || 0), 0) / filteredAccounts.length;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const chartData = days.map(day => {
       let dailyReach = 0;
       let dailyEng = 0;
       
       filteredAccounts.forEach(acc => {
          const dayData = acc.metrics?.history.find(h => h.date === day);
          if (dayData) {
            dailyReach += dayData.reach;
            dailyEng += dayData.engagement;
          }
       });

       return { name: day, reach: dailyReach, engagement: dailyEng };
    });

    return {
      reach: totalReach,
      followers: totalFollowers,
      clicks: totalClicks,
      spend: totalSpend,
      engagement: avgEngagement.toFixed(2),
      chartData
    };

  }, [accounts, selectedPlatform]);

  if (!hasConnections) {
     return (
       <div className="space-y-6 animate-fade-in">
          <div className="bg-blue-600/10 border border-blue-600/20 p-6 rounded-2xl flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-full text-white animate-pulse">
                   <AlertTriangle size={24} />
                </div>
                <div>
                   <h2 className="text-xl font-bold text-white">{t('dashboard.demoMode')}</h2>
                   <p className="text-blue-200">{t('dashboard.demoSubtitle')}</p>
                </div>
             </div>
             <button className="px-6 py-2 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                {t('dashboard.connectAccounts')}
             </button>
          </div>
          
          <div className="opacity-50 pointer-events-none filter grayscale-[0.5]">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title={t('dashboard.reachGrowth')} value="0" icon={Users} trend={0} color="text-slate-500" />
                <StatCard title={t('dashboard.avgEngagement')} value="0%" icon={TrendingUp} trend={0} color="text-slate-500" />
                <StatCard title={t('dashboard.linkClicks')} value="0" icon={MousePointerClick} trend={0} color="text-slate-500" />
                <StatCard title={t('dashboard.adSpend')} value="$0" icon={DollarSign} trend={0} color="text-slate-500" />
             </div>
          </div>
       </div>
     );
  }

  if (!aggregatedStats) return <div>{t('common.loading')}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">{t('common.dashboard')}</h1>
          <p className="text-slate-400 text-sm">
             {t('dashboard.overview')} <span className="text-white font-bold">{selectedPlatform === 'ALL' ? t('dashboard.allPlatforms') : selectedPlatform}</span>
          </p>
        </div>
        
        {/* Platform Filter */}
        <div className="relative group">
           <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-violet rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
           <div className="relative bg-slate-900 border border-white/10 rounded-xl flex items-center p-1">
              <div className="px-3 text-slate-500"><Filter size={16} /></div>
              <select 
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-transparent text-white text-sm font-medium py-2 pr-8 outline-none cursor-pointer appearance-none"
              >
                <option value="ALL">{t('dashboard.allPlatforms')}</option>
                {accounts.map(a => (
                  <option key={a.platform} value={a.platform}>{a.platform}</option>
                ))}
              </select>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t('dashboard.totalFollowers')} value={(aggregatedStats.followers / 1000).toFixed(1) + 'K'} icon={Users} trend={2.4} color="text-accent-cyan" />
        <StatCard title={t('dashboard.avgEngagement')} value={aggregatedStats.engagement + '%'} icon={TrendingUp} trend={1.2} color="text-accent-pink" />
        <StatCard title={t('dashboard.linkClicks')} value={aggregatedStats.clicks.toLocaleString()} icon={MousePointerClick} trend={-0.5} color="text-accent-violet" />
        <StatCard title={t('dashboard.adSpend')} value={`$${aggregatedStats.spend}`} icon={DollarSign} trend={5.8} color="text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-6 font-display">{t('dashboard.reachVsEng')}</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={aggregatedStats.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} reversed={isRTL} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} orientation={isRTL ? "right" : "left"} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(20, 11, 46, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f8fafc' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="reach" fill="#00d2ff" radius={[4, 4, 0, 0]} name="Reach" />
              <Bar dataKey="engagement" fill="#9d50bb" radius={[4, 4, 0, 0]} name="Engagement" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-6 font-display">{t('dashboard.reachGrowth')}</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={aggregatedStats.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} reversed={isRTL} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} orientation={isRTL ? "right" : "left"} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(20, 11, 46, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f8fafc' }}
              />
              <Line type="monotone" dataKey="reach" stroke="#ff0099" strokeWidth={3} dot={{ r: 4, fill: '#ff0099', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
