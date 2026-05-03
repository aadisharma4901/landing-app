'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export type AssistantMessage = {
  type: 'text' | 'navigate';
  message: string;
  page?: string;
  filter?: string;
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

function speak(text: string) {
  if (typeof window === 'undefined') return;
  if (!window.speechSynthesis) return;
  
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1.05;
  u.pitch = 1.08;
  u.volume = 1;
  window.speechSynthesis.speak(u);
}

export function useVoiceAssistant() {
  const [isListening, setIsListening] = useState(GLOBAL_IS_RUNNING);
  const [messages, setMessages] = useState<AssistantMessage[]>([{ type: 'text', message: GREETING }]);
  const [isOpen, setIsOpenState] = useState(false);
  const hasGreetedRef = useRef(false);
  const isActiveRef = useRef(GLOBAL_IS_RUNNING);

  const addMessage = useCallback((msg: AssistantMessage) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const greet = useCallback(() => {
    if (hasGreetedRef.current) return;
    hasGreetedRef.current = true;
    setIsOpenState(true);
    speak("Hey! I'm Bro. How can I help?");
  }, []);

  const setIsOpen = useCallback((open: boolean) => {
    setIsOpenState(open);
  }, []);

  useEffect(() => {
    if (isOpen && !hasGreetedRef.current) {
      greet();
    }
  }, [isOpen, greet]);

  const processQuery = useCallback(async (query: string) => {
    const q = query.toLowerCase().trim();
    addMessage({ type: 'text', message: query });

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
          
          addMessage({ type: 'text', message: message.trim() });
          speak(message.trim());
          
          setTimeout(() => {
            window.location.href = path + (filter && filter.trim() ? `?filter=${filter.trim()}` : '');
          }, 700);
          
          return;
        }
        
        addMessage({ type: 'text', message: responseText });
        speak(responseText);
      } else {
        const randomDefault = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
        addMessage({ type: 'text', message: randomDefault });
        speak(randomDefault);
      }
    } catch (error) {
      const randomDefault = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      addMessage({ type: 'text', message: randomDefault });
      speak(randomDefault);
    }
  }, [addMessage]);

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
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.lang = 'en-US';

    let silenceTimer: any = null;

    rec.onresult = (e: any) => {
      let speechText = '';
      
      for (let i = 0; i < e.results.length; i++) {
        speechText += e.results[i][0].transcript;
      }
      
      speechText = speechText.toLowerCase().trim();

      if (silenceTimer) clearTimeout(silenceTimer);

      if (speechText.includes('hey bro') || speechText.includes('heybro')) {
        if (!isOpen) greet();
        speechText = speechText.replace(/hey\s?bro/gi, '').trim();
      }

      silenceTimer = setTimeout(() => {
        if (speechText) {
          processQuery(speechText);
        }
      }, 400);
    };

    rec.onend = () => {
      setTimeout(() => { try { rec.start() } catch {} }, 1);
    };

    rec.onerror = () => {
      setTimeout(() => { try { rec.start() } catch {} }, 1);
    };

    GLOBAL_RECOGNITION = rec;
    GLOBAL_INITIALIZED = true;

    const start = () => {
      if (!GLOBAL_IS_RUNNING) {
        try {
          rec.start();
          GLOBAL_IS_RUNNING = true;
          isActiveRef.current = true;
          setIsListening(true);
        } catch {}
      }
    };
    
    document.addEventListener('click', start, { once: true });
    document.addEventListener('touchstart', start, { once: true });
    document.addEventListener('keydown', start, { once: true });

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