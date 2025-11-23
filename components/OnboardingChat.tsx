
import React, { useState, useEffect, useRef } from 'react';
import { Message, CompanyProfile, ImageModel, ChatStep, WebsiteAnalysis, ViewState } from '../types';
import { Sparkles, Power, CornerDownLeft, UploadCloud, RefreshCw, ThumbsUp, Globe, Wand2, ArrowRight, Home, LayoutDashboard } from 'lucide-react';
import { sendOnboardingMessage, generateImage, analyzeWebsite } from '../services/geminiService';
import { NeoCosmoAvatar } from './NeoCosmoAvatar';

interface OnboardingChatProps {
  onComplete: (profile: CompanyProfile) => void;
  onNavigate?: (view: ViewState) => void;
}

const WebsiteCard = ({ data, language, onConfirm, onEdit }: any) => (
  <div className="glass-panel p-6 rounded-2xl w-full max-w-md mx-auto animate-fade-in-up border border-white/10">
     <div className="flex items-start gap-4 mb-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Globe size={24} /></div>
        <div className="flex-1">
           <h3 className="text-white font-display font-bold text-xl leading-tight">{data.name || 'Unknown Site'}</h3>
           <p className="text-slate-400 text-sm mt-1 line-clamp-2">{data.summary}</p>
        </div>
     </div>
     <div className="flex gap-2 flex-wrap mb-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {data.services.slice(0, 3).map((s: string, i: number) => (
           <span key={i} className="text-xs font-medium px-2.5 py-1 bg-white/5 rounded-full text-slate-300 border border-white/5">{s}</span>
        ))}
     </div>
     <div className="flex gap-3" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <button onClick={onEdit} className="flex-1 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/10">
           {language === 'ar' ? 'تعديل' : 'Edit Data'}
        </button>
        <button onClick={onConfirm} className="flex-1 py-3 text-sm font-bold bg-gradient-to-r from-accent-cyan to-accent-violet text-white rounded-xl shadow-lg shadow-accent-cyan/20 hover:opacity-90 transition-all">
           {language === 'ar' ? 'تأكيد' : 'Confirm & Use'}
        </button>
     </div>
  </div>
);

// Helper check for Arabic
const isArabicText = (text: string) => {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
};

