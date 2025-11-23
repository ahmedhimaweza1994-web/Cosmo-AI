
import React, { useEffect, useState } from 'react';
import { Check, Sparkles, X } from 'lucide-react';
import { db } from '../services/dbService';
import { PlanConfig } from '../types';

interface PricingProps {
  onSelectPlan: (planId: string) => void;
  onBack: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan, onBack }) => {
  const [plans, setPlans] = useState<PlanConfig[]>([]);

  useEffect(() => {
    const settings = db.getSettings();
    setPlans(settings.plans);
  }, []);

  return (
    <div className="min-h-screen bg-cosmic-950 pt-20 pb-12 px-6 relative">
      <div className="absolute top-6 left-6 z-20">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-white transition-colors">
           <X size={24} />
        </button>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4 font-display">Upgrade your AI Power</h2>
        <p className="text-slate-400 max-w-xl mx-auto">Unlock advanced models like Veo, remove limits, and automate your entire workflow.</p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div key={i} className={`relative p-8 rounded-3xl border transition-all duration-300 flex flex-col ${plan.isPopular ? 'bg-white/10 border-primary-500/50 shadow-2xl shadow-primary-500/10 scale-105 z-10' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-600 to-accent-pink text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Sparkles size={12} /> Most Popular
              </div>
            )}
            <h3 className="text-xl font-medium text-slate-300 mb-2 font-display">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-bold text-white">{plan.currency}{plan.price}</span>
              <span className="text-slate-500">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400">
                    <Check size={12} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => onSelectPlan(plan.id)}
              className={`w-full py-3.5 rounded-xl font-bold transition-all ${plan.isPopular ? 'bg-white text-black hover:bg-slate-200 shadow-lg shadow-white/10' : 'bg-white/10 hover:bg-white/20 text-white'}`}
            >
              Select {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
