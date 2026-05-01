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

const KEYWORD_MAP: Record<string, { page: string; filter: string; msg: string }> = {
  home: { page: '/', filter: '', msg: "Going back to home page!" },
  homepage: { page: '/', filter: '', msg: "Taking you back to home!" },
  back: { page: '/', filter: '', msg: "Heading back home!" },
  main: { page: '/', filter: '', msg: "Going to main home page!" },
  gohome: { page: '/', filter: '', msg: "Returning to home page!" },
  laptop: { page: '/products', filter: 'laptops', msg: 'Showing laptops!' },
  laptops: { page: '/products', filter: 'laptops', msg: 'Here are our laptops!' },
  phone: { page: '/products', filter: 'phones', msg: 'Showing smartphones!' },
  phones: { page: '/products', filter: 'phones', msg: 'Check out our phones!' },
  mobile: { page: '/products', filter: 'phones', msg: 'Smartphones right here!' },
  mobiles: { page: '/products', filter: 'phones', msg: 'Our mobile collection!' },
  smartphone: { page: '/products', filter: 'phones', msg: 'Smartphones here!' },
  smartwatch: { page: '/products', filter: 'watches', msg: 'Smart watches coming up!' },
  watch: { page: '/products', filter: 'watches', msg: 'Nice watches here!' },
  watches: { page: '/products', filter: 'watches', msg: 'Explore our watch collection!' },
  accessory: { page: '/products', filter: 'pcs', msg: 'Accessories for you!' },
  accessories: { page: '/products', filter: 'pcs', msg: 'Browse our accessories!' },
  cart: { page: '/cart', filter: '', msg: "Here's your cart!" },
  product: { page: '/products', filter: '', msg: "Here are all our products!" },
  products: { page: '/products', filter: '', msg: "Showing all products!" },
  deal: { page: '/pricing', filter: '', msg: "Showing our best deals and offers!" },
  deals: { page: '/pricing', filter: '', msg: "Opening deals page with all our special offers!" },
  offer: { page: '/pricing', filter: '', msg: "Looking at our latest offers now!" },
  offers: { page: '/pricing', filter: '', msg: "Here are our special offers!" },
  pricing: { page: '/pricing', filter: '', msg: "Opening pricing and deals page!" },
  support: { page: '/support', filter: '', msg: "Opening our support page for you!" },
  help: { page: '/support', filter: '', msg: "Here's our support help center!" },
  contact: { page: '/support', filter: '', msg: "Opening contact and support page!" },
  about: { page: '/about', filter: '', msg: "Opening about page to tell you more about Banazon!" },
  banazon: { page: '/about', filter: '', msg: "Let me show you about Banazon!" },
  who: { page: '/about', filter: '', msg: "Opening our about page!" }
};

