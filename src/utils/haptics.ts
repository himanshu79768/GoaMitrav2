/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * iOS-grade Tactile Haptic Feedback Engine
 *
 * Implements a hybrid dual-engine for mobile & iOS:
 * 1. Web Vibration API (navigator.vibrate) for native vibration on supported browsers/PWAs
 * 2. Ultra-low-latency Web Audio Synthesizer producing damped micro-acoustic/taptic impulses
 *    (mimics native iOS Taptic Engine click / Apple Pay / camera shutter feel on iPhone speakers & chassis)
 * 3. Global pointerdown event delegation for instant 0ms touch response
 */

export type HapticImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
export type HapticNotificationType = 'success' | 'warning' | 'error';

class HapticEngine {
  private audioCtx: AudioContext | null = null;
  private isAudioUnlocked = false;
  private isEnabled = true;
  private lastHapticTime = 0;
  private soundEnabled = true;

  constructor() {
    // Load persisted user preference if available
    try {
      const stored = localStorage.getItem('goamitra_haptics_enabled');
      if (stored !== null) {
        this.isEnabled = stored === 'true';
      }
      const soundStored = localStorage.getItem('goamitra_haptic_sound_enabled');
      if (soundStored !== null) {
        this.soundEnabled = soundStored === 'true';
      }
    } catch {
      // Ignore storage errors
    }

    // Auto-unlock audio on first touch/interaction
    this.setupUnlockListeners();
  }

  private setupUnlockListeners() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      this.initAudioContext();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('click', unlock);
    };

    window.addEventListener('pointerdown', unlock, { passive: true, once: false });
    window.addEventListener('touchstart', unlock, { passive: true, once: false });
    window.addEventListener('click', unlock, { passive: true, once: false });
  }

  private initAudioContext() {
    if (this.audioCtx && this.audioCtx.state === 'running') {
      this.isAudioUnlocked = true;
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        if (!this.audioCtx) {
          this.audioCtx = new AudioContextClass();
        }
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().then(() => {
            this.isAudioUnlocked = true;
          }).catch(() => {});
        } else {
          this.isAudioUnlocked = true;
        }
      }
    } catch {
      // AudioContext unavailable
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    try {
      localStorage.setItem('goamitra_haptics_enabled', String(enabled));
    } catch {}
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    try {
      localStorage.setItem('goamitra_haptic_sound_enabled', String(enabled));
    } catch {}
  }

  public getIsSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  /**
   * Generates a high-precision micro-transient wave creating an iOS Taptic click sensation
   */
  private playSyntheticImpulse(
    frequency: number,
    durationMs: number,
    peakGain: number,
    type: OscillatorType = 'sine'
  ) {
    if (!this.isEnabled || !this.soundEnabled) return;
    this.initAudioContext();

    if (!this.audioCtx || this.audioCtx.state !== 'running') return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Bandpass shaping for physical mechanical enclosure "pop/click"
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(frequency, now);
      filter.Q.setValueAtTime(3.2, now);

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, now);
      // Exponential pitch drop produces a sharp tactile percussive transient
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, frequency * 0.35), now + (durationMs / 1000));

      gain.gain.setValueAtTime(0.0001, now);
      // Fast attack (<2ms)
      gain.gain.linearRampToValueAtTime(peakGain, now + 0.002);
      // Fast exponential decay
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (durationMs / 1000));

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + (durationMs / 1000) + 0.01);
    } catch {
      // Fail silently
    }
  }

  /**
   * Vibrates the physical hardware on supported devices
   */
  private vibrateHardware(pattern: number | number[]) {
    if (!this.isEnabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Fallback
      }
    }
  }

  /**
   * Debounce guard to prevent audio clipping during ultra-rapid gestures
   */
  private canTrigger(): boolean {
    if (!this.isEnabled) return false;
    const now = performance.now();
    if (now - this.lastHapticTime < 35) {
      return false;
    }
    this.lastHapticTime = now;
    return true;
  }

  /**
   * Standard iOS Impact Feedback Generator
   */
  public impact(style: HapticImpactStyle = 'light') {
    if (!this.canTrigger()) return;

    switch (style) {
      case 'light':
        this.vibrateHardware(10);
        this.playSyntheticImpulse(180, 14, 0.09, 'sine');
        break;

      case 'medium':
        this.vibrateHardware(18);
        this.playSyntheticImpulse(150, 20, 0.14, 'triangle');
        break;

      case 'heavy':
        this.vibrateHardware(32);
        this.playSyntheticImpulse(120, 28, 0.20, 'triangle');
        break;

      case 'rigid':
        this.vibrateHardware(12);
        this.playSyntheticImpulse(240, 10, 0.12, 'square');
        break;

      case 'soft':
        this.vibrateHardware(14);
        this.playSyntheticImpulse(130, 24, 0.08, 'sine');
        break;
    }
  }

  /**
   * iOS Selection Change Feedback (Wheel picker, radio selection, tabs, checkboxes)
   */
  public selection() {
    if (!this.canTrigger()) return;
    this.vibrateHardware(6);
    this.playSyntheticImpulse(210, 10, 0.07, 'sine');
  }

  /**
   * iOS Navigation & Screen Transition Feedback
   */
  public transition() {
    if (!this.canTrigger()) return;
    this.vibrateHardware(14);
    this.playSyntheticImpulse(160, 22, 0.11, 'sine');
  }

  /**
   * iOS Notification Feedback Generator
   */
  public notification(type: HapticNotificationType = 'success') {
    if (!this.isEnabled) return;
    this.lastHapticTime = performance.now();

    switch (type) {
      case 'success':
        this.vibrateHardware([12, 45, 18]);
        this.playSyntheticImpulse(180, 14, 0.10, 'sine');
        setTimeout(() => {
          this.playSyntheticImpulse(240, 22, 0.14, 'sine');
        }, 60);
        break;

      case 'warning':
        this.vibrateHardware([20, 50, 20]);
        this.playSyntheticImpulse(140, 24, 0.14, 'triangle');
        setTimeout(() => {
          this.playSyntheticImpulse(120, 24, 0.14, 'triangle');
        }, 70);
        break;

      case 'error':
        this.vibrateHardware([25, 40, 25, 40, 35]);
        this.playSyntheticImpulse(110, 30, 0.18, 'sawtooth');
        setTimeout(() => {
          this.playSyntheticImpulse(90, 30, 0.18, 'sawtooth');
        }, 80);
        setTimeout(() => {
          this.playSyntheticImpulse(80, 40, 0.22, 'sawtooth');
        }, 160);
        break;
    }
  }
}

