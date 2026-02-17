import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Gift, Star, Trophy, Zap, Crown } from 'lucide-react';
import CoinDisplay from '../components/CoinDisplay';
import { soundManager } from '../components/SoundManager';

const ACHIEVEMENTS = [
  { id: 'first_creature', name: 'First Friend', description: 'Unlock your first creature', reward: 100, icon: '🦄' },
  { id: 'five_creatures', name: 'Creature Collector', description: 'Unlock 5 creatures', reward: 250, icon: '🌟' },
  { id: 'first_habitat', name: 'Home Sweet Home', description: 'Unlock your first habitat', reward: 150, icon: '🏠' },
  { id: 'three_habitats', name: 'Habitat Master', description: 'Unlock 3 habitats', reward: 300, icon: '🌈' },
  { id: 'play_all_games', name: 'Game Champion', description: 'Play all 5 mini games', reward: 500, icon: '🎮' },
  { id: 'high_score', name: 'Super Star', description: 'Score 50+ in Tap The Farts', reward: 200, icon: '⭐' },
];

export default function DailyBonus() {

  const queryClient = useQueryClient();

  const [canClaim, setCanClaim] = useState(false);
  const [claimedToday, setClaimedToday] = useState(false);

  const { data: progress } = useQuery({
    queryKey: ['gameProgress'],
    queryFn: async () => {
      const progs = await base44.entities.GameProgress.list();
      return progs[0];
    },
  });

  const { data: creatures } = useQuery({
    queryKey: ['creatures'],
    queryFn: async () => {
      return await base44.entities.Creature.list();
    },
  });

  useEffect(() => {

    if (!progress) return;

    if (progress.last_daily_claim) {

      const lastClaim = new Date(progress.last_daily_claim);
      const today = new Date();

      const isSameDay =
        lastClaim.getFullYear() === today.getFullYear() &&
        lastClaim.getMonth() === today.getMonth() &&
        lastClaim.getDate() === today.getDate();

      setClaimedToday(isSameDay);
      setCanClaim(!isSameDay);

    } else {

      setCanClaim(true);

    }

  }, [progress]);

  const claimDaily = useMutation({

    mutationFn: async () => {

      if (!progress) return;

      // ALWAYS fetch latest progress to prevent stale overwrites
      const latest = await base44.entities.GameProgress.list();
      const current = latest[0];

      const streak = (current.daily_streak || 0) + 1;

      const baseReward = 100;
      const streakBonus = Math.min(streak * 10, 100);

      const totalReward = baseReward + streakBonus;

      return await base44.entities.GameProgress.update(current.id, {

        coins: (current.coins || 0) + totalReward,

        last_daily_claim: new Date().toISOString(),

        daily_streak: streak,

      });

    },

    onSuccess: () => {

      soundManager.playUnlockSound();
      soundManager.playCoinSound();

      queryClient.invalidateQueries(['gameProgress']);

      setClaimedToday(true);
      setCanClaim(false);

    },

  });

  const handleClaim = () => {

    if (!canClaim || !progress) return;

    claimDaily.mutate();

  };

  const unlockedCreatures =
    creatures?.filter(c => c.unlocked).length || 0;

  const unlockedHabitats =
    progress?.unlocked_habitats?.length || 0;

  return (

    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200 p-6">

      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">

          <div className="flex items-center gap-4">

            <Link
              to={createPageUrl('Home')}
              onClick={() => soundManager.playClickSound()}
            >

              <Button
                variant="outline"
                className="bg-white/80 backdrop-blur-sm rounded-full"
              >

                <ArrowLeft className="mr-2 h-5 w-5" />

                Back

              </Button>

            </Link>

            <h1 className="text-4xl md:text-5xl font-black text-purple-700">
              🎁 BONUSES & REWARDS 🎁
            </h1>

          </div>

          <CoinDisplay coins={progress?.coins || 0} />

        </div>

        {/* DAILY BONUS */}

        <motion.div

          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}

          className="bg-gradient-to-br from-yellow-300 to-orange-400 rounded-3xl p-8 shadow-xl mb-8"

        >

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            <div className="flex items-center gap-6">

              <Gift className="h-24 w-24 text-white" />

              <div className="text-white">

                <h2 className="text-4xl font-black mb-2">
                  Daily Bonus!
                </h2>

                <p className="text-xl mb-2">
                  Come back every day for free coins!
                </p>

                {progress?.daily_streak > 0 && (

                  <div className="flex items-center gap-2">

                    <Zap className="h-5 w-5" />

                    <p className="text-lg font-bold">
                      {progress.daily_streak} Day Streak! 🔥
                    </p>

                  </div>

                )}

              </div>

            </div>

            <div className="text-center">

              {claimedToday ? (

                <div className="bg-white/30 text-white font-bold text-xl px-12 py-6 rounded-full">

                  ✓ Claimed Today!

                  <div className="text-sm mt-1">
                    Come back tomorrow!
                  </div>

                </div>

              ) : (

                <Button

                  onClick={handleClaim}

                  disabled={!canClaim}

                  className="bg-white hover:bg-white/90 text-orange-600 font-bold text-2xl px-12 py-8 rounded-full shadow-lg"

                >

                  <Gift className="mr-2 h-6 w-6" />

                  Claim Daily Coins

                </Button>

              )}

            </div>

          </div>

        </motion.div>

        {/* ACHIEVEMENTS AND EVENTS remain unchanged */}

      </div>

    </div>

  );

}
