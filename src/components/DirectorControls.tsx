import React from 'react';
import { 
  Camera, 
  Tv, 
  Maximize2, 
  Volume2, 
  Clock, 
  Sparkles, 
  Film, 
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  GenerationConfig, 
  CameraMotion, 
  Resolution, 
  AspectRatio, 
  FrameRate, 
  VideoDuration 
} from '../types';

interface DirectorControlsProps {
  config: GenerationConfig;
  onChangeConfig: (newConfig: Partial<GenerationConfig>) => void;
  userCredits: number;
  onGenerate: () => void;
  isGenerating: boolean;
  onOpenPricing: () => void;
}

const MOTION_OPTIONS: { id: CameraMotion; label: string; desc: string; cost: number }[] = [
  { id: 'dolly_zoom', label: 'Dolly Zoom (Vertigo)', desc: 'Foreground static, background warps', cost: 15 },
  { id: 'orbit_360', label: '360° Orbital Pan', desc: 'Seamless horizontal camera revolution', cost: 15 },
  { id: 'drone_fpv', label: 'FPV Drone Swoop', desc: 'Acrobatic dynamic pitch and speed', cost: 15 },
  { id: 'crane_pedestal', label: 'Crane Pedestal', desc: 'Ascending high-angle elevation', cost: 15 },
  { id: 'pan_tilt', label: 'Cinematic Pan & Tilt', desc: 'Measured lateral whip and tilt', cost: 15 },
  { id: 'static_tripod', label: 'Locked Mitchell Tripod', desc: 'Stable studio lock with micro-drift', cost: 0 },
];

const RESOLUTION_OPTIONS: { id: Resolution; label: string; badge: string; cost: number }[] = [
  { id: '720p', label: '720p HD', badge: 'Standard', cost: 0 },
  { id: '1080p', label: '1080p FHD', badge: 'Crisp', cost: 0 },
  { id: '4k', label: '4K Ultra HD', badge: 'Cinema Grade', cost: 25 },
];

const ASPECT_RATIOS: { id: AspectRatio; label: string; ratio: string }[] = [
  { id: '16:9', label: 'Widescreen', ratio: '16:9' },
  { id: '9:16', label: 'Vertical (Reels/TikTok)', ratio: '9:16' },
  { id: '1:1', label: 'Square', ratio: '1:1' },
  { id: '2.39:1', label: 'Anamorphic Scope', ratio: '2.39:1' },
];

const DURATION_OPTIONS: { id: VideoDuration; label: string; cost: number }[] = [
  { id: '5s', label: '5 Seconds', cost: 0 },
  { id: '10s', label: '10 Seconds', cost: 20 },
  { id: '15s', label: '15 Seconds', cost: 35 },
];

