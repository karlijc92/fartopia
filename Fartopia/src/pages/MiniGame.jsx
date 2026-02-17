import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Trophy } from 'lucide-react';
import CoinDisplay from '../components/CoinDisplay';
import { soundManager } from '../components/SoundManager';

const CREATURES = ['🦄', '🦏', '🐸', '🦙', '🐭', '🦍', '🐉', '🐼', '🧚', '🐦'];

export default function MiniGame() {

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [timeLeft, setTimeLeft] = useState(30);

  const [score, setScore] = useState(0);

  const [gameActive, setGameActive] = useState(false);

  const [activeCreatures, setActiveCreatures] = useState([]);

  const [gameOver, setGameOver] = useState(false);

  const { data: progress } = useQuery({

    queryKey: ['gameProgress'],

    queryFn: async () => {

      const progs = await base44.entities.GameProgress.list();

      return progs[0];

    },

    staleTime: 0,

    refetchOnWindowFocus: true,

  });

  // Update sound manager when settings change
  useEffect(() => {

    if (progress) {

      soundManager.setEnabled(progress.sound_enabled);

    }

  }, [progress?.sound_enabled]);

  const updateProgress = useMutation({

    // NOTE: pass BOTH coinsEarned and finalScore
    mutationFn: async ({ coinsEarned, finalScore }) => {

      if (!progress) return;

      const currentCoins = progress.coins || 0;

      const currentHigh = progress.high_score || 0;

      const newCoins = currentCoins + coinsEarned;

      const newHigh = Math.max(currentHigh, finalScore);

      const result = await base44.entities.GameProgress.update(progress.id, {

        coins: newCoins,

        high_score: newHigh,

      });

      return result;

    },

    onSuccess: (data) => {

      // instant UI update
      queryClient.setQueryData(['gameProgress'], data);

      // background verification
      queryClient.invalidateQueries(['gameProgress']);

    },

  });

  useEffect(() => {

    if (gameActive && timeLeft > 0) {

      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);

      return () => clearTimeout(timer);

    }

    if (timeLeft === 0 && gameActive) {

      // finalize game using the final score
      const finalScore = score;

      const coinsEarned = finalScore * 10;

      setGameActive(false);

      setGameOver(true);

      updateProgress.mutate({ coinsEarned, finalScore });

    }

  }, [timeLeft, gameActive, score]);

  useEffect(() => {

    if (gameActive) {

      const interval = setInterval(() => {

        if (Math.random() > 0.5) {

          const creature = {

            id: Date.now(),

            emoji: CREATURES[Math.floor(Math.random() * CREATURES.length)],

            x: Math.random() * 80,

            y: Math.random() * 70,

          };

          setActiveCreatures((prev) => [...prev, creature]);

          setTimeout(() => {

            setActiveCreatures((prev) => prev.filter((c) => c.id !== creature.id));

          }, 1500);

        }

      }, 800);

      return () => clearInterval(interval);

    }

  }, [gameActive]);

  const startGame = () => {

    soundManager.playClickSound();

    setGameActive(true);

    setTimeLeft(30);

    setScore(0);

    setGameOver(false);

    setActiveCreatures([]);

  };

  const tapCreature = (creatureId) => {

    const fartSounds = ['bubble', 'squeak', 'cloud', 'whistle', 'sparkle'];

    const randomSound = fartSounds[Math.floor(Math.random() * fartSounds.length)];

    soundManager.playFartSound(randomSound);

    soundManager.playCoinSound();

    setScore((prev) => prev + 1);

    setActiveCreatures((prev) => prev.filter((c) => c.id !== creatureId));

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 p-6">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">

          <Button

            onClick={() => {

              soundManager.playClickSound();

              navigate(createPageUrl('Home'));

            }}

            variant="outline"

            className="bg-white/80 backdrop-blur-sm rounded-full"

          >

            <ArrowLeft className="mr-2 h-5 w-5" />

            Back

          </Button>

          <CoinDisplay coins={progress?.coins || 0} />

        </div>

        {/* Game area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">

          <div className="text-center mb-6">

            <h1 className="text-5xl font-black text-purple-700 mb-2">
              💨 TAP THE FARTS! 💨
            </h1>

            <p className="text-xl text-gray-700">
              Tap the creatures as fast as you can!
            </p>

          </div>

          {/* Stats */}
          <div className="flex justify-around mb-6 text-center">

            <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-2xl p-4 min-w-[120px]">

              <div className="text-3xl font-bold">{timeLeft}s</div>

              <div className="text-sm">Time Left</div>

            </div>

            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-2xl p-4 min-w-[120px]">

              <div className="text-3xl font-bold">{score}</div>

              <div className="text-sm">Score</div>

            </div>

          </div>

          {/* Game screen */}
          <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl h-[400px] border-8 border-white shadow-inner overflow-hidden">

            {!gameActive && !gameOver && (

              <div className="flex items-center justify-center h-full">

                <Button

                  onClick={startGame}

                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-3xl px-12 py-8 rounded-full shadow-2xl"

                >

                  START GAME! 🎮

                </Button>

              </div>

            )}

            {gameOver && (

              <motion.div

                initial={{ opacity: 0, scale: 0.5 }}

                animate={{ opacity: 1, scale: 1 }}

                className="flex flex-col items-center justify-center h-full"

              >

                <Trophy className="h-20 w-20 text-yellow-500 mb-4" />

                <h2 className="text-4xl font-bold text-purple-700 mb-2">
                  Game Over!
                </h2>

                <p className="text-2xl mb-4">
                  You scored: {score} points
                </p>

                <p className="text-xl text-green-600 font-bold mb-6">
                  You earned {score * 10} coins! 🪙
                </p>

                <Button

                  onClick={startGame}

                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl px-8 py-6 rounded-full"

                >

                  Play Again!

                </Button>

              </motion.div>

            )}

            <AnimatePresence>

              {activeCreatures.map((creature) => (

                <motion.button

                  key={creature.id}

                  initial={{ scale: 0, rotate: -180 }}

                  animate={{ scale: 1, rotate: 0 }}

                  exit={{ scale: 0, rotate: 180 }}

                  onClick={() => tapCreature(creature.id)}

                  className="absolute text-6xl cursor-pointer hover:scale-125 transition-transform"

                  style={{

                    left: `${creature.x}%`,

                    top: `${creature.y}%`,

                  }}

                >

                  {creature.emoji}

                  <motion.span

                    className="absolute -top-2 -right-2 text-3xl"

                    animate={{ scale: [1, 1.5, 1] }}

                    transition={{ duration: 0.5, repeat: Infinity }}

                  >

                    💨

                  </motion.span>

                </motion.button>

              ))}

            </AnimatePresence>

          </div>

          {progress?.high_score > 0 && (

            <div className="text-center mt-6 text-gray-600">

              High Score: {progress.high_score} points

            </div>

          )}

        </div>

      </div>

    </div>

  );

}