const FUN_RESPONSES: Record<string, string[]> = {
  default: [
    "I can help you find products, check your cart, answer questions about shipping, returns, or anything about Banazon. What do you need help with?",
    "Need help finding something? Just tell me what you're looking for and I'll show you right away!",
    "I'm here to help! Ask me about products, shipping, returns, or anything else about our store."
  ],
  hi: [
    "Hey! Welcome to Banazon! 😊 What can I help you find today?",
    "Hi there! Great to have you here. Looking for anything specific?",
    "Hey! Need help shopping? Just tell me what you want."
  ],
  hello: [
    "Hi! Need help finding something good?",
    "Hello there! What are you looking for today?",
    "Hey hey! Ready to help you find exactly what you need."
  ],
  hey: [
    "Yo! What's up? Looking for something cool?",
    "Hey! Need a hand finding something?",
    "Sup! Tell me what you need, I got you."
  ],
  help: [
    "I can help with: finding products, checking your cart, shipping info, return policy, or anything about Banazon. Just ask!",
    "No problem! I can help you browse products, check your cart, answer shipping questions, or help with returns. What do you need?",
    "Happy to help! You can ask me about products, shipping, returns, or just tell me what you're looking for."
  ],
  deal: [
    "Oh we got amazing deals right now! Head over to the products page to see our best prices 🔥",
    "Great question! Check out our products page for all the latest discounts and special offers.",
    "Tons of awesome deals going on! All our best prices are on the products page right now."
  ],
  shipping: [
    "Banazon offers SUPER FAST 3-5 day delivery on every single order! And all orders over $99 ship completely FREE.",
    "Lightning fast shipping here! 3-5 days for everything, plus free shipping on all orders over $99. Nice right?",
    "Quick delivery guaranteed! We get it to you in 3-5 days, and spend over $99? Shipping is totally free."
  ],
  ship: [
    "Banazon offers SUPER FAST 3-5 day delivery on every single order! And all orders over $99 ship completely FREE.",
    "Lightning fast shipping here! 3-5 days for everything, plus free shipping on all orders over $99. Nice right?"
  ],
  delivery: [
    "Banazon offers SUPER FAST 3-5 day delivery on every single order! And all orders over $99 ship completely FREE.",
    "Lightning fast shipping here! 3-5 days for everything, plus free shipping on all orders over $99. Nice right?"
  ],
  return: [
    "Zero stress returns! Banazon has a full 30-day hassle-free return policy. No questions asked. If you don't love it, just send it back.",
    "Super easy returns! 30 days, no fine print, no hoops to jump through. Don't like it? Send it back. Simple.",
    "No worries about returns! 30 day full refund policy, absolutely no questions asked. We make it easy."
  ],
  returns: [
    "Zero stress returns! Banazon has a full 30-day hassle-free return policy. No questions asked. If you don't love it, just send it back.",
    "Super easy returns! 30 days, no fine print, no hoops to jump through. Don't like it? Send it back. Simple."
  ],
  contact: [
    "Our support team is always here! Email us anytime at support@banazon.com or call us 24/7 at 1-800-BANAZON.",
    "Need to reach someone? You can email us at support@banazon.com or call our 24/7 support line at 1-800-BANAZON.",
    "We're here for you! Reach out any time at support@banazon.com or call us anytime day or night."
  ],
  support: [
    "Our support team is available 24/7! Email us at support@banazon.com",
    "Got questions? Our support team is always here for you at support@banazon.com.",
    "Need help? Just shoot us an email at support@banazon.com and we'll get back to you fast."
  ],
  about: [
    "Banazon is your trusted spot for premium electronics. Best prices, fastest shipping, amazing customer support. That's us!",
    "We're Banazon - your go-to place for all the best electronics. Great prices, quick delivery, awesome service.",
    "Banazon is where you shop for premium electronics. Unbeatable prices, fast shipping, and we actually care about our customers."
  ],
  banazon: [
    "Banazon is the best place to shop for premium electronics! Great prices, fast shipping, and awesome service.",
    "That's us! We sell the best electronics at the best prices, with lightning fast shipping.",
    "Banazon! Your number one spot for watches, phones, laptops and all the good tech stuff."
  ],
  who: [
    "Banazon is your trusted destination for premium electronics. We offer watches, smartphones, laptops, and computer components at unbeatable prices.",
    "We're Banazon - we sell all the best electronics: watches, phones, laptops, computer parts, all at amazing prices.",
    "Banazon is the online electronics store you can trust. Great products, great prices, great service."
  ],
  what: [
    "Banazon is an online electronics store with the best deals on watches, phones, laptops and computer parts!",
    "We're an electronics store! We sell watches, smartphones, laptops, PC components - all the good stuff, all the best prices.",
    "Banazon is where you buy awesome electronics. Everything from watches to gaming PCs, we got it."
  ],
  thanks: [
    "You're very welcome! 😊 Anything else I can help with?",
    "No problem at all! Need anything else?",
    "Happy to help! Let me know if you need anything else.",
    "Anytime! What else can I do for you?"
  ],
  thank: [
    "You're very welcome! 😊 Anything else I can help with?",
    "No problem at all! Need anything else?"
  ],
  okay: [
    "Sounds good! Let me know if you need anything else.",
    "Alright! Just holler if you need help with anything.",
    "Got it! I'm here if you need anything else."
  ],
  no: [
    "No problem! Just let me know if you change your mind.",
    "Alright! I'm here when you need me.",
    "Okay no worries! Just say the word if you need help later."
  ],
  yes: [
    "Great! What would you like help with?",
    "Awesome! Tell me what you're looking for.",
    "Perfect! How can I help you?"
  ]
};

