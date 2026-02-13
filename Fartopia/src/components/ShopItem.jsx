import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function ShopItem({ title, description, price, popular, emoji, color, onPurchase }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className={`relative bg-gradient-to-br ${color} rounded-3xl p-6 shadow-xl text-white`}
    >
      {popular && (
        <div className="absolute -top-3 -right-3 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
          <Sparkles className="h-4 w-4" />
          POPULAR
        </div>
      )}

      <div className="text-center mb-4">
        <div className="text-7xl mb-4">{emoji}</div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        {description && <p className="text-white/80 mb-4">{description}</p>}
        <div className="text-4xl font-bold mb-4">${price}</div>
      </div>

      <Button
        onClick={onPurchase}
        className="w-full bg-white hover:bg-white/90 text-purple-700 font-bold text-xl py-6 rounded-full shadow-lg"
      >
        Purchase
      </Button>
    </motion.div>
  );
}
