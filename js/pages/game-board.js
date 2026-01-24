import Game from "../game-logic/game.js";
import { delay, diceRoll } from "../utils/utils.js";
import { loadGameState, saveGameState } from "../utils/saving-and-loading.js";
import Grid from "../game-logic/grid.js";
import PortalTile from "../game-logic/tiles/portalTile.js";
import PlayerAccountData from "../utils/PlayerAccountData.js";
import Point from "../utils/point.js";
import CardTile from "../game-logic/tiles/cardTile.js";

/**
 * Constants
 */
const ROLL_SIZE = 6;
const GRID_W = 10;
const GRID_H = 10;
const MARKER_OFFSET =10;   // 10 comes from: (80px Square - 60px Icon) / 2 to center it
const CELL_SIZE = 80;     // 80 comes from: 800px Board Width / 10 Columns


/**
 * Received Data HomePage
 */
const challengesToggled = JSON.parse(window.localStorage.getItem("challengesToggled"));
const playerAccountData = JSON.parse(window.localStorage.getItem("playerAccountData"));

const players = [];
const playerIcons = [];

playerAccountData.forEach((player)=>{
	players.push(player.name);
	playerIcons.push(parseInt(player.imgNumber));

});


/**
 * Build Game
 */
const playerIds = [];
for (let i in players){ // NOTE!!!: js for ... in returns index only i.e [0,1,2,3]
	playerIds.push(Number(i));
}
let grid = new Grid(GRID_W,GRID_H);

// Add Snakes and Ladders
[
	// Snakes
	[40,2],
	[43,17],
	[27,5],

	[54,31],
	[66,45],
	[89,53],

	[99,41],
	[95,76],

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

// initialize challenges
const challengeNoOverlap = challengesToggled[0];
const challengeShuffle = challengesToggled[1];
const challengeCards = challengesToggled[2];
const challengeElimination = challengesToggled[3];
let currentEliminationRow = 0;

if (challengeCards){
	[1,2,3,6,7,8,10].forEach((target) => {
		// add tiles after transforming 1d to 2d space
		grid.addTile(new CardTile(
			grid.distToPoint(target-1),
		));
	});
}

let game = new Game(playerIds,grid,challengeShuffle,challengeNoOverlap);

// load if not starting a new game
let startNew = JSON.parse(window.localStorage.getItem("startNewGame"));
if (!startNew){
	//TODO: remove alert if possible
	let shouldLoad = window.confirm("valid save data found, load game?");
	if (shouldLoad){
		loadGameState(game);
	}
}
window.localStorage.setItem("startNewGame",JSON.stringify(false));
saveGameState(game);




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
const playerMarkerContainer = document.getElementById("playerMarkerContainer");
const cardContainer = document.getElementById("card-container");

// Templates
const playerTemplate = document.getElementById("playerInfo");
const playerMarkerTemplate = document.getElementById("playerMarker");
const uiFlagMarker = document.getElementById("flagMarker");

/**
 * UI REFERENCES (Dynamic Elements)
 * stored in arrays so we never have to use querySelector again
 */
const uiSquareValues = [];
const uiQueueContainers = [];
const uiPlayerMarkers = [];
const uiCardContainers = [];
const uiCardImages = [];


/**
 * Run Setup Script
 */
setUpPlayers();
addCards(); //add empty card buttons
refreshActiveLeaderBoard();

if (challengeElimination){
	updateEliminationFlagPosition();
	uiFlagMarker.hidden=false;
}

if (!challengeCards){
	cardContainer.style.display="none";
} else {
	updateCardVisuals(game.current);
}














/** ---------------------------------------------------------------------------------------------------------
 * FUNCTIONs
 */


/**
 * Cheats
 */
// skip cheat
window.skip = function(n){
	game.players.forEach((player,index)=>{
		game.advancePlayer(player.playerId,n);
		updateMarkerPosition(index);
	});
};

// weightedRoll cheat
window.weightedRoll = function(n) {
	// Check win condition
	//if (game.winQueue.length > 0) {return;}  // go to leaderboard

	rollButton.disabled = true;
	diceImage.src = "../assets/images/dice-animation.gif";


	let result = n;

	setTimeout(() => {
		diceImage.src = "../assets/images/cheater.webp";

		updatePositionsUI(result).then(()=>{
			//Note: button becomes enabled after update updatePositionUI is called

			activePlayerLeaderboardHighlight();

			// Note: button becomes enabled after all visual effects and animations are done
			rollButton.disabled = false;
		});
	});
};


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
		uiQueueContainers.push(clonedPlayerContainer);
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
	});

	players.forEach((_,index)=>{
		updateMarkerPosition(index,true);
	});


	// Set initial turn text
	updateTurnDisplay();  /* Make first player active turn */
}



