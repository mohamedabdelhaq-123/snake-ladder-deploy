import { enableGlobalButtonSfx } from "../utils/button-sfx.js";

document.addEventListener("DOMContentLoaded", () => {
  enableGlobalButtonSfx();
});
import { initBgm } from "../utils/bgm.js";

document.addEventListener("DOMContentLoaded", () => {
  initBgm({ volume: 0.25 });
});

const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
	scrollTopBtn.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	});
}

let goBackButton = document.getElementById("go-back-button");

goBackButton.addEventListener("click", () => {
	window.history.back();
});
