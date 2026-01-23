import { play } from "./sound.js";

export function enableGlobalButtonSfx() {
  document.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest("button, .btn, a");
      if (!btn) return;

      play("button", { volume: 0.9 });
    },
    true
  );
}