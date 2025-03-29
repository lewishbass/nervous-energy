import React, { useState, useEffect } from 'react';
import ColorProgressBar from '../ColorProgressBar';

interface ChangePasswordFormProps {
  userId: string | undefined;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const AUTH_ROUTE = '/.netlify/functions/auth';

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ 
  userId, 
  isLoading, 
  setIsLoading 
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Password strength calculation
  const passwordStrength = (password: string) => {
    return Math.sqrt(password.length) / Math.sqrt(10) + 
           (new Set(password)).size / 10 + 
           ((/[^a-zA-Z0-9]/).test(password) ? 1 : 0) + 
           ((/[a-z]/).test(password) && (/[A-Z]/).test(password) ? 1 : 0) + 
           (/[0-9]/.test(password) ? 1 : 0);
  }

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return false;
    } else if (passwordStrength(password) < 3) {
      setValidationError('Password must be stronger');
      return false;
    } else if (validationError?.includes("Password must")) {
      setValidationError(null);
      return true;
    }
    return true;
  }

  // Validate password on change
  useEffect(() => {
    if (newPassword) {
      validatePassword(newPassword);
    } else {
      setValidationError(null);
    }
  }, [newPassword]);

  // Password change handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    setValidationError(null);

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (!validatePassword(newPassword)) {
      return;
    }

    // Submit password change
    try {
      setIsLoading(true);
      const response = await fetch(`${AUTH_ROUTE}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          currentPassword,
          newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(data.error || 'Failed to update password');
      }
    } catch (err) {
      setPasswordError('Error connecting to server');
      console.error('Error updating password:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <h3 className="text-lg font-semibold tc1 mb-3">Change Password</h3>

      <div className={'mb-3 p-2 rounded ' + (passwordError || validationError ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100' : '')}
        style={{ display: (passwordError || validationError) ? 'block' : 'none' }}>
        {passwordError || validationError}
      </div>

      <div className="mb-3 p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded"
        style={{ display: passwordSuccess ? 'block' : 'none' }}>
        {passwordSuccess}
      </div>

      <form onSubmit={handlePasswordChange} className="space-y-3">
        <div>
          <label htmlFor="current-password" className="block text-sm font-medium tc3 mb-1">
            Current Password
          </label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 bg3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 tc3"
            placeholder="Enter your current password"
            autoComplete="current-password"
            required
          />
        </div>
        
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium tc3 mb-1">
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 bg3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 tc3"
            placeholder="Create a new password"
            autoComplete="new-password"
            required
          />
        </div>
        
        <div>
          <ColorProgressBar 
            max={5} 
            current={passwordStrength(newPassword)} 
            disappear={true} 
            className="w-full h-2.5 mt-[-4px] mb-[-8px]" 
          />
        </div>
        
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium tc3 mb-1">
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 bg3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 tc3"
            placeholder="Confirm your new password"
            autoComplete="new-password"
            required
          />
        </div>
        
        <div>
          <ColorProgressBar 
            max={Math.max(newPassword.length, confirmPassword.length)} 
            current={Array.from(newPassword).filter((char, index) => char === confirmPassword[index]).length} 
            disappear={true} 
            className="w-full h-2.5 mt-[-4px]" 
            constantColor={"#00ff00"} 
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bt2 rounded-lg tc2 font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </span>
          ) : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
