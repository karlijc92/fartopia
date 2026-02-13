import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import CreatureCard from '../components/CreatureCard';
import CoinDisplay from '../components/CoinDisplay';
import { soundManager } from '../components/SoundManager';

const CREATURES_DATA = [
  { id: 'unicorn', name: 'Sparkle-Fart Unicorn', emoji: '🦄', rarity: 'Legendary', fart_sound: 'sparkle', cost: 500 },
  { id: 'rhino', name: 'Thunder Booty Rhino', emoji: '🦏', rarity: 'Epic', fart_sound: 'thunder', cost: 400 },
  { id: 'frog', name: 'Bubble Toot Frog', emoji: '🐸', rarity: 'Common', fart_sound: 'bubble', cost: 100 },
  { id: 'llama', name: 'Rainbow Gas Llama', emoji: '🦙', rarity: 'Rare', fart_sound: 'rainbow', cost: 300 },
  { id: 'mouse', name: 'Sneaky Squeaker Mouse', emoji: '🐭', rarity: 'Common', fart_sound: 'squeak', cost: 100 },
  { id: 'gorilla', name: 'Mega Poof Gorilla', emoji: '🦍', rarity: 'Epic', fart_sound: 'mega', cost: 400 },
  { id: 'dragon', name: 'Lightning Toot Dragon', emoji: '🐉', rarity: 'Legendary', fart_sound: 'lightning', cost: 500 },
  { id: 'panda', name: 'Cloudy Puff Panda', emoji: '🐼', rarity: 'Rare', fart_sound: 'cloud', cost: 300 },
  { id: 'fairy', name: 'Glitter Gas Fairy', emoji: '🧚', rarity: 'Epic', fart_sound: 'glitter', cost: 400 },
  { id: 'bird', name: 'Whistle-Butt Bird', emoji: '🐦', rarity: 'Common', fart_sound: 'whistle', cost: 100 },
  { id: 'alien', name: 'Space Poof Alien', emoji: '👽', rarity: 'Legendary', fart_sound: 'sparkle', cost: 500 },
  { id: 'octopus', name: 'Bubbly Octopus', emoji: '🐙', rarity: 'Rare', fart_sound: 'bubble', cost: 300 },
  { id: 'dolphin', name: 'Singing Dolphin', emoji: '🐬', rarity: 'Epic', fart_sound: 'whistle', cost: 400 },
  { id: 'penguin', name: 'Icy Toot Penguin', emoji: '🐧', rarity: 'Common', fart_sound: 'squeak', cost: 100 },
  { id: 'phoenix', name: 'Fire Wind Phoenix', emoji: '🔥', rarity: 'Legendary', fart_sound: 'lightning', cost: 500 },
  { id: 'butterfly', name: 'Flutter Gas Butterfly', emoji: '🦋', rarity: 'Common', fart_sound: 'whistle', cost: 100 },
  { id: 'robot', name: 'Cyber Toot Robot', emoji: '🤖', rarity: 'Epic', fart_sound: 'thunder', cost: 400 },
  { id: 'ghost', name: 'Spooky Puff Ghost', emoji: '👻', rarity: 'Rare', fart_sound: 'cloud', cost: 300 },
  { id: 'mermaid', name: 'Ocean Breeze Mermaid', emoji: '🧜', rarity: 'Legendary', fart_sound: 'rainbow', cost: 500 },
  { id: 'tiger', name: 'Jungle Roar Tiger', emoji: '🐯', rarity: 'Epic', fart_sound: 'thunder', cost: 400 },
  { id: 'elephant', name: 'Trumpet Toot Elephant', emoji: '🐘', rarity: 'Rare', fart_sound: 'mega', cost: 300 },
  { id: 'bunny', name: 'Fluffy Hop Bunny', emoji: '🐰', rarity: 'Common', fart_sound: 'squeak', cost: 100 },
  { id: 'owl', name: 'Wise Hoot Owl', emoji: '🦉', rarity: 'Rare', fart_sound: 'whistle', cost: 300 },
  { id: 'koala', name: 'Sleepy Puff Koala', emoji: '🐨', rarity: 'Common', fart_sound: 'cloud', cost: 100 },
  { id: 'wizard', name: 'Magic Spell Wizard', emoji: '🧙', rarity: 'Legendary', fart_sound: 'sparkle', cost: 500 },
  { id: 'dinosaur', name: 'Prehistoric Poofasaurus', emoji: '🦕', rarity: 'Epic', fart_sound: 'mega', cost: 400 },
  { id: 'bee', name: 'Buzzy Gas Bee', emoji: '🐝', rarity: 'Common', fart_sound: 'whistle', cost: 100 },
  { id: 'crab', name: 'Pinchy Bubble Crab', emoji: '🦀', rarity: 'Rare', fart_sound: 'bubble', cost: 300 },
  { id: 'starfish', name: 'Sparkle Sea Star', emoji: '⭐', rarity: 'Epic', fart_sound: 'glitter', cost: 400 },
  { id: 'sloth', name: 'Slow Toot Sloth', emoji: '🦥', rarity: 'Rare', fart_sound: 'cloud', cost: 300 },
];

export default function MyCreatures() {
  const queryClient = useQueryClient();

  const { data: progress } = useQuery({
    queryKey: ['gameProgress'],
    queryFn: async () => {
      const progs = await base44.entities.GameProgress.list();
      return progs[0];
    },
  });

  // Update sound manager when settings change
  useEffect(() => {
    if (progress) {
      soundManager.setEnabled(progress.sound_enabled);
      soundManager.setVibrationEnabled(progress.vibration_enabled);
    }
  }, [progress?.sound_enabled, progress?.vibration_enabled]);

  const { data: creatures } = useQuery({
    queryKey: ['creatures'],
    queryFn: async () => {
      return await base44.entities.Creature.list();
    },
  });

  // Initialize creatures if empty
  useEffect(() => {
    const initCreatures = async () => {
      if (creatures && creatures.length === 0) {
        const creaturesToCreate = CREATURES_DATA.map((c) => ({
          creature_id: c.id,
          name: c.name,
          emoji: c.emoji,
          rarity: c.rarity,
          fart_sound: c.fart_sound,
          unlocked: c.rarity === 'Common',
        }));
        await base44.entities.Creature.bulkCreate(creaturesToCreate);
        queryClient.invalidateQueries(['creatures']);
      }
    };
    initCreatures();
  }, [creatures]);

  const unlockCreature = useMutation({
    mutationFn: async ({ creatureId, cost }) => {
      const creature = creatures.find((c) => c.creature_id === creatureId);
      await base44.entities.Creature.update(creature.id, { unlocked: true });
      await base44.entities.GameProgress.update(progress.id, {
        coins: progress.coins - cost,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['creatures']);
      queryClient.invalidateQueries(['gameProgress']);
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Home')} onClick={() => soundManager.playClickSound()}>
              <Button variant="outline" className="bg-white/80 backdrop-blur-sm rounded-full">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-purple-700">
              🦄 My Creatures 🦄
            </h1>
          </div>
          <CoinDisplay coins={progress?.coins || 0} />
        </div>

        {/* Creatures grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CREATURES_DATA.map((creatureData, index) => {
            const creature = creatures?.find((c) => c.creature_id === creatureData.id);
            return (
              <CreatureCard
                key={creatureData.id}
                creature={creature || { ...creatureData, unlocked: false }}
                creatureData={creatureData}
                onUnlock={unlockCreature}
                canAfford={progress?.coins >= creatureData.cost}
                delay={index * 0.05}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
