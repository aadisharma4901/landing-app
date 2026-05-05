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
  const utteranceIdRef = useRef(0);
  const QUERY_COOLDOWN_MS = 2000;

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined') return;
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.05;
    u.pitch = 1.08;
    u.volume = 1;
    
    const currentId = ++utteranceIdRef.current;
    isSpeakingRef.current = true;
    
    u.onend = () => {
      if (utteranceIdRef.current === currentId) {
        isSpeakingRef.current = false;
      }
    };
    u.onerror = () => {
      if (utteranceIdRef.current === currentId) {
        isSpeakingRef.current = false;
      }
    };
    
    window.speechSynthesis.speak(u);
  }, [isSpeakingRef, utteranceIdRef]);

  const addMessage = useCallback((msg: AssistantMessage) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const greet = useCallback(() => {
    if (hasGreetedRef.current) return;
    hasGreetedRef.current = true;
    setIsOpenState(true);
    speak("Hey! I'm Bro. How can I help?");
  }, [speak]);

  const setIsOpen = useCallback((open: boolean) => {
    setIsOpenState(open);
  }, []);

  useEffect(() => {
    if (isOpen && !hasGreetedRef.current) {
      greet();
    }
  }, [isOpen, greet]);

  const processQuery = useCallback(async (query: string) => {
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

  const sendMessage = useCallback((text: string) => {
    processQuery(text);
  }, [processQuery]);

  const closeChat = useCallback(() => {
    setIsOpenState(false);
  }, []);

  useEffect(() => {
    if (GLOBAL_INITIALIZED) {
      setIsListening(GLOBAL_IS_RUNNING);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 5;
    rec.lang = 'en-US';

    let silenceTimer: any = null;

    rec.onresult = (e: any) => {
      let speechText = '';
      
      for (let i = 0; i < e.results.length; i++) {
        speechText += e.results[i][0].transcript;
      }
      speechText = speechText.toLowerCase().trim();

      if (silenceTimer) clearTimeout(silenceTimer);

      // Check wake word FIRST (always allowed)
      const hasWakeWord = speechText.includes('hey bro') || speechText.includes('heybro');
      
      if (hasWakeWord) {
        // Cancel any ongoing speech so the assistant can listen immediately
        if (isSpeakingRef.current) {
          window.speechSynthesis.cancel();
          isSpeakingRef.current = false;
        }
        
        if (!isOpen) {
          greet();
        }
        
        // Strip wake word from the query
        speechText = speechText.replace(/hey\s?bro/gi, '').trim();
        
        // If nothing left after stripping, we're done
        if (!speechText) return;
      }

      // For non-wake-word queries, block while assistant is speaking
      if (!hasWakeWord && isSpeakingRef.current) {
        return;
      }

      silenceTimer = setTimeout(() => {
        if (speechText && speechText.length > 2) {
          processQuery(speechText);
        }
      }, 400);
    };

    rec.onend = () => {
      setTimeout(() => { try { rec.start() } catch {} }, 5);
    };

    rec.onerror = () => {
      setTimeout(() => { try { rec.start() } catch {} }, 5);
    };

    GLOBAL_RECOGNITION = rec;
    GLOBAL_INITIALIZED = true;

    const start = () => {
      if (!GLOBAL_IS_RUNNING) {
        try {
          rec.start();
          GLOBAL_IS_RUNNING = true;
          setIsListening(true);
        } catch {}
      }
    };
    
    document.addEventListener('click', start, { once: true });

  }, [greet, processQuery, isOpen]);

  const toggleListening = useCallback(() => {}, []);

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