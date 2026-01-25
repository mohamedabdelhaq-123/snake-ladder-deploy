// Shared Background Music (BGM) controller for all pages

let bgm = null; // Audio instance (single)
const STORAGE_KEY = "bgmMuted"; // Save mute state in localStorage

// Detect if we are inside /html pages (welcome/home/...)
function getAudioSrc() {
  // If the current URL contains "/html/", then assets path should be "../assets/..."
  // Otherwise (rare), it might be "./assets/..."
  const inHtmlFolder = window.location.pathname.includes("/html/");
  return inHtmlFolder ? "../assets/audio/gameBG.mp3" : "./assets/audio/gameBG.wav";
}

// Create audio only once
function ensureAudio() {
  if (bgm) return;

  bgm = new Audio(getAudioSrc());
  bgm.loop = true;         // Repeat forever
  bgm.preload = "auto";    // Preload for faster play
  bgm.volume = 0.35;       // Default volume

  // Apply saved mute state
  const saved = localStorage.getItem(STORAGE_KEY);
  const muted = saved ? JSON.parse(saved) : false;
  bgm.muted = muted;
}

// Try to play (may require user gesture on some browsers)
function tryPlay() {
  if (!bgm) return;
  if (bgm.muted) return;

  bgm.play().catch(() => {
    // If browser blocks autoplay, we will unlock on first click/keydown
  });
}

// Update button icon text
function updateBtn(btn, muted) {
  if (!btn) return;
  // Simple icon using emoji (easy). You can replace with SVG later.
  btn.textContent = muted ? "🔇" : "🔊";
  btn.setAttribute("aria-label", muted ? "Unmute background music" : "Mute background music");
  btn.title = muted ? "Unmute" : "Mute";
}

// Create/attach the mute button to the page
function mountMuteButton() {
  // If already exists, do nothing
  if (document.getElementById("bgm-toggle")) return;

  const btn = document.createElement("button");
  btn.id = "bgm-toggle";
  btn.type = "button";
  btn.className = "bgm-toggle"; // we'll style it in global.css
  document.body.appendChild(btn);

  // Set initial icon
  updateBtn(btn, bgm.muted);

  // Toggle mute on click
  btn.addEventListener("click", () => {
    const newMuted = !bgm.muted;
    bgm.muted = newMuted;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMuted));
    updateBtn(btn, newMuted);

    // If unmuted, try to play immediately
    if (!newMuted) tryPlay();
  });
}

// Unlock audio after first user interaction (fixes "welcome needs click" issues)
function setupUnlockOnFirstGesture() {
  const unlock = () => {
    // Try play after first gesture
    tryPlay();
    // Remove listeners after first success attempt
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };

  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

/**
 * Public API
 * Call this from each page JS after DOMContentLoaded
 */
export function initBgm() {
  ensureAudio();
  mountMuteButton();
  setupUnlockOnFirstGesture();
  tryPlay();
}