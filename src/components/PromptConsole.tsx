import React, { useState } from 'react';
import { Sparkles, Wand2, Compass, Camera, Sun, Palette, Loader2 } from 'lucide-react';
import { CinematicStyle, GenerationConfig } from '../types';

interface PromptConsoleProps {
  config: GenerationConfig;
  onChangeConfig: (newConfig: Partial<GenerationConfig>) => void;
  onEnhance: () => Promise<void>;
  isEnhancing: boolean;
}

const STYLE_OPTIONS: { id: CinematicStyle; label: string; desc: string }[] = [
  { id: 'hollywood_blockbuster', label: 'Hollywood Cinema', desc: 'Anamorphic 35mm, warm key light, deep dynamic range' },
  { id: 'cyberpunk', label: 'Cyberpunk Neo-Noir', desc: 'Rain reflections, electric neon cyan/magenta, misty streets' },
  { id: 'sci_fi_space', label: 'Deep Space Sci-Fi', desc: 'Cosmic nebula backdrop, coronal backlights, sleek hull' },
  { id: 'film_noir', label: 'Vintage Film Noir', desc: 'Monochrome silver halide grain, high-contrast shadows' },
  { id: 'nature_wildlife', label: 'Nature 8K Macro', desc: 'Golden hour rim lighting, crisp organic motion blur' },
  { id: 'vintage_35mm', label: 'Vintage 1970s Film', desc: 'Kodachrome warm organic halation, natural gate weave' },
];

const PROMPT_SUGGESTIONS = [
  'A neon-drenched cyberpunk street in Tokyo with flying speeders gliding over rain-soaked asphalt',
  'An IMAX 70mm shot of an astronaut gazing into a swirling golden interstellar wormhole',
  'A lone detective in a vintage fedora standing under a flickering street lamp in foggy London alleyway',
  'A majestic golden eagle banking tightly across snow-capped Himalayan peaks at golden hour sunset',
  'A sleek stealth hypercar accelerating along a misty mountain pass with sparks reflecting in wet rock',
];

export const PromptConsole: React.FC<PromptConsoleProps> = ({
  config,
  onChangeConfig,
  onEnhance,
  isEnhancing,
}) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const handleApplySuggestion = (text: string) => {
    setSelectedSuggestion(text);
    onChangeConfig({ prompt: text });
  };

  return (
    <div className="space-y-4">
      {/* Prompt Input Header */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
          <span>Text Prompt & Scene Concept</span>
          <span className="text-xs font-normal text-neutral-500">· Describe actions, environment, and mood</span>
        </label>
        
        <button
          type="button"
          onClick={onEnhance}
          disabled={isEnhancing || !config.prompt.trim()}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Enhance prompt with Hollywood camera optics, lighting and color science"
        >
          {isEnhancing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Director Polishing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Director Enhance</span>
            </>
          )}
        </button>
      </div>

      {/* Main Textarea */}
      <div className="relative rounded-lg border border-neutral-800 bg-neutral-900/90 focus-within:border-amber-500/60 focus-within:ring-1 focus-within:ring-amber-500/40 transition-all">
        <textarea
          value={config.prompt}
          onChange={(e) => onChangeConfig({ prompt: e.target.value })}
          placeholder="e.g. A hyper-realistic shot of an explorer discovering an illuminated crystalline cavern deep underground, camera sweeping in a smooth dolly zoom..."
          rows={3}
          className="w-full bg-transparent px-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none resize-none leading-relaxed"
        />

        {/* Enhanced Director Notes Bar */}
        {config.enhancedPrompt && (
          <div className="border-t border-neutral-800/80 px-4 py-2.5 bg-neutral-950/60 rounded-b-lg">
            <div className="flex items-start gap-2.5 text-xs text-neutral-300">
              <Camera className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-neutral-400">
                  <span className="font-semibold text-amber-400">Director's Cut:</span> {config.enhancedPrompt}
                </p>
                {config.lensInfo && (
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
                    <span><strong className="text-neutral-300">Optics:</strong> {config.lensInfo}</span>
                    <span>·</span>
                    <span><strong className="text-neutral-300">Lighting:</strong> {config.lightingSetup}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Scene Inspiration Presets */}
      <div>
        <div className="text-xs text-neutral-400 mb-2 flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-neutral-500" />
          <span>Quick Inspiration</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PROMPT_SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleApplySuggestion(sug)}
              className="text-left text-xs px-2.5 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 transition-colors truncate max-w-[280px]"
              title={sug}
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Cinematic Style Selection */}
      <div className="pt-2">
        <label className="text-sm font-semibold text-neutral-200 block mb-2">
          Cinematic Director Style
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {STYLE_OPTIONS.map((style) => {
            const isSelected = config.style === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onChangeConfig({ style: style.id })}
                className={`text-left p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-amber-500/70 bg-amber-500/10 text-white shadow-sm'
                    : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-semibold ${isSelected ? 'text-amber-400' : 'text-neutral-200'}`}>
                    {style.label}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-1 leading-snug">
                  {style.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