export const DirectorControls: React.FC<DirectorControlsProps> = ({
  config,
  onChangeConfig,
  userCredits,
  onGenerate,
  isGenerating,
  onOpenPricing,
}) => {
  // Compute total credits required
  let totalCost = 50; // base standard generation
  if (config.resolution === '4k') totalCost += 25;
  if (config.cameraMotion !== 'static_tripod') totalCost += 15;
  if (config.audioScore) totalCost += 10;
  if (config.duration === '10s') totalCost += 20;
  if (config.duration === '15s') totalCost += 35;

  const hasEnoughCredits = userCredits >= totalCost;

  return (
    <div className="space-y-6 bg-neutral-900/60 border border-neutral-800 rounded-xl p-5">
      
      {/* 1. Camera Motion Rig */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Camera Motion Rig</span>
          </label>
          <span className="text-[11px] text-neutral-500 font-mono">
            {config.cameraMotion === 'static_tripod' ? 'Standard 0 pts' : '+15 credits'}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MOTION_OPTIONS.map((motion) => {
            const isSelected = config.cameraMotion === motion.id;
            return (
              <button
                key={motion.id}
                type="button"
                onClick={() => onChangeConfig({ cameraMotion: motion.id })}
                className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                  isSelected
                    ? 'border-amber-500/70 bg-amber-500/10 text-white'
                    : 'border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div className="font-medium text-neutral-200 flex items-center justify-between">
                  <span>{motion.label}</span>
                  {motion.cost > 0 && <span className="text-[10px] text-amber-400 font-mono">+{motion.cost}</span>}
                </div>
                <div className="text-[10px] text-neutral-400 truncate mt-0.5">{motion.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Resolution & Aspect Ratio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Resolution */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-amber-400" />
              <span>Resolution Quality</span>
            </label>
            <span className="text-[11px] text-neutral-500 font-mono">
              {config.resolution === '4k' ? '+25 credits' : 'Included'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {RESOLUTION_OPTIONS.map((res) => {
              const isSelected = config.resolution === res.id;
              return (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => onChangeConfig({ resolution: res.id })}
                  className={`py-2 px-2 rounded border text-center transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-semibold">{res.label}</div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                    {res.cost > 0 ? `+${res.cost} pts` : 'Standard'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Aspect Ratio */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-2">
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Framing / Aspect Ratio</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {ASPECT_RATIOS.map((ar) => {
              const isSelected = config.aspectRatio === ar.id;
              return (
                <button
                  key={ar.id}
                  type="button"
                  onClick={() => onChangeConfig({ aspectRatio: ar.id })}
                  className={`py-2 px-2.5 rounded border text-left transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-semibold truncate">{ar.label}</div>
                  <div className="text-[10px] text-neutral-400 font-mono">{ar.ratio}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Duration, Frame Rate & Sound Design */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-neutral-800/80">
        
        {/* Duration */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Clip Duration</span>
          </label>
          <div className="flex gap-1.5">
            {DURATION_OPTIONS.map((dur) => {
              const isSelected = config.duration === dur.id;
              return (
                <button
                  key={dur.id}
                  type="button"
                  onClick={() => onChangeConfig({ duration: dur.id })}
                  className={`flex-1 py-1.5 px-2 rounded border text-xs font-medium text-center transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div>{dur.label}</div>
                  {dur.cost > 0 && <span className="text-[10px] text-amber-400 font-mono">+{dur.cost}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Frame Rate */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-1.5">
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>Frame Rate</span>
          </label>
          <div className="flex gap-1.5">
            {(['24fps', '30fps', '60fps'] as FrameRate[]).map((fps) => {
              const isSelected = config.fps === fps;
              return (
                <button
                  key={fps}
                  type="button"
                  onClick={() => onChangeConfig({ fps })}
                  className={`flex-1 py-1.5 px-2 rounded border text-xs font-mono text-center transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 text-white font-semibold'
                      : 'border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  {fps}
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio Design Toggle */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-1.5">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Cinematic Audio (+10)</span>
          </label>
          <button
            type="button"
            onClick={() => onChangeConfig({ audioScore: !config.audioScore })}
            className={`w-full py-2 px-3 rounded border text-xs flex items-center justify-between transition-all ${
              config.audioScore
                ? 'border-amber-500 bg-amber-500/10 text-white'
                : 'border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            <span className="truncate">Atmospheric Score</span>
            <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${config.audioScore ? 'bg-amber-500 text-neutral-950 font-semibold' : 'bg-neutral-800 text-neutral-400'}`}>
              {config.audioScore ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

      </div>

      {/* Credit Summary & Primary Generation CTA */}
      <div className="pt-3 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Cost breakdown */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Total Generation Cost:</span>
            <span className="font-mono text-base font-bold tabular-nums text-amber-400">
              {totalCost}
            </span>
            <span className="text-xs text-neutral-500 font-mono">credits</span>
          </div>
          <div className="text-[11px] text-neutral-400 flex items-center gap-2">
            <span>Your Balance:</span>
            <span className="font-mono tabular-nums font-semibold text-neutral-200">{userCredits} credits</span>
            <span>·</span>
            {hasEnoughCredits ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Ready to render</span>
              </span>
            ) : (
              <button 
                type="button"
                onClick={onOpenPricing}
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                <span>Refill needed ($0.01 for 2 videos)</span>
              </button>
            )}
          </div>
        </div>

        {/* Primary CTA */}
        <div className="flex items-center gap-3">
          {!hasEnoughCredits && (
            <button
              type="button"
              onClick={onOpenPricing}
              className="px-4 py-2.5 rounded-lg border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 text-xs font-semibold transition-colors"
            >
              Get Credits ($0.01)
            </button>
          )}

          <button
            type="button"
            onClick={hasEnoughCredits ? onGenerate : onOpenPricing}
            disabled={isGenerating || !config.prompt.trim()}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
              hasEnoughCredits
                ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-amber-500/20 active:scale-98'
                : 'bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                <span>Synthesizing Video...</span>
              </>
            ) : hasEnoughCredits ? (
              <>
                <Sparkles className="w-4 h-4 text-neutral-950" />
                <span>Generate Video ({totalCost} pts)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Get Credits to Generate</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
