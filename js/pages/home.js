

import  PlayerAccountData  from "../utils/PlayerAccountData.js";
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
		options.forEach(option => {
			const value = parseInt(option.value);
			// Disable if this value is selected elsewhere AND it's not the current select's own value
			option.disabled = disabledValues.has(value) && value !== parseInt(select.value);
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
		if (prevChoices.has(selectedId)){
			const prevValue = prevChoices.get(selectedId);
			disabledOptions.delete(prevValue);
		}
		prevChoices.set(selectedId, parseInt(selectedValue));
		imgElement.src=`../assets/images/Player${selectedValue}-Icon.jpg`;
		disabledOptions.add(parseInt(selectedValue));
		console.log(prevChoices);
		updateAllSelectsDisabled(allSelects,disabledOptions);
	});});

playButton.addEventListener("click", (event) => {
	event.preventDefault(); // Stop navigation temporarily
	let playerAccountDataList = [];
	let playerCount = 0;
	for (let entery of userEntries){
		let playerName = entery.querySelector("input[type=\"text\"]").value;
		let selectedImg = entery.querySelector("select");
		console.log("Selected Image Value:", selectedImg.value);
		let _playerPicture = `../assets/images/Player${selectedImg.value}-Icon.jpg`;
		if (!playerName && playerCount < 2) {
			window.alert("A least Two players are required to play the game");
			return;
		}
		if (playerAccountDataList.find((player) => player.name === playerName)) {
			console.log("Duplicate name found:", playerName);
			window.alert("Please choose different names for each player");
			return;
		}
		if (playerName) {
			playerAccountDataList.push(new PlayerAccountData(playerName,selectedImg.value));
			playerCount++;
		}
	}

	// Encode as JSON
	console.log( JSON.stringify(playerAccountDataList));
	window.localStorage.setItem("playerAccountData", JSON.stringify(playerAccountDataList));
	window.localStorage.setItem("startNewGame", JSON.stringify(true));
	window.location.href = "game-board.html";
});

clearInputFields();
clearSelectFields(allSelects);