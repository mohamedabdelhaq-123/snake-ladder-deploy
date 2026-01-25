import { initBgm } from "../utils/bgm.js";
import { enableGlobalButtonSfx } from "../utils/button-sfx.js";
document.addEventListener("DOMContentLoaded", () => {

  enableGlobalButtonSfx(); // enable button sound effects globally
  initBgm(); // initialize background music
});