function speak(text: string) {
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
    // ✅ NEVER RESET HASGREETED - ALWAYS STAY ACTIVE
  }, []);

  useEffect(() => {
    if (isOpen && !hasGreetedRef.current) {
      greet();
    }
  }, [isOpen, greet]);

  const processQuery = useCallback(async (query: string) => {
    const q = query.toLowerCase().trim();
    addMessage({ type: 'text', message: query });

    // Handle navigation commands first
    for (const [kw, nav] of Object.entries(KEYWORD_MAP)) {
      if (q.includes(kw)) {
        const explainMessage = `Sure! Let me show you our ${kw}s.`;
        addMessage({ type: 'text', message: explainMessage });
        speak(explainMessage);
        
        setTimeout(() => {
          const resp: AssistantMessage = { type: 'navigate', message: nav.msg, page: nav.page, filter: nav.filter };
          addMessage(resp);
          setTimeout(() => {
            window.location.href = nav.page + (nav.filter ? `?filter=${nav.filter}` : '');
          }, 700);
        }, 1200);
        
        return;
      }
    }

    if (q.includes('stop') || q.includes('off') || q.includes('close') || q.includes('quit')) {
      speak("Okay, I'll stop listening. Click the button to wake me again.");
      addMessage({ type: 'text', message: "Okay, stopped listening. Click to start again." });
      return;
    }

    // ✅ ACTUAL OPENROUTER AI RESPONSE FOR EVERYTHING ELSE
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      const data = await response.json();
      
      if (data.response) {
        addMessage({ type: 'text', message: data.response });
        speak(data.response);
      } else {
        // Fallback if API fails
        const defaultResponses = FUN_RESPONSES.default;
        const randomDefault = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        addMessage({ type: 'text', message: randomDefault });
        speak(randomDefault);
      }
    } catch (error) {
      // Fallback on error
      const defaultResponses = FUN_RESPONSES.default;
      const randomDefault = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      addMessage({ type: 'text', message: randomDefault });
      speak(randomDefault);
    }
  }, [addMessage]);

  const sendMessage = useCallback((text: string) => {
    processQuery(text);
  }, [processQuery]);

  const closeChat = useCallback(() => {
    // ✅ NEVER CLOSE CHAT AUTOMATICALLY - STAY OPEN FOREVER
    // Only user manual click will close, never auto close
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

    let finalTranscript = '';

    rec.onresult = (e: any) => {
      let interimTranscript = '';
      
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript.toLowerCase().trim();
        if (e.results[i].isFinal) {
          finalTranscript = transcript;
        } else {
          interimTranscript = transcript;
        }
      }

      const fullText = (finalTranscript + ' ' + interimTranscript).toLowerCase();
      
      // Detect wake word and open chat immediately
      if (fullText.includes('hey bro') || fullText.includes('heybro') || fullText.includes('a bro') || fullText.includes('hey burn')) {
        if (!isOpen) {
          greet();
        }
        finalTranscript = finalTranscript.replace(/hey\s?bro/gi, '').trim();
      }

      // ALWAYS PROCESS EVERYTHING - NO CONDITIONS EVER
      if (finalTranscript && finalTranscript.length > 2) {
        if (!isOpen) {
          greet();
        }
        processQuery(finalTranscript);
        finalTranscript = '';
      }
    };
    rec.onend = () => {
      setTimeout(() => {
        try { rec.start(); } catch {}
      }, 5);
    };

    rec.onerror = () => {
      setTimeout(() => {
        try { rec.start(); } catch {}
      }, 5);
    };

    GLOBAL_RECOGNITION = rec;
    GLOBAL_INITIALIZED = true;

    // START ON FIRST USER INTERACTION
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