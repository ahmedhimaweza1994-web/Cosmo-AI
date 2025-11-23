
import React from 'react';
import { Post } from '../types';
import { Calendar, Clock, MoreHorizontal, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

interface SchedulerProps {
  posts: Post[];
}

export const Scheduler: React.FC<SchedulerProps> = ({ posts = [] }) => {
  // Mock calendar grid generation
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const getIcon = (p: string) => {
    switch(p) {
      case 'Instagram': return <Instagram size={14} />;
      case 'LinkedIn': return <Linkedin size={14} />;
      case 'Twitter': return <Twitter size={14} />;
      case 'YouTube': return <Youtube size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Content Calendar</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium">Auto-Schedule</button>
          <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700">Settings</button>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950">
          {days.map(d => (
            <div key={d} className="p-4 text-center text-slate-500 text-sm font-medium uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-slate-900">
           {Array.from({ length: 35 }).map((_, i) => (
             <div key={i} className="border-r border-b border-slate-800 min-h-[120px] p-2 relative hover:bg-slate-800/30 transition-colors group">
                <span className="text-slate-600 text-xs font-medium ml-1">{i + 1}</span>
                {/* Fake post for demo */}
                {i % 4 === 0 && (
                  <div className="mt-2 p-2 bg-slate-800 rounded-lg border border-slate-700 cursor-pointer hover:border-primary-500 transition-colors shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                       <span className="text-primary-400">{getIcon(i % 8 === 0 ? 'LinkedIn' : 'Instagram')}</span>
                       <span className="text-[10px] text-slate-500">10:00 AM</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">Exciting news! We are launching our...</p>
                  </div>
                )}
                 <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-primary-600 rounded text-white">
                   <MoreHorizontal size={14} />
                 </button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
