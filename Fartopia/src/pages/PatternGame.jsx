// src/pages/PatternGame.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Trophy } from 'lucide-react';
import CoinDisplay from '../components/CoinDisplay';
import { soundManager } from '../components/SoundManager';
import { GameProgress } from '@/utils/GameProgress';

const SOUNDS = [
  { id: 'bubble', emoji: '🫧', color: 'from-blue-400 to-cyan-500', sound: 'bubble' },
  { id: 'sparkle', emoji: '✨', color: 'from-purple-400 to-pink-500', sound: 'sparkle' },
  { id: 'thunder', emoji: '⚡', color: 'from-yellow-400 to-orange-500', sound: 'thunder' },
  { id: 'whistle', emoji: '🎵', color: 'from-green-400 to-emerald-500', sound: 'whistle' },
];

export default function PatternGame() {
  const navigate = useNavigate();

  // Local coin state (display only) sourced from GameProgress
  const [coins, setCoins] = useState(0);

  const [level, setLevel] = useState(1);
  const [pattern, setPattern] = useState([]);
  const [playerPattern, setPlayerPattern] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [canPlay, setCanPlay] = useState(false);

  // On mount, load coins from local-only progress
  useEffect(() => {
    setCoins(GameProgress.getCoins());
  }, []);

  const startGame = () => {
    soundManager.playClickSound();
    setLevel(1);
    setGameActive(true);
    setGameOver(false);
    startNewRound([]);
  };

  const startNewRound = (currentPattern) => {
    const newPattern = [
      ...currentPattern,
      SOUNDS[Math.floor(Math.random() * SOUNDS.length)],
    ];

    setPattern(newPattern);
    setPlayerPattern([]);
    playPattern(newPattern);
  };

  const playPattern = async (patternToPlay) => {
    setIsPlaying(true);
    setCanPlay(false);

    for (let i = 0; i < patternToPlay.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));

      soundManager.playFartSound(patternToPlay[i].sound);

      const element = document.getElementById(`sound-${patternToPlay[i].id}`);
      if (element) {
        element.classList.add('ring-4', 'ring-white');
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-white');
        }, 400);
      }
    }

    setIsPlaying(false);
    setCanPlay(true);
  };

  const awardCoins = (amount) => {
    if (amount <= 0) return;
    GameProgress.addCoins(amount);
    setCoins(GameProgress.getCoins());
  };

  const handleSoundClick = (sound) => {
    if (!canPlay || isPlaying) return;

    soundManager.playFartSound(sound.sound);

    const newPlayerPattern = [...playerPattern, sound];
    setPlayerPattern(newPlayerPattern);

    const currentIndex = newPlayerPattern.length - 1;

    // Wrong input -> game over + award coins
    if (pattern[currentIndex].id !== sound.id) {
      soundManager.playFartSound('squeak');

      setGameOver(true);
      setGameActive(false);

      const earnedCoins = (level - 1) * 50;
      awardCoins(earnedCoins);

      return;
    }

    // Completed the round -> next level
    if (newPlayerPattern.length === pattern.length) {
      soundManager.playCoinSound();
      setLevel(prev => prev + 1);
      setCanPlay(false);

      setTimeout(() => {
        startNewRound(pattern);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 p-6">
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

          <CoinDisplay coins={coins} />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-5xl font-black text-purple-700 mb-2">
              🎵 PATTERN MASTER 🎵
            </h1>
            <p className="text-xl text-gray-700">
              Remember the fart sequence!
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-2xl p-4 min-w-[120px] text-center">
              <div className="text-3xl font-bold">{level}</div>
              <div className="text-sm">Level</div>
            </div>
          </div>

          {!gameActive && !gameOver && (
            <div className="flex items-center justify-center h-[400px]">
              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-3xl px-12 py-8 rounded-full shadow-2xl"
              >
                START GAME! 🎮
              </Button>
            </div>
          )}

          {gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <Trophy className="h-20 w-20 text-yellow-500 mb-4" />

              <h2 className="text-4xl font-bold text-purple-700 mb-2">
                Game Over!
              </h2>

              <p className="text-2xl mb-4">
                You reached level {level}
              </p>

              {level > 1 && (
                <p className="text-xl text-green-600 font-bold mb-6">
                  You earned {(level - 1) * 50} coins! 🪙
                </p>
              )}

              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl px-8 py-6 rounded-full"
              >
                Play Again!
              </Button>
            </motion.div>
          )}

          {gameActive && (
            <div>
              <div className="text-center mb-6">
                {isPlaying && (
                  <p className="text-2xl font-bold text-purple-700 animate-pulse">
                    Watch & Listen! 👀
                  </p>
                )}

                {canPlay && (
                  <p className="text-2xl font-bold text-green-700">
                    Your Turn! Repeat the pattern! 🎯
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                {SOUNDS.map(sound => (
                  <motion.button
                    key={sound.id}
                    id={`sound-${sound.id}`}
                    whileHover={{ scale: canPlay ? 1.05 : 1 }}
                    whileTap={{ scale: canPlay ? 0.95 : 1 }}
                    onClick={() => handleSoundClick(sound)}
                    disabled={!canPlay}
                    className={`aspect-square rounded-3xl text-6xl font-bold bg-gradient-to-br ${sound.color} text-white shadow-lg ${
                      canPlay ? 'hover:shadow-2xl' : 'opacity-70'
                    }`}
                  >
                    {sound.emoji}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
