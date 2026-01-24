import Game from "../game-logic/game.js";
import { delay, diceRoll } from "../utils/utils.js";
import { loadGameState, saveGameState } from "../utils/saving-and-loading.js";
import Grid from "../game-logic/grid.js";
import PortalTile from "../game-logic/tiles/portalTile.js";
import CardTile from "../game-logic/tiles/cardtile.js";
import PlayerAccountData from "../utils/PlayerAccountData.js";
import Point from "../utils/point.js";
/**
 * Constants
 */
const ROLL_SIZE = 6;
const GRID_W = 10;
const GRID_H = 10;
const markerOffset=10;   // 10 comes from: (80px Square - 60px Icon) / 2 to center it
const cellSize = 80;     // 80 comes from: 800px Board Width / 10 Columns

/**
 * Received Data HomePage
 */
const gameData = window.localStorage.getItem("playerAccountData");
console.log(gameData);
const playerAccountData = JSON.parse(gameData);
const players = [];
const playerIcons = [];
playerAccountData.forEach((player)=>{
	players.push(player.name);
	playerIcons.push(parseInt(player.imgNumber));
	console.log(player.name+player.imgNumber);

});




// Build game
const playerIds = [];
for (let i in players){ // NOTE!!!: js for ... in returns index only i.e [0,1,2,3]
	playerIds.push(Number(i));
}
let grid = new Grid(GRID_W,GRID_H);

// TODO create a function to intialize position from distance

[
	// Snakes
	[40,2],
	[43,17],
	[27,5],

	[54,31],
	[66,45],
	[89,53],

	// for faster winning
	// [99,41],
	// [95,76],

	// Ladders
	[4,23],
	[13,46],
	[33,52],

	[50,69],
	[42,63],
	[62,81],

	[74,93],
].forEach(([start,end]) => {
	// add tiles after transforming 1d to 2d space
	grid.addTile(new PortalTile(
		grid.distToPoint(start-1),
		grid.distToPoint(end-1)
	));
});

//adding card giving tiles

// [1,2,3,4,5,6].forEach((target) => {
// 	// add tiles after transforming 1d to 2d space
// 	grid.addTile(new CardTile(
// 		grid.distToPoint(target-1),
// 	));
// });



let game = new Game(playerIds,grid);
// check if starting a new game
let startNew = JSON.parse(window.localStorage.getItem("startNewGame"));
if (!startNew){
	let shouldLoad = window.confirm("valid save data found, load game?");
	if (shouldLoad){
		loadGameState(game);
	}
}
window.localStorage.setItem("startNewGame",JSON.stringify(false));

// SKIP cheat
window.skip = function(n){
	game.players.forEach((player,index)=>{
		game.advancePlayer(player.playerId,n);
		updateMarkerPosition(index);
	});
};

/**
 * DOM REFERENCES (Static Elements)
 */
const rollButton = document.getElementById("rollDiceButton");
const diceImage = document.getElementById("diceIcon");
const activeTurnDisplay = document.getElementById("activeTurnPlayerName");
const activeTurnPlayerImg= document.getElementById("activeTurnPlayerImg");
const outcomeSection = document.getElementById("outcome");

// Containers
const leaderboardContainer = document.getElementById("playersLeaderboard");
// const logContainer = document.getElementById("gameLogPlayersList");
const playerMarkerContainer = document.getElementById("playerMarkerContainer");

// Templates
const playerTemplate = document.getElementById("playerInfo");
// const logTemplate = document.getElementById("gameLogPlayers");
const playerMarkerTemplate = document.getElementById("playerMarker");

/**
 * UI REFERENCES (Dynamic Elements)
 * stored in arrays so we never have to use querySelector again
 */
const uiSquareValues = [];
const uiCardContainers = [];
// const uiLogs = [];
const uiPlayerMarkers = [];





/**
 * INITIALIZATION: setUpPlayers
 */
