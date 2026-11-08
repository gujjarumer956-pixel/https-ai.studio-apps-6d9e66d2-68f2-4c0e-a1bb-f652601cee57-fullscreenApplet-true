import React from 'react';
import { Play, Sparkles, Film, Camera } from 'lucide-react';
import { GeneratedVideo } from '../types';
import { SHOWCASE_VIDEOS } from '../data/showcaseData';

interface ShowcaseGalleryProps {
  onSelectVideo: (video: GeneratedVideo) => void;
  onRemixPrompt: (prompt: string, style: any) => void;
}

export const ShowcaseGallery: React.FC<ShowcaseGalleryProps> = ({
  onSelectVideo,
  onRemixPrompt,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Cinematic Showcase Gallery</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Explore production-grade AI videos generated with ufg.ai's high-definition camera motion and style rigs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SHOWCASE_VIDEOS.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-xl border border-neutral-800 bg-neutral-900/60 overflow-hidden hover:border-neutral-700 transition-all flex flex-col"
          >
            {/* Thumbnail with overlay */}
            <div className="relative aspect-video w-full bg-neutral-950 overflow-hidden">
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Play Badge */}
              <button
                onClick={() => onSelectVideo(item)}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-neutral-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-lg"
                title="Play in studio player"
              >
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              </button>

              {/* Top Meta info */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] font-bold text-amber-400 bg-neutral-950/80 px-2 py-0.5 rounded border border-neutral-800">
                  {item.resolution.toUpperCase()} · {item.fps}
                </span>
                <span className="text-[11px] font-mono text-neutral-300 bg-neutral-950/80 px-2 py-0.5 rounded border border-neutral-800">
                  {item.duration}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                  {item.prompt}
                </p>
              </div>

              {/* Unboxed Metadata with typographic separators */}
              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>{item.cameraMotion.replace('_', ' ')}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.lensInfo || '35mm Anamorphic'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRemixPrompt(item.prompt, item.style)}
                    className="text-amber-400 hover:text-amber-300 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Remix</span>
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    onClick={() => onSelectVideo(item)}
                    className="text-white hover:text-neutral-300 font-medium"
                  >
                    Open Player
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
