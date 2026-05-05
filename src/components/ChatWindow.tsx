'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AssistantMessage } from '@/hooks/useVoiceAssistant';

export default function ChatWindow({ messages, onSendMessage, onClose, wakeWord, isListening, toggleListening }: {
  messages: AssistantMessage[];
  onSendMessage: (msg: string) => void;
  onClose: () => void;
  wakeWord: string;
  isListening: boolean;
  toggleListening: () => void;
}) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSend = (text?: string) => {
    const message = text || inputValue.trim();
    if (message) {
      onSendMessage(message);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    { text: "What is Banazon?", query: "What is this website?" },
    { text: "What products?", query: "What products do you sell?" },
    { text: "All products", query: "Show me all products" },
    { text: "Laptops", query: "Show me laptops" },
    { text: "Smartphones", query: "Show me smartphones" },
    { text: "Watches", query: "Show me watches" },
    { text: "Accessories", query: "Show me accessories" },
    { text: "My cart", query: "Show my cart" },
    { text: "Deals?", query: "Any deals?" },
    { text: "Shipping?", query: "What about shipping?" },
    { text: "Returns?", query: "What is your return policy?" },
  ];

  const getResponseType = (msg: AssistantMessage) => {
    if (msg.type === 'navigate' && msg.page) {
      return { color: 'bg-blue-100 text-blue-700', label: '→ Navigate' };
    }
    return { color: 'bg-zinc-100 text-zinc-700', label: 'AI' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden"
      style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
    >
       {/* Header */}
       <div className="bg-gradient-to-r from-zinc-900 to-zinc-700 p-4 flex justify-between items-center">
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
             <span className="text-white font-bold text-lg">B</span>
           </div>
           <div>
             <h3 className="text-white font-semibold">Bro</h3>
             <p className="text-zinc-300 text-xs">Your Shopping Assistant</p>
           </div>
         </div>
         <div className="flex items-center gap-2">
           {/* Mic Toggle Button */}
           <button
             onClick={toggleListening}
             className={`btn-interactive p-2 rounded-full transition-colors ${
               isListening
                 ? 'bg-red-500 text-white'
                 : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
             }`}
             aria-label={isListening ? 'Stop listening' : 'Start listening'}
             title={isListening ? 'Click to stop voice' : 'Click to speak'}
           >
             {isListening ? (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
               </svg>
             ) : (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
               </svg>
             )}
           </button>
           {/* Close Button */}
           <button
             onClick={onClose}
             className="text-zinc-300 hover:text-white transition-colors p-1"
             aria-label="Close chat"
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
         </div>
       </div>

      {/* Quick Questions */}
      <div className="p-3 border-b border-zinc-100 overflow-x-auto">
        <div className="flex gap-2 min-w-max flex-wrap">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q.query)}
              className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full text-xs font-medium transition-colors whitespace-nowrap"
            >
              {q.text}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: '300px' }}>
         <AnimatePresence>
           {messages.map((msg, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.2 }}
               className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
             >
               <div
                 className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                     ? 'bg-zinc-900 text-white rounded-br-sm'
                     : 'bg-zinc-100 text-zinc-800 rounded-bl-sm'
                 }`}
               >
                {idx === 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👋</span>
                    <p>{msg.message}</p>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                )}

                {msg.type === 'navigate' && msg.page && (
                  <div className="mt-2 pt-2 border-t border-zinc-200/20">
                    <span className={`text-xs px-2 py-1 rounded-full ${getResponseType(msg).color}`}>
                      {getResponseType(msg).label}
                    </span>
                    {msg.filter && msg.filter !== 'all' && (
                      <span className="ml-1 text-xs text-zinc-500">
                        (filter: {msg.filter})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-zinc-100 bg-zinc-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm focus:outline-none focus:border-zinc-400 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            className="px-4 py-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
 <p className="text-xs text-zinc-400 mt-2 text-center">
            Tip: Say &quot;hey bro&quot; to activate voice mode
          </p>
      </div>
    </motion.div>
  );
}
