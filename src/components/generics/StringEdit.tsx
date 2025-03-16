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
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitIconRef.current?.submit();
    } else if (e.key === 'Escape') {
      setValue(submitIconRef.current?.lastSuccessfulData as string);
      if(!submitIconRef.current?.idle())
        await new Promise((resolve) => setTimeout(resolve, 500));
      setIsEditing(false);
      console.log(submitIconRef.current?.idle());
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
          className="w-full px-1 py-1 text-[17px] rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      ) : (
        <div 
          className="w-full px-1 py-1 truncate tc2 text-[17px]"
          onClick={undefined/*toggleEdit*/}
        >
          {value || <span className="opacity-0.5">{placeholder}</span>}
        </div>
      )}
      
      <div className="flex items-center m-0 max-w-0">
        
        
        {submitField && submitRoute && (
          <div className="ml-2 absolute right-1"
          style={{opacity: isEditing ? 1 : 0, pointerEvents: 'none', transition: 'opacity 0.3s ease-in-out'}}>
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
        {(
          <FaEdit
            className={"absolute right-1 w-5 h-5 cursor-pointer " + (submitIconRef.current?.idle() ? 'text-blue-500 hover:text-blue-700' : 'text-yellow-500 hover:text-yellow-600')}
            style={{opacity: (editable && !isEditing) ? 1 : 0, pointerEvents: (editable && !isEditing) ? 'auto' : 'none', cursor: (editable && !isEditing) ? 'pointer' : 'default', transition: 'opacity 0.3s ease-in-out'}}
            onClick={toggleEdit}
          />
        )}
      </div>
    </div>
  );
};

export default StringEdit;
