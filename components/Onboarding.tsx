import React, { useState } from 'react';
import { CompanyProfile, BrandIdentity } from '../types';
import { ChevronRight, ChevronLeft, CheckCircle2, Building2, Target, Palette, UploadCloud } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: CompanyProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CompanyProfile>>({
    goals: [],
    competitors: [],
    branding: {
      primaryColor: '',
      secondaryColor: '',
      fontPairing: 'Inter',
    } as BrandIdentity
  });

  const handleNext = () => setStep(p => p + 1);
  const handleBack = () => setStep(p => p - 1);

  const updateField = (field: keyof CompanyProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[128px]" />
       </div>

      <div className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl z-10">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
             <span className="text-xs font-medium text-primary-400">Step {step} of 4</span>
             <span className="text-xs font-medium text-slate-500">{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 transition-all duration-500 ease-out" style={{ width: `${(step / 4) * 100}%` }} />
          </div>
        </div>

        {/* Steps */}
        <div className="min-h-[320px]">
          {step === 1 && (
            <div className="animate-fade-in space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-slate-800 rounded-xl text-primary-400"><Building2 size={24} /></div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Company Profile</h2>
                  <p className="text-slate-400">Tell us about your business.</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-1">Company Name</label>
                <input 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-primary-500 outline-none"
                  placeholder="Acme Inc."
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Industry</label>
                <input 
                  type="text" 
                  value={formData.industry || ''} 
                  onChange={(e) => updateField('industry', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-primary-500 outline-none"
                  placeholder="e.g. SaaS, Fashion, Tech"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Website</label>
                <input 
                  type="text" 
                  value={formData.website || ''} 
                  onChange={(e) => updateField('website', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-primary-500 outline-none"
                  placeholder="https://"
                />
              </div>
            </div>
          )}

          {step === 2 && (
             <div className="animate-fade-in space-y-4">
             <div className="flex items-center gap-3 mb-6">
               <div className="p-3 bg-slate-800 rounded-xl text-pink-400"><Target size={24} /></div>
               <div>
                 <h2 className="text-2xl font-bold text-white">Strategy & Goals</h2>
                 <p className="text-slate-400">Who are you targeting?</p>
               </div>
             </div>
             
             <div>
               <label className="block text-sm text-slate-400 mb-1">Target Audience</label>
               <textarea 
                 value={formData.targetAudience || ''} 
                 onChange={(e) => updateField('targetAudience', e.target.value)}
                 className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-primary-500 outline-none h-24 resize-none"
                 placeholder="e.g. Urban professionals aged 25-40 interested in sustainability..."
               />
             </div>
             
             <div>
               <label className="block text-sm text-slate-400 mb-2">Marketing Goals</label>
               <div className="grid grid-cols-2 gap-3">
                 {['Brand Awareness', 'Lead Generation', 'Sales', 'Community Growth'].map(goal => (
                   <button
                      key={goal}
                      onClick={() => {
                        const current = formData.goals || [];
                        const exists = current.includes(goal);
                        updateField('goals', exists ? current.filter(g => g !== goal) : [...current, goal]);
                      }}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        formData.goals?.includes(goal) 
                        ? 'bg-primary-600/20 border-primary-500 text-primary-200' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                   >
                     {goal}
                   </button>
                 ))}
               </div>
             </div>
           </div>
          )}

          {step === 3 && (
             <div className="animate-fade-in space-y-4">
             <div className="flex items-center gap-3 mb-6">
               <div className="p-3 bg-slate-800 rounded-xl text-cyan-400"><Palette size={24} /></div>
               <div>
                 <h2 className="text-2xl font-bold text-white">Branding</h2>
                 <p className="text-slate-400">Define your visual identity.</p>
               </div>
             </div>
             
             <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:bg-slate-800/50 transition-colors cursor-pointer">
                <UploadCloud className="mx-auto text-slate-500 mb-2" size={32} />
                <p className="text-slate-300 font-medium">Upload Logo</p>
                <p className="text-slate-500 text-sm">or drag and drop</p>
             </div>

             <div className="text-center">
               <p className="text-slate-500 text-sm my-2">- OR -</p>
               <button className="text-primary-400 text-sm hover:text-primary-300 underline">
                 Generate Brand Identity with AI
               </button>
             </div>
             
             <div>
               <label className="block text-sm text-slate-400 mb-2">Primary Brand Color</label>
               <div className="flex gap-3">
                 {['#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981'].map(color => (
                    <button
                      key={color}
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        branding: { ...(prev.branding as BrandIdentity), primaryColor: color }
                      }))}
                      style={{ backgroundColor: color }}
                      className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${formData.branding?.primaryColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}`}
                    />
                 ))}
               </div>
             </div>
           </div>
          )}

          {step === 4 && (
             <div className="animate-fade-in space-y-4 text-center pt-8">
               <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400">
                 <CheckCircle2 size={40} />
               </div>
               <h2 className="text-3xl font-bold text-white mb-2">All Set!</h2>
               <p className="text-slate-400 max-w-md mx-auto mb-8">
                 Our AI is ready to generate your marketing strategy, posts, and assets based on your profile.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-xl text-left text-sm text-slate-400 mb-6">
                 <p><strong className="text-slate-200">Company:</strong> {formData.name}</p>
                 <p><strong className="text-slate-200">Industry:</strong> {formData.industry}</p>
                 <p><strong className="text-slate-200">Goals:</strong> {formData.goals?.join(', ')}</p>
               </div>
           </div>
          )}
        </div>

        {/* Footer Nav */}
        <div className="flex justify-between mt-8 pt-6 border-t border-slate-800">
          {step > 1 ? (
            <button onClick={handleBack} className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
              <ChevronLeft size={16} /> Back
            </button>
          ) : <div />}
          
          {step < 4 ? (
             <button onClick={handleNext} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-primary-500/20">
             Next <ChevronRight size={16} />
           </button>
          ) : (
            <button onClick={() => onComplete(formData as CompanyProfile)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-2 rounded-lg font-bold transition-all shadow-lg shadow-emerald-500/20">
              Launch Dashboard
            </button>
          )}
        </div>

      </div>
    </div>
  );
};