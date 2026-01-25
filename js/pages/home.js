import PlayerAccountData from "../utils/PlayerAccountData.js";
import { enableGlobalButtonSfx } from "../utils/button-sfx.js";

document.addEventListener("DOMContentLoaded", () => {
	enableGlobalButtonSfx();
});

import { initBgm } from "../utils/bgm.js";

document.addEventListener("DOMContentLoaded", () => {
	initBgm({ volume: 0.25 });
});

const templateSelect = document.getElementById("templateSelect").content;

for (let i=1;i<=4;i++) /* generate the players in home page dynamically */
{
	const clone = templateSelect.cloneNode(true);
	const selectElement = clone.querySelector("select");
	selectElement.id = `player${i}-picture`;
	const inputElement = clone.querySelector("input");
	inputElement.id = `player${i}`;
	inputElement.name = `player${i}`;
	inputElement.placeholder = `Player${i} Name`;
	const imgElement = clone.querySelector("img");
	imgElement.id = `player${i}Img`;

	document.getElementById("players").appendChild(clone);
}


function clearInputFields() {
	const inputs = document.querySelectorAll('input[type="text"]');
	inputs.forEach(input => {

		input.value = "";
	});
}

function clearSelectFields(allSelects) {
	allSelects.forEach(select => {
		select.selectedIndex = 0;
	});
}

function updateAllSelectsDisabled(allSelects, disabledValues) {
	allSelects.forEach(select => {
		const options = select.querySelectorAll("option");
		options.forEach((option,index) => {
			if (index!==0){    // can't access the first option (Pick an image) again
				const value = parseInt(option.value);
				// Disable if this value is selected elsewhere AND it's not the current select's own value
				option.disabled = disabledValues.has(value) && value !== parseInt(select.value);
			}
		});
	});
}


const playButton = document.getElementById("play-button");
const userEntries = document.querySelectorAll(".user-entry");
const allSelects = Array.from(userEntries).map(entery => entery.querySelector("select"));

let prevChoices = new Map();
let disabledOptions = new Set();



userEntries.forEach((entery) => {
	const selectElement = entery.querySelector("select");
	const imgElement = entery.querySelector("img");

	selectElement.addEventListener("change", (event) => {

		const selectedValue = event.target.value;
		const selectedId = event.target.id;

		if (prevChoices.has(selectedId)) {
			const prevValue = prevChoices.get(selectedId);
			disabledOptions.delete(prevValue);
		}

		prevChoices.set(selectedId, parseInt(selectedValue));
		imgElement.src = `../assets/images/Player${selectedValue}-Icon.jpg`;
		disabledOptions.add(parseInt(selectedValue));
		console.log(prevChoices);
		updateAllSelectsDisabled(allSelects, disabledOptions);
	});
});








playButton.addEventListener("click", (event) => {
	event.preventDefault(); // Stop navigation temporarily
	let playerAccountDataList = [];
	let playerCount = 0;
	for (let entery of userEntries) {

		let playerName = entery.querySelector("input[type=\"text\"]").value;
		let selectedImg = entery.querySelector("select");


		if (playerAccountDataList.find((player) => player.name === playerName)) {
			console.log("Duplicate name found:", playerName);
			window.alert("Please choose different names for each player");
			return;
		}

		if (playerName) {
			if (!/^[a-z]+$/i.test(playerName)) // Check if name is letters only
			{
				window.alert("Player name must contain only letters: " + playerName);
				return;
			}
			if (selectedImg.value === "") {
				window.alert("Please select an image for " + playerName);
				return;
			}
			playerAccountDataList.push(new PlayerAccountData(playerName, selectedImg.value));
			playerCount++;
		}
	}

	if (playerCount < 2) {
		window.alert("A least Two players are required to play the game");
		return;
	}

	// Encode as JSON
	console.log(JSON.stringify(playerAccountDataList));
	window.localStorage.setItem("playerAccountData", JSON.stringify(playerAccountDataList));
	window.localStorage.setItem("startNewGame", JSON.stringify(true));
	window.localStorage.setItem("challengesToggled", JSON.stringify(challengesToggled));
	window.location.href = "game-board.html";
});


const challengesDiv = document.getElementById("challenge-panel");
const challengesUnlocked = JSON.parse(window.localStorage.getItem("challengesUnlocked"));
if (!challengesUnlocked){
	console.log("uh?");
	console.log(challengesDiv);
	challengesDiv.style.display="none";
}


let challengesToggled = JSON.parse(window.localStorage.getItem("challengesToggled"));
if (!challengesToggled) {
	challengesToggled = [false, false, false, false];
}

let toggleButtons = Array.from(document.getElementsByClassName("toggle-button"));
function updateChallengeButtons() {
	toggleButtons.forEach((button, index) => {
		if (challengesToggled[index]) {
			button.classList.add("active");
		} else {
			button.classList.remove("active");
		}
	});
}


toggleButtons.forEach((toggleButton, index) => {
	toggleButton.addEventListener("click", function () {

		// Toggle the value
		challengesToggled[index] = !challengesToggled[index];

		// update the 'active' class
		updateChallengeButtons();
	});
});

let leaderboardButton= document.getElementById("leaderboard-link");
leaderboardButton.addEventListener("click",()=>{
	window.localStorage.setItem("homeButton",1); // Indicate navigation from home to leaderboard (to )
	window.location.href = "leaderboard.html";
});




updateChallengeButtons();
clearInputFields();
clearSelectFields(allSelects);


console.log(window.localStorage.getItem("playerAccountData"));

console.log(document.getElementById("players"));

window.addEventListener("DOMContentLoaded", () => { // containers is dynammically generated
	const userEntries = window.localStorage.getItem("playerAccountData");
	if (userEntries) {
		const parsedEntries = JSON.parse(userEntries); // Parse the stored player data
		console.log(parsedEntries.length);

		for (let i = 0; i < parsedEntries.length; i++) {

			const inputElement = document.getElementById(`player${i+1}`);  // get input field
			const selectElement = document.getElementById(`player${i+1}-picture`);
			const imgElement = document.getElementById(`player${i+1}Img`);


			inputElement.value = parsedEntries[i].name;
			selectElement.value = parsedEntries[i].imgNumber; // set values with loaded
			if (inputElement.value) // case : select img without name when loading remove img
			{
				imgElement.src = `../assets/images/Player${parsedEntries[i].imgNumber}-Icon.jpg`;
			}

			prevChoices.set(selectElement.id, parseInt(parsedEntries[i].imgNumber));
			disabledOptions.add(parseInt(parsedEntries[i].imgNumber));
			updateAllSelectsDisabled(allSelects, disabledOptions);
		}
	}
});

