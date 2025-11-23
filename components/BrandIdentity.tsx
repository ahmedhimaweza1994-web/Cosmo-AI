
import React from 'react';
import { BrandIdentity as BrandIdentityType } from '../types';
import { Download, RefreshCw, Type } from 'lucide-react';

interface Props {
  brand: BrandIdentityType;
}

export const BrandIdentity: React.FC<Props> = ({ brand }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Brand Identity</h1>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 flex items-center gap-2">
             <RefreshCw size={16} /> Regenerate
           </button>
           <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium flex items-center gap-2">
             <Download size={16} /> Export Guide
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logo Section */}
        <div className="lg:col-span-1 bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Primary Logo</h3>
          <div className="aspect-square bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center p-8 mb-4">
             {brand.logoUrl ? (
               <img src={brand.logoUrl} alt="Brand Logo" className="max-w-full max-h-full object-contain" />
             ) : (
               <div className="text-slate-600 text-center">No Logo Generated</div>
             )}
          </div>
          <p className="text-sm text-slate-400">
            Generated using Nano Banana. Vector files available in export.
          </p>
        </div>

        {/* Colors & Typography */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
             <h3 className="text-lg font-semibold text-white mb-4">Color Palette</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[brand.primaryColor, brand.secondaryColor, '#f8fafc', '#0f172a'].map((c, i) => (
                 <div key={i} className="space-y-2">
                   <div className="h-20 rounded-lg shadow-lg border border-slate-600/20" style={{ backgroundColor: c }}></div>
                   <div className="flex justify-between text-xs text-slate-400">
                     <span>{i === 0 ? 'Primary' : i === 1 ? 'Secondary' : 'Neutral'}</span>
                     <span className="uppercase">{c}</span>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
             <h3 className="text-lg font-semibold text-white mb-4">Typography</h3>
             <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-lg border border-slate-800">
               <div className="p-3 bg-slate-800 rounded-lg text-slate-400"><Type size={24} /></div>
               <div>
                 <div className="text-white font-bold text-xl">{brand.fontPairing}</div>
                 <div className="text-slate-500 text-sm">Modern sans-serif pairing for high readability.</div>
               </div>
             </div>
           </div>
           
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
             <h3 className="text-lg font-semibold text-white mb-4">Voice & Tone</h3>
             <p className="text-slate-300 leading-relaxed">
               The brand voice is professional, authoritative, yet approachable. Content should focus on clarity and value, avoiding jargon where possible.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};
