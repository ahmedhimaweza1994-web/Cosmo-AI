
import React, { useState, useEffect, useRef } from 'react';

export const NeoCosmoAvatar = ({ 
  mousePos, 
  mood = 'neutral', 
  isThinking = false, 
  isSpeaking = false,
  isListening = false,
  scale = 1
}: { 
  mousePos: { x: number, y: number }, 
  mood?: 'neutral' | 'happy' | 'excited' | 'thinking', 
  isThinking?: boolean,
  isSpeaking?: boolean,
  isListening?: boolean,
  scale?: number
}) => {
  const [look, setLook] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  // Smooth eye tracking with dampening
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = (mousePos.x - centerX) / window.innerWidth;
    const dy = (mousePos.y - centerY) / window.innerHeight;
    
    // Limit the range so he doesn't look unnatural
    const limitedX = Math.max(-15, Math.min(15, dx * 30));
    const limitedY = Math.max(-10, Math.min(10, dy * 20));

    setLook({ x: limitedX, y: limitedY }); 
  }, [mousePos]);

  // Eye Rendering Logic
  const renderEyes = () => {
     if (mood === 'happy' || mood === 'excited') {
       return (
         <>
           <div className="w-3 h-3 border-t-[3px] border-accent-cyan rounded-full mt-2 mx-1"></div>
           <div className="w-3 h-3 border-t-[3px] border-accent-cyan rounded-full mt-2 mx-1"></div>
         </>
       );
     }

     // Default blinking eyes
     return (
       <>
         <div className={`w-3 h-4 bg-accent-cyan rounded-full shadow-[0_0_10px_rgba(0,210,255,0.8)] animate-blink ${isThinking ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.1s' }}></div>
         <div className={`w-3 h-4 bg-accent-cyan rounded-full shadow-[0_0_10px_rgba(0,210,255,0.8)] animate-blink ${isThinking ? 'animate-bounce' : ''}`} style={{ animationDelay: '2s' }}></div>
       </>
     );
  };

  return (
    <div ref={ref} className="relative w-32 h-32 flex items-center justify-center transition-transform duration-1000 ease-out will-change-transform" style={{ transform: `scale(${scale})` }}>
      
      {/* Floating Animation Container */}
      <div className="relative animate-float flex flex-col items-center">
        
        {/* Antenna / Halo */}
        <div className="absolute -top-8 animate-bounce-slight opacity-80">
           <div className="w-1 h-4 bg-slate-400 mx-auto"></div>
           <div className={`w-3 h-3 rounded-full ${isThinking ? 'bg-accent-pink animate-ping' : 'bg-accent-cyan shadow-[0_0_15px_#00d2ff]'}`}></div>
        </div>

        {/* HEAD - 3D Plastic Look */}
        <div className="relative w-24 h-20 bg-gradient-to-b from-slate-50 to-slate-300 rounded-[2rem] shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_10px_20px_rgba(0,0,0,0.3)] z-20 flex items-center justify-center border border-slate-200">
           
           {/* Face Screen (Black Glass) */}
           <div className="w-20 h-14 bg-slate-950 rounded-[1.5rem] shadow-[inset_0_2px_8px_rgba(255,255,255,0.1),inset_0_-2px_8px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col items-center justify-center group">
              
              {/* Screen Reflection */}
              <div className="absolute top-2 right-2 w-6 h-3 bg-white/10 rounded-full rotate-12 blur-[1px]"></div>

              {/* Eyes Container - Moves with mouse */}
              <div 
                className="flex gap-3 transition-transform duration-100 ease-out mb-1"
                style={{ transform: `translate(${look.x}px, ${look.y}px)` }}
              >
                 {renderEyes()}
              </div>

              {/* Cheeks (Blush) */}
              {(mood === 'happy' || isSpeaking) && (
                 <div className="absolute top-7 w-full flex justify-between px-3 opacity-60">
                    <div className="w-2 h-1 bg-pink-500 blur-sm rounded-full"></div>
                    <div className="w-2 h-1 bg-pink-500 blur-sm rounded-full"></div>
                 </div>
              )}

              {/* Mouth Animation - Changed from bars to a single cute mouth */}
              {isSpeaking ? (
                 <div className="mt-1 w-2 h-1 bg-white rounded-full animate-talk-mouth shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
              ) : (
                  <>
                    {mood === 'happy' ? (
                        <div className="w-4 h-2 border-b-2 border-white/50 rounded-full mt-0"></div>
                    ) : (
                        <div className="w-2 h-1 bg-white/30 rounded-full mt-1"></div>
                    )}
                  </>
              )}

           </div>
        </div>

        {/* BODY / NECK Hint */}
        <div className="w-12 h-6 bg-slate-800 rounded-b-xl -mt-3 z-10 shadow-inner"></div>

        {/* FLOATING HANDS - 3D Depth */}
        <div className="absolute top-10 -left-8 w-5 h-5 bg-gradient-to-b from-slate-100 to-slate-300 rounded-full shadow-lg animate-float-delayed z-30"></div>
        <div className="absolute top-10 -right-8 w-5 h-5 bg-gradient-to-b from-slate-100 to-slate-300 rounded-full shadow-lg animate-float-delayed z-30" style={{ animationDelay: '1s' }}></div>

      </div>
      
      {/* Ground Shadow */}
      <div className="absolute bottom-4 w-16 h-2 bg-black/30 rounded-[100%] blur-md animate-shadow-pulse"></div>

    </div>
  );
};
