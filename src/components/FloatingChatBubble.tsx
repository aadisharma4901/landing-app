'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import ChatWindow from './ChatWindow';

export default function FloatingChatBubble() {
  const {
    isListening,
    isOpen,
    isVisible,
    toggleListening,
    closeChat,
    messages,
    sendMessage,
    wakeWord,
    setIsOpen
  } = useVoiceAssistant();

   const handleBubbleClick = () => {
     setIsOpen(true);
   };

   return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBubbleClick}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-zinc-900 to-zinc-700 rounded-full shadow-2xl flex items-center justify-center border-2 border-zinc-600"
            style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}
          >
            {isListening ? (
              <div className="relative">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <motion.div
                  className="absolute inset-0 rounded-full bg-red-500"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            ) : (
              <div className="relative">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {isVisible && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-zinc-800 text-white text-xs font-medium rounded-full whitespace-nowrap"
                  >
                    Say &quot;{wakeWord}&quot;
                  </motion.span>
                )}
              </div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            messages={messages}
            onSendMessage={sendMessage}
            onClose={closeChat}
            wakeWord={wakeWord}
          />
        )}
      </AnimatePresence>
    </>
  );
}
