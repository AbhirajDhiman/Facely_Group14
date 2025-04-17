import React from 'react'
import { motion } from 'framer-motion'

const FloatingShape = ({ color, size, top, left, delay }) => {
  return (
    <motion.div
      className={`absolute rounded-full opacity-20 blur-xl ${size} ${color}`}
      style={{
        top, 
        left 
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
  )
}

export default FloatingShape;
