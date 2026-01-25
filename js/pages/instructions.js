import { enableGlobalButtonSfx } from "../utils/button-sfx.js";
import { initBgm } from "../utils/bgm.js";

document.addEventListener("DOMContentLoaded", () => {
	enableGlobalButtonSfx(); // enable button sound effects globally
	initBgm(); // initialize background music
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