/**
 * UI update functions
 * TODO: split logic and UI from each other
 */
async function updateMarkerPosition(index,instant=false){
	// currently alternating left position visually
	// and flipping y direction (advance up)
	const pos = game.players.get(index).position;  /* (x,y) ==> in css (x,y) but from up*/
	const yIndex = (GRID_H-pos.y-1); /* flip y to start from the bottom of the board */
	let xIndex = pos.x; /* x is same the issue is in y, but */

	if (pos.y%2!==0){
		xIndex = (GRID_W-pos.x-1);   /*  flip the x also if row is odd (our board is zigzag)*/
	}

	const xPx = xIndex*CELL_SIZE+MARKER_OFFSET;
	const yPx = yIndex*CELL_SIZE+MARKER_OFFSET;

	//TODO: replace with animations
	if (!instant){
		await delay(200);
	}

	uiPlayerMarkers[index].style.transform = `
	translateX(${xPx}px)
	translateY(${yPx}px)
	`;
	// uiPlayerMarkers[index].style.left = `${xPx}px`;
	// uiPlayerMarkers[index].style.top = `${yPx}px`;

	// Update visual square number using our array reference
	let distance = pos.y*GRID_W+pos.x+1;
	uiSquareValues[index].textContent = `Square ${distance}`;
}

function updateTurnDisplay() {
	activeTurnDisplay.textContent = `${players[game.current]}'s Turn`;
	activeTurnPlayerImg.src=`../assets/images/Player${playerIcons[game.current]}-Icon.jpg`;
}


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
	updateCardVisuals(game.current);

	// updates other players, no need to await? not sure
	players.forEach((_,index)=>{
		updateMarkerPosition(index,false);
	});

	await updateMarkerPosition(game.current);

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

function refreshActiveLeaderBoard(){
	// clear out old children
	game.players.forEach(player => {
		let playerId = player.playerId;
		uiQueueContainers[playerId].classList.add("disabled");
	});

	// add children that are in the active queue
	game.activeQueue.forEach(playerId => {
		leaderboardContainer.append(uiQueueContainers[playerId]);
		uiQueueContainers[playerId].classList.remove("disabled");
	});
}

function updateEliminationFlagPosition(){
	uiFlagMarker.style.transform= `translateY(${80*(GRID_H-currentEliminationRow-1)}px)`;
	// uiFlagMarker.style.top=`${80*(GRID_H-currentEliminationRow-1)}px`;
}


/**
 * Card UI Changes
 *
 */
function activePlayerPowerUps(){

}


/**
 * UI-Toggles
 *
 */

/**
 *toggle the roll dice button to be end turn and vice versa
 *@param {btn} the roll dice button
 */

function toggleNextTurnButton(btn){
	btn.classList.toggle("end-turn");
	//you will find that the class .end turn is the one changing the button


	if (btn.classList.contains("end-turn")) {
		btn.textContent = "End Turn";
	} else {
		btn.textContent = "\u2682"+" Roll Dice";
	}

}



/**
 *toggle the the empty card container to fill it with a new card
 *@param {container} the container to be filled with the card
 */

function toggleFillCard(container,on){
	if (on){
		container.classList.add("fill");
	} else {
		container.classList.remove("fill");
	}

}

/**
 *toggle the dice container to replace it with the card description
 *@param {container} the container to be replaced
 */


function toggleDescription(container){
	container.classList.toggle("active");

	//you will find that the class .active is the one displaying the description card

	if (container.classList.contains("active")){
		container.textContent = "card description missing"; //cardDesc;
	} else {
		container.innerHTML = "";

		container.appendChild(diceImage);
	}
}


