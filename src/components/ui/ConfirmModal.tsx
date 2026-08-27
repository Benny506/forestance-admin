import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isDestructive = false
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#111111]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-10"
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              className="bg-[#FDFDFD] w-full max-w-md rounded-2xl shadow-xl flex flex-col border border-[#111111]/10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#111111]/10 bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-zinc-100 text-[#111111]/60'}`}>
                    <AlertTriangle size={16} />
                  </div>
                  <h2 className="font-heading text-xl text-[#111111] uppercase">
                    {title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 -mr-1 text-[#111111]/40 hover:text-[#111111] hover:bg-[#111111]/5 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 font-outfit text-[#111111]/70 leading-relaxed bg-white">
                {message}
              </div>

              {/* Footer */}
              <div className="p-6 pt-0 bg-white flex flex-col md:flex-row items-center gap-3 justify-end border-t-0">
                <button
                  onClick={onClose}
                  className="w-full md:w-auto px-5 py-2.5 rounded-lg font-outfit font-medium text-sm text-[#111111]/70 hover:bg-zinc-100 transition-colors border border-transparent"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`w-full md:w-auto px-5 py-2.5 rounded-lg font-outfit font-medium text-sm transition-colors border shadow-sm ${
                    isDestructive 
                      ? 'bg-red-500 text-white border-red-600 hover:bg-red-600' 
                      : 'bg-black text-white border-black hover:bg-black/80'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
