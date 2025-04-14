import React from "react";
import { motion } from "framer-motion";

const FaceScanner = () => {
  return (
    <div className="relative w-40 h-40 mx-auto mb-6 border-4 border-blue-400 rounded-full overflow-hidden">
      <motion.div
        className="absolute w-full h-1 bg-blue-400"
        initial={{ y: 0 }}
        animate={{ y: "100%" }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      <p className="absolute bottom-2 w-full text-center text-xs text-gray-400">Scanning...</p>
    </div>
  );
};

export default FaceScanner;
