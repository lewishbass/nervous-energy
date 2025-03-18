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


import React from 'react';
import StringEdit from './StringEdit';
import ParagraphEdit from './ParagraphEdit';
import DateEdit from './DateEdit';
//import { FaEdit } from 'react-icons/fa';
//import SubmitIcon from './SubmitIcon';

type GenericValue = string | number | boolean | Date | null;

interface GenericEditProps {
   className?: string,
   type: string,
   editable?: boolean,
   value: GenericValue,
   placeholder: GenericValue,
   options?: string[],
   submitField?: string,
   submitRoute?: string,
}

const GenericEdit: React.FC<GenericEditProps> = ({
   className = "",
   type = 'string',
   editable = true,
   value,
   placeholder,
   options,
   submitField,
   submitRoute,
}) => {
   if(options){
      console.log(options);
   }

   const renderSpecificEdit = () => {
      switch (type) {
         case 'string':
            if(!value) value = "";
            if(!placeholder) placeholder = "";
            if(typeof value !== 'string') value = value.toString();
            if(typeof placeholder !== 'string') placeholder = placeholder.toString();
            return (
              <StringEdit
                editable={editable}
                value={value}
                placeholder={placeholder}
                submitField={submitField}
                submitRoute={submitRoute}
              />
            );
         case 'word':
               if(!value) value = "";
               if(!placeholder) placeholder = "";
               if(typeof value !== 'string') value = value.toString();
               if(typeof placeholder !== 'string') placeholder = placeholder.toString();
               return (
                 <StringEdit
                   editable={editable}
                   value={value}
                   placeholder={placeholder}
                   submitField={submitField}
                   submitRoute={submitRoute}
                   fitContent={true}
                 />
               );
         case 'paragraph':
            if(!value) value = "";
            if(!placeholder) placeholder = "";
            if(typeof value !== 'string') value = value.toString();
            if(typeof placeholder !== 'string') placeholder = placeholder.toString();
            return (
              <ParagraphEdit
                editable={editable}
                value={value}
                placeholder={placeholder}
                submitField={submitField}
                submitRoute={submitRoute}
              />
            );
         case 'date':
            if(!(value instanceof Date)){
               if (typeof value === 'number') {
                value = new Date(value);
               } else if (typeof value === 'string') {
                value = new Date(value);
               } else {
                value = new Date();
               }
             }
             if(!(placeholder instanceof Date)){
               if (typeof placeholder === 'number') {
                placeholder = new Date(placeholder);
               } else if (typeof placeholder === 'string') {
                placeholder = new Date(placeholder);
               } else {
                placeholder = new Date();
               }
             }

            return (
              <DateEdit
                editable={editable}
                value={value}
                submitField={submitField}
                submitRoute={submitRoute}
              />
            );
         /*case 'time':
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
            return (<div>{value ? value.toString() : "none"}</div>);
      }
   }

   return (
      <div className={"w-full " + className}>
        {renderSpecificEdit()}
      </div>
   );

};

export default GenericEdit;

