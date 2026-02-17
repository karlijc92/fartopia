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

  /*
  ============================
  LOAD GAME PROGRESS
  ============================
  */
  const { data: progress } = useQuery({
    queryKey: ['gameProgress'],
    queryFn: async () => {
      const progs = await base44.entities.GameProgress.list();

      if (!progs || progs.length === 0) {

        // create progress if none exists
        const newProgress = await base44.entities.GameProgress.create({
          coins: 0
        });

        return newProgress;
      }

      return progs[0];
    },
  });

  /*
  ============================
  FIXED COIN UPDATE
  ============================
  */
  const updateProgress = useMutation({

    mutationFn: async (coinsEarned) => {

      if (!progress) return;

      const newTotal = (progress.coins || 0) + coinsEarned;

      const result = await base44.entities.GameProgress.update(
        progress.id,
        { coins: newTotal }
      );

      return result;
    },

    onSuccess: (updatedProgress) => {

      // instantly update UI
      queryClient.setQueryData(['gameProgress'], updatedProgress);

      // ensure backend sync
      queryClient.invalidateQueries(['gameProgress']);
    },
  });

  /*
  ============================
  TIMER
  ============================
  */
  useEffect(() => {

    if (gameActive && timeLeft > 0) {

      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (timeLeft === 0 && gameActive) {

      setGameActive(false);
      setGameOver(true);

      const coinsEarned = score * 5;

      updateProgress.mutate(coinsEarned);
    }

  }, [timeLeft, gameActive]);

  /*
  ============================
  SPAWN BUBBLES
  ============================
  */
  useEffect(() => {

    if (!gameActive) return;

    const interval = setInterval(() => {

      const bubble = {
        id: Date.now(),
        x: Math.random() * 80,
        y: 100,
        speed: 1 + Math.random() * 2,
        size: 50 + Math.random() * 30,
        points: Math.floor(1 + Math.random() * 3),
      };

      setBubbles(prev => [...prev, bubble]);

    }, 600);

    return () => clearInterval(interval);

  }, [gameActive]);

  /*
  ============================
  MOVE BUBBLES
  ============================
  */
  useEffect(() => {

    if (!gameActive) return;

    const interval = setInterval(() => {

      setBubbles(prev =>
        prev
          .map(b => ({ ...b, y: b.y - b.speed }))
          .filter(b => b.y > -20)
      );

    }, 50);

    return () => clearInterval(interval);

  }, [gameActive]);

  /*
  ============================
  START GAME
  ============================
  */
  function startGame() {

    soundManager.playClickSound();

    setGameActive(true);
    setTimeLeft(45);
    setScore(0);
    setGameOver(false);
    setBubbles([]);
    setCombo(0);
  }

  /*
  ============================
  POP BUBBLE
  ============================
  */
  function popBubble(id, points) {

    soundManager.playFartSound('bubble');
    soundManager.playCoinSound();

    const newCombo = combo + 1;

    setCombo(newCombo);

    const comboBonus = newCombo > 5 ? 2 : 1;

    setScore(prev => prev + (points * comboBonus));

    setBubbles(prev =>
      prev.filter(b => b.id !== id)
    );

    setTimeout(() => {
      setCombo(c => Math.max(0, c - 1));
    }, 2000);
  }

  /*
  ============================
  UI
  ============================
  */
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

            <h1 className="text-5xl font-black text-blue-700 mb-2">
              💭 BUBBLE POP 💭
            </h1>

            <p className="text-xl text-gray-700">
              Pop bubbles before they float away!
            </p>

          </div>

          <div className="flex justify-around mb-6 text-center">

            <div className="bg-blue-500 text-white rounded-2xl p-4">
              <div className="text-3xl font-bold">{timeLeft}s</div>
              <div>Time</div>
            </div>

            <div className="bg-purple-500 text-white rounded-2xl p-4">
              <div className="text-3xl font-bold">{score}</div>
              <div>Score</div>
            </div>

          </div>

          <div className="relative bg-blue-100 rounded-3xl h-[500px] overflow-hidden">

            {!gameActive && !gameOver && (

              <div className="flex justify-center items-center h-full">

                <Button onClick={startGame}>
                  START GAME
                </Button>

              </div>

            )}

            {gameOver && (

              <div className="flex flex-col items-center justify-center h-full">

                <Trophy className="h-20 w-20 text-yellow-500 mb-4" />

                <h2 className="text-4xl font-bold mb-2">
                  Game Over!
                </h2>

                <p className="text-xl mb-4">
                  Coins earned: {score * 5}
                </p>

                <Button onClick={startGame}>
                  Play Again
                </Button>

              </div>

            )}

            <AnimatePresence>

              {bubbles.map(bubble => (

                <motion.button
                  key={bubble.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={() => popBubble(bubble.id, bubble.points)}
                  className="absolute"
                  style={{
                    left: `${bubble.x}%`,
                    bottom: `${bubble.y}%`,
                    width: bubble.size,
                    height: bubble.size
                  }}
                >

                  <div className="bg-white rounded-full w-full h-full flex items-center justify-center">
                    {bubble.points}
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
