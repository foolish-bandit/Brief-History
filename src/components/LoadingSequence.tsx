import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const LOADING_TEXTS = [
  "Consulting the archives...",
  "Reviewing colonial statutes...",
  "Cross-referencing case law...",
  "Checking with Justice Scalia's ghost...",
  "Dusting off the Constitution...",
  "Asking a 19th-century judge...",
  "Translating legalese...",
  "Searching the Library of Congress...",
  "Bribing a prohibition-era politician...",
  "Consulting the Federalist Papers..."
];

export default function LoadingSequence() {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % LOADING_TEXTS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-24 h-24 mb-8">
        <motion.div 
          className="absolute inset-0 border-t-2 border-amber-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-2 border-r-2 border-indigo-400 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-amber-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      
      <div className="h-8 relative w-full max-w-sm overflow-hidden text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={textIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 text-white/70 font-serif italic text-lg"
          >
            {LOADING_TEXTS[textIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