export const OnboardingChat: React.FC<OnboardingChatProps> = ({ onComplete, onNavigate }) => {
  // Core State
  const [gameState, setGameState] = useState<'sleeping' | 'intro' | 'chat'>('sleeping');
  const [chatStep, setChatStep] = useState<ChatStep>(ChatStep.LANGUAGE_SELECT);
  const [companyData, setCompanyData] = useState<Partial<CompanyProfile>>({ language: 'en' });
  const [history, setHistory] = useState<Message[]>([]);
  
  // UI State
  const [input, setInput] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); 
  const [fullText, setFullText] = useState("");
  const [mood, setMood] = useState<'neutral' | 'happy' | 'excited' | 'thinking'>('neutral');
  
  // Refs & Effects
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Simulate Speaking Animation when text changes
  useEffect(() => {
     if (fullText) {
       setIsSpeaking(true);
       const wordCount = fullText.split(' ').length;
       const speakDuration = Math.min(wordCount * 300, 4000); 
       const timer = setTimeout(() => setIsSpeaking(false), speakDuration);
       return () => clearTimeout(timer);
     }
  }, [fullText]);

  // --- ACTIONS ---

  const wakeUp = () => {
     // Transition state
     setGameState('intro');
     setMood('happy');
     // Add delay to text so avatar has time to grow smoothly first
     setTimeout(() => {
        setFullText("Hi there! I'm Cosmo. I can speak Arabic or English. Which do you prefer?");
     }, 900); // Increased delay to match transition completion
  };

  const setLanguage = (lang: 'en' | 'ar') => {
    const isAr = lang === 'ar';
    setCompanyData({ ...companyData, language: lang });
    setGameState('chat');
    setChatStep(ChatStep.USER_INTRO);
    setFullText(''); // Clear momentarily
    
    // Small delay for smooth transition to chat layout
    setTimeout(() => {
        const msg = isAr ? "أهلاً بك! أنا كوزمو 🌟 لنبدأ، ما هو اسمك؟" : "Hi! I'm Cosmo, your AI creative partner 🌟 Let's start! What is your name?";
        setFullText(msg);
        addAiMessageToHistory(msg);
    }, 600);
  };

  const addAiMessageToHistory = (text: string, extra?: any) => {
    const msg: Message = { 
      id: Date.now().toString(), 
      role: 'ai', 
      content: text, 
      timestamp: new Date(),
      ...extra 
    };
    setHistory(prev => [...prev, msg]);
    setMood('happy');
    setTimeout(() => setMood('neutral'), 3000);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);
    setMood('thinking');

    try {
      // --- URL Handling ---
      const urlMatch = input.match(/(https?:\/\/[^\s]+)/g);
      if (urlMatch && chatStep === ChatStep.COMPANY_INTRO) {
         const analysis = await analyzeWebsite(urlMatch[0], companyData.language);
         setCompanyData(prev => ({ ...prev, website: urlMatch[0], name: analysis.name, description: analysis.summary }));
         setChatStep(ChatStep.WEBSITE_VERIFY);
         
         const txt = companyData.language === 'ar' 
           ? "وجدت موقعك! 🕵️‍♂️ هل هذه البيانات صحيحة؟" 
           : "I found your site! 🕵️‍♂️ Does this look right?";
         
         setFullText(txt);
         addAiMessageToHistory(txt, { websiteData: analysis, action: { type: 'website_verify' } });
         setIsThinking(false);
         return;
      }

      // --- Logo Gen Handling ---
      if (chatStep === ChatStep.BRANDING_STYLE) {
         await generateLogo(input);
         setIsThinking(false);
         return;
      }

      // --- Standard Flow ---
      let updatedData = { ...companyData };
      if (chatStep === ChatStep.USER_INTRO) updatedData.userName = input;
      else if (chatStep === ChatStep.COMPANY_INTRO) updatedData.name = input;
      
      setCompanyData(updatedData);

      const contextHistory = history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }));
      const response = await sendOnboardingMessage(contextHistory, userMsg.content, chatStep, updatedData);
      
      if (chatStep === ChatStep.USER_INTRO && updatedData.userName) setChatStep(ChatStep.COMPANY_INTRO);
      else if (chatStep === ChatStep.COMPANY_INTRO && !updatedData.website && history.length > 4) setChatStep(ChatStep.GOALS);
      else if (chatStep === ChatStep.GOALS) setChatStep(ChatStep.BRANDING_LOGO);
      else if (chatStep === ChatStep.BRANDING_LOGO) {
        if (response.toLowerCase().includes('upload')) setChatStep(ChatStep.BRANDING_FILES);
        else setChatStep(ChatStep.BRANDING_STYLE);
      }
      else if (chatStep === ChatStep.PLANNING) {
         handleFinalize();
         return; 
      }

      setFullText(response);
      addAiMessageToHistory(response, { 
         action: chatStep === ChatStep.BRANDING_FILES ? { type: 'upload_request' } : undefined 
      });

    } catch (e) {
      const err = "My connection flickered! Can you say that again?";
      setFullText(err);
      addAiMessageToHistory(err);
    } finally {
      setIsThinking(false);
    }
  };

  const generateLogo = async (style: string) => {
     const prompt = `Vector logo for ${companyData.name}. Style: ${style}. Minimalist, clean background.`;
     try {
        const img = await generateImage(prompt, ImageModel.NANO_BANANA);
        const txt = companyData.language === 'ar' ? "ما رأيك في هذا التصميم؟" : "How does this look?";
        setFullText(txt);
        addAiMessageToHistory(txt, { imageUrl: img, action: { type: 'logo_approval' } });
     } catch (e) {
        setFullText("I couldn't generate the logo right now. Let's skip?");
     }
  };

  const handleFinalize = () => {
     setChatStep(ChatStep.APPROVAL);
     const msg = companyData.language === 'ar' ? "أنا جاهز لبناء خطتك! لننطلق؟" : "I'm ready to build your strategy! Shall we?";
     setFullText(msg);
     addAiMessageToHistory(msg, { action: { type: 'plan_approval' } });
  };

  const getLastAction = () => {
    const lastMsg = history[history.length - 1];
    return lastMsg?.action;
  };
  
  const getLastImage = () => {
      const lastMsg = history[history.length - 1];
      return lastMsg?.imageUrl;
  };

  const getLastWebsiteData = () => {
      const lastMsg = history[history.length - 1];
      return lastMsg?.websiteData;
  };

  // Font Class Helper
  const fontClass = companyData.language === 'ar' ? 'font-arabic' : 'font-display';
  const isRTL = companyData.language === 'ar';
  const isAr = isArabicText(fullText);
  const activeAction = getLastAction();
  const activeImage = getLastImage();
  const activeWebsite = getLastWebsiteData();

  return (
    <div className="min-h-screen bg-cosmic-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
        
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none">
            {/* Added Grid and Blobs here as well to match landing vibe but darker */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20 z-0" />
            <div className={`absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent-violet/10 rounded-full blur-[120px] transition-all duration-1000 ${gameState === 'sleeping' ? 'scale-75 opacity-50' : 'scale-100 opacity-100'}`}></div>
        </div>

        {/* Header */}
        <div className={`absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 transition-all duration-1000 ${gameState === 'sleeping' ? '-translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`}>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center shadow-lg shadow-accent-cyan/20">
                    <Sparkles size={14} className="text-white" />
                </div>
                <span className="font-display font-bold text-white tracking-tight">Nexus AI</span>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
               {onNavigate && (
                 <>
                   <button 
                      onClick={() => onNavigate(ViewState.LANDING)} 
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors backdrop-blur-md border border-white/5"
                    >
                      <Home size={16} /> Home
                   </button>
                   <button 
                      onClick={() => onNavigate(ViewState.DASHBOARD)} 
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors backdrop-blur-md border border-white/5"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                   </button>
                 </>
               )}
               <button onClick={() => { setGameState('sleeping'); setMood('neutral'); }} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <Power size={20} />
               </button>
            </div>
        </div>

        {/* --- CENTRAL STAGE --- */}
        {/* Wrapper for Avatar and Content to keep them tightly coupled */}
        <div className="relative flex flex-col items-center z-30 w-full max-w-2xl mx-auto">
            
            {/* --- AVATAR --- */}
            <div 
                // Using a specific smoother bezier curve and will-change-transform for better performance
                className="transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform"
                style={{
                    transform: 
                        gameState === 'sleeping' ? 'scale(0.9) translateY(0)' : 
                        gameState === 'intro' ? 'scale(1.6) translateY(-20px)' : 
                        'scale(1.2) translateY(0px)',
                    marginBottom: gameState === 'chat' ? '0px' : '20px'
                }}
                onClick={gameState === 'sleeping' ? wakeUp : undefined}
            >
                <div className={gameState === 'sleeping' ? 'cursor-pointer hover:scale-105 transition-transform' : ''}>
                    <NeoCosmoAvatar 
                        mousePos={mousePos} 
                        mood={mood} 
                        isThinking={isThinking} 
                        isSpeaking={isSpeaking}
                        isListening={!isThinking && !isSpeaking}
                    />
                </div>
            </div>

            {/* --- SLEEPING TEXT --- */}
            <div className={`absolute top-[160px] transition-all duration-500 ${gameState === 'sleeping' ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="relative px-6 py-2 bg-slate-900/50 border border-white/10 rounded-full text-slate-300 font-display text-sm tracking-widest animate-pulse cursor-pointer backdrop-blur-md hover:bg-white/10 transition-colors" onClick={wakeUp}>
                    CLICK TO WAKE COSMO
                </div>
            </div>

            {/* --- INTRO CONTENT --- */}
            {gameState === 'intro' && (
                <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                   {fullText && (
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed drop-shadow-2xl font-display max-w-lg mx-auto">
                            {fullText}
                        </h1>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => setLanguage('en')} className="px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all hover:-translate-y-1 hover:bg-white/20 backdrop-blur-md shadow-lg">
                            English
                        </button>
                        <button onClick={() => setLanguage('ar')} className="px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all hover:-translate-y-1 font-arabic hover:bg-white/20 backdrop-blur-md shadow-lg">
                            العربية
                        </button>
                    </div>
                </div>
            )}

            {/* --- CHAT INTERFACE (Compact Stack) --- */}
            {gameState === 'chat' && (
                <div className="w-full px-4 flex flex-col gap-6 items-center animate-fade-in-up" style={{ animationDuration: '0.8s' }}>
                    
                    {/* 1. Question Text */}
                    <div className="text-center w-full min-h-[60px]">
                       {fullText && (
                           <h2 
                           key={fullText} 
                           dir={isAr ? "rtl" : "ltr"}
                           className={`
                              text-2xl md:text-3xl font-bold text-white leading-normal drop-shadow-lg 
                              ${fontClass}
                              ${isThinking ? 'opacity-50 scale-95 blur-sm transition-all' : 'opacity-100 scale-100 blur-0 transition-all'} 
                           `}
                         >
                            {fullText.split(' ').map((word, i) => (
                                <span 
                                  key={i} 
                                  className="inline-block opacity-0 animate-fade-in-up" 
                                  style={{ animationDelay: `${i * 0.1}s` }} 
                                >
                                  {word}&nbsp;
                                </span>
                            ))}
                         </h2>
                       )}
                    </div>

                    {/* 2. Dynamic Content (Cards) */}
                    <div className={`w-full transition-opacity duration-500 ${isThinking ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        {activeAction?.type === 'website_verify' && activeWebsite && (
                           <WebsiteCard 
                             data={activeWebsite} 
                             language={companyData.language} 
                             onConfirm={() => { setChatStep(ChatStep.GOALS); setFullText(companyData.language === 'ar' ? "عظيم! ما هي أهدافك التسويقية الأساسية؟" : "Great! What are your main marketing goals?"); }}
                             onEdit={() => { /* Edit logic */ }}
                           />
                        )}

                        {activeImage && (
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 max-w-sm mx-auto animate-fade-in-up">
                             <img src={activeImage} alt="Generated Asset" className="rounded-xl w-full shadow-2xl mb-4" />
                             <div className="flex gap-3" dir={isRTL ? 'rtl' : 'ltr'}>
                                <button onClick={() => { setCompanyData({...companyData, branding: { ...companyData.branding, logoUrl: activeImage } as any}); setChatStep(ChatStep.BRANDING_FILES); setFullText("Logo saved! 🎨 Do you have other files to upload?"); }} className="flex-1 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors">
                                   <ThumbsUp size={16} /> {isRTL ? 'موافقة' : 'Approve'}
                                </button>
                                <button onClick={() => setFullText(isRTL ? "صف النمط مرة أخرى بدقة!" : "Describe the style again, be specific!")} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors">
                                   <RefreshCw size={16} /> {isRTL ? 'إعادة' : 'Retry'}
                                </button>
                             </div>
                          </div>
                        )}

                         {activeAction?.type === 'upload_request' && (
                            <label className="block w-full max-w-md mx-auto h-32 border-2 border-dashed border-white/10 rounded-2xl hover:bg-white/5 hover:border-accent-cyan/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-accent-cyan group animate-fade-in-up">
                                <div className="p-3 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
                                  <UploadCloud size={24} />
                                </div>
                                <span className="text-sm font-medium">{isRTL ? 'اسحب الملفات هنا أو اضغط للرفع' : 'Drop files here or click to upload'}</span>
                                <input type="file" className="hidden" onChange={(e) => { setFullText(`Received ${e.target.files?.[0]?.name}. Any others?`); }} />
                            </label>
                        )}

                        {activeAction?.type === 'plan_approval' && (
                           <button onClick={() => onComplete(companyData as CompanyProfile)} className="px-10 py-4 bg-gradient-to-r from-accent-cyan to-accent-violet text-white font-bold text-lg rounded-2xl shadow-xl shadow-accent-cyan/20 hover:scale-105 transition-transform flex items-center gap-3 mx-auto animate-bounce-slight font-display">
                              <Wand2 size={24} /> 
                              {companyData.language === 'ar' ? 'إنشاء الاستراتيجية السحرية' : 'Generate Magic Strategy'}
                           </button>
                        )}
                    </div>

                    {/* 3. Input Bar */}
                    <div className="w-full max-w-xl relative group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                         <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/20 to-accent-violet/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                         <div className={`relative bg-cosmic-950/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center p-2 shadow-2xl transition-all ${isThinking ? 'opacity-50' : 'hover:border-white/20 focus-within:border-accent-cyan/50 focus-within:ring-1 focus-within:ring-accent-cyan/50'}`}>
                            <input
                               ref={inputRef}
                               type="text"
                               dir={companyData.language === 'ar' ? 'rtl' : 'ltr'}
                               value={input}
                               onChange={(e) => setInput(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && !isThinking && handleSend()}
                               placeholder={isThinking ? (companyData.language === 'ar' ? 'جاري التفكير...' : 'Thinking...') : (companyData.language === 'ar' ? 'اكتب إجابتك هنا...' : 'Type your answer here...')}
                               disabled={isThinking}
                               className={`flex-1 bg-transparent border-none text-white placeholder:text-slate-500 px-6 py-4 focus:ring-0 text-lg outline-none font-light ${fontClass}`}
                               autoFocus={gameState === 'chat'}
                            />
                            <button 
                               onClick={handleSend}
                               disabled={!input.trim() || isThinking}
                               className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-xl disabled:opacity-30 transition-colors group-focus-within:bg-accent-cyan group-focus-within:text-cosmic-950"
                            >
                               {companyData.language === 'ar' ? <CornerDownLeft className="rotate-180" size={24} /> : <CornerDownLeft size={24} />}
                            </button>
                         </div>
                    </div>

                </div>
            )}

        </div>
    </div>
  );
};
