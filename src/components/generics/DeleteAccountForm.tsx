import React, { useState } from 'react';
import ColorProgressBar from '../ColorProgressBar';

interface DeleteAccountFormProps {
  userId: string | undefined;
  username: string | undefined; // Add username prop
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onDelete: () => void;
}

const AUTH_ROUTE = '/.netlify/functions/auth';

const DeleteAccountForm: React.FC<DeleteAccountFormProps> = ({ 
  userId,
  username, // Destructure the username prop
  isLoading, 
  setIsLoading,
  onDelete 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteUsername, setDeleteUsername] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Check if entered username matches the actual username
  const usernameMatches = deleteUsername === username;

  // Delete account handler
  const handleDeleteAccount = async () => {
    // Additional validation
    if (!usernameMatches) {
      setDeleteError('Username does not match');
      return;
    }
    
    setDeleteError(null);

    try {
      setIsLoading(true);
      const response = await fetch(`${AUTH_ROUTE}/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          username: deleteUsername,
          password: deletePassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Account deleted successfully, call the onDelete callback
        onDelete();
      } else {
        setDeleteError(data.error || 'Failed to delete account');
      }
    } catch (err) {
      setDeleteError('Error connecting to server');
      console.error('Error deleting account:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <button
          className={`w-full py-2 rounded-lg transition-all duration-300 ${
            showDeleteConfirm 
              ? 'bt2 tc2 hover:opacity-90' 
            : 'bg-red-500 text-white hover:bg-red-700 cursor-pointer'
          }`}
          onClick={() => {
            if (showDeleteConfirm) {
              // Cancel action
              setShowDeleteConfirm(false);
              setDeleteUsername('');
              setDeletePassword('');
              setDeleteError(null);
            } else {
              // Show confirm state
              setShowDeleteConfirm(true);
            }
          }}
        >
          <span className="transition-opacity duration-300">
            {showDeleteConfirm ? 'Cancel' : 'Delete Account'}
          </span>
        </button>
      </div>

      <div className={`bg2 p-4 rounded-lg transition-all duration-300 ${
        showDeleteConfirm ? 'opacity-100' : 'opacity-20 pointer-events-none scale-[0.98]'
      }`}>
        <h4 className="text-lg font-semibold tc1 mb-2">Are you sure you want to delete your account?</h4>
        <p className="text-sm tc3 mb-4">This action cannot be undone. All your data will be permanently removed.</p>

        <div className="mb-3">
          <label htmlFor="delete-username" className="block text-sm font-medium tc3 mb-1">
            Enter your username to confirm
          </label>
          <input
            id="delete-username"
            type="text"
            value={deleteUsername}
            onChange={(e) => setDeleteUsername(e.target.value)}
            className={`w-full p-2 bg3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 tc3 mb-3`}
            placeholder="Your username"
            autoComplete="username"
            disabled={!showDeleteConfirm}
            required
          />
          
          <div>
            <ColorProgressBar
              max={username?.length || 1}
              current={Array.from(deleteUsername).filter((char, index) => char === username?.[index]).length}
              disappear={true}
              className="w-full mt-[-4px]"
              constantColor={"#00ff00"}
            />
          </div>

        </div>

        <div className="mb-3">
          <label htmlFor="delete-password" className="block text-sm font-medium tc3 mb-1">
            Enter your password to confirm
          </label>
          <input
            id="delete-password"
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="w-full p-2 bg3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 tc3"
            placeholder="Your current password"
            autoComplete="current-password"
            disabled={!showDeleteConfirm}
            required
          />
        </div>

        <div className={'mb-3 p-2 rounded ' + (deleteError ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100' : '')}
          style={{ display: deleteError ? 'block' : 'none' }}>
          {deleteError}
        </div>
        
        <button
          className={`w-full py-2 rounded-lg ${
            showDeleteConfirm && usernameMatches ? 'bg-red-500 text-white hover:bg-red-700 cursor-pointer' : 'bg-gray-500/50 text-white'
          } transition-colors duration-300`}
          onClick={handleDeleteAccount}
          disabled={!showDeleteConfirm || !usernameMatches || !deletePassword || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Deleting...
            </span>
          ) : 'Yes, Delete Account'}
        </button>
      </div>
    </div>
  );
};

export default DeleteAccountForm;
