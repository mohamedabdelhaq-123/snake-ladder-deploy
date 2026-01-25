import { play } from "./sound.js";

export function enableGlobalButtonSfx() {
  document.addEventListener(
    "pointerdown",
    (e) => {
      const el = e.target.closest("button, .btn, a");
      if (!el) return;

      play("button", { volume: 0.9 });
    },
    true
  );
}
