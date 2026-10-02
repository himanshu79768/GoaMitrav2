import { useEffect, useRef, useState, useCallback } from 'react';

interface UseGAIWakeWordOptions {
  onWake: (detectedPrompt?: string) => void;
  isPaused?: boolean;
}

export function useGAIWakeWord({ onWake, isPaused = false }: UseGAIWakeWordOptions) {
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [isWakeListening, setIsWakeListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const onWakeRef = useRef(onWake);
  onWakeRef.current = onWake;

  // 1. Ask Microphone Permission on App Start
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          // Immediately stop tracks so the browser mic indicator turns off until speech is needed
          stream.getTracks().forEach((track) => track.stop());
          setHasMicPermission(true);
        })
        .catch((err) => {
          console.warn('Microphone permission request result:', err?.name);
          setHasMicPermission(false);
        });
    }
  }, []);

  // 2. Initialize Continuous Wake-Word Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not available in this browser');
      return;
    }

    let recognition: any;
    try {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';
    } catch (e) {
      console.warn('Failed to construct SpeechRecognition for wake-word', e);
      return;
    }

    recognitionRef.current = recognition;

    const startListening = () => {
      if (isPausedRef.current) return;
      try {
        recognition.start();
        setIsWakeListening(true);
      } catch (err) {
        // Recognition might already be running
      }
    };

    const stopListening = () => {
      try {
        recognition.stop();
        setIsWakeListening(false);
      } catch {}
    };

    recognition.onresult = (event: any) => {
      if (isPausedRef.current) return;

      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0]?.transcript?.trim().toLowerCase() || '';

      // Check for wake words: "hey gai", "hey gai!", "hey guy", "hey goa", "ok gai", "gai"
      const wakeMatch = transcript.match(/(?:hey|hello|hi|ok|okay)?\s*(?:gai|guy|g\s*a\s*i|goa|guyz)\b/i);

      if (wakeMatch) {
        // Extract any prompt spoken immediately after wake word
        const afterWake = transcript.slice(wakeMatch.index! + wakeMatch[0].length).trim();
        stopListening();
        onWakeRef.current(afterWake || undefined);
      }
    };

    recognition.onerror = (e: any) => {
      if (e.error === 'not-allowed') {
        setIsWakeListening(false);
        return;
      }
      // Silently ignore other errors like 'no-speech' or 'aborted'
    };

    recognition.onend = () => {
      setIsWakeListening(false);
      // Auto-restart continuous background wake-word listening if not paused
      if (!isPausedRef.current) {
        setTimeout(() => {
          if (!isPausedRef.current) {
            startListening();
          }
        }, 600);
      }
    };

    if (!isPaused) {
      startListening();
    }

    return () => {
      try {
        recognition.stop();
      } catch {}
    };
  }, []);

  // 3. React to isPaused changes (pause when bottomsheet/chat is actively capturing speech)
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isPaused) {
      try {
        recognitionRef.current.stop();
        setIsWakeListening(false);
      } catch {}
    } else {
      setTimeout(() => {
        if (!isPausedRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
            setIsWakeListening(true);
          } catch {}
        }
      }, 500);
    }
  }, [isPaused]);

  const manuallyTriggerWake = useCallback((extraPrompt?: string) => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    onWake(extraPrompt);
  }, [onWake]);

  return {
    hasMicPermission,
    isWakeListening,
    manuallyTriggerWake,
  };
}
