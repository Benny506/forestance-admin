import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '../../context/UIContext';

export const GlobalLoader: React.FC = () => {
  const { isLoading, loadingText } = useUI();

  return (
    <div className="fixed bottom-8 right-8 z-[9999]" style={{ perspective: '1000px' }}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ rotateX: 90, opacity: 0, transformOrigin: 'bottom' }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: -90, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#111111] text-[#FDFDFD] px-6 py-4 rounded-full flex items-center gap-3 shadow-2xl border border-white/10"
          >
            <svg className="animate-spin h-5 w-5 text-[#FDFDFD]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="font-outfit font-medium text-[15px]">{loadingText}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
