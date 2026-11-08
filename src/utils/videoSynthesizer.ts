import { CinematicStyle, CameraMotion, AspectRatio } from '../types';

interface RenderFrameOptions {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  time: number;
  duration: number;
  style: CinematicStyle;
  cameraMotion: CameraMotion;
  baseImage?: HTMLImageElement | null;
  aspectRatio: AspectRatio;
}

export function drawCinematicFrame({
  canvas,
  ctx,
  time,
  duration,
  style,
  cameraMotion,
  baseImage,
}: RenderFrameOptions) {
  const w = canvas.width;
  const h = canvas.height;
  const progress = (time % duration) / duration; // 0 to 1

  ctx.save();
  ctx.clearRect(0, 0, w, h);

  // Apply Camera Motion Transforms
  let scale = 1.0;
  let offsetX = 0;
  let offsetY = 0;
  let rotation = 0;

  if (cameraMotion === 'dolly_zoom') {
    // Vertigo effect: camera moves forward while background warps
    scale = 1.0 + Math.sin(progress * Math.PI) * 0.18;
    offsetY = Math.sin(progress * Math.PI * 2) * 8;
  } else if (cameraMotion === 'orbit_360') {
    // Elliptical pan
    offsetX = Math.cos(progress * Math.PI * 2) * (w * 0.05);
    offsetY = Math.sin(progress * Math.PI * 2) * (h * 0.02);
    scale = 1.08 + Math.sin(progress * Math.PI * 2) * 0.04;
  } else if (cameraMotion === 'drone_fpv') {
    // Dynamic bank and pitch
    offsetX = Math.sin(progress * Math.PI * 2) * (w * 0.08);
    offsetY = Math.cos(progress * Math.PI) * (h * 0.04);
    rotation = Math.sin(progress * Math.PI * 2) * 0.04; // slight tilt
    scale = 1.05 + progress * 0.1;
  } else if (cameraMotion === 'crane_pedestal') {
    // Vertical ascension
    offsetY = (0.5 - progress) * (h * 0.12);
    scale = 1.04;
  } else if (cameraMotion === 'pan_tilt') {
    // Horizontal sweep
    offsetX = (0.5 - progress) * (w * 0.12);
    offsetY = Math.sin(progress * Math.PI) * (h * 0.03);
    scale = 1.05;
  } else {
    // Subtle organic camera breathing
    scale = 1.02 + Math.sin(progress * Math.PI * 2) * 0.01;
    offsetY = Math.cos(progress * Math.PI * 2) * 3;
  }

  ctx.translate(w / 2, h / 2);
  ctx.scale(scale, scale);
  ctx.rotate(rotation);
  ctx.translate(-w / 2 + offsetX, -h / 2 + offsetY);

  // 1. Draw Base Plate (If image provided, or deep atmospheric background)
  if (baseImage && baseImage.complete && baseImage.naturalWidth > 0) {
    // Maintain cover aspect ratio
    const imgRatio = baseImage.naturalWidth / baseImage.naturalHeight;
    const canvasRatio = w / h;
    let dw = w;
    let dh = h;
    let dx = 0;
    let dy = 0;

    if (canvasRatio > imgRatio) {
      dh = w / imgRatio;
      dy = (h - dh) / 2;
    } else {
      dw = h * imgRatio;
      dx = (w - dw) / 2;
    }

    ctx.drawImage(baseImage, dx, dy, dw, dh);
  } else {
    // Procedural cinematic background
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, w * 0.1, w / 2, h / 2, w * 0.8);
    if (style === 'cyberpunk') {
      bgGrad.addColorStop(0, '#1a0b2e');
      bgGrad.addColorStop(0.5, '#0d1326');
      bgGrad.addColorStop(1, '#05070f');
    } else if (style === 'sci_fi_space') {
      bgGrad.addColorStop(0, '#2e1065');
      bgGrad.addColorStop(0.4, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
    } else if (style === 'film_noir') {
      bgGrad.addColorStop(0, '#262626');
      bgGrad.addColorStop(0.6, '#171717');
      bgGrad.addColorStop(1, '#0a0a0a');
    } else {
      bgGrad.addColorStop(0, '#312e81');
      bgGrad.addColorStop(0.6, '#1e1b4b');
      bgGrad.addColorStop(1, '#030712');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);
  }

  // 2. Dynamic Atmosphere / Volumetric Layers
  if (style === 'cyberpunk') {
    // Rain streaks and neon light wash
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.35)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 45; i++) {
      const rx = (i * 47 + time * 320) % w;
      const ry = (i * 31 + time * 850) % h;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - 8, ry + 24);
      ctx.stroke();
    }

    // Moving neon anamorphic streak
    const flareX = ((time * 70) % (w * 1.4)) - w * 0.2;
    const flareGrad = ctx.createLinearGradient(flareX - 120, 0, flareX + 120, 0);
    flareGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
    flareGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.22)');
    flareGrad.addColorStop(1, 'rgba(255, 0, 127, 0)');
    ctx.fillStyle = flareGrad;
    ctx.fillRect(0, h * 0.42, w, 14);

  } else if (style === 'sci_fi_space') {
    // Starfield warp & nebula drift
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 60; i++) {
      const sx = (Math.sin(i * 99 + time * 0.2) * 0.5 + 0.5) * w;
      const sy = (Math.cos(i * 33 + time * 0.15) * 0.5 + 0.5) * h;
      const radius = ((i % 3) + 1) * (1.0 + Math.sin(time * 3 + i) * 0.3);
      ctx.beginPath();
      ctx.arc(sx, sy, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cosmic glow pulsing
    const glow = ctx.createRadialGradient(w * 0.7, h * 0.3, 10, w * 0.7, h * 0.3, w * 0.45);
    glow.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
    glow.addColorStop(0.5, 'rgba(59, 130, 246, 0.12)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

  } else if (style === 'film_noir') {
    // Atmospheric fog drift & venetian light rays
    const fogGrad = ctx.createLinearGradient(0, 0, w, h);
    fogGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    fogGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
    fogGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, 0, w, h);

  } else {
    // Golden hour sun flare & dust motes
    const sunX = w * 0.85;
    const sunY = h * 0.25;
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, w * 0.6);
    sunGrad.addColorStop(0, 'rgba(251, 191, 36, 0.35)');
    sunGrad.addColorStop(0.4, 'rgba(245, 158, 11, 0.12)');
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, w, h);
  }

  // 3. Cinematic Vignette & Color Grade Overlay
  const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.35, w / 2, h / 2, w * 0.75);
  vignette.addColorStop(0, 'transparent');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  // Subtle 35mm Film Grain
  const grainAlpha = style === 'film_noir' || style === 'vintage_35mm' ? 0.08 : 0.035;
  ctx.fillStyle = `rgba(255, 255, 255, ${grainAlpha})`;
  for (let g = 0; g < 120; g++) {
    const gx = Math.random() * w;
    const gy = Math.random() * h;
    ctx.fillRect(gx, gy, 1.5, 1.5);
  }

  ctx.restore();
}

