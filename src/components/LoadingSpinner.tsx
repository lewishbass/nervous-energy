import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = 'Loading...', 
  size = 'md',
  className = '',
  color = 'var(--khb)'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-4',
    md: 'w-10 h-10 border-6',
    lg: 'w-16 h-16 border-8'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full animate-spin`} style={{ borderColor: `${color} transparent ${color} transparent` }}></div>
      {text && <p className="mt-3 tc2 animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
