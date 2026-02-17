import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  ArrowLeft,
  Coins,
  Gift,
  Home,
  ShieldOff
} from 'lucide-react';

import ShopItem from '../components/ShopItem';
import CoinDisplay from '../components/CoinDisplay';

export default function Shop() {

  const queryClient = useQueryClient();

  const { data: progress } = useQuery({

    queryKey: ['gameProgress'],

    queryFn: async () => {

      const progs =
        await base44.entities.GameProgress.list();

      return progs[0];

    },

  });

  // SAFE coin add mutation
  const addCoinsMutation = useMutation({

    mutationFn: async (coinsToAdd) => {

      const latest =
        (await base44.entities.GameProgress.list())[0];

      return await base44.entities.GameProgress.update(
        latest.id,
        {
          coins:
            (latest.coins || 0) + coinsToAdd
        }
      );

    },

    onSuccess: () => {

      queryClient.invalidateQueries(['gameProgress']);

    }

  });

  // Replace these Stripe links with YOUR real ones
  const coinPacks = [

    {
      coins: 500,
      price: 0.99,
      popular: false,
      stripeLink:
        "https://buy.stripe.com/YOUR_500_LINK"
    },

    {
      coins: 2000,
      price: 2.99,
      popular: true,
      stripeLink:
        "https://buy.stripe.com/YOUR_2000_LINK"
    },

    {
      coins: 10000,
      price: 4.99,
      popular: false,
      stripeLink:
        "https://buy.stripe.com/YOUR_10000_LINK"
    }

  ];

  const handleCoinPurchase = (pack) => {

    // open Stripe
    window.open(pack.stripeLink, "_blank");

    // DEV MODE ONLY (remove once Stripe webhook added)
    addCoinsMutation.mutate(pack.coins);

  };

  const creaturePacks = [

    {
      name: 'Starter Pack',
      description: '3 Random Creatures',
      price: 1.99,
      emoji: '🎁'
    },

    {
      name: 'Super Pack',
      description: '5 Random + 1 Rare',
      price: 3.99,
      emoji: '🎉',
      popular: true
    },

    {
      name: 'Legendary Pack',
      description: '10 Random + 1 Legendary',
      price: 4.99,
      emoji: '⭐'
    }

  ];

  const specialItems = [

    {
      name: 'Unlock Habitat',
      description: 'Unlock any habitat instantly',
      price: 2.99,
      icon: Home,
      color:
        'from-green-400 to-emerald-500'
    },

    {
      name: 'Remove Ads',
      description: 'Enjoy ad-free experience',
      price: 1.99,
      icon: ShieldOff,
      color:
        'from-purple-400 to-purple-600',
      purchased:
        progress?.ads_removed
    }

  ];

  return (

    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-6">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">

          <div className="flex items-center gap-4">

            <Link to={createPageUrl('Home')}>

              <Button
                variant="outline"
                className="bg-white/80 backdrop-blur-sm rounded-full"
              >

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

                onPurchase={() =>
                  handleCoinPurchase(pack)
                }

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

                onPurchase={() =>
                  alert(
                    "Creature packs ready — connect Stripe next."
                  )
                }

              />

            ))}

          </div>

        </div>

      </div>

    </div>

  );

}
