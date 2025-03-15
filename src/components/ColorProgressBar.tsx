// ColorProgressBass.tsx
// node.js react tailwind typescript
// inputs
//  - max: number
//  - current: number
//  - className: string (optional)
//  - disappear: boolean (optional) - if true, bar will disappear when current >= max
// states
//  fills bar with color based on current/max
//  - color: transitions smoothly from red -> yellow -> green  based on current/max
//  - width: transitions smoothly from 0% -> 100% based on current/max

import React, { useMemo } from 'react';

interface ColorProgressBarProps {
  max: number;
  current: number;
  className?: string;
  disappear?: boolean;
  constantColor?: string | null;
  transitionWidth?: boolean;
}

export const ColorProgressBar: React.FC<ColorProgressBarProps> = ({ 
  max, 
  current,
  className = '',
   disappear = false,
   constantColor = null,
   transitionWidth = true
}) => {
  // Ensure values are valid
  const safeMax = Math.max(0.01, max); // Prevent division by zero
  const safeCurrent = Math.max(0, Math.min(current, safeMax)); // Clamp between 0 and max
  
  // Calculate percentage
  const percentage = (safeCurrent / safeMax) * 100;
  
  // Determine color based on percentage
  const color = useMemo(() => {
   if (constantColor){
      return constantColor;
    }
   
    // Red to yellow to green transition
    if (percentage < 50) {
      // Red to yellow (0% to 50%)
      const r = 255;
      const g = Math.round((percentage / 50) * 255);
      return `rgb(${r}, ${g}, 0)`;
    } else {
      // Yellow to green (50% to 100%)
      const r = Math.round(255 * (1 - (percentage - 50) / 50));
      const g = 255;
      return `rgb(${r}, ${g}, 0)`;
    }
  }, [percentage]);
  
  return (
   <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className} overflow-hidden`}
     style={{opacity: disappear && percentage >= 100 ? 0 : 1,
            maxHeight: disappear && percentage >= 100 ? 0 : '2.5rem',
            transition: 'opacity 0.5s ease-out 0.5s, max-height 0.5s ease-out 0.5s'
     }}>
     <div 
      className="h-2.5 rounded-full transition-all duration-600 ease-out"
      style={{ 
        width: transitionWidth === false ? '100%' : `${percentage}%`,
        backgroundColor: color
      }}
     />
   </div>
  );
};

export default ColorProgressBar;
