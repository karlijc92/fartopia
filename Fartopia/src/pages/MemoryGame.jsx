import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Trophy, Star } from 'lucide-react';
import CoinDisplay from '../components/CoinDisplay';
import { soundManager } from '../components/SoundManager';

const CREATURES = ['🦄', '🐸', '🦙', '🐭', '🐼', '🧚', '👽', '🐬', '🔥', '🦋'];

export default function MemoryGame() {

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [cards, setCards] = useState([]);

  const [flipped, setFlipped] = useState([]);

  const [matched, setMatched] = useState([]);

  const [moves, setMoves] = useState(0);

  const [gameActive, setGameActive] = useState(false);

  const [gameOver, setGameOver] = useState(false);

  const [bonusLevel, setBonusLevel] = useState(false);

  const [level, setLevel] = useState(1);

  const { data: progress } = useQuery({

    queryKey: ['gameProgress'],

    queryFn: async () => {

      const progs = await base44.entities.GameProgress.list();

      return progs[0];

    },

    staleTime: 0,

    refetchOnWindowFocus: true,

  });

  const updateProgress = useMutation({

    mutationFn: async (coinsEarned) => {

      if (!progress) return;

      const currentCoins = progress.coins || 0;

      const newTotal = currentCoins + coinsEarned;

      const result = await base44.entities.GameProgress.update(progress.id, {

        coins: newTotal,

      });

      return result;

    },

    onSuccess: (data) => {

      queryClient.setQueryData(['gameProgress'], data);

      queryClient.invalidateQueries(['gameProgress']);

    },

  });

  const initializeGame = (numPairs = 6) => {

    const selectedCreatures = CREATURES.slice(0, numPairs);

    const cardPairs = [...selectedCreatures, ...selectedCreatures];

    const shuffled = cardPairs

      .sort(() => Math.random() - 0.5)

      .map((emoji, index) => ({

        id: index,

        emoji,

      }));

    setCards(shuffled);

    setFlipped([]);

    setMatched([]);

    setMoves(0);

    setGameActive(true);

    setGameOver(false);

  };

  const startGame = () => {

    soundManager.playClickSound();

    setLevel(1);

    setBonusLevel(false);

    initializeGame(6);

  };

  const startBonusLevel = () => {

    soundManager.playUnlockSound();

    setBonusLevel(true);

    initializeGame(10);

  };

  const handleCardClick = (cardId) => {

    if (flipped.length === 2 || flipped.includes(cardId) || matched.includes(cardId)) return;

    soundManager.playClickSound();

    const newFlipped = [...flipped, cardId];

    setFlipped(newFlipped);

    if (newFlipped.length === 2) {

      setMoves((prev) => prev + 1);

      const [first, second] = newFlipped;

      const firstCard = cards.find(c => c.id === first);

      const secondCard = cards.find(c => c.id === second);

      if (firstCard.emoji === secondCard.emoji) {

        soundManager.playFartSound('sparkle');

        soundManager.playCoinSound();

        const newMatched = [...matched, first, second];

        setMatched(newMatched);

        setFlipped([]);

        if (newMatched.length === cards.length) {

          setTimeout(() => {

            const baseCoins = bonusLevel ? 500 : 200;

            const bonusCoins = Math.max(0, (20 - moves) * 10);

            const totalCoins = baseCoins + bonusCoins;

            updateProgress.mutate(totalCoins);

            setGameOver(true);

            setGameActive(false);

          }, 500);

        }

      } else {

        soundManager.playFartSound('squeak');

        setTimeout(() => setFlipped([]), 1000);

      }

    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-6">

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

            <h1 className="text-5xl font-black text-purple-700 mb-2">

              {bonusLevel ? '⭐ BONUS LEVEL! ⭐' : '🧠 MEMORY MATCH 🧠'}

            </h1>

            <p className="text-xl text-gray-700">

              Find matching pairs!

            </p>

          </div>

          {/* Game UI unchanged */}

        </div>

      </div>

    </div>

  );

}
