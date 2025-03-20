'use client';
import React, { ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';

interface DragCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const DragCard: React.FC<DragCardProps> = ({ children, className = '', style = {} }) => {


  return (
    <motion.div
      drag
      whileDrag={{ scale: 1.1, boxShadow: "8px 8px 8px #0003", rotate: 0 }}
      className={`cursor-grab active:cursor-grabbing ${className}`}
      style={{
        ...style,
        boxShadow: "3px 3px 5px #0002",
        position: 'absolute',
        userSelect: 'none',
        zIndex: 1,
        rotate: 0,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
      }}
      initial={{
        rotate: (Math.random() ** 1.5) * 20 - 10,
      }}
      onDragEnd={() => {
        const randomRotation = (Math.random() ** 2) * 200 - 10;
        return { rotate: randomRotation };
      }}
      dragMomentum={true}
      // Use motion values for positioning
      // Update motion values during drag
    >
      {children}
    </motion.div>
  );
};

export default DragCard;

