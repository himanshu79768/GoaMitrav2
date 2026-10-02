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
  const isRunningRef = useRef(false);
  const restartTimerRef = useRef<any>(null);
  const lastWakeTimeRef = useRef(0);

  // Initialize SpeechRecognition instance and continuous listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API is not supported in this browser.');
      return;
    }

    let recognition: any;
    try {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';
      recognition.maxAlternatives = 3;
    } catch (err) {
      console.warn('Could not initialize SpeechRecognition:', err);
      return;
    }

    recognitionRef.current = recognition;

    const safeStart = () => {
      if (!isHomeScreenRef.current || isRunningRef.current || !recognitionRef.current) {
        return;
      }
      try {
        recognitionRef.current.start();
        isRunningRef.current = true;
        setIsListening(true);
        setHasMicPermission(true);
      } catch (err: any) {
        // Recognition might already be starting or active
        if (err?.name === 'InvalidStateError') {
          isRunningRef.current = true;
          setIsListening(true);
        }
      }
    };

    const safeStop = () => {
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      isRunningRef.current = false;
      setIsListening(false);
    };

    recognition.onstart = () => {
      isRunningRef.current = true;
      setIsListening(true);
      setHasMicPermission(true);
    };

    recognition.onresult = (event: any) => {
      if (!isHomeScreenRef.current) return;

      const now = Date.now();
      if (now - lastWakeTimeRef.current < 2000) return; // Prevent double wake within 2s

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        for (let a = 0; a < result.length; a++) {
          const transcript = (result[a]?.transcript || '').trim().toLowerCase();

          // Regex matching: "hey gai", "hey guy", "hey goa", "ok gai", "hello gai", "gai", "hi gai", etc.
          const wakeMatch = transcript.match(
            /(?:hey|hi|hello|ok|okay|yo|listen|namaste)?\s*(?:gai|guy|gae|goa|guide|guyz|g\s*a\s*i|geye|gaay|gaai)\b/i
          );

          if (wakeMatch) {
            lastWakeTimeRef.current = now;

            // Extract any follow-up query spoken directly after the wake phrase
            const afterWake = transcript
              .slice(wakeMatch.index! + wakeMatch[0].length)
              .replace(/^[,\s.?!]+/, '')
              .trim();

            safeStop();
            onWakeRef.current(afterWake || undefined);
            return;
          }
        }
      }
    };

    recognition.onerror = (e: any) => {
      if (e.error === 'not-allowed') {
        setHasMicPermission(false);
        isRunningRef.current = false;
        setIsListening(false);
        return;
      }
      // For 'no-speech' or 'aborted' or 'network', onend will handle smooth restart if still on homescreen
      isRunningRef.current = false;
    };

    recognition.onend = () => {
      isRunningRef.current = false;
      setIsListening(false);

      // If still on homescreen, gracefully restart continuous listening after slight delay
      if (isHomeScreenRef.current) {
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(() => {
          if (isHomeScreenRef.current) {
            safeStart();
          }
        }, 400);
      }
    };

    if (isHomeScreen) {
      safeStart();
    }

    return () => {
      safeStop();
    };
  }, []);

  // React to screen changes (Start when entering homescreen, stop when leaving)
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }

    if (isHomeScreen) {
      // Delay start slightly to allow screen transition animations to settle smoothly
      restartTimerRef.current = setTimeout(() => {
        if (isHomeScreenRef.current && !isRunningRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
            isRunningRef.current = true;
            setIsListening(true);
          } catch (err: any) {
            if (err?.name === 'InvalidStateError') {
              isRunningRef.current = true;
              setIsListening(true);
            }
          }
        }
      }, 350);
    } else {
      // Exiting homescreen -> Stop immediately
      try {
        recognitionRef.current.stop();
      } catch {}
      isRunningRef.current = false;
      setIsListening(false);
    }
  }, [isHomeScreen]);

  const manuallyTriggerWake = useCallback((extraPrompt?: string) => {
    lastWakeTimeRef.current = Date.now();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    isRunningRef.current = false;
    setIsListening(false);
    onWakeRef.current(extraPrompt);
  }, []);

  return {
    hasMicPermission,
    isListening,
    manuallyTriggerWake,
  };
}