/**
 * Record a cinematic video sequence into a high-quality video blob using Canvas captureStream & MediaRecorder.
 */
export async function recordCinematicVideoBlob({
  durationSec,
  fps,
  style,
  cameraMotion,
  baseImage,
  aspectRatio,
  onProgress,
}: {
  durationSec: number;
  fps: number;
  style: CinematicStyle;
  cameraMotion: CameraMotion;
  baseImage?: HTMLImageElement | null;
  aspectRatio: AspectRatio;
  onProgress?: (pct: number) => void;
}): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    let width = 1280;
    let height = 720;

    if (aspectRatio === '9:16') {
      width = 720;
      height = 1280;
    } else if (aspectRatio === '1:1') {
      width = 960;
      height = 960;
    } else if (aspectRatio === '2.39:1') {
      width = 1440;
      height = 602;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject(new Error('Canvas context unavailable'));

    const stream = canvas.captureStream(fps);
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    let mediaRecorder: MediaRecorder;
    try {
      mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 6000000, // 6 Mbps
      });
    } catch {
      mediaRecorder = new MediaRecorder(stream);
    }

    const recordedChunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
      resolve(videoBlob);
    };

    mediaRecorder.start(200);

    const totalFrames = durationSec * fps;
    let currentFrame = 0;
    const intervalMs = 1000 / fps;

    const renderLoop = setInterval(() => {
      currentFrame++;
      const timeSec = currentFrame / fps;

      drawCinematicFrame({
        canvas,
        ctx,
        time: timeSec,
        duration: durationSec,
        style,
        cameraMotion,
        baseImage,
        aspectRatio,
      });

      if (onProgress) {
        onProgress(Math.min(100, Math.round((currentFrame / totalFrames) * 100)));
      }

      if (currentFrame >= totalFrames) {
        clearInterval(renderLoop);
        setTimeout(() => {
          mediaRecorder.stop();
        }, 150);
      }
    }, intervalMs);
  });
}
