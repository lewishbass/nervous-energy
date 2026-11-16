'use client';

import { createRoot } from 'react-dom/client';

type ToastIcon = 'check' | 'x' | null;

interface ToastProps {
  message: string;
  duration?: number;
  icon: ToastIcon;
  color?: string;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 2000, icon = 'check', color = 'var(--khg)' }) => {
  return (
    <div
      className="fixed bottom-5 right-5 z-[9999] px-4 py-2 rounded-lg shadow-lg animate-fade-in-out print:hidden"
      style={{
        background: color,
        color: 'white',
        animation: `fadeInOut ${duration}ms ease-in-out`,
      }}
    >
      <div className="flex items-center gap-2">
        {icon && <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {icon === 'x' && (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          )}
          {icon === 'check' && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
          )}
        </svg>}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export const createToast = (message: string, duration: number = 2000, icon: ToastIcon = 'check', color: string = 'var(--khg)') => {
  const toastContainer = document.createElement('div');
  document.body.appendChild(toastContainer);
  const root = createRoot(toastContainer);
  root.render(<Toast message={message} duration={duration} icon={icon} color={color} />);
  setTimeout(() => {
    root.unmount();
    document.body.removeChild(toastContainer);
  }, duration);
};

export const copyToClipboard = async (text: string, message: string = 'Copied!', doCopy: boolean = true): Promise<boolean> => {
  try {
    if (doCopy) await navigator.clipboard.writeText(text);

    // Create toast notification
    createToast(message, 2000, doCopy ? 'check' : null);
    
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    createToast('Failed to copy to clipboard', 2000, 'x');
    return false;
  }
};
