/**
 * Synthesizes ambient cinematic soundscapes using the Web Audio API.
 * Provides authentic Hollywood-style atmospheric scores matching each genre.
 */

let audioCtx: AudioContext | null = null;
let currentNodes: { stop: () => void } | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playCinematicSoundtrack(style: string): { stop: () => void } {
  try {
    stopCinematicSoundtrack();
    const ctx = getAudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 1.2);
    masterGain.connect(ctx.destination);

    const activeOscillators: OscillatorNode[] = [];
    const activeFilters: BiquadFilterNode[] = [];

    if (style === 'cyberpunk') {
      // Dark synth bassline with dual detuned saw waves & lowpass cutoff sweep
      const freqs = [65.41, 65.8, 130.81]; // C2 detuned & octave
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 2.5);

        const gain = ctx.createGain();
        gain.gain.value = 0.25 / freqs.length;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start();
        activeOscillators.push(osc);
        activeFilters.push(filter);
      });

      // Glitch LFO pulses
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(4, ctx.currentTime); // 4Hz pulse
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(200, ctx.currentTime);
      lfo.connect(lfoGain);
      activeFilters.forEach(f => lfoGain.connect(f.frequency));
      lfo.start();
      activeOscillators.push(lfo);

    } else if (style === 'hollywood_blockbuster') {
      // Low brass orchestral drone + swelling sub bass
      const root = 55; // A1
      [root, root * 1.5, root * 2].forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 2.0);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        activeOscillators.push(osc);
      });

    } else if (style === 'sci_fi_space') {
      // Ethereal cosmic shimmer with resonant bandpass
      [220, 277.18, 329.63, 440].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + (i * 0.7), ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq * 1.5, ctx.currentTime);
        filter.Q.value = 4.0;

        const gain = ctx.createGain();
        gain.gain.value = 0.15;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        osc.start();
        activeOscillators.push(osc);
      });

    } else if (style === 'film_noir') {
      // Moody warm jazz undertone with low rumble
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(73.42, ctx.currentTime); // D2

      const gain = ctx.createGain();
      gain.gain.value = 0.25;
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      activeOscillators.push(osc);

      // Muted harmonic fifth
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110, ctx.currentTime);
      const gain2 = ctx.createGain();
      gain2.gain.value = 0.12;
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start();
      activeOscillators.push(osc2);

    } else {
      // Natural ambient drone
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130.81, ctx.currentTime);
      const gain = ctx.createGain();
      gain.gain.value = 0.2;
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      activeOscillators.push(osc);
    }

    const controller = {
      stop: () => {
        try {
          masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
          setTimeout(() => {
            activeOscillators.forEach(o => {
              try { o.stop(); o.disconnect(); } catch {}
            });
            masterGain.disconnect();
          }, 850);
        } catch {}
      },
    };

    currentNodes = controller;
    return controller;
  } catch (err) {
    console.warn('AudioContext playback error:', err);
    return { stop: () => {} };
  }
}

export function stopCinematicSoundtrack() {
  if (currentNodes) {
    currentNodes.stop();
    currentNodes = null;
  }
}
