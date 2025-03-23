import { useState, useEffect, useRef } from 'react';
import ModalTemplate from './ModalTemplate';
import { useAuth } from '@/context/AuthContext';
import { FaCheck, FaTimes, FaCog } from 'react-icons/fa';
import ColorProgressBar from './ColorProgressBar';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [activeForm, setActiveForm] = useState<'login' | 'register'>('login');
  const [successMessage, setSuccessMessage] = useState('');
  const usernameCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [usernameValid, setUsernameValid] = useState<'checking' | 'valid' | 'invalid' | 'error' | 'none'>('none');

  const { login, register, isLoading, error } = useAuth();



  useEffect(() => {
    if (isOpen) {
      setLoginUsername('');
      setLoginPassword('');
      setRegisterUsername('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
      setValidationError('');
      setSuccessMessage('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (validationError) {
      const timer = setTimeout(() => {
        setValidationError('');
      }, 3000); // Clear after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [validationError]);

  useEffect(() => {

  }, [validationError]);

  // Add new useEffect for username checking with debounce
  useEffect(() => {
    console.log('Checking username:', registerUsername);
    // Clear any existing timeout
    if (usernameCheckTimeoutRef.current) {
      clearTimeout(usernameCheckTimeoutRef.current);
    }

    // If username is empty, don't check
    if (!registerUsername) {
      setUsernameValid('none');
      return
    }

    setUsernameValid('checking');

    // Set a new timeout
    usernameCheckTimeoutRef.current = setTimeout(async () => {
      const result = await checkUserExists(registerUsername);
      if (result.error) {
        setValidationError('Error checking username');
        setUsernameValid('error');
      } else if (result.exists) {
        setValidationError(`${registerUsername} is already taken${result.suggestion ? ` try ${result.suggestion}` : ''}`);
        setUsernameValid('invalid');
      } else {
        // Clear validation error if username is available
        setValidationError('');
        setUsernameValid('valid');
      }
    }, 300);

    // Cleanup function to clear timeout when component unmounts or username changes again
    return () => {
      if (usernameCheckTimeoutRef.current) {
        clearTimeout(usernameCheckTimeoutRef.current);
      }
    };
  }, [registerUsername]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!loginUsername || !loginPassword) {
      setValidationError('Please fill in all fields');
      return;
    }

    try {
      const successful_login = await login(loginUsername, loginPassword);
      console.log("Login Success:", successful_login);
      if (successful_login !== true) {
        return;
      }
      setSuccessMessage('Login successful! Redirecting...');
      // Clear form after successful login
      setLoginUsername('');
      setLoginPassword('');

      // Close modal after a short delay to show the success message
      setTimeout(() => {
        setSuccessMessage('');
        setValidationError('');
        onClose();
      }, 2500);
    } catch (err) {
      // @ts-expect-error because i said so
      console.log('login modal error: ' + err.message);
      return
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


    if (validatePassword(registerPassword) !== true) {
      return;
    }

    try {
      const successful_register = await register(registerUsername, registerPassword);
      if (successful_register !== true) {
        return;
      }

      setSuccessMessage('Registration successful! Welcome!');
      // Clear form after successful registration
      setRegisterUsername('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');

      // Close modal after a short delay to show the success message
      setTimeout(() => {
        setSuccessMessage('');
        setValidationError('');
        onClose();
      }, 2500);
    } catch (err) {
      // @ts-expect-error because i said so
      console.log('login modal error: ' + err.message);
    }
  };
  // Checks if user exists and gets suggestions
  const checkUserExists = async (username: string) => {
    try {
      const response = await fetch('/.netlify/functions/auth/user-exists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) {
        throw new Error('Failed to check username');
      }
      const data = await response.json();
      return { exists: data.exists, suggestion: data.suggestion, error: false };
    } catch (error) {
      console.error('Error checking username:', error);
      return { exists: true, suggestion: null, error: true };
    }
  }

  const passwordStrength = (password: string) => {
    return Math.sqrt(password.length) / Math.sqrt(10) + (new Set(password)).size / 10 + ((/[^a-zA-Z0-9]/).test(password) ? 1 : 0) + ((/[a-z]/).test(password) && (/[A-Z]/).test(password) ? 1 : 0) + (/[0-9]/.test(password) ? 1 : 0);
  }

  const validatePassword = (password: string) => {
    if (registerPassword.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return false;
    } else if (passwordStrength(registerPassword) < 3) {
      setValidationError('Password must be stronger');
      return false;
    } else if (validationError?.includes("Password must")) {
      setValidationError('');
      return true;
    }
  }
  useEffect(() => {
    validatePassword(registerPassword);
  }, [registerPassword]);

  return (
    <ModalTemplate isOpen={isOpen} onClose={onClose} title="Login or Register" contentLoading={false}>

      <div className={'mb-[-1.4em] mt-[-0.7em] p-2 rounded items-center ' + (validationError ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-400 dark:text-yellow-200' : '') + (error ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100' : '')}
        style={{ height: (error || validationError) ? '2.4em' : '0px', opacity: (error || validationError) ? 1 : 0, overflow: 'hidden', transition: 'height 0.5s ease-in-out, opacity 0.5s ease-in-out, background-color 0.5s ease-in-out' }}>
        {error} {validationError}
      </div>


      <div className="mb-2 mt-[6] p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded"
        style={{ height: (successMessage) ? '2.4em' : '0px', opacity: (successMessage) ? 1 : 0, overflow: 'hidden', transition: 'height 0.5s ease-in-out, opacity 0.5s ease-in-out' }}>
        {successMessage}
      </div>

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
                className="w-full p-2 bg3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 tc3"
                placeholder="Enter your username"
                disabled={isLoading}
                autoComplete='username'
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
                className="w-full p-2 bg3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 tc3"
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete='current-password'
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 bt2 rounded-lg tc2 font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
              onClick={() => setActiveForm('login')}
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
        <div className="space-y-4 md:border-l-2 border-gray-200 md:pl-6 pt-6 md:pt-0">
          <h3 className="text-xl font-bold tc1">Register</h3>
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label htmlFor="register-username" className="block text-sm font-medium tc3 mb-1">
                Username
              </label>
              <div className="relative h-[2.4em]">
                <input
                  id="register-username"
                  type="text"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  className="absolute w-full p-2 bg3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 tc3"
                  placeholder="Choose a username"
                  disabled={isLoading}
                  autoComplete='username'
                />
                <div className="absolute right-2 top-2 w-6 h-6 flex items-center justify-center mw-0 mh-0 m-0 p-0">
                  <div style={{ opacity: usernameValid === 'none' ? 1 : 0, transition: 'opacity 0.25s ease' }} className="absolute rounded-full min-h-5 min-w-5 border-4 border-blue-500" />
                  {/*<div style={{opacity: usernameValid === 'checking' ? 1 : 0, transition: 'opacity 0.5s ease'}} className="absolute animate-spin rounded-full min-h-5 min-w-5 border-t-4 border-r-4 border-yellow-500"/>*/}
                  <FaCog style={{ opacity: usernameValid === 'checking' ? 1 : 0, transition: 'opacity 0.25s ease' }} className="absolute animate-spin text-yellow-500" />
                  <FaCheck style={{ opacity: usernameValid === 'valid' ? 1 : 0, transition: 'opacity 0.25s ease' }} className="absolute text-green-500" />
                  <FaTimes style={{ opacity: usernameValid === 'invalid' ? 1 : 0, transition: 'opacity 0.25s ease' }} className="absolute text-yellow-500" />
                  <FaTimes style={{ opacity: usernameValid === 'error' ? 1 : 0, transition: 'opacity 0.25s ease' }} className="absolute text-red-500" />
                </div>
              </div>
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
                className="w-full p-2 bg3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 tc3"
                placeholder="Create a password"
                disabled={isLoading}
                autoComplete='new-password'
              />
            </div>
            <div>
              <ColorProgressBar max={5} current={passwordStrength(registerPassword)} disappear={true} className="w-full h-2.5 mt-[-4px] mb-[-8px]" />
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
                className="w-full p-2 bg3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 tc3"
                placeholder="Confirm your password"
                disabled={isLoading}
                autoComplete='new-password'
              />
            </div>
            <div>
              <ColorProgressBar max={Math.max(registerPassword.length, registerConfirmPassword.length)} current={Array.from(registerPassword).filter((char, index) => char === registerConfirmPassword[index]).length} disappear={true} className="w-full h-2.5 mt-[-4px]" constantColor={"#00ff00"} />
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