function addCards(){
	for (let i = 0; i < 3; i++) {
		const card = document.createElement("button");
		card.className = "card";
		const image = document.createElement("img");
		image.className= "card-icon";
		image.style.display = "none";


		card.addEventListener("click", () => {
			if (game.players.get(game.current).cards[i]) {
				game.playCard(game.current,i);

				updateCardVisuals(game.current); // this one is for reseting your card after it was used

				// TODO: hacky way to update other players, maybe come up with something better
				game.activeQueue.forEach((playerId)=>{
					updateMarkerPosition(playerId);
				});

				updateCardVisuals(game.current); //this one is in case you get a new one afterwards
			}
		});

		uiCardContainers.push(card);
		uiCardImages.push(image);

		card.appendChild(image);
		cardContainer.appendChild(card);
	}
}

function updateCardVisuals(playerId){
	for (let i = 0; i < 3; i++) {
		const card = uiCardContainers[i];
		const image = uiCardImages[i];
		console.log("-----------");
		game.players.forEach((player)=>{
			console.log(player.playerId);
			console.log(player.cards);
		});
		if (game.players.get(playerId).cards.length>i){
			toggleFillCard(card,true);
			//TODO: add mapping from card name to image url
			// image.src = imgMap(game.players.get(playerId).cards[i].name);
			image.style.display = "flex";
			image.src= "../assets/images/dice-5.png";
		} else {
			toggleFillCard(card,false);
			image.style.display = "none";
		}
	}
}

/**
 * TURN MANAGEMENT: activePlayerLeaderboardHighlight
 * Manages the CSS classes on the player card containers.
 */
function activePlayerLeaderboardHighlight() {
	// 1. Target the .playerInfo container of the player who just moved
	uiQueueContainers[game.current].classList.remove("PickedPlayerTurn");
	// 2. Increment index
	game.updateQueues();

	if (challengeElimination){

		// eliminate bad players
		game.activeQueue.forEach(playerId => {
			let player = game.players.get(playerId);

			if (player.position.y<currentEliminationRow){
				game.removePlayerFromActiveQueue(playerId);
			}
		});

		// add player from above
		let activeRows = game.activeQueue.map((id)=>game.players.get(id).position.y);
		let worstRow = Math.min(...activeRows);
		currentEliminationRow = worstRow;

		// TODO update visual indicator
		updateEliminationFlagPosition();
	}

	refreshActiveLeaderBoard();
	updateCardVisuals(game.current);
	// Saving
	saveGameState(game);


	// 3.check if game ended
	if (game.winQueue.length > 0 || game.activeQueue.length===1)
	{
		goToLeaderBoard(); // player won
		return; // Stop the function here so we don't switch turns
	}

	// 4. Highlight the new player
	uiQueueContainers[game.current].classList.add("PickedPlayerTurn");
	updateTurnDisplay();



}














/** ----------------------------------------------------------------------------------------------
 * EVENT LISTENERS
 */
rollButton.addEventListener("click", ()=>{
	// Check win condition
	//if (game.winQueue.length > 0) {return;}  // go to leaderboard


	if (!rollButton.classList.contains("active")){
		if (!rollButton.classList.contains("end-turn")||!challengeCards){
			rollButton.disabled = true;
			diceImage.src = "../assets/images/dice-animation.gif";

			let result = diceRoll(ROLL_SIZE);
			setTimeout(() => {
				diceImage.src = `../assets/images/dice-${result}.png`;

				updatePositionsUI(result).then(()=>{

					// Note: button becomes enabled after all visual effects and animations are done
					rollButton.disabled = false;
					if (challengeCards){
						toggleNextTurnButton(rollButton);
						toggleDescription(outcomeSection);
					} else {
						activePlayerLeaderboardHighlight();
					}
				});


			}, 1000);

		} else {
			activePlayerLeaderboardHighlight();
			toggleNextTurnButton(rollButton);
			toggleDescription(outcomeSection);
		}


	} else {
		toggleNextTurnButton(rollButton);
		toggleDescription(outcomeSection);
	}

});