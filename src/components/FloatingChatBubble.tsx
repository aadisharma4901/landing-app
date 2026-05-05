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
    // Auto-start listening the first time chat opens
    if (!isListening) {
      toggleListening();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBubbleClick();
    }
  };

  return (
    <>
      {/* Floating Chat Bubble Button - only shown when chat is closed */}
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
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-label="Open chat and start voice assistant"
          >
            <div className="relative">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              {isVisible && !isListening && (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-zinc-800 text-white text-xs font-medium rounded-full whitespace-nowrap"
                >
                  Say &quot;{wakeWord}&quot;
                </motion.span>
              )}
            </div>
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
            isListening={isListening}
            toggleListening={toggleListening}
          />
        )}
      </AnimatePresence>
    </>
  );
}
