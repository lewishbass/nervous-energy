import React, { useState } from 'react';
import ModalTemplate from './ModalTemplate';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => Promise<void>;
  onRegister: (username: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onLogin, 
  onRegister,
  isLoading = false,
  error: contextError = null
}) => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [activeForm, setActiveForm] = useState<'login' | 'register'>('login');
  const [successMessage, setSuccessMessage] = useState('');

  // Combined error from context or validation
  const error = contextError || validationError;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');
    
    if (!loginUsername || !loginPassword) {
      setValidationError('Please fill in all fields');
      return;
    }
    
    try {
      await onLogin(loginUsername, loginPassword);
      setSuccessMessage('Login successful! Redirecting...');
      // Clear form after successful login
      setLoginUsername('');
      setLoginPassword('');
      
      // Close modal after a short delay to show the success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      // Error handling is done in the context
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');
    
    if (!registerUsername || !registerPassword) {
      setValidationError('Please fill in all fields');
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    try {
      await onRegister(registerUsername, registerPassword);
      setSuccessMessage('Registration successful! Welcome!');
      // Clear form after successful registration
      setRegisterUsername('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
      
      // Close modal after a short delay to show the success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      // Error handling is done in the context
    }
  };

  return (
    <ModalTemplate isOpen={isOpen} onClose={onClose} title="Login or Register">
      {error && (
        <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
          {successMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Login Form */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold tc1">Login</h3>
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label htmlFor="login-username" className="block text-sm font-medium tc3 mb-1">
                Username
              </label>
              <input
                id="login-username"
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full p-2 bg3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium tc3 mb-1">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full p-2 bg3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 bt2 rounded-lg tc2 font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading && activeForm === 'login' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : 'Login'}
            </button>
          </form>
        </div>

        {/* Register Form */}
        <div className="space-y-4 md:border-l md:pl-6 pt-6 md:pt-0">
          <h3 className="text-xl font-bold tc1">Register</h3>
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label htmlFor="register-username" className="block text-sm font-medium tc3 mb-1">
                Username
              </label>
              <input
                id="register-username"
                type="text"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                className="w-full p-2 bg3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Choose a username"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium tc3 mb-1">
                Password
              </label>
              <input
                id="register-password"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full p-2 bg3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Create a password"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="register-confirm-password" className="block text-sm font-medium tc3 mb-1">
                Confirm Password
              </label>
              <input
                id="register-confirm-password"
                type="password"
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                className="w-full p-2 bg3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 bt2 rounded-lg tc2 font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
              onClick={() => setActiveForm('register')}
            >
              {isLoading && activeForm === 'register' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </ModalTemplate>
  );
};

export default AuthModal;
