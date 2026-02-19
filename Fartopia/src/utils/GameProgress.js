// src/utils/GameProgress.js

const STORAGE_KEY = "fartopia_progress";

class GameProgressClass {
  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    this.data = saved
      ? JSON.parse(saved)
      : {
          coins: 0,
          unlockedCreatures: [],
          unlockedWorlds: []
        };
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  getCoins() {
    return this.data.coins || 0;
  }

  addCoins(amount) {
    this.data.coins += amount;
    this.save();
  }

  spendCoins(amount) {
    if (this.data.coins >= amount) {
      this.data.coins -= amount;
      this.save();
      return true;
    }
    return false;
  }

  unlockCreature(id) {
    if (!this.data.unlockedCreatures.includes(id)) {
      this.data.unlockedCreatures.push(id);
      this.save();
    }
  }

  unlockWorld(id) {
    if (!this.data.unlockedWorlds.includes(id)) {
      this.data.unlockedWorlds.push(id);
      this.save();
    }
  }
}

export const GameProgress = new GameProgressClass();
