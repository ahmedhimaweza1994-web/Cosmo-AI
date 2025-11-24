
import React from 'react';
import { BrandIdentity as BrandIdentityType, CompanyProfile } from '../types';
import { Download, RefreshCw, Type, Sparkles, Save } from 'lucide-react';
import { db } from '../services/dbService';

interface Props {
  brand: BrandIdentityType;
  company: CompanyProfile;
  onUpdate: (company: CompanyProfile) => void;
}

export const BrandIdentity: React.FC<Props> = ({ brand, company, onUpdate }) => {
  const [localBrand, setLocalBrand] = React.useState<BrandIdentityType>(brand);
  const [isGenerating, setIsGenerating] = React.useState<Record<string, boolean>>({});
  const [selectedModel, setSelectedModel] = React.useState<string>('gemini-2.5-flash');
  const [editMode, setEditMode] = React.useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = React.useState(false);

  // Sync props to local state
  React.useEffect(() => {
    setLocalBrand(brand);
  }, [brand]);

  const toggleEdit = (section: string) => {
    setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleGenerate = async (section: 'logo' | 'colors' | 'typography' | 'voice' | 'assets') => {
    setIsGenerating(prev => ({ ...prev, [section]: true }));
    try {
      // Mock context - in real app, pass full company profile
      const context: any = {
        name: 'My Company',
        industry: 'Tech',
        description: 'A cool tech company',
        branding: localBrand,
        language: 'en'
      };

      if (section === 'logo') {
        // For logo we need a specific style prompt, using default for now
        // In real implementation, we'd ask user or use existing style
        // const url = await generateBrandLogo(context, "Modern Minimalist", ImageModel.NANO_BANANA);
        // setLocalBrand(prev => ({ ...prev, logoUrl: url }));
        // Placeholder as we need to import generateBrandLogo and it needs full context
        console.log("Logo generation requires full context integration");
      } else {
        // const result = await generateBrandAsset(section, context, selectedModel);
        // Merge result into localBrand
        // setLocalBrand(prev => ({ ...prev, ...result }));
        console.log(`Generating ${section}...`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(prev => ({ ...prev, [section]: false }));
    }
  };

  const handleRegenerateAll = async () => {
    // Trigger all
    await Promise.all([
      handleGenerate('colors'),
      handleGenerate('typography'),
      handleGenerate('voice')
    ]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedCompany = { ...company, branding: localBrand };
      await db.saveCompany(updatedCompany);
      onUpdate(updatedCompany);
      alert('Brand identity saved successfully!');
    } catch (error) {
      console.error('Failed to save brand identity:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Brand Identity</h1>
          <p className="text-slate-400 mt-1">Manage your visual assets and brand voice.</p>
        </div>
        <div className="flex gap-2 items-center">
          {/* Model Selector */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-slate-800 text-slate-300 text-sm rounded-lg border border-slate-700 px-3 py-2 outline-none focus:border-primary-500"
          >
            <option value="gemini-2.5-flash">Gemini Flash (Fast)</option>
            <option value="gemini-3-pro-preview">Gemini Pro (Quality)</option>
          </select>

          <button
            onClick={handleRegenerateAll}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={16} /> Regenerate All
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary-500 transition-colors shadow-lg shadow-primary-600/20">
            <Download size={16} /> Export Brand Kit
          </button>
        </div>
      </div>

      {/* --- STYLE PREFERENCES --- */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-500 rounded-full"></span> Style Preferences
          </h2>
          <button onClick={() => toggleEdit('stylePreferences')} className="text-xs text-slate-400 hover:text-white transition-colors">
            {editMode['stylePreferences'] ? 'Done' : 'Edit'}
          </button>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          {editMode['stylePreferences'] ? (
            <textarea
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-slate-300 text-sm focus:border-primary-500 outline-none h-32 resize-none"
              value={localBrand.stylePreferences || ''}
              onChange={(e) => setLocalBrand({ ...localBrand, stylePreferences: e.target.value })}
              placeholder="Describe your design preferences (e.g., Modern, minimalist, vibrant colors, clean layouts...)"
            />
          ) : (
            <p className="text-slate-300 text-sm leading-relaxed">
              {localBrand.stylePreferences || "No style preferences set yet. Click Edit to add your design preferences."}
            </p>
          )}
        </div>
      </section>

      {/* --- TAGS --- */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-500 rounded-full"></span> Brand Tags
          </h2>
          <button onClick={() => toggleEdit('tags')} className="text-xs text-slate-400 hover:text-white transition-colors">
            {editMode['tags'] ? 'Done' : 'Edit'}
          </button>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          {editMode['tags'] ? (
            <input
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary-500 outline-none"
              value={(localBrand.tags || []).join(', ')}
              onChange={(e) => setLocalBrand({ ...localBrand, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              placeholder="Enter tags separated by commas (e.g., Modern, Eco-friendly, Innovative)"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {(localBrand.tags || []).length > 0 ? (
                (localBrand.tags || []).map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 text-sm">No tags added yet. Click Edit to add tags.</span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* --- LOGO SUITE --- */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-accent-cyan rounded-full"></span> Logo Suite
          </h2>
          <div className="flex gap-2">
            <button onClick={() => handleGenerate('logo')} className="text-xs bg-accent-cyan/10 text-accent-cyan px-3 py-1 rounded-full hover:bg-accent-cyan/20 transition-colors flex items-center gap-1">
              <Sparkles size={12} /> Generate
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Primary Logo', url: localBrand.logoUrl, desc: 'Main usage' },
            { label: 'Dark Mode', url: localBrand.logoDarkUrl, desc: 'For light backgrounds' },
            { label: 'Light Mode', url: localBrand.logoLightUrl, desc: 'For dark backgrounds' },
            { label: 'Favicon', url: localBrand.faviconUrl, desc: 'Browser tab icon' }
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-primary-500/50 transition-colors group">
              <div className="aspect-square bg-grid-pattern rounded-lg border border-slate-700/50 flex items-center justify-center p-4 mb-3 relative overflow-hidden">
                {item.url ? (
                  <img src={item.url} alt={item.label} className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="text-slate-600 text-xs text-center">Not Uploaded</div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="text-xs bg-white text-black px-3 py-1 rounded-full font-bold">Edit</button>
                </div>
              </div>
              <h3 className="font-bold text-white text-sm">{item.label}</h3>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- COLORS --- */}
        <section className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-accent-violet rounded-full"></span> Color Palette
            </h2>
            <div className="flex gap-2">
              <button onClick={() => toggleEdit('colors')} className="text-xs text-slate-400 hover:text-white transition-colors">
                {editMode['colors'] ? 'Done' : 'Edit'}
              </button>
              <button onClick={() => handleGenerate('colors')} className="text-xs bg-accent-violet/10 text-accent-violet px-3 py-1 rounded-full hover:bg-accent-violet/20 transition-colors flex items-center gap-1">
                <Sparkles size={12} /> Generate
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Primary', key: 'primaryColor', hex: localBrand.primaryColor },
                { label: 'Secondary', key: 'secondaryColor', hex: localBrand.secondaryColor },
                { label: 'Accent', key: 'accentColor', hex: localBrand.accentColor || '#00d2ff' },
                { label: 'Background', key: 'backgroundColor', hex: localBrand.backgroundColor || '#0f172a' },
                { label: 'Neutral', key: 'neutral', hex: '#94a3b8' } // Neutral usually fixed or derived
              ].map((c, i) => (
                <div key={i} className="space-y-2 group">
                  <div className="h-24 rounded-xl shadow-lg border border-white/5 relative overflow-hidden transition-transform group-hover:scale-105" style={{ backgroundColor: c.hex }}>
                    {editMode['colors'] && c.key !== 'neutral' && (
                      <input
                        type="color"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        value={c.hex}
                        onChange={(e) => setLocalBrand({ ...localBrand, [c.key]: e.target.value })}
                      />
                    )}
                    {!editMode['colors'] && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                        <span className="text-white font-mono text-xs bg-black/50 px-2 py-1 rounded">Copy</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-200">{c.label}</div>
                    <div className="text-xs text-slate-500 font-mono uppercase">{c.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- TYPOGRAPHY --- */}
        <section className="lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-accent-pink rounded-full"></span> Typography
            </h2>
            <div className="flex gap-2">
              <button onClick={() => toggleEdit('typography')} className="text-xs text-slate-400 hover:text-white transition-colors">
                {editMode['typography'] ? 'Done' : 'Edit'}
              </button>
              <button onClick={() => handleGenerate('typography')} className="text-xs bg-accent-pink/10 text-accent-pink px-3 py-1 rounded-full hover:bg-accent-pink/20 transition-colors flex items-center gap-1">
                <Sparkles size={12} /> Generate
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-6">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase mb-2">Headings</div>
              <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg border border-white/5">
                <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center text-white font-bold text-xl">Aa</div>
                <div className="flex-1">
                  {editMode['typography'] ? (
                    <input
                      className="bg-transparent border-b border-white/20 text-white font-bold w-full outline-none focus:border-primary-500"
                      value={localBrand.fontHeading || ''}
                      onChange={(e) => setLocalBrand({ ...localBrand, fontHeading: e.target.value })}
                      placeholder="Font Name"
                    />
                  ) : (
                    <div className="text-white font-bold">{localBrand.fontHeading || localBrand.fontPairing.split('/')[0] || 'Inter'}</div>
                  )}
                  <div className="text-xs text-slate-500">Bold • 700</div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase mb-2">Body Text</div>
              <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg border border-white/5">
                <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center text-white font-serif text-xl">Aa</div>
                <div className="flex-1">
                  {editMode['typography'] ? (
                    <input
                      className="bg-transparent border-b border-white/20 text-white font-medium w-full outline-none focus:border-primary-500"
                      value={localBrand.fontBody || ''}
                      onChange={(e) => setLocalBrand({ ...localBrand, fontBody: e.target.value })}
                      placeholder="Font Name"
                    />
                  ) : (
                    <div className="text-white font-medium">{localBrand.fontBody || 'Inter'}</div>
                  )}
                  <div className="text-xs text-slate-500">Regular • 400</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* --- BRAND ASSETS --- */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span> Brand Assets
          </h2>
          <button onClick={() => handleGenerate('assets')} className="text-xs bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full hover:bg-emerald-500/20 transition-colors flex items-center gap-1">
            <Sparkles size={12} /> Generate
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cover Image */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-1 overflow-hidden group">
            <div className="bg-slate-900 h-32 rounded-t-lg relative flex items-center justify-center overflow-hidden">
              {localBrand.coverImageUrl ? (
                <img src={localBrand.coverImageUrl} className="w-full h-full object-cover" alt="Cover" />
              ) : (
                <div className="text-slate-600 text-sm">No Cover Image</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white">Social Cover</h3>
              <p className="text-xs text-slate-500 mt-1">1500x500px • For Twitter/LinkedIn</p>
            </div>
          </div>

          {/* Business Card */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-1 overflow-hidden group">
            <div className="bg-slate-900 h-32 rounded-t-lg relative flex items-center justify-center overflow-hidden">
              {localBrand.businessCardFrontUrl ? (
                <img src={localBrand.businessCardFrontUrl} className="w-full h-full object-cover" alt="Card" />
              ) : (
                <div className="text-slate-600 text-sm">No Business Card</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white">Business Card</h3>
              <p className="text-xs text-slate-500 mt-1">Print Ready • PDF/PNG</p>
            </div>
          </div>

          {/* Social Banner */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-1 overflow-hidden group">
            <div className="bg-slate-900 h-32 rounded-t-lg relative flex items-center justify-center overflow-hidden">
              {localBrand.socialBannerUrl ? (
                <img src={localBrand.socialBannerUrl} className="w-full h-full object-cover" alt="Banner" />
              ) : (
                <div className="text-slate-600 text-sm">No Social Banner</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white">Ad Banner</h3>
              <p className="text-xs text-slate-500 mt-1">1080x1080px • Instagram/Facebook</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- VOICE & TONE --- */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-yellow-500 rounded-full"></span> Voice & Tone
          </h2>
          <div className="flex gap-2">
            <button onClick={() => toggleEdit('voice')} className="text-xs text-slate-400 hover:text-white transition-colors">
              {editMode['voice'] ? 'Done' : 'Edit'}
            </button>
            <button onClick={() => handleGenerate('voice')} className="text-xs bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full hover:bg-yellow-500/20 transition-colors flex items-center gap-1">
              <Sparkles size={12} /> Generate
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-white mb-2">Brand Persona</h3>
              {editMode['voice'] ? (
                <textarea
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-slate-300 text-sm focus:border-primary-500 outline-none h-32 resize-none"
                  value={localBrand.voiceTone || ''}
                  onChange={(e) => setLocalBrand({ ...localBrand, voiceTone: e.target.value })}
                />
              ) : (
                <p className="text-slate-300 text-sm leading-relaxed">
                  {localBrand.voiceTone || "The brand voice is professional, authoritative, yet approachable. Content should focus on clarity and value, avoiding jargon where possible."}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {(localBrand.brandValues || ['Professional', 'Trustworthy', 'Innovative']).map((val, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">{val}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">Do's & Don'ts</h3>
              {editMode['voice'] ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500 uppercase mb-1 block">Do's (comma separated)</label>
                    <input
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-slate-300 text-sm focus:border-primary-500 outline-none"
                      value={(localBrand.voiceDos || []).join(', ')}
                      onChange={(e) => setLocalBrand({ ...localBrand, voiceDos: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      placeholder="Use active voice, Focus on benefits..."
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase mb-1 block">Don'ts (comma separated)</label>
                    <input
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-slate-300 text-sm focus:border-primary-500 outline-none"
                      value={(localBrand.voiceDonts || []).join(', ')}
                      onChange={(e) => setLocalBrand({ ...localBrand, voiceDonts: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      placeholder="Avoid jargon, Don't be overly formal..."
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {(localBrand.voiceDos || ['Use active voice and clear calls to action', 'Focus on customer benefits, not just features']).map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="text-emerald-400 font-bold">✓</span> {item}
                    </div>
                  ))}
                  {(localBrand.voiceDonts || ['Avoid using overly complex industry jargon']).map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="text-red-400 font-bold">✗</span> {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
