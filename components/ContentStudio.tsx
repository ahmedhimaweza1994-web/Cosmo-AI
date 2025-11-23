
import React, { useState } from 'react';
import { Image, Video, Type, Loader2, Wand2, Download, Share2 } from 'lucide-react';
import { ImageModel, VideoModel } from '../types';
import { generateImage, generateVideo, generateCaption } from '../services/geminiService';

export const ContentStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'text'>('image');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const [selectedImageModel, setSelectedImageModel] = useState<ImageModel>(ImageModel.NANO_BANANA);
  const [selectedVideoModel, setSelectedVideoModel] = useState<VideoModel>(VideoModel.VEO_FAST);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setResult(null);
    
    try {
      let output = '';
      if (activeTab === 'image') {
        output = await generateImage(prompt, selectedImageModel);
      } else if (activeTab === 'video') {
        output = await generateVideo(prompt, selectedVideoModel);
      } else {
        output = await generateCaption(prompt, "Instagram");
      }
      setResult(output);
    } catch (e) {
      console.error(e);
      alert("Generation failed. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white font-display">Content Studio</h1>
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          {['image', 'video', 'text'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all capitalize text-sm font-medium ${
                activeTab === tab 
                ? 'bg-accent-violet text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab === 'image' && <Image size={16} />}
              {tab === 'video' && <Video size={16} />}
              {tab === 'text' && <Type size={16} />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Controls Panel */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 h-fit">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prompt</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-accent-cyan focus:border-transparent outline-none resize-none h-32 placeholder:text-slate-600"
              placeholder={`Describe your ${activeTab} idea in detail...`}
            />
          </div>

          {activeTab === 'image' && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Model</label>
              <select 
                value={selectedImageModel}
                onChange={(e) => setSelectedImageModel(e.target.value as ImageModel)}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-accent-cyan"
              >
                <option value={ImageModel.NANO_BANANA}>Nano Banana (Flash)</option>
                <option value={ImageModel.NANO_BANANA_PRO}>Nano Banana Pro (Pro)</option>
                <option value={ImageModel.IMAGEN}>Imagen 4.0 (Photo)</option>
              </select>
            </div>
          )}

          {activeTab === 'video' && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Model</label>
              <select 
                value={selectedVideoModel}
                onChange={(e) => setSelectedVideoModel(e.target.value as VideoModel)}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-accent-cyan"
              >
                <option value={VideoModel.VEO_FAST}>Veo Fast (Preview)</option>
                <option value={VideoModel.VEO_HQ}>Veo High Quality</option>
              </select>
            </div>
          )}

          <button 
            onClick={handleGenerate}
            disabled={isLoading || !prompt}
            className="w-full py-3.5 bg-gradient-to-r from-accent-cyan to-accent-violet hover:opacity-90 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent-cyan/20"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
            Generate
          </button>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2 glass-panel rounded-2xl flex items-center justify-center relative overflow-hidden min-h-[400px] bg-black/20">
          {!result && !isLoading && (
            <div className="text-center text-slate-500">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Wand2 size={32} className="opacity-50" />
              </div>
              <p>AI is waiting for your command</p>
            </div>
          )}
          
          {isLoading && (
            <div className="text-center text-accent-cyan">
              <Loader2 size={48} className="animate-spin mx-auto mb-4" />
              <p className="animate-pulse font-display">Dreaming...</p>
            </div>
          )}

          {result && !isLoading && activeTab === 'image' && (
             <img src={result} alt="Generated" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
          )}

          {result && !isLoading && activeTab === 'video' && (
            <video controls src={result} className="max-w-full max-h-full rounded-lg shadow-2xl" />
          )}

          {result && !isLoading && activeTab === 'text' && (
            <div className="p-8 text-left w-full max-w-xl">
               <div className="glass-panel p-6 rounded-xl shadow-xl">
                 <p className="text-lg leading-relaxed whitespace-pre-wrap text-slate-200">{result}</p>
               </div>
            </div>
          )}
          
          {result && !isLoading && (
            <div className="absolute top-4 right-4 flex gap-2">
               <button className="p-2 bg-black/40 hover:bg-black/60 text-white rounded-lg backdrop-blur-md transition-colors">
                 <Download size={20} />
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
