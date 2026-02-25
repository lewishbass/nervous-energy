'use client';

import { createRoot } from 'react-dom/client';

interface ToastProps {
  message: string;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 2000}) => {
  return (
    <div
      className="fixed bottom-5 right-5 z-[9999] px-4 py-2 rounded-lg shadow-lg animate-fade-in-out print:hidden"
      style={{
        background: 'var(--khg)',
        color: 'white',
        animation: `fadeInOut ${duration}ms ease-in-out`,
      }}
    >
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export const copyToClipboard = async (text: string, message: string = 'Copied!', doCopy: boolean = true): Promise<boolean> => {
  try {
    if(doCopy)await navigator.clipboard.writeText(text);
    
    // Create toast notification
    const toastContainer = document.createElement('div');
    document.body.appendChild(toastContainer);
    
    const root = createRoot(toastContainer);
    const duration = 2000;
    
    root.render(<Toast message={message} duration={duration} />);
    
    // Remove toast after animation completes
    setTimeout(() => {
      root.unmount();
      document.body.removeChild(toastContainer);
    }, duration);
    
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};
