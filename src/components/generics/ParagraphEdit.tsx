import React, { useState, useRef, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import SubmitIcon, { SubmitIconRef } from './SubmitIcon';

interface ParagraphEditProps {
  editable?: boolean;
  value: string;
  placeholder?: string;
  submitField?: string;
  submitRoute?: string;
  // @ts-expect-error some of your api calls are gonna be anys and you just have to deal with it
  onSuccess?: (response) => void;
  // @ts-expect-error some of your api calls are gonna be anys and you just have to deal with it
  onError?: (error) => void;
  rows?: number;
  maxRows?: number;
}

const ParagraphEdit: React.FC<ParagraphEditProps> = ({
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update value when prop changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Toggle editing mode
  const toggleEdit = () => {
    if (editable) {
      setIsEditing(!isEditing);
      // Focus textarea when entering edit mode
      setTimeout(() => {
        if (textareaRef.current && !isEditing) {
          textareaRef.current.focus();
        }
      }, 10);
    }
  };

  // Auto-adjust textarea height
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `auto`;
    }
  }, [value, isEditing]);

  // Handle key presses in textarea field
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.shiftKey)) {
        submitIconRef.current?.submit();
    }
    else if (e.key === 'Escape') {
      setValue(submitIconRef.current?.lastSuccessfulData as string);
      if(!submitIconRef.current?.idle())
        await new Promise((resolve) => setTimeout(resolve, 500));
      setIsEditing(false);
    }
  };

  return (
    <div className="relative w-full">
        
        <div 
          className=" w-full px-2 py-2 whitespace-pre-wrap"
          onClick={undefined}
          style={{whiteSpace: "pre-wrap", }}
        >
        { isEditing && <textarea
            ref={textareaRef}
            value={value}
            placeholder={placeholder}
            onChange={(e) => {
                setValue(e.target.value);
                // Reset scroll position to top
                if (e.target) {
                    e.target.scrollTop = 0;
                }
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsEditing(false)}
          className="max-h-[100%] min-h-[100%] absolute top-0 left-0 w-full px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 z-10"
            style={{ 
                resize: "none", 
                overflow: "hidden",
            }}
        />}
          <span style={{opacity: (isEditing) ? 0 : 1}}>{value || <span className="opacity-0.5">{placeholder}</span>}</span>
        </div>
      
      
      <div className="absolute bottom-1.5 right-1 max-w-5 max-h-5">
        {submitField && submitRoute && (
          <div 
            style={{
              opacity: isEditing ? 1 : 0, 
              pointerEvents: isEditing ? 'auto' : 'none', 
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
            <SubmitIcon
              className="absolute right-0 bottom-0 w-5 h-5"
              ref={submitIconRef}
              data={value}
              submitField={submitField}
              submitRoute={submitRoute}
              onSuccess={onSuccess}
              onError={onError}
            />
          </div>
        )}
        
          <FaEdit
            className={"absolute right-[0px] bottom-0 w-5 h-5 cursor-pointer " + (submitIconRef.current?.idle() ? 'text-blue-500 hover:text-blue-700' : 'text-yellow-500 hover:text-yellow-600')}
            style={{
              opacity: (editable && !isEditing) ? 1 : 0, 
              pointerEvents: (editable && !isEditing) ? 'auto' : 'none', 
              cursor: (editable && !isEditing) ? 'pointer' : 'default', 
              transition: 'opacity 0.3s ease-in-out'
            }}
            onClick={toggleEdit}
          />
        
      </div>
    </div>
  );
};

export default ParagraphEdit;
