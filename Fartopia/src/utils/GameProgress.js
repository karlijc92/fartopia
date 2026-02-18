const STORAGE_KEY = "fartopia_progress";

function loadProgress() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return {
      coins: 0,
      unlockedWorlds: ["banana", "lava"],
      unlockedCreatures: []
    };
  }

  return JSON.parse(data);
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

const GameProgress = {
  getCoins() {
    const progress = loadProgress();
    return progress.coins;
  },

  addCoins(amount) {
    const progress = loadProgress();
    progress.coins += amount;
    saveProgress(progress);
  },

  spendCoins(amount) {
    const progress = loadProgress();

    if (progress.coins >= amount) {
      progress.coins -= amount;
      saveProgress(progress);
      return true;
    }

    return false;
  },

  unlockWorld(world) {
    const progress = loadProgress();

    if (!progress.unlockedWorlds.includes(world)) {
      progress.unlockedWorlds.push(world);
      saveProgress(progress);
    }
  },

  isWorldUnlocked(world) {
    const progress = loadProgress();
    return progress.unlockedWorlds.includes(world);
  }
};

export default GameProgress;
