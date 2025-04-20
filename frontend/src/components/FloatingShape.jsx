import React from 'react';
import { motion } from 'framer-motion';
import '../css/FloatingShape.css';

const FloatingShape = ({ color, size, top, left, delay }) => {
  return (
    <motion.div
      className="floating-shape"
      style={{
        top,
        left,
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 15,
        ease: "easeInOut",
        repeat: Infinity,
        delay
      }}
      aria-hidden="true"
    />
  );
};

export default FloatingShape;