function setUpPlayers() {
	// Clear containers in case of a game reset TODO: Reset Button
	leaderboardContainer.innerHTML = "";
	// logContainer.innerHTML = "";

	players.forEach((name, index) => {
		// 1. Create Leaderboard Card
		const clonedPlayerTemplate = playerTemplate.content.cloneNode(true);

		const clonedPlayerContainer = clonedPlayerTemplate.firstElementChild; 	/* <div class="playerInfo"> */
		const clonedPlayerName = clonedPlayerTemplate.querySelector("h5");      /* <h5>Player i</h5> */
		const clonedPlayerPosition = clonedPlayerTemplate.querySelector(".currentPlayerSquareNumber");  /* <span class="currentPlayerSquareNumber">Square 1</span>< */
		let clonedPlayerIcon = clonedPlayerTemplate.querySelector("img");

		clonedPlayerIcon.src=`../assets/images/Player${playerIcons[index]}-Icon.jpg`;
		clonedPlayerName.textContent = name;
		clonedPlayerPosition.textContent = "Square 1";  /* all characters start from square 1 */

		if (index === game.current) {
			clonedPlayerContainer.classList.add("PickedPlayerTurn");  /* at start highlight first indexed player (his turn) */
		}

		// Store reference so we can update it later by index
		uiCardContainers.push(clonedPlayerContainer);
		uiSquareValues.push(clonedPlayerPosition);
		leaderboardContainer.appendChild(clonedPlayerContainer);

		// 2. Create Player Markers
		const clonedMarkerTemplate = playerMarkerTemplate.content.cloneNode(true);
		let clonedPlayerMarker = clonedMarkerTemplate.firstElementChild;
		clonedPlayerMarker.src=`../assets/images/Player${playerIcons[index]}-Icon.jpg`;


		// marker.style.color = playerColors[index];

		// Store reference to the log item
		uiPlayerMarkers.push(clonedPlayerMarker);
		playerMarkerContainer.appendChild(clonedPlayerMarker);

		// 3. Create Game Log Entry
		// const clonedLogTempalte = logTemplate.content.cloneNode(true);
		// const clonedPlayerLog = clonedLogTempalte.firstElementChild;

		// clonedPlayerLog.textContent = `${name} rolled a 0 and moved to Square 1`;

		// Store reference to the log item
		// uiLogs.push(clonedPlayerLog);
		// logContainer.appendChild(clonedPlayerLog);
	});

	players.forEach((_,index)=>{
		updateMarkerPosition(index,true);
	});


	// Set initial turn text
	updateTurnDisplay();  /* Make first player active turn */
}








async function updateMarkerPosition(index,instant=false){

	// currently alternating left position visually
	// and flipping y direction (advance up)
	const pos = game.players.get(index).position;  /* (x,y) ==> in css (x,y) but from up*/
	const yIndex = (GRID_H-pos.y-1); /* flip y to start from the bottom of the board */
	let xIndex = pos.x; /* x is same the issue is in y, but */

	if (pos.y%2!==0){
		xIndex = (GRID_W-pos.x-1);   /*  flip the x also if row is odd (our board is zigzag)*/
	}

	const xPx = xIndex*cellSize+markerOffset;
	const yPx = yIndex*cellSize+markerOffset;

	//TODO: replace with animations
	if (!instant){
		// let i = 0;
		// let interval = setInterval(() => {
		// 	i+=1/10;
		// 	// find intermidiate values and update them
		// }, 200/10);
		await delay(200);
		// clearInterval(interval);
	}

	uiPlayerMarkers[index].style.left = `${xPx}px`;
	uiPlayerMarkers[index].style.top = `${yPx}px`;

	// Update visual square number using our array reference
	let distance = pos.y*GRID_W+pos.x+1;
	uiSquareValues[index].textContent = `Square ${distance}`;
}





function updateTurnDisplay() {
	activeTurnDisplay.textContent = `${players[game.current]}'s Turn`;
	activeTurnPlayerImg.src=`../assets/images/Player${playerIcons[game.current]}-Icon.jpg`;
}




// Execute setup on script load
setUpPlayers();








