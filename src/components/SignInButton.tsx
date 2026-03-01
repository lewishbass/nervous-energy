'use client';

import React, { useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

interface SignInButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
	andRegister?: boolean;
	inline?: boolean;
}

const SignInButton: React.FC<SignInButtonProps> = ({
  variant = 'primary',
  size = 'md',
  showIcon = true,
  children = 'Sign In',
  className = '',
  style = {},
  ariaLabel = 'Sign in button',
  andRegister = false,
  inline = false
}) => {
  const { isLoading, isLoggedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set('openAuth', 'true');
    router.push(`?${params.toString()}`);
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Variant classes
  const variantClasses = {
    primary: 'bt2 tc2',
    secondary: 'bg-gray-200/50 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600',
    outline: 'border-2 border-current text-current hover:bg-opacity-10'
  };

  // Icon size based on button size
  const iconSizeMap = {
    sm: 14,
    md: 18,
    lg: 24
  };

  if (isLoggedIn) {
    return null;
  }

  const buttonText = isLoading ? 'Logging in...' : (andRegister ? 'Log In/Register' : children);

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      aria-label={ariaLabel}
      className={`
				cursor-pointer select-none
        flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 ease-out
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'}
        ${inline ? 'inline-flex' : ''}
        ${className}
      `}
      style={style}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : showIcon ? (
        <FaUser size={iconSizeMap[size]} />
      ) : null}
      <span>{buttonText}</span>
    </button>
  );
};

export default SignInButton;
