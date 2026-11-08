import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Download, 
  Maximize, 
  Share2, 
  Sparkles,
  Camera,
  Film,
  Check,
  Loader2
} from 'lucide-react';
import { GeneratedVideo } from '../types';
import { drawCinematicFrame, recordCinematicVideoBlob } from '../utils/videoSynthesizer';
import { playCinematicSoundtrack, stopCinematicSoundtrack } from '../utils/audioSynth';

interface VideoPlayerProps {
  video: GeneratedVideo | null;
  onReusePrompt?: (prompt: string, style: any) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onReusePrompt }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const durationSec = video ? parseInt(video.duration, 10) || 5 : 5;
  const fpsNum = video ? parseInt(video.fps, 10) || 24 : 24;

  const baseImageRef = useRef<HTMLImageElement | null>(null);

  // Preload base image plate if available
  useEffect(() => {
    if (video && video.thumbnailUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = video.thumbnailUrl;
      img.onload = () => {
        baseImageRef.current = img;
      };
    } else {
      baseImageRef.current = null;
    }
  }, [video?.id]);

  // Audio playback lifecycle
  useEffect(() => {
    if (video && isPlaying && !isMuted) {
      playCinematicSoundtrack(video.style);
    } else {
      stopCinematicSoundtrack();
    }
    return () => {
      stopCinematicSoundtrack();
    };
  }, [video?.id, isPlaying, isMuted, video?.style]);

  // Continuous Canvas Animation Loop
  useEffect(() => {
    let animId: number;
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const deltaSec = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (isPlaying && video) {
        setCurrentTime((prev) => {
          const next = prev + deltaSec;
          return next >= durationSec ? 0 : next;
        });
      }

      if (canvasRef.current && video) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          drawCinematicFrame({
            canvas: canvasRef.current,
            ctx,
            time: currentTime,
            duration: durationSec,
            style: video.style,
            cameraMotion: video.cameraMotion,
            baseImage: baseImageRef.current,
            aspectRatio: video.aspectRatio,
          });
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, video, currentTime, durationSec]);

  // Handle Video Blob Download
  const handleDownloadVideo = async () => {
    if (!video) return;
    try {
      setIsExporting(true);
      setExportProgress(10);

      const blob = await recordCinematicVideoBlob({
        durationSec,
        fps: fpsNum,
        style: video.style,
        cameraMotion: video.cameraMotion,
        baseImage: baseImageRef.current,
        aspectRatio: video.aspectRatio,
        onProgress: (pct) => setExportProgress(pct),
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${video.id}_${video.style}_${video.resolution}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download export failed:', err);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleCopyPrompt = () => {
    if (!video) return;
    navigator.clipboard.writeText(video.enhancedPrompt || video.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Format Timecode: 00:00:SS:FF
  const sec = Math.floor(currentTime);
  const frames = Math.floor((currentTime % 1) * fpsNum);
  const timecode = `00:00:${sec.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;

  if (!video) {
    return (
      <div className="relative aspect-video w-full rounded-xl border border-neutral-800 bg-neutral-900/40 flex flex-col items-center justify-center p-8 text-center text-neutral-500">
        <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600 mb-4">
          <Film className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-neutral-300 mb-1">No Video Rendered Yet</h3>
        <p className="text-xs text-neutral-500 max-w-sm mb-4">
          Enter a prompt above and click "Generate Video" to render your first cinematic sequence. Your first 2 videos are 100% free!
        </p>
      </div>
    );
  }

  // Aspect Ratio container classes
  let aspectStyle = 'aspect-video';
  if (video.aspectRatio === '9:16') aspectStyle = 'aspect-[9/16] max-w-sm mx-auto';
  if (video.aspectRatio === '1:1') aspectStyle = 'aspect-square max-w-xl mx-auto';
  if (video.aspectRatio === '2.39:1') aspectStyle = 'aspect-[2.39/1]';

  return (
    <div 
      ref={containerRef}
      className="relative rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-2xl flex flex-col group"
    >
      {/* Top HUD Overlay (Specs & Camera) */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
            {video.resolution} · {video.fps}
          </span>
          <span className="text-neutral-500">·</span>
          <span className="text-xs text-neutral-300 font-medium">
            {video.cameraMotion.replace('_', ' ').toUpperCase()} RIG
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {video.directorNotes && (
            <span className="hidden sm:inline-block text-[11px] text-neutral-400 font-mono bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-800">
              {video.lensInfo || '35mm Anamorphic'}
            </span>
          )}
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className={`relative w-full ${aspectStyle} bg-black flex items-center justify-center overflow-hidden`}>
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="w-full h-full object-contain"
        />

        {/* Center Play Button Overlay on Hover/Paused */}
        {!isPlaying && (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-neutral-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400 hover:scale-105 transition-transform shadow-lg"
          >
            <Play className="w-8 h-8 translate-x-0.5 fill-current" />
          </button>
        )}
      </div>

      {/* Scrubber & Video Controls Toolbar */}
      <div className="bg-neutral-900/95 border-t border-neutral-800/80 px-4 py-3 space-y-2.5">
        
        {/* Progress Track */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono tabular-nums text-amber-400 w-24">
            {timecode}
          </span>
          <div 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              setCurrentTime(pct * durationSec);
            }}
            className="relative flex-1 h-2 bg-neutral-800 rounded cursor-pointer group/scrub"
          >
            <div 
              className="absolute left-0 top-0 bottom-0 bg-amber-400 rounded transition-all"
              style={{ width: `${(currentTime / durationSec) * 100}%` }}
            />
          </div>
          <span className="text-[11px] font-mono tabular-nums text-neutral-400 w-12 text-right">
            00:00:{durationSec.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-200 transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={() => setCurrentTime(0)}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
              title="Restart from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
              title={isMuted ? 'Unmute Soundtrack' : 'Mute Soundtrack'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
            <span className="text-xs text-neutral-400 hidden sm:inline ml-1 font-mono text-[11px]">
              {video.soundTrack?.genre || 'Atmospheric Score'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800/80 hover:bg-neutral-800 text-xs text-neutral-300 transition-colors"
              title="Copy prompt"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedPrompt ? 'Copied' : 'Share'}</span>
            </button>

            {onReusePrompt && (
              <button
                onClick={() => onReusePrompt(video.prompt, video.style)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800/80 hover:bg-neutral-800 text-xs text-neutral-300 transition-colors"
                title="Load into editor"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Remix</span>
              </button>
            )}

            <button
              onClick={handleDownloadVideo}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs transition-colors disabled:opacity-50"
              title="Download high-definition video file"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Exporting {exportProgress}%</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download {video.resolution.toUpperCase()}</span>
                </>
              )}
            </button>

            <button
              onClick={handleToggleFullscreen}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
              title="Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Scene Summary Footer */}
      <div className="px-4 py-3 bg-neutral-950 border-t border-neutral-900 text-xs text-neutral-400">
        <p className="line-clamp-2">
          <strong className="text-neutral-200">Scene Concept:</strong> {video.prompt}
        </p>
      </div>

    </div>
  );
};
