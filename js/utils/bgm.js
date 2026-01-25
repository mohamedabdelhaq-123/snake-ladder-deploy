// js/utils/bgm.js

let bgm = null;

export function initBgm({
  src = "../../assets/audio/gameBG.wav",
  volume = 0.25,
} = {}) {
  if (bgm) return bgm;

  bgm = new Audio(src);
  bgm.loop = true;
  bgm.volume = volume;

  // Start muted (allowed by browsers)
  bgm.muted = true;
  bgm.play().catch(() => {});

  // Unlock sound on first user interaction
  const unlock = () => {
    bgm.muted = false;
    bgm.play().catch(() => {});
  };

  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });

  return bgm;
}
