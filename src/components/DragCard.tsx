'use client';
import React, { ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';

interface DragCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const DragCard: React.FC<DragCardProps> = ({ children, className = '', style = {} }) => {

  const [isMoved, setIsMoved] = React.useState(false);
  const [mini, setMini] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setMini(window.innerWidth < 600);
    };
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      //onMouseUp={() => setIsMoved(true)}
      drag
      whileDrag={{ scale: mini ? 0.8 : 1.1, boxShadow: "8px 8px 8px #0003", rotate: 0 }}
      className={`cursor-grab active:cursor-grabbing ${className}`}
      style={{
        ...style,
        boxShadow: "3px 3px 5px #0002",
        position: 'absolute',
        userSelect: 'none',
        zIndex: 1,
        rotate: isMoved ? 0 : (Math.random() ** 1.5) * 30 - 15,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        scale: mini ? 0.7 : 1,
      }}
      initial={{
        rotate: isMoved ? 0 : (Math.random() ** 1.5) * 30 - 15,
      }}
      onDragEnd={() => {
        setIsMoved(true);
      }}
      dragMomentum={true}
      // Use motion values for positioning
      // Update motion values during drag
    >
      <div>
        {children}
      </div>
    </motion.div>
  );
};

export default DragCard;

