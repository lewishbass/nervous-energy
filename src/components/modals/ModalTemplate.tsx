import React, { useState, useEffect, ReactNode, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingSpinner from '../LoadingSpinner';

interface ModalTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  contentLoading?: boolean;
  modalWidth?: string;
  transitionSpeed?: number;
  skipLoadingAnimation?: boolean;
}

const ModalTemplate: React.FC<ModalTemplateProps> = ({
  isOpen,
  onClose,
  children,
  title,
  contentLoading = true,
  modalWidth = '80%',
  transitionSpeed = 1,
  skipLoadingAnimation = false,
}) => {
  // Animation states
  const [isLoading, setIsLoading] = useState(!skipLoadingAnimation);
  const [contentVisible, setContentVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'widthExpanding' | 'heightExpanding' | 'complete'>('initial');
  const [isClosing, setIsClosing] = useState(1);

  // Reset and manage animation sequence when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Reset states

      if(!skipLoadingAnimation)setIsLoading(true);

      setContentVisible(false);
      setAnimationPhase('initial');

      if (contentLoading) return;

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
          }, 400 * transitionSpeed);
          
          return () => clearTimeout(contentTimer);
        }, 400 * transitionSpeed);

        return () => clearTimeout(heightTimer);
      }, 100 * transitionSpeed);
      
      return () => clearTimeout(loadingTimer);
    }
  }, [isOpen, contentLoading]);

  const resetModal = () => {
    setIsClosing(0);
    setTimeout(() => {
      onClose();
      if(!skipLoadingAnimation)setIsLoading(true);
      setAnimationPhase('initial');
      setIsClosing(1);
    }, 500);
  };

  // Don't render if modal isn't open and we're in initial state
  if (!isOpen && animationPhase === 'initial') return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="modal-closer fixed inset-0 bd1 z-200 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: isClosing }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              const target = e.target as HTMLElement;
              if (target.classList.contains('modal-closer')) {
                e.preventDefault();
                e.stopPropagation();
              resetModal();
              }
            }}
          >
          
          {/* Modal container */}
          <div className="modal-closer fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg1 rounded-lg shadow-md overflow-hidden"
              initial={{ width: '200px', height: '120px' }}
              animate={{
                width: animationPhase === 'initial' ? '200px' : modalWidth,
                height: animationPhase === 'initial' || animationPhase === 'widthExpanding' ? '120px' : 'auto',
              }}
              exit={{ opacity: 0 }}
              transition={{
                width: { duration: 0.3 * transitionSpeed },
                height: { duration: 0.3 * transitionSpeed }
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
                      <LoadingSpinner />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Modal content */}
              <AnimatePresence>
                {!isLoading && (
                  <motion.div
                    className="p-4 cursor-default no-sb"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: contentVisible ? 1 : 0 }}
                    transition={{
                      opacity: { duration: 0.6 * transitionSpeed }
                    }}
                    exit={{ opacity: 0 }}
                    style={{ 
                      minHeight: animationPhase === 'heightExpanding' || animationPhase === 'complete' ? '200px' : '0',
                      maxHeight: '90vh',
                      overflowY: 'scroll',
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