export const haptics = new HapticEngine();

/**
 * Initializes global event listener for instant tactile feedback across the whole DOM
 */
export function initGlobalHaptics() {
  if (typeof window === 'undefined') return;

  const handlePointerDown = (e: PointerEvent) => {
    // Check if target or any parent has tactile intent
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const interactiveEl = target.closest<HTMLElement>(
      'button, [role="button"], a, input[type="radio"], input[type="checkbox"], [data-haptic], select'
    );

    if (!interactiveEl) return;

    // Check if disabled
    if (
      interactiveEl.hasAttribute('disabled') ||
      interactiveEl.getAttribute('aria-disabled') === 'true' ||
      interactiveEl.classList.contains('cursor-not-allowed')
    ) {
      return;
    }

    const hapticType = interactiveEl.getAttribute('data-haptic');

    if (hapticType === 'none') {
      return;
    }

    if (hapticType === 'heavy') {
      haptics.impact('heavy');
    } else if (hapticType === 'medium') {
      haptics.impact('medium');
    } else if (hapticType === 'selection') {
      haptics.selection();
    } else if (hapticType === 'success') {
      haptics.notification('success');
    } else if (hapticType === 'soft') {
      haptics.impact('soft');
    } else if (hapticType === 'rigid') {
      haptics.impact('rigid');
    } else {
      // Default for buttons & interactive elements
      if (
        interactiveEl.tagName === 'INPUT' ||
        interactiveEl.getAttribute('role') === 'tab' ||
        interactiveEl.classList.contains('pill-filter')
      ) {
        haptics.selection();
      } else {
        haptics.impact('light');
      }
    }
  };

  window.addEventListener('pointerdown', handlePointerDown, { passive: true, capture: true });
}
