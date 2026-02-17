import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Trophy, Zap, Brain, Coins } from 'lucide-react';
import CoinDisplay from '../components/CoinDisplay';
import { soundManager } from '../components/SoundManager';

export default function GameMenu() {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: progress } = useQuery({
    queryKey: ['gameProgress'],
    queryFn: async () => {

      const progs =
        await base44.entities.GameProgress.list();

      if (!progs || progs.length === 0) {

        const created =
          await base44.entities.GameProgress.create({

            coins: 0,
            high_score: 0,
            sound_enabled: true,
            vibration_enabled: true,
            ads_removed: false

          });

        return created;

      }

      return progs[0];

    }
  });

  const goToGame = (gameName) => {

    soundManager.playClickSound();

    navigate(
      createPageUrl(gameName)
    );

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200 p-6">

      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <Button

            onClick={() => {

              soundManager.playClickSound();

              navigate(
                createPageUrl('Home')
              );

            }}

            variant="outline"
            className="bg-white/80 backdrop-blur-sm rounded-full"

          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back

          </Button>

          <CoinDisplay
            coins={progress?.coins || 0}
          />

        </div>

        {/* Title */}

        <div className="text-center mb-8">

          <h1 className="text-5xl font-black text-purple-700 mb-2">

            🎮 Game Zone 🎮

          </h1>

          <p className="text-xl text-gray-700">

            Play games and earn coins!

          </p>

        </div>

        {/* Games Grid */}

        <div className="grid md:grid-cols-3 gap-6">

          {/* Pattern Game */}

          <motion.div

            whileHover={{ scale: 1.05 }}

            className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl p-6 shadow-xl text-white text-center"

          >

            <Brain className="h-16 w-16 mx-auto mb-4" />

            <h2 className="text-2xl font-bold mb-2">

              Pattern Master

            </h2>

            <p className="mb-4">

              Repeat fart sequences

            </p>

            <Button

              onClick={() => goToGame('PatternGame')}

              className="bg-white text-purple-600 font-bold text-xl px-8 py-4 rounded-full"

            >

              Play

            </Button>

          </motion.div>

          {/* Race Game */}

          <motion.div

            whileHover={{ scale: 1.05 }}

            className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl p-6 shadow-xl text-white text-center"

          >

            <Zap className="h-16 w-16 mx-auto mb-4" />

            <h2 className="text-2xl font-bold mb-2">

              Creature Race

            </h2>

            <p className="mb-4">

              Pick and win coins

            </p>

            <Button

              onClick={() => goToGame('RaceGame')}

              className="bg-white text-green-600 font-bold text-xl px-8 py-4 rounded-full"

            >

              Play

            </Button>

          </motion.div>

          {/* Future expansion */}

          <motion.div

            whileHover={{ scale: 1.05 }}

            className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6 shadow-xl text-white text-center"

          >

            <Trophy className="h-16 w-16 mx-auto mb-4" />

            <h2 className="text-2xl font-bold mb-2">

              More Games Soon

            </h2>

            <p className="mb-4">

              New coin games coming

            </p>

            <Button

              onClick={() => {}}

              disabled

              className="bg-white/50 text-white font-bold text-xl px-8 py-4 rounded-full"

            >

              Locked

            </Button>

          </motion.div>

        </div>

        {/* Monetization prompt */}

        <div className="mt-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6 text-white text-center shadow-xl">

          <Coins className="h-10 w-10 mx-auto mb-2" />

          <h3 className="text-2xl font-bold">

            Earn coins faster in the Shop!

          </h3>

          <Button

            onClick={() => navigate(
              createPageUrl('Shop')
            )}

            className="mt-4 bg-white text-orange-600 font-bold text-xl px-8 py-4 rounded-full"

          >

            Go to Shop

          </Button>

        </div>

      </div>

    </div>

  );

}
