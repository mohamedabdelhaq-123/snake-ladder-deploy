
const sounds = {
  button: new Audio("../../assets/audio/buttonclick.ogg"),
  dice: new Audio("../../assets/audio/dice-roll.mp3"),
  move: new Audio("../../assets/audio/player-move.mp3"),
  snake: new Audio("../../assets/audio/snake-slide.mp3"),
  ladder: new Audio("../../assets/audio/ladder-climb.wav"),
  win: new Audio("../../assets/audio/win.wav"),
  lose: new Audio("../../assets/audio/lose.wav"),
};

// تجهيز مبدئي
Object.values(sounds).forEach(audio => {
  audio.preload = "auto";
});

export function play(name, { volume = 1, restart = true } = {}) {
  const audio = sounds[name];
  if (!audio) return;

  audio.volume = volume;
  if (restart) audio.currentTime = 0;
  audio.play().catch(() => {});}
