import { initBgm } from "../utils/bgm.js";

document.addEventListener("DOMContentLoaded", () => {
  initBgm({ volume: 0.25 });
});

import { enableGlobalButtonSfx } from "../utils/button-sfx.js";

document.addEventListener("DOMContentLoaded", () => {
  enableGlobalButtonSfx();
});
