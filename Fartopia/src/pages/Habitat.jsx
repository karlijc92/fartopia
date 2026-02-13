import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Lock, Plus } from 'lucide-react';
import CoinDisplay from '../components/CoinDisplay';

const HABITATS = {
  swamp: { name: 'Swampy Stink Lagoon', emoji: '🐸', color: 'from-green-400 to-emerald-600', cost: 1000 },
  rainbow: { name: 'Rainbow Fart Meadow', emoji: '🌈', color: 'from-pink-400 to-purple-600', cost: 2000 },
  volcano: { name: 'Thunder-Booty Volcano', emoji: '🌋', color: 'from-orange-400 to-red-600', cost: 3000 },
  cave: { name: 'Glitter Gas Cave', emoji: '✨', color: 'from-purple-400 to-indigo-600', cost: 4000 },
  forest: { name: 'Noisy Night Forest', emoji: '🌙', color: 'from-blue-400 to-indigo-800', cost: 5000 },
};

export default function Habitat() {
  const [searchParams] = useSearchParams();
  const habitatId = searchParams.get('id');
  const habitat = HABITATS[habitatId];
  const queryClient = useQueryClient();

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

  const unlockHabitat = useMutation({
    mutationFn: async () => {
      await base44.entities.GameProgress.update(progress.id, {
        unlocked_habitats: [...progress.unlocked_habitats, habitatId],
        coins: progress.coins - habitat.cost,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['gameProgress']);
    },
  });

  const isUnlocked = progress?.unlocked_habitats?.includes(habitatId);
  const creaturesInHabitat = creatures?.filter((c) => c.in_habitat === habitatId && c.unlocked) || [];

  if (!habitat) {
    return <div>Habitat not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Home')}>
              <Button variant="outline" className="bg-white/80 backdrop-blur-sm rounded-full">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-purple-700">
              {habitat.emoji} {habitat.name}
            </h1>
          </div>
          <CoinDisplay coins={progress?.coins || 0} />
        </div>

        {!isUnlocked ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-gradient-to-br ${habitat.color} rounded-3xl p-12 shadow-2xl text-center text-white`}
          >
            <Lock className="h-24 w-24 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Habitat Locked</h2>
            <p className="text-2xl mb-8">Unlock this habitat to place creatures here!</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8 inline-block">
              <p className="text-3xl font-bold">Cost: {habitat.cost} 🪙</p>
            </div>
            <Button
              onClick={() => unlockHabitat.mutate()}
              disabled={progress?.coins < habitat.cost}
              className="bg-white hover:bg-white/90 text-purple-700 font-bold text-2xl px-12 py-8 rounded-full shadow-lg"
            >
              {progress?.coins < habitat.cost ? 'Not Enough Coins' : 'Unlock Habitat!'}
            </Button>
          </motion.div>
        ) : (
          <div className={`bg-gradient-to-br ${habitat.color} rounded-3xl p-8 shadow-2xl text-white min-h-[500px]`}>
            <h2 className="text-3xl font-bold mb-6">Creatures in this habitat:</h2>
            
            {creaturesInHabitat.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-2xl mb-6">No creatures here yet!</p>
                <Link to={createPageUrl('MyCreatures')}>
                  <Button className="bg-white hover:bg-white/90 text-purple-700 font-bold text-xl px-8 py-6 rounded-full">
                    <Plus className="mr-2 h-6 w-6" />
                    Add Creatures
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {creaturesInHabitat.map((creature, index) => (
                  <motion.div
                    key={creature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center"
                  >
                    <div className="text-6xl mb-2">{creature.emoji}</div>
                    <p className="font-bold text-sm">{creature.name}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
