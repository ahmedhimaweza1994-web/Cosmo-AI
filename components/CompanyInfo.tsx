
import React, { useState } from 'react';
import { CompanyProfile, UploadedAsset } from '../types';
import { db } from '../services/dbService';
import { Save, UploadCloud, FileText, Image as ImageIcon, Video, Trash2, Tag, Globe, Target, Building2, File } from 'lucide-react';

interface Props {
   company: CompanyProfile;
   onUpdate: (updated: CompanyProfile) => void;
}

export const CompanyInfo: React.FC<Props> = ({ company, onUpdate }) => {
   const [formData, setFormData] = useState<CompanyProfile>(company);
   const [isDirty, setIsDirty] = useState(false);

   // Asset Form State
   const [newAsset, setNewAsset] = useState<{
      name: string;
      description: string;
      category: UploadedAsset['category'];
      type: UploadedAsset['type'];
   }>({ name: '', description: '', category: 'Other', type: 'doc' });

   const handleChange = (field: keyof CompanyProfile, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      setIsDirty(true);
   };

   const handleSave = async () => {
      await db.saveCompany(formData);
      onUpdate(formData);
      setIsDirty(false);
      alert('Company details saved successfully!');
   };

   // Simulate File Upload
   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const asset: UploadedAsset = {
         id: Date.now().toString(),
         name: newAsset.name || file.name,
         description: newAsset.description,
         category: newAsset.category,
         type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'doc',
         url: URL.createObjectURL(file), // Demo simulation
         uploadDate: new Date()
      };

      const updatedCompany = await db.addAssetToCompany(formData.id, asset);
      if (updatedCompany) {
         setFormData(updatedCompany);
         onUpdate(updatedCompany);
         // Reset form
         setNewAsset({ name: '', description: '', category: 'Other', type: 'doc' });
      }
   };

   const deleteAsset = async (assetId: string) => {
      if (confirm("Are you sure you want to delete this file?")) {
         const updatedCompany = await db.removeAssetFromCompany(formData.id, assetId);
         if (updatedCompany) {
            setFormData(updatedCompany);
            onUpdate(updatedCompany);
         }
      }
   };

   return (
      <div className="space-y-8 animate-fade-in pb-10">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-3xl font-bold text-white font-display">Company Info</h1>
               <p className="text-slate-400">Manage your brand profile, strategy details, and digital assets.</p>
            </div>
            <button
               onClick={handleSave}
               disabled={!isDirty}
               className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-500 transition-all"
            >
               <Save size={18} /> Save Changes
            </button>
         </div>

         {/* Main Details Grid */}
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

            {/* Left Column: Basic Info */}
            <div className="xl:col-span-2 space-y-6">
               <div className="glass-panel p-8 rounded-2xl border border-white/10">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                     <Building2 className="text-primary-500" /> General Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Company Name</label>
                        <input
                           className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none"
                           value={formData.name}
                           onChange={(e) => handleChange('name', e.target.value)}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Industry</label>
                        <input
                           className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none"
                           value={formData.industry}
                           onChange={(e) => handleChange('industry', e.target.value)}
                        />
                     </div>
                     <div className="col-span-2 space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                        <textarea
                           className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none h-24"
                           value={formData.description}
                           onChange={(e) => handleChange('description', e.target.value)}
                        />
                     </div>
                     <div className="col-span-2 space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Website</label>
                        <div className="relative">
                           <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                           <input
                              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-primary-500 outline-none"
                              value={formData.website || ''}
                              onChange={(e) => handleChange('website', e.target.value)}
                           />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="glass-panel p-8 rounded-2xl border border-white/10">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                     <Target className="text-accent-pink" /> Strategic Profile
                  </h2>
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Marketing Goals (Comma Separated)</label>
                        <input
                           className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none"
                           value={formData.goals.join(', ')}
                           onChange={(e) => handleChange('goals', e.target.value.split(',').map(s => s.trim()))}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Target Audience</label>
                        <textarea
                           className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none h-24"
                           value={formData.targetAudience}
                           onChange={(e) => handleChange('targetAudience', e.target.value)}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Design Preferences</label>
                        <input
                           className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none"
                           value={formData.designPreferences || ''}
                           onChange={(e) => handleChange('designPreferences', e.target.value)}
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Column: Asset Manager */}
            <div className="xl:col-span-1 space-y-6">
               <div className="glass-panel-strong p-6 rounded-2xl border border-white/10 sticky top-6">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <UploadCloud className="text-accent-cyan" /> Asset Manager
                  </h2>

                  {/* Upload Form */}
                  <div className="bg-white/5 p-4 rounded-xl mb-6 border border-white/5">
                     <div className="space-y-3 mb-4">
                        <input
                           placeholder="File Name"
                           className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white"
                           value={newAsset.name}
                           onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                        />
                        <input
                           placeholder="Description (e.g., Main Logo Light)"
                           className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white"
                           value={newAsset.description}
                           onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                        />
                        <select
                           className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white"
                           value={newAsset.category}
                           onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value as any })}
                        >
                           <option value="Other">Select Category</option>
                           <option value="Logo">Logo</option>
                           <option value="Product">Product Image</option>
                           <option value="Team">Team Photo</option>
                           <option value="BrandGuide">Brand Guide</option>
                        </select>
                     </div>
                     <label className="flex items-center justify-center w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg cursor-pointer transition-colors text-sm font-medium gap-2 border border-dashed border-white/20">
                        <UploadCloud size={16} /> Upload File
                        <input type="file" className="hidden" onChange={handleFileUpload} />
                     </label>
                  </div>

                  {/* File List */}
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                     <h3 className="text-xs font-bold text-slate-500 uppercase">Library ({formData.assets?.length || 0})</h3>
                     {formData.assets?.map((asset) => (
                        <div key={asset.id} className="bg-slate-900 p-3 rounded-lg border border-white/5 group hover:border-primary-500/30 transition-colors">
                           <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                                    {asset.type === 'image' ? <ImageIcon size={18} /> : asset.type === 'video' ? <Video size={18} /> : <FileText size={18} />}
                                 </div>
                                 <div>
                                    <div className="text-sm font-bold text-white truncate max-w-[140px]">{asset.name}</div>
                                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                       <Tag size={10} /> {asset.category}
                                    </div>
                                 </div>
                              </div>
                              <button onClick={() => deleteAsset(asset.id)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Trash2 size={14} />
                              </button>
                           </div>
                           {asset.description && (
                              <p className="text-xs text-slate-400 bg-white/5 p-2 rounded">{asset.description}</p>
                           )}
                        </div>
                     ))}
                     {(!formData.assets || formData.assets.length === 0) && (
                        <div className="text-center py-6 text-slate-500 text-sm italic">
                           No assets uploaded yet.
                        </div>
                     )}
                  </div>

               </div>
            </div>
         </div>
      </div>
   );
};
