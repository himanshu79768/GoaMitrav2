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

  const recognitionRef = useRef<any>(null);
  const isRecognizingRef = useRef(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const monitorIntervalRef = useRef<any>(null);
  const lastVoiceTimeRef = useRef(0);

  // Initialize SpeechRecognition once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    let recognition: any;
    try {
      recognition = new SpeechRecognition();
      recognition.continuous = false; // Single utterance per detection to prevent infinite timeout loops
      recognition.interimResults = true;
      recognition.lang = 'en-IN';
    } catch (e) {
      return;
    }

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      if (!isHomeScreenRef.current) return;

      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0]?.transcript?.trim().toLowerCase() || '';

      // Match wake phrases: "hey gai", "hey gai!", "hey guy", "hey goa", "ok gai", "gai"
      const wakeMatch = transcript.match(/(?:hey|hello|hi|ok|okay)?\s*(?:gai|guy|g\s*a\s*i|goa|guyz)\b/i);

      if (wakeMatch) {
        const afterWake = transcript.slice(wakeMatch.index! + wakeMatch[0].length).trim();
        try {
          recognition.stop();
        } catch {}
        isRecognizingRef.current = false;
        setIsListening(false);
        onWakeRef.current(afterWake || undefined);
      }
    };

    recognition.onerror = () => {
      isRecognizingRef.current = false;
      setIsListening(false);
      // NOTE: DO NOT auto-restart here! We wait for actual voice activity from the silent AudioContext
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setIsListening(false);
      // NOTE: DO NOT auto-restart here! This prevents the active/deactive cycling loop
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {}
    };
  }, []);

  // Manage silent audio stream & voice activity detection strictly on Homescreen
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Clean up when NOT on homescreen
    const cleanupAudio = () => {
      if (monitorIntervalRef.current) {
        clearInterval(monitorIntervalRef.current);
        monitorIntervalRef.current = null;
      }

      if (recognitionRef.current && isRecognizingRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        isRecognizingRef.current = false;
        setIsListening(false);
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
    };

    // If NOT on homescreen, shut down microphone completely
    if (!isHomeScreen) {
      cleanupAudio();
      return;
    }

    // ON HOMESCREEN: Open single quiet stream and listen silently
    let isCancelled = false;

    const startSilentHomescreenListener = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

      try {
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

        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        const audioCtx = new AudioContextClass();
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        audioContextRef.current = audioCtx;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.4;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        // Periodically monitor volume: Only activate speech recognition when someone actually speaks
        monitorIntervalRef.current = setInterval(() => {
          if (!isHomeScreenRef.current || !analyserRef.current) return;

          analyserRef.current.getByteFrequencyData(dataArray);

          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avgVolume = sum / dataArray.length;

          const now = Date.now();

          // Threshold for actual human speech above ambient silence (typically 18-24)
          if (avgVolume > 18) {
            lastVoiceTimeRef.current = now;

            // Start recognition silently if not already running
            if (!isRecognizingRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
                isRecognizingRef.current = true;
                setIsListening(true);
              } catch (e) {
                // Already started or busy
              }
            }
          } else {
            // If silence has persisted for > 2.5 seconds and recognition is running, let it rest
            if (isRecognizingRef.current && now - lastVoiceTimeRef.current > 2500) {
              if (recognitionRef.current) {
                try {
                  recognitionRef.current.stop();
                } catch {}
              }
              isRecognizingRef.current = false;
              setIsListening(false);
            }
          }
        }, 120);
      } catch (err: any) {
        console.warn('Silent microphone listener notice:', err?.name);
        setHasMicPermission(false);
      }
    };

    startSilentHomescreenListener();

    return () => {
      isCancelled = true;
      cleanupAudio();
    };
  }, [isHomeScreen]);

  const manuallyTriggerWake = useCallback((extraPrompt?: string) => {
    if (recognitionRef.current && isRecognizingRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    isRecognizingRef.current = false;
    setIsListening(false);
    onWakeRef.current(extraPrompt);
  }, []);

  return {
    hasMicPermission,
    isListening,
    manuallyTriggerWake,
  };
}
