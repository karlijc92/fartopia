export const Sounds = {

  // Core fart sounds
  fart_soft: new Audio("/sounds/fart_soft.mp3"),
  fart_long: new Audio("/sounds/fart_long.mp3"),
  fart_bubble: new Audio("/sounds/fart_bubble.mp3"),
  fart_squeak: new Audio("/sounds/fart_squeak.mp3"),
  fart_thunder: new Audio("/sounds/fart_thunder.mp3"),

  // Reward sounds
  win: new Audio("/sounds/win.mp3"),
  coin: new Audio("/sounds/coin.mp3"),
  unlock: new Audio("/sounds/unlock.mp3"),

  // Creature sounds
  frog: new Audio("/sounds/frog.mp3"),
  monkey: new Audio("/sounds/monkey.mp3"),
  alien: new Audio("/sounds/alien.mp3"),
  robot: new Audio("/sounds/robot.mp3"),
  dragon: new Audio("/sounds/dragon.mp3"),
  unicorn: new Audio("/sounds/unicorn.mp3"),

  // Habitat sounds
  jungle: new Audio("/sounds/jungle.mp3"),
  lava: new Audio("/sounds/lava.mp3"),
  ice: new Audio("/sounds/ice.mp3"),
  water: new Audio("/sounds/water.mp3"),
  space: new Audio("/sounds/space.mp3"),
  cloud: new Audio("/sounds/cloud.mp3"),

  play(name) {

    const sound = this[name];

    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }

  }

};
