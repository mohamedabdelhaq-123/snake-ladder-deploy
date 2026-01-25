import { enableGlobalButtonSfx } from "../utils/button-sfx.js";
import { play } from "../utils/sound.js";

document.addEventListener("DOMContentLoaded", () => { /* Wait until the HTML page is fully loaded*/
	enableGlobalButtonSfx();

});

window.addEventListener("DOMContentLoaded", ()=>{ // Show win sound if not coming from home page (player won only)

	if (!window.localStorage.getItem("homeButton"))
	{
		play("win", { volume: 0.8, restart: true });
	}
	window.localStorage.removeItem("homeButton"); // Clean up to avoid repeated alerts
});

import PlayerAccountData from "../utils/PlayerAccountData.js";
const gameData = window.localStorage.getItem("playerAccountData");
const tableBody = document.querySelector("tbody");
const playerAccountData = JSON.parse(gameData);
const playerRowTemplate = document.getElementById("player-row");
const playAgainButton = document.getElementById("play-button");



console.log(playerAccountData);
playerAccountData.sort((a,b)=>b.score-a.score);


function addPlayerToTable(player,index){


	console.log(player.name,player.imgNumber);
	const clonedPlayerTemplate = playerRowTemplate.content.cloneNode(true);

	const clonedPlayerRow = clonedPlayerTemplate.firstElementChild;

	const clonedPlayerTableData = clonedPlayerRow.querySelectorAll("td");

	const playerNameSpan = clonedPlayerTableData.item(0).firstElementChild;

	playerNameSpan.textContent = index+1;

	const playerCardContainer = clonedPlayerTableData.item(1);

	const playerImage = playerCardContainer.firstElementChild;
	playerImage.src = `../assets/images/Player${player.imgNumber}-Icon.jpg`;

	const playerName = playerCardContainer.querySelector("span");
	playerName.textContent = `${player.name}`;

	const scoreCell = clonedPlayerTableData.item(2);
	scoreCell.textContent = player.score;

	tableBody.appendChild(clonedPlayerRow);
}


playerAccountData.forEach((element,index) => {
	addPlayerToTable(element,index);
});


playAgainButton.addEventListener("click",()=>{
	window.location.href = "../html/home.html";
}
);