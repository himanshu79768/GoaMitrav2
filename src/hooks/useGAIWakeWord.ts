import { useEffect, useRef, useState, useCallback } from 'react';

interface UseGAIWakeWordOptions {
  onWake: (detectedPrompt?: string) => void;
  isHomeScreen: boolean;
}

export function useGAIWakeWord({ onWake, isHomeScreen }: UseGAIWakeWordOptions) {
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [isListening, setIsListening] = useState(false);

  const onWakeRef = useRef(onWake);
  onWakeRef.current = onWake;

  const isHomeScreenRef = useRef(isHomeScreen);
  isHomeScreenRef.current = isHomeScreen;

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastWakeTimeRef = useRef(0);

  // Manage silent, pure Web Audio wake-word acoustic cadence detection strictly on Homescreen
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cleanupAudio = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {}
        });
        mediaStreamRef.current = null;
      }

      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch {}
        audioContextRef.current = null;
      }

      setIsListening(false);
    };

    // If NOT on homescreen, shut down microphone completely (zero background listening)
    if (!isHomeScreen) {
      cleanupAudio();
      return;
    }

    let isCancelled = false;

    const startSilentAcousticDetector = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

      try {
        // Request clean media stream with built-in browser hardware acoustic echo cancellation & noise suppression
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        if (isCancelled || !isHomeScreenRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        mediaStreamRef.current = stream;
        setHasMicPermission(true);
        setIsListening(true);

        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        const audioCtx = new AudioContextClass();
        if (audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }
        audioContextRef.current = audioCtx;

        // Bandpass Filtering: Human voice fundamental and vowel formant range (130Hz - 3400Hz)
        // Eliminates low-frequency AC/fan rumbles and high-frequency clicks/squeaks
        const highPass = audioCtx.createBiquadFilter();
        highPass.type = 'highpass';
        highPass.frequency.value = 130;

        const lowPass = audioCtx.createBiquadFilter();
        lowPass.type = 'lowpass';
        lowPass.frequency.value = 3400;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(highPass);
        highPass.connect(lowPass);

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.25;
        lowPass.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        // Acoustic Cadence State Machine for "Hey GAI"
        // Pattern: [Syllable 1: "Hey" (120-400ms)] -> [Dip/Valley (30-220ms)] -> [Syllable 2: "GAI" (140-480ms)]
        let state: 'IDLE' | 'SYLLABLE_1' | 'VALLEY' | 'SYLLABLE_2' = 'IDLE';
        let syllable1Start = 0;
        let valleyStart = 0;
        let syllable2Start = 0;
        let noiseFloor = 10;

        const processAudioFrame = () => {
          if (isCancelled || !isHomeScreenRef.current || !analyser) return;

          analyser.getByteFrequencyData(dataArray);

          // Calculate energy in speech frequency bins (approx 150Hz - 3000Hz)
          let speechSum = 0;
          let count = 0;
          const maxBin = Math.min(dataArray.length, 36); // Focus on human speech spectrum
          for (let i = 2; i < maxBin; i++) {
            speechSum += dataArray[i];
            count++;
          }
          const currentEnergy = count > 0 ? speechSum / count : 0;

          // Adaptive dynamic noise floor tracking (adapts to ambient room sound)
          noiseFloor = noiseFloor * 0.96 + currentEnergy * 0.04;

          // Speech threshold: Must be distinctly above the moving noise floor
          const speechThreshold = Math.max(14, noiseFloor * 1.85 + 6);
          const isSpeech = currentEnergy > speechThreshold;
          const now = Date.now();

          // Prevent double wakes within 2.5 seconds
          if (now - lastWakeTimeRef.current > 2500) {
            switch (state) {
              case 'IDLE':
                if (isSpeech) {
                  state = 'SYLLABLE_1';
                  syllable1Start = now;
                }
                break;

              case 'SYLLABLE_1':
                if (isSpeech) {
                  // If continuous sound is too long (> 420ms), it's continuous background noise or long sentence
                  if (now - syllable1Start > 420) {
                    state = 'IDLE';
                  }
                } else {
                  // Syllable 1 ended
                  const syl1Duration = now - syllable1Start;
                  if (syl1Duration >= 100 && syl1Duration <= 400) {
                    state = 'VALLEY';
                    valleyStart = now;
                  } else {
                    state = 'IDLE';
                  }
                }
                break;

              case 'VALLEY':
                if (isSpeech) {
                  const valleyDuration = now - valleyStart;
                  if (valleyDuration >= 25 && valleyDuration <= 230) {
                    state = 'SYLLABLE_2';
                    syllable2Start = now;
                  } else {
                    state = 'IDLE';
                  }
                } else {
                  // Valley gap too long (> 250ms), reset
                  if (now - valleyStart > 250) {
                    state = 'IDLE';
                  }
                }
                break;

              case 'SYLLABLE_2':
                if (isSpeech) {
                  if (now - syllable2Start > 520) {
                    state = 'IDLE';
                  }
                } else {
                  // Syllable 2 ended -> Check total phrase length for "Hey GAI"
                  const syl2Duration = now - syllable2Start;
                  const totalDuration = now - syllable1Start;

                  if (
                    syl2Duration >= 110 &&
                    syl2Duration <= 480 &&
                    totalDuration >= 340 &&
                    totalDuration <= 1150
                  ) {
                    // WAKE TRIGGERED!
                    lastWakeTimeRef.current = now;
                    state = 'IDLE';
                    onWakeRef.current(undefined);
                  } else {
                    state = 'IDLE';
                  }
                }
                break;
            }
          }

          animationFrameRef.current = requestAnimationFrame(processAudioFrame);
        };

        animationFrameRef.current = requestAnimationFrame(processAudioFrame);
      } catch (err: any) {
        console.warn('Acoustic wake detector notice:', err?.name);
        setHasMicPermission(false);
      }
    };

    startSilentAcousticDetector();

    return () => {
      isCancelled = true;
      cleanupAudio();
    };
  }, [isHomeScreen]);

  const manuallyTriggerWake = useCallback((extraPrompt?: string) => {
    lastWakeTimeRef.current = Date.now();
    onWakeRef.current(extraPrompt);
  }, []);

  return {
    hasMicPermission,
    isListening,
    manuallyTriggerWake,
  };
}
