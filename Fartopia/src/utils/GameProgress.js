// GameProgress.js
// Handles saving/loading coins, habitats, creatures, and progress

const STORAGE_KEY = "fartopia_progress";

function getDefaultProgress() {
  return {
    coins: 0,

    unlockedHabitats: {
      banana: true,
      lava: true,
      frog: false,
      monkey: false,
      space: false,
      ice: false,
      water: false,
      cloud: false
    },

    unlockedCreatures: {},

    settings: {
      soundOn: true,
      musicOn: true
    }
  };
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      const defaultProgress = getDefaultProgress();
      saveProgress(defaultProgress);
      return defaultProgress;
    }

    return JSON.parse(saved);

  } catch (e) {
    console.error("Failed to load progress:", e);
    return getDefaultProgress();
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save progress:", e);
  }
}

function getCoins() {
  const progress = loadProgress();
  return progress.coins;
}

function addCoins(amount) {
  const progress = loadProgress();
  progress.coins += amount;
  saveProgress(progress);
}

function spendCoins(amount) {
  const progress = loadProgress();

  if (progress.coins >= amount) {
    progress.coins -= amount;
    saveProgress(progress);
    return true;
  }

  return false;
}

function unlockHabitat(habitatId) {
  const progress = loadProgress();
  progress.unlockedHabitats[habitatId] = true;
  saveProgress(progress);
}

function isHabitatUnlocked(habitatId) {
  const progress = loadProgress();
  return !!progress.unlockedHabitats[habitatId];
}

export const GameProgress = {
  loadProgress,
  saveProgress,
  getCoins,
  addCoins,
  spendCoins,
  unlockHabitat,
  isHabitatUnlocked
};
