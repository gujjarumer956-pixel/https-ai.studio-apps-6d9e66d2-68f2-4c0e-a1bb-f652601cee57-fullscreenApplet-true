import React, { useState } from 'react';
import { Header } from './components/Header';
import { PromptConsole } from './components/PromptConsole';
import { DirectorControls } from './components/DirectorControls';
import { VideoPlayer } from './components/VideoPlayer';
import { ShowcaseGallery } from './components/ShowcaseGallery';
import { UserLibrary } from './components/UserLibrary';
import { PricingModal } from './components/PricingModal';
import { SHOWCASE_VIDEOS } from './data/showcaseData';
import { 
  GenerationConfig, 
  GeneratedVideo, 
  Transaction, 
  CinematicStyle 
} from './types';
import { 
  Sparkles, 
  Film, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Camera, 
  Layers 
} from 'lucide-react';

export default function App() {
  // Free 100 points granted initially (first two videos free at 50 pts each)
  const [userCredits, setUserCredits] = useState<number>(100);
  const [currentTab, setCurrentTab] = useState<'studio' | 'showcase' | 'library' | 'pricing'>('studio');
  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);
  
  // Active Video in Player
  const [currentVideo, setCurrentVideo] = useState<GeneratedVideo | null>(SHOWCASE_VIDEOS[0]);
  const [userVideos, setUserVideos] = useState<GeneratedVideo[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Director Generation Configuration
  const [config, setConfig] = useState<GenerationConfig>({
    prompt: 'A futuristic city street with glowing neon lights and flying cars reflecting on rain-soaked asphalt',
    enhancedPrompt: 'Cinematic 8k IMAX still of a futuristic neon-lit city street at night in rain, glowing holographic billboards reflecting in wet asphalt, dark moody atmosphere, anamorphic lens flare, shallow depth of field, blockbuster movie aesthetic',
    style: 'cyberpunk',
    cameraMotion: 'dolly_zoom',
    resolution: '1080p',
    aspectRatio: '16:9',
    fps: '24fps',
    duration: '5s',
    audioScore: true,
    slowMotion: false,
    lensInfo: 'Panavision Anamorphic 40mm T2.0',
    lightingSetup: 'High-contrast neon signs, wet asphalt ground reflection, electric cyan & magenta rim light',
    directorNotes: 'Vertigo dolly zoom pulling back while lens focal zooms forward maintaining subject scale.',
  });

  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Change config partially
  const handleChangeConfig = (newConfig: Partial<GenerationConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // AI Director Enhancement via backend Gemini
  const handleEnhancePrompt = async () => {
    if (!config.prompt.trim()) return;
    setIsEnhancing(true);

    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: config.prompt,
          style: config.style,
          cameraMotion: config.cameraMotion,
          resolution: config.resolution,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setConfig((prev) => ({
          ...prev,
          enhancedPrompt: data.enhancedPrompt || prev.enhancedPrompt,
          directorNotes: data.directorNotes || prev.directorNotes,
          lensInfo: data.lensInfo || prev.lensInfo,
          lightingSetup: data.lightingSetup || prev.lightingSetup,
        }));
        showToast('Director prompt enhanced with Hollywood lens optics and lighting!', 'success');
      }
    } catch (err) {
      console.warn('Enhancement error:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Generate Video
  const handleGenerateVideo = async () => {
    // Calculate required cost
    let cost = 50;
    if (config.resolution === '4k') cost += 25;
    if (config.cameraMotion !== 'static_tripod') cost += 15;
    if (config.audioScore) cost += 10;
    if (config.duration === '10s') cost += 20;
    if (config.duration === '15s') cost += 35;

    if (userCredits < cost) {
      setIsPricingOpen(true);
      showToast(`Need ${cost} credits to render. Get 2 videos for just $0.01!`, 'info');
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: config.prompt,
          style: config.style,
          cameraMotion: config.cameraMotion,
          resolution: config.resolution,
          aspectRatio: config.aspectRatio,
          fps: config.fps,
          duration: config.duration,
          options: {
            audioScore: config.audioScore,
            slowMotion: config.slowMotion,
          },
        }),
      });

      const data = await res.json();

      // Pick corresponding showcase image or synthesize
      const matchedShowcase = SHOWCASE_VIDEOS.find((s) => s.style === config.style) || SHOWCASE_VIDEOS[0];

      const newVideo: GeneratedVideo = {
        id: data.videoId || 'ufg_' + Date.now().toString(36),
        title: config.prompt.slice(0, 40) + '...',
        prompt: config.prompt,
        enhancedPrompt: config.enhancedPrompt,
        style: config.style,
        cameraMotion: config.cameraMotion,
        resolution: config.resolution,
        aspectRatio: config.aspectRatio,
        fps: config.fps,
        duration: config.duration,
        creditCost: cost,
        createdAt: new Date().toISOString(),
        thumbnailUrl: matchedShowcase.thumbnailUrl,
        previewUrl: data.nativeVideoDataUrl || matchedShowcase.previewUrl,
        directorNotes: config.directorNotes,
        lensInfo: config.lensInfo,
        soundTrack: data.soundDesign || matchedShowcase.soundTrack,
      };

      // Deduct credits
      setUserCredits((prev) => Math.max(0, prev - cost));
      setUserVideos((prev) => [newVideo, ...prev]);
      setCurrentVideo(newVideo);
      setCurrentTab('studio');

      showToast(`Video rendered successfully! ${cost} credits deducted.`, 'success');
    } catch (err: any) {
      showToast('Rendering error. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Add credits from checkout
  const handleAddCredits = (credits: number, planName: string, amountUSD: number) => {
    setUserCredits((prev) => prev + credits);
    const newTx: Transaction = {
      id: 'TX_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      planName,
      amountUSD,
      creditsGranted: credits,
      date: new Date().toLocaleDateString(),
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Successfully added +${credits} credits!`, 'success');
  };

  const handleRemixPrompt = (prompt: string, style: CinematicStyle) => {
    setConfig((prev) => ({
      ...prev,
      prompt,
      style,
      enhancedPrompt: undefined,
    }));
    setCurrentTab('studio');
    showToast('Prompt loaded into Director Console', 'info');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className={`px-4 py-3 rounded-lg shadow-xl border text-xs font-semibold flex items-center gap-2 ${
            toastMessage.type === 'success'
              ? 'bg-neutral-900 border-amber-500/60 text-white'
              : toastMessage.type === 'error'
              ? 'bg-neutral-900 border-red-500/60 text-red-200'
              : 'bg-neutral-900 border-neutral-700 text-neutral-200'
          }`}>
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        credits={userCredits}
        onOpenPricing={() => setIsPricingOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* Onboarding Welcome Callout */}
        <div className="mb-6 p-4 rounded-xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </span>
            <div>
              <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                First Two Videos 100% Free
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                We've provided <strong className="text-white font-mono">100 complimentary credits</strong> (50 points per video). Need more? Refill 2 additional videos for <strong className="text-amber-400">$0.01</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsPricingOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-colors whitespace-nowrap shadow-sm shadow-amber-500/20"
            >
              Get 2 Videos for $0.01
            </button>
          </div>
        </div>

        {/* Studio View */}
        {currentTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Prompt Console & Camera Controls */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 space-y-4">
                <PromptConsole
                  config={config}
                  onChangeConfig={handleChangeConfig}
                  onEnhance={handleEnhancePrompt}
                  isEnhancing={isEnhancing}
                />
              </div>

              <DirectorControls
                config={config}
                onChangeConfig={handleChangeConfig}
                userCredits={userCredits}
                onGenerate={handleGenerateVideo}
                isGenerating={isGenerating}
                onOpenPricing={() => setIsPricingOpen(true)}
              />

            </div>

            {/* Right Column: Live Cinematic Viewport Player */}
            <div className="lg:col-span-6 space-y-4 sticky top-20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                  <Film className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ultra High-Definition Video Monitor</span>
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  ufg.ai Engine 2.5
                </span>
              </div>

              <VideoPlayer
                video={currentVideo}
                onReusePrompt={(prompt, style) => handleRemixPrompt(prompt, style)}
              />

              {/* Quick Specs strip */}
              {currentVideo && (
                <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-900/40 text-xs text-neutral-400 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-200">Shutter Angle:</span>
                    <span className="font-mono text-neutral-400">180°</span>
                    <span className="text-neutral-600">·</span>
                    <span className="font-semibold text-neutral-200">Color Science:</span>
                    <span className="font-mono text-neutral-400">ACEScc Rec.2020</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-400">
                    <span>{currentVideo.creditCost} pts rendered</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Showcase Gallery View */}
        {currentTab === 'showcase' && (
          <ShowcaseGallery
            onSelectVideo={(video) => {
              setCurrentVideo(video);
              setCurrentTab('studio');
            }}
            onRemixPrompt={handleRemixPrompt}
          />
        )}

        {/* User Library View */}
        {currentTab === 'library' && (
          <UserLibrary
            videos={userVideos}
            transactions={transactions}
            onSelectVideo={(video) => {
              setCurrentVideo(video);
              setCurrentTab('studio');
            }}
            onGoToStudio={() => setCurrentTab('studio')}
            onOpenPricing={() => setIsPricingOpen(true)}
          />
        )}

        {/* Direct Pricing View */}
        {currentTab === 'pricing' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">ufg.ai Plans & Credits</h2>
              <p className="text-xs text-neutral-400 max-w-lg mx-auto">
                First 2 videos are free with your 100 welcome credits. Refill on demand with our $0.01 micro-pack or choose a creator subscription.
              </p>
            </div>

            <PricingModal
              isOpen={true}
              onClose={() => setCurrentTab('studio')}
              userCredits={userCredits}
              onAddCredits={handleAddCredits}
            />
          </div>
        )}

      </main>

      {/* Pricing Modal for Quick Refill Popup */}
      {currentTab !== 'pricing' && (
        <PricingModal
          isOpen={isPricingOpen}
          onClose={() => setIsPricingOpen(false)}
          userCredits={userCredits}
          onAddCredits={handleAddCredits}
        />
      )}

      {/* Minimal Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 text-xs text-neutral-500 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-400">ufg.ai</span>
            <span>·</span>
            <span>Cinematic AI Video Studio</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentTab('studio')} className="hover:text-neutral-300">Studio</button>
            <button onClick={() => setCurrentTab('showcase')} className="hover:text-neutral-300">Showcase</button>
            <button onClick={() => setIsPricingOpen(true)} className="hover:text-amber-400 text-neutral-400">$0.01 Refill</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
