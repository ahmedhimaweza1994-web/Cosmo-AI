
import React, { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, Lock, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../services/dbService';
import { PlanConfig, PaymentConfig } from '../types';

interface CheckoutProps {
  planId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ planId, onSuccess, onCancel }) => {
  const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');
  const [plan, setPlan] = useState<PlanConfig | null>(null);
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  
  useEffect(() => {
    const settings = db.getSettings();
    const foundPlan = settings.plans.find(p => p.id === planId);
    setPlan(foundPlan || null);
    setConfig(settings.payment);
  }, [planId]);

  const handlePayment = () => {
    setStep('processing');
    
    // Simulate Payment Processing based on Mode
    const delayTime = config?.mode === 'LIVE' ? 4000 : 2000;
    
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, delayTime);
  };

  if (!plan || !config) return <div className="p-10 text-white">Loading...</div>;

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-cosmic-950 flex items-center justify-center p-6">
        <div className="glass-panel p-8 rounded-3xl text-center max-w-md w-full border border-emerald-500/30 animate-fade-in">
           <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400 animate-bounce-slight">
             <CheckCircle2 size={40} />
           </div>
           <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
           <p className="text-slate-400 mb-6">Your account has been upgraded to {plan.name}. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-950 flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 relative z-10 animate-fade-in-up">
        
        {/* Order Summary */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 h-fit">
           <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
             <ArrowLeft size={16} /> Back
           </button>
           
           <h2 className="text-xl font-bold text-white mb-6 font-display">Order Summary</h2>
           
           <div className="flex justify-between items-center py-4 border-b border-white/10">
             <div>
               <div className="text-white font-medium">Nexus AI {plan.name} Plan</div>
               <div className="text-slate-500 text-sm">Monthly Subscription</div>
             </div>
             <div className="text-white font-bold">{plan.currency}{plan.price}</div>
           </div>
           
           <div className="flex justify-between items-center py-4">
             <div className="text-slate-400">Total today</div>
             <div className="text-2xl font-bold text-primary-500">{plan.currency}{plan.price}</div>
           </div>

           {config.mode === 'SANDBOX' && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-2 text-yellow-400 text-xs items-center">
                 <AlertCircle size={16} />
                 <span>Sandbox Mode Active (Simulated Payment)</span>
              </div>
           )}

           <div className="mt-8 bg-emerald-500/10 p-4 rounded-xl flex gap-3 items-start border border-emerald-500/20">
              <ShieldCheck className="text-emerald-400 shrink-0" size={20} />
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="text-emerald-400 font-bold block mb-1">30-Day Money-Back Guarantee</span>
                If you're not blown away by the AI results, cancel anytime in the first month for a full refund.
              </div>
           </div>
        </div>

        {/* Payment Method */}
        <div className="glass-panel-strong p-8 rounded-3xl border border-white/10 relative overflow-hidden">
           {step === 'processing' && (
             <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4"></div>
                <p className="text-white font-medium">Connecting to {config.gateway === 'PAYPAL' ? 'PayPal' : 'Stripe'}...</p>
             </div>
           )}

           <h2 className="text-xl font-bold text-white mb-6 font-display flex items-center gap-2">
             <Lock size={18} className="text-slate-400" /> Secure Checkout
           </h2>

           <div className="space-y-4">
             {config.gateway === 'PAYPAL' ? (
               <div className="p-4 bg-[#FFC439] rounded-xl cursor-pointer hover:brightness-105 transition-all flex items-center justify-center relative overflow-hidden group shadow-lg" onClick={handlePayment}>
                  <span className="text-[#003087] font-bold italic text-xl mr-1">Pay</span>
                  <span className="text-[#009cde] font-bold italic text-xl">Pal</span>
               </div>
             ) : (
               <button onClick={handlePayment} className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-500 transition-all">
                 Pay with Stripe
               </button>
             )}

             <div className="relative py-4">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
               <div className="relative flex justify-center"><span className="px-3 bg-[#0F0826] text-slate-500 text-xs">OR PAY WITH CARD</span></div>
             </div>

             {/* Card Form (Visual Only) */}
             <div className="space-y-3 opacity-50 grayscale select-none pointer-events-none">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Card Number</label>
                  <div className="relative">
                    <input type="text" disabled className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white pl-10" placeholder="0000 0000 0000 0000" />
                    <CreditCard className="absolute left-3 top-3 text-slate-500" size={18} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs text-slate-500 mb-1">Expiry</label>
                     <input type="text" disabled className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white" placeholder="MM/YY" />
                   </div>
                   <div>
                     <label className="block text-xs text-slate-500 mb-1">CVC</label>
                     <input type="text" disabled className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white" placeholder="123" />
                   </div>
                </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};
