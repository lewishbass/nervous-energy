import React, { useState, useRef, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import SubmitIcon, { SubmitIconRef } from './SubmitIcon';

interface StringEditProps {
  editable?: boolean;
  value: string;
  placeholder?: string;
  submitField?: string;
  submitRoute?: string;
  // @ts-expect-error some of your api calls are gonna be anys and you just have to deal with it
  onSuccess?: (response) => void;
  // @ts-expect-error some of your api calls are gonna be anys and you just have to deal with it
  onError?: (error) => void;
}

const StringEdit: React.FC<StringEditProps> = ({
  editable = true,
  value: initialValue,
  placeholder = '',
  submitField,
  submitRoute,
  onSuccess,
  onError,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>(initialValue);
  const submitIconRef = useRef<SubmitIconRef>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update value when prop changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Toggle editing mode
  const toggleEdit = () => {
    if (editable) {
      setIsEditing(!isEditing);
      // Focus input when entering edit mode
      setTimeout(() => {
        if (inputRef.current && !isEditing) {
          inputRef.current.focus();
        }
      }, 10);
    }
  };

  // Handle key presses in input field
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitIconRef.current?.submit();
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  return (
    <div className="relative flex items-center w-full">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsEditing(false)}
          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      ) : (
        <div 
          className="w-full px-2 py-1 cursor-text truncate"
          onClick={editable ? toggleEdit : undefined}
        >
          {value || <span className="text-gray-400">{placeholder}</span>}
        </div>
      )}
      
      <div className="flex items-center ml-2">
        {editable && !isEditing && (
          <FaEdit
            className="text-blue-500 cursor-pointer hover:text-blue-700"
            onClick={toggleEdit}
          />
        )}
        
        {submitField && submitRoute && (
          <div className="ml-2">
            <SubmitIcon
              ref={submitIconRef}
              data={value}
              submitField={submitField}
              submitRoute={submitRoute}
              onSuccess={onSuccess}
              onError={onError}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StringEdit;
