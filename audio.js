/**
 * Ambient Web Audio Synthesizer Engine
 * Generates soft lo-fi / space coding pads and chimes with zero external MP3 dependencies.
 */
(function () {
  'use strict';

  class AmbientSynthEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.isPlaying = false;
      this.stepTimer = null;
      this.stepIndex = 0;
      this.currentTrack = null;
      this.listeners = new Set();
    }

    _ensureContext() {
      if (this.ctx) return true;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.0001;
      this.masterGain.connect(this.ctx.destination);
      return true;
    }

    onStateChange(cb) {
      this.listeners.add(cb);
    }

    _emit() {
      this.listeners.forEach((cb) => {
        try {
          cb({ isPlaying: this.isPlaying, track: this.currentTrack });
        } catch (err) {
          /* ignore listener errors */
        }
      });
    }

    setTrack(track) {
      this.currentTrack = track;
      this.stepIndex = 0;
      if (this.isPlaying) {
        this._restartLoop();
      }
      this._emit();
    }

    play(track) {
      if (track) this.currentTrack = track;
      if (!this.currentTrack && window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.playlist.length) {
        this.currentTrack = window.PORTFOLIO_DATA.playlist[0];
      }
      if (!this._ensureContext()) {
        this.isPlaying = true;
        document.body.classList.add('audio-reactive');
        this._emit();
        return;
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(0.14, now, 0.25);

      this.isPlaying = true;
      document.body.classList.add('audio-reactive');
      this._restartLoop();
      this._emit();
    }

    pause() {
      this.isPlaying = false;
      document.body.classList.remove('audio-reactive');
      if (this.stepTimer) {
        clearInterval(this.stepTimer);
        this.stepTimer = null;
      }
      if (this.ctx && this.masterGain) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setTargetAtTime(0.0001, now, 0.15);
      }
      this._emit();
    }

    toggle(track) {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play(track);
      }
      return this.isPlaying;
    }

    playUiTick(freq = 640) {
      if (!this.isPlaying || !this._ensureContext()) return;
      if (this.ctx.state === 'suspended') return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.08);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.12);
    }

    _restartLoop() {
      if (this.stepTimer) {
        clearInterval(this.stepTimer);
        this.stepTimer = null;
      }
      if (!this.currentTrack || !this.ctx) return;

      this._playStep();
      this.stepTimer = setInterval(() => {
        if (this.isPlaying) this._playStep();
      }, this.currentTrack.tempoMs || 500);
    }

    _playStep() {
      if (!this.ctx || !this.currentTrack) return;
      const now = this.ctx.currentTime;
      const chord = this.currentTrack.chord || [220, 261.63, 329.63, 392];
      const idx = this.stepIndex % chord.length;

      // Soft melodic pluck on every step
      this._triggerVoice(chord[idx] * (this.stepIndex % 8 === 7 ? 2 : 1), 'triangle', 0.09, 0.65, 950);

      // Warm sub pad at the start of every 4-step bar
      if (idx === 0) {
        const root = (this.currentTrack.baseFreq || 196) * 0.5;
        this._triggerVoice(root, 'sine', 0.14, 1.9, 420);
        this._triggerVoice(chord[2] || 329.63, 'sine', 0.05, 1.6, 700);
      }

      this.stepIndex += 1;
    }

    _triggerVoice(freq, type, peakGain, duration, cutoff) {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(cutoff, now);
      filter.Q.value = 1.2;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(peakGain, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.04);
    }
  }

  window.PortfolioAudio = new AmbientSynthEngine();
})();
