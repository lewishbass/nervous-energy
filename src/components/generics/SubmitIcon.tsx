// SubmitIcon.tsx
// Node.js, react, tailwind, typescript, javascript
// a react component that handles validating, submitting information to the backend
// member functions
//  - update: updated state based on value change
//  - submit: attempts to submit data to route
// stores
//  - last successful data: initial/stored value for comparing if updated
// takes
//  - data: information to be submitted
//  - submit field: field of submission
//  - submit route: route to submit data
//  - ref: used to pass reference to parent function, so parent can trigger submit
//  - validation function?: returns if data is valid or not
// states: icons fade between states in 0.25s
//  - no change: value unchanged - blue circle div w-5 h-5 border-4 border-blue-500 rounded-full
//  - changed valid: value changed and valid - only state that can submit - yellow FaCheck
//  - changed invalid: value changed and invalid - yellow FaTimes
//  - submitting: value submitted and waiting for response - spinning yellow FaCog
//  - submitted invalid: value submitted and response invalid/error - returns to changed after 2 seconds - red FaTimes
//  - submitted valid: value submitted and response valid - updates (last successful data) - returns to no change after 2 seconds - green FaCheck

import React, { useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { FaCog, FaTimes, FaCheck } from 'react-icons/fa';
import axios from 'axios';

import { useAuth } from '@/context/AuthContext';

// Enum for component states
enum ChangeState {
  NO_CHANGE,
  VALID,
  INVALID,
}
enum SubmitState {
  IDLE,
  SUBMITTING,
  VALID,
  INVALID
}

type GenericValue = string | number | boolean | Date;

interface SubmitIconProps {
  className?: string;
  data: GenericValue;
  submitField: string;
  submitRoute: string;
  validationFunction?: (data: GenericValue) => boolean;
  // @ts-expect-error some of your api calls are gonna be anys and you just have to deal with it
  onSuccess?: (response) => void;
  // @ts-expect-error some of your api calls are gonna be anys and you just have to deal with it
  onError?: (error) => void;
}

export interface SubmitIconRef {
  submit: () => Promise<boolean>;
  update: () => ChangeState;
  idle: () => boolean;
  lastSuccessfulData: GenericValue;
}

const SubmitIcon = forwardRef<SubmitIconRef, SubmitIconProps>(({
  className,
  data,
  submitField,
  submitRoute,
  validationFunction,
  onSuccess,
  onError
}, ref) => {
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.IDLE);
  const [lastSuccessfulData, setLastSuccessfulData] = useState<string | number | boolean | Date>(data);

  const { token, username, isLoggedIn } = useAuth();

  
  // Function to update state based on data changes
  const update = useMemo(() => {
    if (JSON.stringify(data) === JSON.stringify(lastSuccessfulData)) return ChangeState.NO_CHANGE;
    if (!validationFunction) return ChangeState.VALID;

   const isValid = validationFunction(data);
   return isValid ? ChangeState.VALID : ChangeState.INVALID;
  }, [data, lastSuccessfulData, validationFunction]);

  // Check if component is idle
  const idle = useMemo(() => {
    return (submitState === SubmitState.IDLE || submitState === SubmitState.VALID) && update === ChangeState.NO_CHANGE;
  }, [submitState, update]);

  // Submit function to send data to backend
  const submit = async (): Promise<boolean> => {
    console.log("submitting: ", data, " to ", submitRoute, " with field: ", submitField);
    // Only submit if state is CHANGED_VALID
    if (update !== ChangeState.VALID && submitState !== SubmitState.IDLE) {
      return false;
    }

    setSubmitState(SubmitState.SUBMITTING);
    
    try {
      if (isLoggedIn === false) {
         setSubmitState(SubmitState.INVALID);
         return false;
      }
      const payload = { updates: {[submitField]: data} , token: token, username: username, action: 'set'};
      const response = await axios.post(submitRoute, payload);
      const responseData = response.data;
      
      if(response.status !== 200 || responseData.error) {
        setSubmitState(SubmitState.INVALID);
        return false;
      }

      setSubmitState(SubmitState.VALID);
      setLastSuccessfulData(data);
      
      // Return to IDLE after 2 seconds
      setTimeout(() => {
        setSubmitState(SubmitState.IDLE);
      }, 2000);
      
      if (onSuccess) onSuccess(response);
      return true;
    } catch (error) {
      console.error(error);
      setSubmitState(SubmitState.INVALID);
      
      // Return to IDLE state after 2 seconds
      setTimeout(() => {
        setSubmitState(SubmitState.IDLE);
      }, 2000);
      
      if (onError) onError(error);
      return false;
    }
  };

  // Expose functions to parent component
  useImperativeHandle(ref, () => ({
    submit,
    update: () => update,
    idle: () => idle,
    lastSuccessfulData
  }));

  /*interface ClickIconEvent {
    preventDefault: () => void;
    stopPropagation: () => void;
  }

  const clickIcon = (e: ClickIconEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    submit();
  }*/

  // Render different icons based on state
  const renderIcon = () => {
    const ss = submitState;
    const us = update;
    return (
      <div >{/*onClick={(e) => clickIcon(e)}>*/}
        <div 
          className={`absolute w-5 h-5 border-4 border-blue-500 rounded-full transition-opacity duration-250 ease-in-out ${
          (ss === SubmitState.IDLE && us === ChangeState.NO_CHANGE) ? 'opacity-100' : 'opacity-0'}`}/>
        
        <FaCog className={`absolute w-5 h-5 text-yellow-500 transition-opacity duration-250 ease-in-out ${
          (ss === SubmitState.SUBMITTING) ? 'opacity-100 animate-spin' : 'opacity-0'}`}/>
          
        <FaTimes className={`absolute w-5 h-5 transition-opacity duration-250 ease-in-out text-red-500 ${
          (ss === SubmitState.INVALID) ? 'opacity-100' : 'opacity-0'}`}/>

          <FaCheck className={`absolute w-5 h-5 text-green-500 transition-opacity duration-250 ease-in-out ${
           (ss === SubmitState.VALID) ? 'opacity-100' : 'opacity-0'}`}/>
        
        <FaCheck className={`absolute w-5 h-5 text-yellow-500 transition-opacity duration-250 ease-in-out ${
          (ss === SubmitState.IDLE && us == ChangeState.VALID) ? 'opacity-100' : 'opacity-0'}`}/>
        
        <FaTimes className={`absolute w-5 h-5 transition-opacity duration-250 ease-in-out text-yellow-500 ${
          (ss === SubmitState.IDLE && us === ChangeState.INVALID) ? 'opacity-100' : 'opacity-0'}`}/>

      </div>
    );
  };

  return (
    <div className={`${className}`}>
      <div className="relative w-5 h-5">
        {renderIcon()}
      </div>
    </div>
  );
});

SubmitIcon.displayName = 'SubmitIcon';

export default SubmitIcon;