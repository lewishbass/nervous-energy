import React, { useState, useEffect, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface ModalTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const ModalTemplate: React.FC<ModalTemplateProps> = ({
  isOpen,
  onClose,
  children,
  title
}) => {
  // Animation states
  const [isLoading, setIsLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'widthExpanding' | 'heightExpanding' | 'complete'>('initial');

  // Reset and manage animation sequence when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Reset states
      setIsLoading(true);
      setContentVisible(false);
      setAnimationPhase('initial');
      
      // 1 second loading time
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
        
        // First expand width
        setAnimationPhase('widthExpanding');
        
        // Then expand height
        const heightTimer = setTimeout(() => {
          setAnimationPhase('heightExpanding');
          
          // Finally show content
          const contentTimer = setTimeout(() => {
            setAnimationPhase('complete');
            setContentVisible(true);
          }, 400);
          
          return () => clearTimeout(contentTimer);
        }, 400);
        
        return () => clearTimeout(heightTimer);
      }, 1000);
      
      return () => clearTimeout(loadingTimer);
    }
  }, [isOpen]);

  const resetModal = () => {
    onClose();
    setIsLoading(true);
    setContentVisible(false);
    setAnimationPhase('initial');
  };

  // Don't render if modal isn't open and we're in initial state
  if (!isOpen && animationPhase === 'initial') return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bd1 z-200 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetModal}
          >
          
          {/* Modal container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg1 rounded-lg shadow-md overflow-hidden"
              initial={{ width: '200px', height: '120px' }}
              animate={{
                width: animationPhase === 'initial' ? '200px' : '80%',
                height: animationPhase === 'initial' || animationPhase === 'widthExpanding' ? '120px' : 'auto',
              }}
              exit={{ opacity: 0 }}
              transition={{
                width: { duration: 0.3 },
                height: { duration: 0.3 }
              }}
            >
              
              {/* Loading spinner and text */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-10 h-10 border-6 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                    <p className="mt-3 text-gray-600 animate-pulse">Loading...</p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Modal content */}
              <AnimatePresence>
                {!isLoading && (
                  <motion.div
                    className="p-4 cursor-default"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: contentVisible ? 1 : 0 }}
                    transition={{
                      opacity: { duration: 0.8 }
                    }}
                    exit={{ opacity: 0 }}
                    style={{ 
                      minHeight: animationPhase === 'heightExpanding' || animationPhase === 'complete' ? '200px' : '0',
                      display: isLoading ? 'none' : 'block'
                    }}
                  >
                    {title && (
                      <div className="border-b-2 pb-2 mb-4 border-gray-200">
                        <h2 className="text-2xl font-semibold tc1">{title}</h2>
                      </div>
                    )}
                    <div>{children}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalTemplate;
