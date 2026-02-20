// src/utils/GameProgress.js

const STORAGE_KEY = "fartopia_progress";

class GameProgressClass {
  constructor() {
    this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        this.data = JSON.parse(saved);
      } else {
        this.setDefaults();
      }

      // Safety check
      if (typeof this.data.coins !== "number") {
        this.data.coins = 0;
      }

      if (!Array.isArray(this.data.unlockedCreatures)) {
        this.data.unlockedCreatures = [];
      }

      if (!Array.isArray(this.data.unlockedWorlds)) {
        this.data.unlockedWorlds = [];
      }

    } catch (err) {
      console.error("GameProgress corrupted, resetting...");
      this.setDefaults();
      this.save();
    }
  }

  setDefaults() {
    this.data = {
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
    if (typeof amount !== "number") return;
    this.data.coins = (this.data.coins || 0) + amount;
    this.save();
  }

  spendCoins(amount) {
    if (typeof amount !== "number") return false;

    if ((this.data.coins || 0) >= amount) {
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
