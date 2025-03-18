import React, { useState, useRef, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import SubmitIcon, { SubmitIconRef } from './SubmitIcon';


interface DateEditProps {
  editable?: boolean;
  value: Date;
  placeholder?: Date;
  submitField?: string;
  submitRoute?: string;
  // @ts-expect-error some of your api calls are gonna be anys and you just have to deal with it
  onSuccess?: (response) => void;
  // @ts-expect-error some of your api calls are gonna be anys and you just have to deal with it
  onError?: (error) => void;
}

const YEAR_MIN = 1900;
const YEAR_MAX = 2030;

const DateEdit: React.FC<DateEditProps> = ({
  editable = true,
  value,
  submitField,
  submitRoute,
  onSuccess,
  onError,
}) => {
  // Convert initialValue to Date if it's a string

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(value);
  const [month, setMonth] = useState<number>(date.getMonth());
  const [day, setDay] = useState<number>(date.getDate());
  const [year, setYear] = useState<number>(date.getFullYear());
  
  const submitIconRef = useRef<SubmitIconRef>(null);
  const containerRef = useRef<HTMLFormElement>(null);
  const dayRef = useRef<HTMLSelectElement>(null);
  const monthRef = useRef<HTMLSelectElement>(null);
  const yearRef = useRef<HTMLSelectElement>(null);
  
  // Array of month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Update date state when individual parts change
  useEffect(() => {
    const newDate = new Date(year, month, Math.min(day, getDaysInMonth(year, month)));
    setDate(newDate);
    // If day is greater than days in current month, adjust it
    if (day > getDaysInMonth(year, month)) {
      setDay(getDaysInMonth(year, month));
    }
  }, [month, day, year]);

  // Update component when props change
  useEffect(() => {
    setDate(value);
    setMonth(value.getMonth());
    setDay(value.getDate());
    setYear(value.getFullYear());
  }, [value]);

  
  // Handle wheel events for scrolling
  const handleWheel = (
    e: React.WheelEvent<HTMLSelectElement>,
    unit: "year" | "month" | "day",
  ) => {
    if(e.cancelable)e.preventDefault();
    if (unit == "month" && monthRef)monthRef.current?.focus();
    if (unit == "day" && dayRef)dayRef.current?.focus();
    if (unit == "year" && yearRef)yearRef.current?.focus();

    const delta = - Math.sign(e.deltaY);
    if (unit === 'year') {
      setYear(Math.max(YEAR_MIN, Math.min(YEAR_MAX, year + delta)));
    } else if (unit === 'month') {
      if (month + delta < 0) {
        setMonth(11);
        setYear(Math.max(YEAR_MIN, Math.min(YEAR_MAX, year - 1)));
      }
      else if (month + delta > 11) {
        setMonth(0);
        setYear(Math.max(YEAR_MIN, Math.min(YEAR_MAX, year + 1)));
      }
      else setMonth(month + delta);
    } else if (unit === 'day') {
      if (day + delta < 1) {
        if(month === 0) {
          setDay(getDaysInMonth(year - 1, 11));
          setMonth(11);
          setYear(Math.max(YEAR_MIN, Math.min(YEAR_MAX, year - 1)));
        }else{
          setDay(getDaysInMonth(year, month - 1));
          setMonth(month - 1);
        }
      }
      else if (day + delta > getDaysInMonth(year, month)) {
        if(month === 11) {
          setDay(1);
          setMonth(0);
          setYear(Math.max(YEAR_MIN, Math.min(YEAR_MAX, year + 1)));
        }else{
          setDay(1);
          setMonth(month + 1);
        }
      }
      else setDay(day + delta);
    }
  };

  // Format date as string
  const formatDate = (date: Date) => {
    return (
      <div className="flex items-center flex-row">
        <div className="mr-14 min-w-15 max-w-15">{months[date.getMonth()]}</div> 
        <div className="mr-2.5 min-w-10">{date.getDate()}</div>
        <div className="mr-0 min-w-10">{date.getFullYear()}</div>
      </div>
    )
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Handle key presses
  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitIconRef.current?.submit();
    } else if (e.key === 'Escape') {
      const last_date = submitIconRef.current?.lastSuccessfulData as Date;
      if (last_date) {
        setDay(last_date.getDate());
        setMonth(last_date.getMonth());
        setYear(last_date.getFullYear());
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
      setIsEditing(false);
    }
  };
  const handleBlur = (e: React.FocusEvent) => {
    if(!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
      setIsEditing(false);
    }
  }

  return (
    <form tabIndex={8} className="max-h-[1.3em] focus:outline-0 relative flex items-center w-full" ref={containerRef} onKeyDown={handleKeyDown} onBlur={(e) => handleBlur(e)}>
      {isEditing ? (
        <div className="flex items-center space-x-2 w-full px-1 py-1">
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            onWheel={(e) => handleWheel(e, "month")}
            className="ml-[-4] py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            ref={monthRef}
          >
            {months.map((monthName, index) => (
              <option key={index} value={index}>
                {monthName}
              </option>
            ))}
          </select>
          
          <select
            value={day}
            onChange={(e) => setDay(parseInt(e.target.value))}
            onWheel={(e) => handleWheel(e, "day")}
            className="py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            ref={dayRef}
          >
            {Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            onWheel={(e) => handleWheel(e, "year")}
            className="py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            ref={yearRef}
          >
            {Array.from({ length: YEAR_MAX - YEAR_MIN + 1 }, (_, i) => i + YEAR_MIN).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div
          className="w-full px-1 py-1 truncate"
          style={{ paddingRight: editable ? '1.75rem' : '0rem', transition: 'padding-right 0.3s ease-in-out' }}
          //onClick={toggleEdit}
        >
          {date ? formatDate(date) : formatDate(date)}
        </div>
      )}

      <div className="flex items-center m-0 max-w-0">
        {submitField && submitRoute && (
          <div
            className="ml-2 absolute right-1"
            onClick ={() => submitIconRef.current?.submit()}
            style={{
              opacity: isEditing ? 1 : 0,
              pointerEvents: isEditing ? 'auto' : 'none',
              cursor: "pointer",
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
            {<SubmitIcon
              ref={submitIconRef}
              data={date}
              submitField={submitField}
              submitRoute={submitRoute}
              onSuccess={(response) => {
                //setIsEditing(false);
                if (onSuccess) onSuccess(response);
              }}
              onError={onError}
            />}
          </div>
        )}

        <FaEdit
          className={"absolute right-1 w-5 h-5 cursor-pointer " + 
            (submitIconRef.current?.idle() ? 'text-blue-500 hover:text-blue-700' : 'text-yellow-500 hover:text-yellow-600')}
          style={{
            opacity: editable && !isEditing ? 1 : 0,
            pointerEvents: editable && !isEditing ? 'auto' : 'none',
            cursor: editable && !isEditing ? 'pointer' : 'default',
            transition: 'opacity 0.3s ease-in-out'
          }}
          onClick={() => {
            setIsEditing(true);
            if(containerRef.current)containerRef.current.focus();
            else console.error("containerRef is null");
          }}
        />
      </div>
    </form>
  );
};

export default DateEdit;
