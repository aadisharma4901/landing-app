'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export type AssistantMessage = {
  type: 'text' | 'navigate';
  message: string;
  page?: string;
  filter?: string;
  sender: 'user' | 'assistant';
};

const WAKE_WORD = 'hey bro';
const GREETING = "Hey! I'm Bro. What can I help you with?";

let GLOBAL_RECOGNITION: any = null;
let GLOBAL_IS_RUNNING = false;
let GLOBAL_INITIALIZED = false;

const FALLBACK_RESPONSES: string[] = [
  "Sorry, I couldn't reach the AI right now. Try again in a moment.",
  "Having trouble connecting. Please try again.",
  "AI service is unavailable. Please try again later."
];

export function useVoiceAssistant() {
  const [isListening, setIsListening] = useState(GLOBAL_IS_RUNNING);
  const [messages, setMessages] = useState<AssistantMessage[]>([{ type: 'text', message: GREETING, sender: 'assistant' }]);
  const [isOpen, setIsOpenState] = useState(false);
  const hasGreetedRef = useRef(false);
  const lastQueryRef = useRef<string>('');
  const lastQueryTimeRef = useRef<number>(0);
  const isSpeakingRef = useRef(false);
  const shouldRestartRef = useRef(true);
  const recognitionRef = useRef<any>(null);
  const utteranceIdRef = useRef(0);
  const processQueryRef = useRef<((query: string) => void) | null>(null);
  const QUERY_COOLDOWN_MS = 2000;

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined') return;
    if (!window.speechSynthesis) return;

    if (recognitionRef.current) {
      try {
        console.log("🛑 Stopping mic for AI speech");
        recognitionRef.current.stop();
      } catch {}
    }

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.05;
    u.pitch = 1.08;
    u.volume = 1;

    const currentId = ++utteranceIdRef.current;
    isSpeakingRef.current = true;

    u.onend = () => {
      console.log("🔊 AI finished speaking");
      isSpeakingRef.current = false;

      if (shouldRestartRef.current && recognitionRef.current) {
        setTimeout(() => {
          try {
            if (!GLOBAL_IS_RUNNING) {
              console.log("🎤 Restart after AI speech");
              recognitionRef.current.start();
            }
          } catch (e: any) {
            if (e.name !== "InvalidStateError") {
              console.log("Restart after speech error:", e);
            }
          }
        }, 300);
      }
    };

    u.onerror = () => {
      console.log("🔊 AI finished speaking (error)");
      isSpeakingRef.current = false;

      if (shouldRestartRef.current && recognitionRef.current) {
        setTimeout(() => {
          try {
            if (!GLOBAL_IS_RUNNING) {
              console.log(" Restart after AI speech");
              recognitionRef.current.start();
            }
          } catch (e: any) {
            if (e.name !== "InvalidStateError") {
              console.log("Restart after speech error:", e);
            }
          }
        }, 300);
      }
    };

    window.speechSynthesis.speak(u);
  }, []);

  const addMessage = useCallback((msg: AssistantMessage) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const greet = useCallback(() => {
    if (hasGreetedRef.current) return;
    hasGreetedRef.current = true;
    setIsOpenState(true);
    speak("Hey! I'm Bro. How can I help?");
  }, [speak]);

  const processQueryCallback = useCallback(async (query: string) => {
    console.log("🚀 Processing query:", query);

    const now = Date.now();
    const trimmedQuery = query.toLowerCase().trim();

    const prevQuery = lastQueryRef.current;
    const prevTime = lastQueryTimeRef.current;

    if (trimmedQuery === prevQuery && now - prevTime < QUERY_COOLDOWN_MS) {
      return;
    }

    lastQueryRef.current = trimmedQuery;
    lastQueryTimeRef.current = now;

    addMessage({ type: 'text', message: query, sender: 'user' });

   try {
     const response = await fetch('/api/chat', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ messages: [{ type: 'user', message: query }] })
     });

     const data = await response.json();

     if (data.message) {
       const responseText = data.message;

       if (responseText.startsWith('NAVIGATE|')) {
         const parts = responseText.split('|');
         const [, path, filter, message] = parts;

         addMessage({ type: 'text', message: message.trim(), sender: 'assistant' });
         speak(message.trim());

         setTimeout(() => {
           window.location.href = path + (filter && filter.trim() ? `?filter=${filter.trim()}` : '');
         }, 700);

         return;
       }

       addMessage({ type: 'text', message: responseText, sender: 'assistant' });
       speak(responseText);
     } else {
       const randomDefault = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
       addMessage({ type: 'text', message: randomDefault, sender: 'assistant' });
       speak(randomDefault);
     }
   } catch (error) {
     const randomDefault = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
     addMessage({ type: 'text', message: randomDefault, sender: 'assistant' });
     speak(randomDefault);
   }
 }, [addMessage, speak]);

  useEffect(() => {
    processQueryRef.current = processQueryCallback;
  }, [processQueryCallback]);

  const sendMessage = useCallback((text: string) => {
    if (processQueryRef.current) {
      processQueryRef.current(text);
    }
  }, []);

  const closeChat = useCallback(() => {
    setIsOpenState(false);
  }, []);

  const setIsOpen = useCallback((open: boolean) => {
    setIsOpenState(open);
  }, []);

  useEffect(() => {
    if (GLOBAL_INITIALIZED) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = false;
    rec.maxAlternatives = 5;
    rec.lang = 'en-US';

    rec.onstart = () => {
      console.log("🎤 Speech recognition started");
      GLOBAL_IS_RUNNING = true;
      setIsListening(true);
    };

    rec.onresult = (e: any) => {
      const result = e.results[e.results.length - 1];

      if (!result.isFinal) return;

      const text = result[0].transcript.trim();
      console.log("🧠 Heard:", text);

      if (!text || text.length < 2) return;

      const lowerText = text.toLowerCase();
      const hasWakeWord = lowerText.includes('hey bro') || lowerText.includes('heybro');

      if (hasWakeWord) {
        if (isSpeakingRef.current) {
          window.speechSynthesis.cancel();
          isSpeakingRef.current = false;
        }

        if (!isOpen) {
          greet();
        }

        const query = lowerText.replace(/hey\s?bro/gi, '').trim();
        if (query && processQueryRef.current) {
          processQueryRef.current(query);
        }
        return;
      }

      if (processQueryRef.current) {
        processQueryRef.current(lowerText);
      }
    };

    rec.onend = () => {
      console.log("⏹️  Speech recognition ended");
      GLOBAL_IS_RUNNING = false;
      setIsListening(false);

      if (!shouldRestartRef.current) return;
      if (isSpeakingRef.current) return;

      setTimeout(() => {
        try {
          if (!GLOBAL_IS_RUNNING) {
            console.log("🔄 Restarting recognition...");
            rec.start();
          }
        } catch (e: any) {
          if (e.name !== "InvalidStateError") {
            console.log("⚠️ Restart error:", e);
          }
        }
      }, 300);
    };

    rec.onerror = () => {
      console.log("⚠️  Speech recognition error");
      GLOBAL_IS_RUNNING = false;
      setIsListening(false);

      if (!shouldRestartRef.current) return;
      if (isSpeakingRef.current) return;

      setTimeout(() => {
        try {
          if (!GLOBAL_IS_RUNNING) {
            console.log("🔄 Restarting recognition...");
            rec.start();
          }
        } catch (e: any) {
          if (e.name !== "InvalidStateError") {
            console.log("⚠️ Restart error:", e);
          }
        }
      }, 300);
    };

    recognitionRef.current = rec;
    GLOBAL_RECOGNITION = rec;
    GLOBAL_INITIALIZED = true;

    const start = () => {
      if (!GLOBAL_IS_RUNNING) {
        try {
          rec.start();
          GLOBAL_IS_RUNNING = true;
          setIsListening(true);
          shouldRestartRef.current = true;
        } catch {}
      }
    };

    const stop = () => {
      if (GLOBAL_IS_RUNNING) {
        shouldRestartRef.current = false;
        try {
          rec.stop();
          GLOBAL_IS_RUNNING = false;
          setIsListening(false);
        } catch {}
      }
    };

    document.addEventListener('click', start, { once: true });

    return () => {
      stop();
    };
  }, [setIsListening, greet, isOpen, processQueryCallback]);

  useEffect(() => {
    if (isOpen && !hasGreetedRef.current) {
      greet();
    }
  }, [isOpen, greet]);

  const toggleListening = useCallback(() => {
    if (GLOBAL_IS_RUNNING) {
      shouldRestartRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch {}
    } else {
      shouldRestartRef.current = true;
      try {
        recognitionRef.current?.start();
      } catch {}
    }
  }, []);

  return {
    isListening,
    messages,
    isOpen,
    isVisible: isOpen,
    toggleListening,
    sendMessage,
    closeChat,
    setIsOpen,
    setIsVisible: setIsOpen,
    wakeWord: WAKE_WORD,
  };
}