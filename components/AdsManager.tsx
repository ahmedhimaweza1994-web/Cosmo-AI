
import React from 'react';
import { AdCampaign } from '../types';
import { BarChart3, Play, Pause, Settings, Plus } from 'lucide-react';

interface AdsManagerProps {
  campaigns: AdCampaign[];
}

export const AdsManager: React.FC<AdsManagerProps> = ({ campaigns = [] }) => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Ads Manager</h1>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Create Campaign
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['Total Spend', 'Impressions', 'Clicks', 'ROAS'].map((k, i) => (
          <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="text-slate-400 text-xs font-medium uppercase mb-1">{k}</div>
            <div className="text-2xl font-bold text-white">
               {i === 0 ? '$1,240' : i === 3 ? '3.4x' : '12.5k'}
            </div>
          </div>
        ))}
      </div>

      {/* Campaigns Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="font-semibold text-white">Active Campaigns</h3>
          <button className="text-sm text-slate-400 hover:text-white">Filter</button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-slate-400 text-xs uppercase">
            <tr>
              <th className="p-4">Status</th>
              <th className="p-4">Campaign Name</th>
              <th className="p-4">Platform</th>
              <th className="p-4">Budget</th>
              <th className="p-4">Results</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-sm">
            {/* Demo Data if empty */}
            {[1, 2, 3].map((_, i) => (
               <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                 <td className="p-4">
                   <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                     <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5"></span> Active
                   </span>
                 </td>
                 <td className="p-4 font-medium text-white">Summer Launch - Phase {i+1}</td>
                 <td className="p-4 text-slate-300">{i === 0 ? 'Meta Ads' : 'Google Ads'}</td>
                 <td className="p-4 text-slate-300">$50.00/day</td>
                 <td className="p-4 text-slate-300">{140 + i * 20} conv.</td>
                 <td className="p-4">
                   <div className="flex gap-2 text-slate-400">
                     <button className="hover:text-white"><Pause size={16} /></button>
                     <button className="hover:text-white"><Settings size={16} /></button>
                   </div>
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
