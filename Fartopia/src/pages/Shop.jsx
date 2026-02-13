import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Coins, Gift, Home, ShieldOff } from 'lucide-react';
import ShopItem from '../components/ShopItem';
import CoinDisplay from '../components/CoinDisplay';

export default function Shop() {
  const { data: progress } = useQuery({
    queryKey: ['gameProgress'],
    queryFn: async () => {
      const progs = await base44.entities.GameProgress.list();
      return progs[0];
    },
  });

  const coinPacks = [
    { coins: 500, price: 0.99, popular: false },
    { coins: 2000, price: 2.99, popular: true },
    { coins: 10000, price: 4.99, popular: false },
  ];

  const creaturePacks = [
    { name: 'Starter Pack', description: '3 Random Creatures', price: 1.99, emoji: '🎁' },
    { name: 'Super Pack', description: '5 Random + 1 Rare', price: 3.99, emoji: '🎉', popular: true },
    { name: 'Legendary Pack', description: '10 Random + 1 Legendary', price: 4.99, emoji: '⭐' },
  ];

  const specialItems = [
    { name: 'Unlock Habitat', description: 'Unlock any habitat instantly', price: 2.99, icon: Home, color: 'from-green-400 to-emerald-500' },
    { name: 'Remove Ads', description: 'Enjoy ad-free experience', price: 1.99, icon: ShieldOff, color: 'from-purple-400 to-purple-600', purchased: progress?.ads_removed },
  ];

  const handlePurchase = (item) => {
    alert(`Purchase ${item} - In production, this would trigger real payment!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-6">
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
              🛍️ FART SHOP 🛍️
            </h1>
          </div>
          <CoinDisplay coins={progress?.coins || 0} />
        </div>

        {/* Coin Packs */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-4 flex items-center">
            <Coins className="mr-3 h-8 w-8 text-yellow-500" />
            Coin Packs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coinPacks.map((pack) => (
              <ShopItem
                key={pack.coins}
                title={`${pack.coins} Coins`}
                price={pack.price}
                popular={pack.popular}
                emoji="🪙"
                color="from-yellow-400 to-orange-500"
                onPurchase={() => handlePurchase(`${pack.coins} coins`)}
              />
            ))}
          </div>
        </div>

        {/* Creature Packs */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-4 flex items-center">
            <Gift className="mr-3 h-8 w-8 text-pink-500" />
            Creature Packs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creaturePacks.map((pack) => (
              <ShopItem
                key={pack.name}
                title={pack.name}
                description={pack.description}
                price={pack.price}
                popular={pack.popular}
                emoji={pack.emoji}
                color="from-pink-400 to-rose-500"
                onPurchase={() => handlePurchase(pack.name)}
              />
            ))}
          </div>
        </div>

        {/* Special Items */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-4 flex items-center">
            ✨ Special Items
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specialItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className={`bg-gradient-to-br ${item.color} rounded-3xl p-6 shadow-xl text-white`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 rounded-2xl p-3">
                        <Icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{item.name}</h3>
                        <p className="text-white/80">{item.description}</p>
                      </div>
                    </div>
                  </div>
                  {item.purchased ? (
                    <Button disabled className="w-full bg-white/30 text-white text-xl py-6 rounded-full">
                      ✓ Purchased
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handlePurchase(item.name)}
                      className="w-full bg-white hover:bg-white/90 text-purple-700 font-bold text-xl py-6 rounded-full shadow-lg"
                    >
                      Buy for ${item.price}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Reward Ad Button */}
        <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl p-8 text-center shadow-xl">
          <h3 className="text-3xl font-bold text-white mb-2">Watch Ad = +250 Coins! 📺</h3>
          <p className="text-white/80 mb-6">Support the game and earn free coins!</p>
          <Button
            onClick={() => alert('Ad would play here! +250 coins')}
            className="bg-white hover:bg-white/90 text-green-600 font-bold text-2xl px-12 py-8 rounded-full shadow-lg"
          >
            Watch Ad Now
          </Button>
        </div>
      </div>
    </div>
  );
}
