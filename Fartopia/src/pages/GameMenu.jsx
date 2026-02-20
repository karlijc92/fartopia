import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import CoinDisplay from '../components/CoinDisplay';
import { GameProgress } from '../utils/GameProgress';
import { soundManager } from '../components/SoundManager';

const GAMES = [
  {
    id: 'MiniGame',
    name: 'Tap The Farts',
    emoji: '💨',
    color: 'from-blue-400 to-purple-500'
  },
  {
    id: 'MemoryGame',
    name: 'Memory Madness',
    emoji: '🧠',
    color: 'from-pink-400 to-rose-500'
  },
  {
    id: 'PatternGame',
    name: 'Pattern Master',
    emoji: '🎵',
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 'RaceGame',
    name: 'Booty Race',
    emoji: '🏁',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'BubbleGame',
    name: 'Bubble Pop',
    emoji: '🫧',
    color: 'from-cyan-400 to-blue-500'
  }
];

export default function GameMenu() {

  const coins = GameProgress.getCoins();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-100 p-6">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <Link to={createPageUrl('Home')} onClick={() => soundManager.playClickSound()}>
            <Button variant="outline" className="bg-white/80 backdrop-blur-sm rounded-full">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
          </Link>

          <CoinDisplay coins={coins} />

        </div>

        <motion.h1
          className="text-5xl font-black text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎮 Choose Your Game
        </motion.h1>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {GAMES.map((game) => (

            <Link
              key={game.id}
              to={createPageUrl(game.id)}
              onClick={() => soundManager.playClickSound()}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-3xl p-8 text-center text-white shadow-xl bg-gradient-to-br ${game.color}`}
              >
                <div className="text-6xl mb-4">{game.emoji}</div>
                <h2 className="text-2xl font-bold">{game.name}</h2>
              </motion.div>
            </Link>

          ))}

        </div>

      </div>

    </div>
  );
}
