import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Trophy, Zap } from 'lucide-react';
import CoinDisplay from '../components/CoinDisplay';
import { soundManager } from '../components/SoundManager';

const RACERS = [
  { id: 1, emoji: '🦄', name: 'Unicorn' },
  { id: 2, emoji: '🐉', name: 'Dragon' },
  { id: 3, emoji: '🦙', name: 'Llama' },
  { id: 4, emoji: '🐸', name: 'Frog' },
];

export default function RaceGame() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [racing, setRacing] = useState(false);
  const [positions, setPositions] = useState({});
  const [winner, setWinner] = useState(null);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [gameOver, setGameOver] = useState(false);

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

  const startRace = () => {
    if (!playerChoice) return;
    soundManager.playClickSound();
    setRacing(true);
    setGameOver(false);
    setWinner(null);
    
    const initialPositions = {};
    RACERS.forEach(racer => {
      initialPositions[racer.id] = 0;
    });
    setPositions(initialPositions);
  };

  useEffect(() => {
    if (racing) {
      const interval = setInterval(() => {
        setPositions((prev) => {
          const newPositions = { ...prev };
          let raceFinished = false;
          
          RACERS.forEach((racer) => {
            if (newPositions[racer.id] < 100) {
              newPositions[racer.id] += Math.random() * 3;
              if (newPositions[racer.id] >= 100 && !winner) {
                newPositions[racer.id] = 100;
                setWinner(racer.id);
                setRacing(false);
                setGameOver(true);
                raceFinished = true;
                
                if (racer.id === playerChoice) {
                  soundManager.playUnlockSound();
                  updateProgress.mutate(300);
                } else {
                  soundManager.playFartSound('squeak');
                }
              }
            }
          });
          
          return newPositions;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [racing, winner]);

  const chooseRacer = (racerId) => {
    soundManager.playClickSound();
    setPlayerChoice(racerId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-emerald-200 to-teal-200 p-6">
      <div className="max-w-5xl mx-auto">
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
            <h1 className="text-5xl font-black text-green-700 mb-2">🏁 CREATURE RACE 🏁</h1>
            <p className="text-xl text-gray-700">Pick a racer and win big!</p>
          </div>

          {!playerChoice && !gameOver && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-center mb-4 text-purple-700">
                Choose Your Racer!
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {RACERS.map((racer) => (
                  <Button
                    key={racer.id}
                    onClick={() => chooseRacer(racer.id)}
                    className="h-32 text-5xl bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 rounded-2xl flex flex-col items-center justify-center gap-2"
                  >
                    {racer.emoji}
                    <span className="text-sm text-white">{racer.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {playerChoice && !racing && !gameOver && (
            <div className="text-center mb-6">
              <p className="text-xl mb-4">
                You chose: {RACERS.find(r => r.id === playerChoice)?.emoji} {RACERS.find(r => r.id === playerChoice)?.name}
              </p>
              <Button
                onClick={startRace}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-2xl px-12 py-6 rounded-full shadow-2xl"
              >
                <Zap className="mr-2 h-6 w-6" />
                START RACE!
              </Button>
            </div>
          )}

          <div className="space-y-4 mb-6">
            {RACERS.map((racer) => {
              const position = positions[racer.id] || 0;
              const isPlayer = racer.id === playerChoice;
              const isWinner = racer.id === winner;
              
              return (
                <div key={racer.id} className="relative">
                  <div className={`h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden border-4 ${isPlayer ? 'border-yellow-400' : 'border-gray-400'}`}>
                    <motion.div
                      className={`h-full flex items-center justify-start pl-4 text-4xl ${isWinner ? 'bg-gradient-to-r from-yellow-300 to-orange-400' : 'bg-gradient-to-r from-blue-300 to-purple-400'}`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${position}%` }}
                      transition={{ duration: 0.1 }}
                    >
                      {racer.emoji}
                      {isPlayer && <span className="text-2xl ml-2">⭐</span>}
                    </motion.div>
                  </div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-600">
                    {racer.name}
                  </div>
                </div>
              );
            })}
          </div>

          {gameOver && winner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-green-700 mb-4">
                {RACERS.find(r => r.id === winner)?.emoji} {RACERS.find(r => r.id === winner)?.name} Wins!
              </h2>
              {winner === playerChoice ? (
                <div>
                  <p className="text-2xl text-green-600 font-bold mb-4">
                    🎉 YOU WON! 🎉
                  </p>
                  <p className="text-xl text-green-600 font-bold mb-6">
                    You earned 300 coins! 🪙
                  </p>
                </div>
              ) : (
                <p className="text-xl text-gray-600 mb-6">Better luck next time!</p>
              )}
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => {
                    setPlayerChoice(null);
                    setGameOver(false);
                    setWinner(null);
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl px-8 py-6 rounded-full"
                >
                  Race Again!
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
