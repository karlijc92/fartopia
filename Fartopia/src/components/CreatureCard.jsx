import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles } from 'lucide-react';
import { soundManager } from './SoundManager';

const RARITY_COLORS = {
  Common: 'from-gray-300 to-gray-400',
  Rare: 'from-blue-400 to-blue-600',
  Epic: 'from-purple-400 to-purple-600',
  Legendary: 'from-yellow-400 to-orange-500',
};

const RARITY_BORDERS = {
  Common: 'border-gray-400',
  Rare: 'border-blue-500',
  Epic: 'border-purple-500',
  Legendary: 'border-yellow-500',
};

export default function CreatureCard({ creature, creatureData, onUnlock, canAfford, delay = 0 }) {
  const isUnlocked = creature?.unlocked;

  const handleFartClick = () => {
    soundManager.playFartSound(creature.fart_sound);
    alert(`${creature.name} says: ${creature.fart_sound}! 💨`);
  };

  const handleUnlock = () => {
    soundManager.playUnlockSound();
    onUnlock.mutate({ creatureId: creatureData.id, cost: creatureData.cost });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative bg-white rounded-3xl p-6 shadow-xl border-4 ${
        RARITY_BORDERS[creature.rarity]
      } ${!isUnlocked && 'opacity-60'}`}
    >
      {/* Rarity badge */}
      <div
        className={`absolute top-4 right-4 bg-gradient-to-r ${
          RARITY_COLORS[creature.rarity]
        } text-white px-3 py-1 rounded-full text-xs font-bold`}
      >
        {creature.rarity}
      </div>

      {/* Creature display */}
      <div className="text-center mb-4">
        <motion.div
          className="text-8xl mb-4 relative cursor-pointer"
          animate={isUnlocked ? { rotate: [0, -5, 5, -5, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={isUnlocked ? handleFartClick : undefined}
        >
          {isUnlocked ? creature.emoji : '❓'}
          {isUnlocked && (
            <motion.span
              className="absolute -top-2 -right-2 text-3xl"
              animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              💨
            </motion.span>
          )}
        </motion.div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">
          {isUnlocked ? creature.name : '???'}
        </h3>
        <p className="text-sm text-gray-500">
          {isUnlocked ? `${creature.fart_sound} fart` : 'Locked'}
        </p>
      </div>

      {/* Action button */}
      {!isUnlocked ? (
        <Button
          onClick={handleUnlock}
          disabled={!canAfford}
          className={`w-full ${
            canAfford
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
              : 'bg-gray-400'
          } text-white font-bold py-3 rounded-full shadow-lg`}
        >
          {canAfford ? (
            <>
              <Lock className="mr-2 h-5 w-5" />
              Unlock for {creatureData.cost} 🪙
            </>
          ) : (
            'Not enough coins'
          )}
        </Button>
      ) : (
        <Button
          onClick={handleFartClick}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-full shadow-lg"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Tap for Fart!
        </Button>
      )}
    </motion.div>
  );
}
