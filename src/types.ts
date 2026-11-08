export type CinematicStyle = 
  | 'cyberpunk'
  | 'hollywood_blockbuster'
  | 'film_noir'
  | 'sci_fi_space'
  | 'nature_wildlife'
  | 'vintage_35mm'
  | 'anime_cinematic';

export type CameraMotion = 
  | 'dolly_zoom'
  | 'orbit_360'
  | 'drone_fpv'
  | 'crane_pedestal'
  | 'pan_tilt'
  | 'static_tripod';

export type Resolution = '720p' | '1080p' | '4k';
export type AspectRatio = '16:9' | '9:16' | '1:1' | '2.39:1';
export type FrameRate = '24fps' | '30fps' | '60fps';
export type VideoDuration = '5s' | '10s' | '15s';

export interface GenerationConfig {
  prompt: string;
  enhancedPrompt?: string;
  style: CinematicStyle;
  cameraMotion: CameraMotion;
  resolution: Resolution;
  aspectRatio: AspectRatio;
  fps: FrameRate;
  duration: VideoDuration;
  audioScore: boolean;
  slowMotion: boolean;
  lensInfo?: string;
  lightingSetup?: string;
  directorNotes?: string;
}

export interface GeneratedVideo {
  id: string;
  title: string;
  prompt: string;
  enhancedPrompt?: string;
  style: CinematicStyle;
  cameraMotion: CameraMotion;
  resolution: Resolution;
  aspectRatio: AspectRatio;
  fps: FrameRate;
  duration: VideoDuration;
  creditCost: number;
  createdAt: string;
  previewUrl: string; // Video URL or Canvas blob
  thumbnailUrl: string;
  directorNotes?: string;
  lensInfo?: string;
  soundTrack?: {
    genre: string;
    bpm: number;
    mood: string;
  };
}

export interface CreditPlan {
  id: string;
  name: string;
  priceUSD: number;
  credits: number;
  videoCountEst: number;
  description?: string;
  targetAudience?: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
  isSubscription?: boolean;
}

export interface Transaction {
  id: string;
  planName: string;
  amountUSD: number;
  creditsGranted: number;
  date: string;
  status: 'completed' | 'pending';
}
