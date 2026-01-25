// js/utils/sound.js

function makeAudio(relPath) {
  const url = new URL(relPath, import.meta.url); // resolves relative to this file
  const a = new Audio(url.href);
  a.preload = "auto";
  return a;
}

const sounds = {
  button: makeAudio("../../assets/audio/buttonclick.ogg"),
  dice: makeAudio("../../assets/audio/dice-roll.mp3"),
  move: makeAudio("../../assets/audio/player-move.mp3"),
  snake: makeAudio("../../assets/audio/snake-slide.mp3"),
  ladder: makeAudio("../../assets/audio/ladder-climb.wav"),
  win: makeAudio("../../assets/audio/win.wav"),
  lose: makeAudio("../../assets/audio/lose.wav"),
};

export function play(name, { volume = 1, restart = true } = {}) {
  const audio = sounds[name];
  if (!audio) return;

  audio.volume = volume;
  if (restart) audio.currentTime = 0;

  audio.play().catch(() => {});
}
