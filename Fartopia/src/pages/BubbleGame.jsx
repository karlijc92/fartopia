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

export default function BubbleGame() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [bubbles, setBubbles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [combo, setCombo] = useState(0);

  const { data: progress } = useQuery({
    queryKey: ['gameProgress'],
    queryFn: async () => {
      const progs = await base44.entities.GameProgress.list();
      return progs[0];
    },
  });

  const updateProgress = useMutation({
    mutationFn: async (coins) => {
      return await base44.entities.GameProgress.update(progress.id, {
        coins: progress.coins + coins,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['gameProgress']);
    },
  });

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      setGameOver(true);
      updateProgress.mutate(score * 5);
    }
  }, [timeLeft, gameActive]);

  useEffect(() => {
    if (gameActive) {
      const interval = setInterval(() => {
        const bubble = {
          id: Date.now(),
          x: Math.random() * 80,
          y: 100,
          speed: 1 + Math.random() * 2,
          size: 50 + Math.random() * 30,
          points: Math.floor(1 + Math.random() * 3),
        };
        setBubbles((prev) => [...prev, bubble]);
      }, 600);
      return () => clearInterval(interval);
    }
  }, [gameActive]);

  useEffect(() => {
    if (gameActive) {
      const moveInterval = setInterval(() => {
        setBubbles((prev) =>
          prev.map((bubble) => ({
            ...bubble,
            y: bubble.y - bubble.speed,
          })).filter((bubble) => bubble.y > -20)
        );
      }, 50);
      return () => clearInterval(moveInterval);
    }
  }, [gameActive]);

  const startGame = () => {
    soundManager.playClickSound();
    setGameActive(true);
    setTimeLeft(45);
    setScore(0);
    setGameOver(false);
    setBubbles([]);
    setCombo(0);
  };

  const popBubble = (bubbleId, points) => {
    soundManager.playFartSound('bubble');
    soundManager.playCoinSound();
    const newCombo = combo + 1;
    setCombo(newCombo);
    const comboBonus = newCombo > 5 ? 2 : 1;
    setScore((prev) => prev + (points * comboBonus));
    setBubbles((prev) => prev.filter((b) => b.id !== bubbleId));
    
    setTimeout(() => {
      setCombo((c) => Math.max(0, c - 1));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-blue-200 to-purple-200 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => {
              soundManager.playClickSound();
              navigate(createPageUrl('GameMenu'));
            }}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm rounded-full"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          <CoinDisplay coins={progress?.coins || 0} />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-5xl font-black text-blue-700 mb-2">💭 BUBBLE POP 💭</h1>
            <p className="text-xl text-gray-700">Pop bubbles before they float away!</p>
          </div>

          <div className="flex justify-around mb-6 text-center">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl p-4 min-w-[120px]">
              <div className="text-3xl font-bold">{timeLeft}s</div>
              <div className="text-sm">Time Left</div>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-2xl p-4 min-w-[120px]">
              <div className="text-3xl font-bold">{score}</div>
              <div className="text-sm">Score</div>
            </div>
            {combo > 1 && (
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-2xl p-4 min-w-[120px]">
                <div className="text-3xl font-bold">{combo}x</div>
                <div className="text-sm">Combo!</div>
              </div>
            )}
          </div>

          <div className="relative bg-gradient-to-b from-blue-100 to-cyan-100 rounded-3xl h-[500px] border-8 border-white shadow-inner overflow-hidden">
            {!gameActive && !gameOver && (
              <div className="flex items-center justify-center h-full">
                <Button
                  onClick={startGame}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-3xl px-12 py-8 rounded-full shadow-2xl"
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
                <h2 className="text-4xl font-bold text-blue-700 mb-2">Game Over!</h2>
                <p className="text-2xl mb-4">You scored: {score} points</p>
                <p className="text-xl text-green-600 font-bold mb-6">
                  You earned {score * 5} coins! 🪙
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
              {bubbles.map((bubble) => (
                <motion.button
                  key={bubble.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={() => popBubble(bubble.id, bubble.points)}
                  className="absolute cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    left: `${bubble.x}%`,
                    bottom: `${bubble.y}%`,
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                  }}
                >
                  <div className="relative w-full h-full">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-cyan-300 opacity-70 border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold text-blue-700">
                      {bubble.points}
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
