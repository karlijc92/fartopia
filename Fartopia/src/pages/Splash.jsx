import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowButton(true), 1500);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-200 flex items-center justify-center overflow-hidden relative">
      {/* Floating clouds */}
      <motion.div
        className="absolute top-20 left-10 text-6xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        ☁️
      </motion.div>
      <motion.div
        className="absolute top-40 right-20 text-5xl"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      >
        💨
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-1/4 text-4xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      >
        ✨
      </motion.div>

      <div className="text-center px-6">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1.2, bounce: 0.5 }}
        >
          <h1 className="text-8xl md:text-9xl font-black mb-4 drop-shadow-lg">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
              FARTOPIA
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p className="text-3xl md:text-4xl font-bold text-purple-700 mb-8">
            🦄 The Fart Zoo Builder 💨
          </p>
        </motion.div>

        {/* Animated fart clouds */}
        <div className="flex justify-center gap-4 mb-12">
          {['💚', '💜', '💛', '💙'].map((emoji, i) => (
            <motion.div
              key={i}
              className="text-6xl"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        {/* Enter button */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
          >
            <Button
              onClick={() => navigate(createPageUrl('Home'))}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-2xl px-12 py-8 rounded-full shadow-2xl transform hover:scale-105 transition-all"
            >
              <Sparkles className="mr-3 h-8 w-8" />
              Enter the Fart Zoo!
              <Sparkles className="ml-3 h-8 w-8" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
