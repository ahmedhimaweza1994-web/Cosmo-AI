
import React, { useEffect, useState } from 'react';
import { CompanyProfile, MarketingPlan } from '../types';
import { generateFullMarketingPackage } from '../services/geminiService';
import { Loader2, Check, BrainCircuit, Target, Megaphone, Palette, ArrowRight } from 'lucide-react';

interface Props {
  company: CompanyProfile;
  onComplete: (plan: MarketingPlan) => void;
}

export const AnalysisPresentation: React.FC<Props> = ({ company, onComplete }) => {
  const [stage, setStage] = useState(0);
  const [plan, setPlan] = useState<MarketingPlan | null>(null);

  useEffect(() => {
    const runAnalysis = async () => {
      // 1. Analysis
      await new Promise(r => setTimeout(r, 2000));
      setStage(1);
      
      // 2. Generation
      const generatedPlan = await generateFullMarketingPackage(company);
      setPlan(generatedPlan);
      
      await new Promise(r => setTimeout(r, 2000));
      setStage(2);

      // 3. Optimizing
      await new Promise(r => setTimeout(r, 2000));
      setStage(3);

      // 4. Ready
      await new Promise(r => setTimeout(r, 1500));
      setStage(4);
    };

    runAnalysis();
  }, [company]);

  const steps = [
    { icon: BrainCircuit, label: "Analyzing Market Data & Competitors" },
    { icon: Palette, label: "Generating Brand Identity Assets" },
    { icon: Target, label: "Structuring Ad Campaigns & Budgets" },
    { icon: Megaphone, label: "Drafting Weekly Content Calendar" },
  ];

  if (stage === 4 && plan) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center animate-fade-in">
           <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-400">
             <Check size={48} strokeWidth={3} />
           </div>
           <h1 className="text-4xl font-bold text-white mb-4">Analysis Complete</h1>
           <p className="text-slate-400 mb-8 text-lg">
             We've built a comprehensive strategy for {company.name}. 
             <br/>Ready to launch your new marketing department?
           </p>
           
           <div className="grid grid-cols-2 gap-4 text-left mb-8 max-w-lg mx-auto">
             <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
               <div className="text-slate-500 text-sm">Weekly Posts</div>
               <div className="text-2xl font-bold text-white">{plan.posts.length}</div>
             </div>
             <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
               <div className="text-slate-500 text-sm">Ad Campaigns</div>
               <div className="text-2xl font-bold text-white">{plan.ads.length}</div>
             </div>
           </div>

           <button 
             onClick={() => onComplete(plan)}
             className="px-8 py-4 bg-white text-slate-950 rounded-xl font-bold text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2 mx-auto"
           >
             Enter Dashboard <ArrowRight />
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Matrix Effect Placeholder */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      
      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-12">
           <h2 className="text-2xl font-bold text-white mb-2">Building Your Marketing Engine</h2>
           <p className="text-slate-500">AI is processing {company.name}'s requirements...</p>
        </div>

        <div className="space-y-6">
          {steps.map((s, i) => {
             const isActive = i === stage;
             const isDone = i < stage;
             
             return (
               <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${isActive ? 'bg-slate-800 border-primary-500 shadow-lg shadow-primary-900/20 scale-105' : 'bg-slate-900/50 border-slate-800 opacity-50'}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                    {isDone ? <Check size={20} /> : isActive ? <Loader2 size={20} className="animate-spin" /> : <s.icon size={20} />}
                  </div>
                  <span className={`font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>{s.label}</span>
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};
