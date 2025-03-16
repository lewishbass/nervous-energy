// GenericEdit.tsx 
// Node.js, tailwind, typescript, react, javascript
// used for displaying and editing generic values
// switches between specific edit components based on the type of the value
// takes
// - type: string, paragraph, date, time, number, location, bool, list, color
// - editable: boolean, whether the value can be edited or just displayed
// - value: the value to be displayed
// - placeholder: the placeholder text to be displayed if the value is empty
// - options: an array of options to be displayed if the type is list
// - submit field: field of submission
// - submit route: route to submit data


import React, { useState, useEffect } from 'react';
import StringEdit from './StringEdit';
//import { FaEdit } from 'react-icons/fa';
//import SubmitIcon from './SubmitIcon';

interface GenericEditProps {
   type: string,
   editable?: boolean,
   value: any,
   placeholder: any,
   options: string[],
   submitField?: string,
   submitRoute?: string,
}

const GenericEdit: React.FC<GenericEditProps> = ({
   type = 'string',
   editable = true,
   value,
   placeholder,
   options,
   submitField,
   submitRoute,
}) => {

   const renderSpecificEdit = () => {
      switch (type) {
         case 'string':
            return (
              <StringEdit
                editable={editable}
                value={value}
                placeholder={placeholder}
                submitField={submitField}
                submitRoute={submitRoute}
              />
            );
         /*case 'paragraph':
            return (<div/>);
         case 'date':
            return (<div/>);
         case 'time':
            return (<div/>);
         case 'number':
            return (<div/>);
         case 'bool':
            return (<div/>);
         case 'list':
            return (<div/>);
         case 'color':
            return (<div/>);*/
         default:
            return (<div>{value}</div>);
      }
   }

   return (
      <div className="w-full">
        {renderSpecificEdit()}
      </div>
   );

};

export default GenericEdit;