/**
 * advances player and displays the changes along the way
 * @param {number} result
 */
async function updatePositionsUI(result) {
	// TODO: currently a player wins even if they roll too high
	// if that needs to change update the advance function in grid

	// advance player
	let effects = game.advancePlayer(game.current,result);

	await updateMarkerPosition(game.current);

	// process roll result
	game.processEffects(game.current,effects);

	await updateMarkerPosition(game.current);

	// Update the game log text using our array reference
	const pos = game.players.get(game.current).position;  /* (x,y) ==> in css (x,y) but from up*/
	let distance = pos.y*GRID_W+pos.x+1;
	// uiLogs[game.current].textContent = `${players[game.current]} rolled a ${result} and moved to Square ${distance}`;

}



function goToLeaderBoard() {
	// 1. Loop through all players in the Game Logic to get their actual positions
	game.players.forEach((playerData, id) => {
		// Calculate the linear score (Square 1 to 100)
		// logic: y * 10 + x + 1
		const pos = playerData.position;
		const finalScore = pos.y * GRID_W + pos.x + 1;

		// 2. Update the shared "playerAccountData" object
		if (playerAccountData[id]) {
			playerAccountData[id].score = finalScore;
		}
	});

	// 3. Save the UPDATED data back to the browser's memory
	window.localStorage.setItem("playerAccountData", JSON.stringify(playerAccountData));
	window.localStorage.setItem("startNewGame", JSON.stringify(true));

	// 4. Redirect to the Leaderboard Page
	// This path matches the 'href' seen in your HTML source code
	window.location.href = "../html/leaderboard.html";
}


/**
 * TURN MANAGEMENT: activePlayerLeaderboardHighlight
 * Manages the CSS classes on the player card containers.
 */
function activePlayerLeaderboardHighlight() {
	// 1. Target the .playerInfo container of the player who just moved
	uiCardContainers[game.current].classList.remove("PickedPlayerTurn");

	// 2. Increment index
	game.updateQueues();


	// 3.check if game ended
	if (game.winQueue.length > 0)
	{
		goToLeaderBoard(); // player won
		return; // Stop the function here so we don't switch turns
	}

	// 4. Highlight the new player
	uiCardContainers[game.current].classList.add("PickedPlayerTurn");
	updateTurnDisplay();



}




/**
 * EVENT LISTENERS
 */
rollButton.addEventListener("click", ()=>{
	// Check win condition
	//if (game.winQueue.length > 0) {return;}  // go to leaderboard

	
	if(!rollButton.classList.contains("active")){
			rollButton.disabled = true;
			diceImage.src = "../assets/images/dice-animation.gif";
			
			let result = diceRoll(ROLL_SIZE);
			setTimeout(() => {
			diceImage.src = `../assets/images/dice-${result}.png`;
		
			updatePositionsUI(result).then(()=>{
				//Note: button becomes enabled after update updatePositionUI is called

				activePlayerLeaderboardHighlight();

				// Saving
				saveGameState(game);

				// Note: button becomes enabled after all visual effects and animations are done
				rollButton.disabled = false;
				toggleNextTurnButton(rollButton);
				toggleDescription(outcomeSection);
			});


		}, 1000);
	}else{
				toggleNextTurnButton(rollButton);
				toggleDescription(outcomeSection);
	}
	
});

/*
*card data
*
*/
let cardDesc = "jump 3 steps"

/**
 * Card UI Changes
 * 
 */

function toggleNextTurnButton(btn){
	btn.classList.toggle("end-turn");
	if (btn.classList.contains("end-turn")) {
    btn.textContent = "End Turn";
  } else {
    btn.textContent = "\u2682"+" Roll Dice";
  }
	
}
function toggleFillCard(btn){
	btn.classList.toggle("fill");

}
function toggleDescription(container){
		container.classList.toggle("active");
		if(container.classList.contains("active")){
			container.textContent = cardDesc;
		}else{
			container.innerHTML = "";

			container.appendChild(diceImage)
		}
}