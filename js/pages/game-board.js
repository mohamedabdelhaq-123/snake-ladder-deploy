import Game from "../game-logic/game.js";
import { delay, diceRoll } from "../utils/utils.js";
import { loadGameState, saveGameState } from "../utils/saving-and-loading.js";
import Grid from "../game-logic/grid.js";
import PortalTile from "../game-logic/tiles/portalTile.js";
import CardTile from "../game-logic/tiles/cardTile.js";
import { allCards, nameToCardIndex } from "../game-logic/all-cards.js";
import { enableGlobalButtonSfx } from "../utils/button-sfx.js";
import { initBgm } from "../utils/bgm.js";
import { play } from "../utils/sound.js"; // ADDED: Sound player (SFX-DICE ROLL, MOVE, SNAKE, LADDER, WIN, LOSE)
document.addEventListener("DOMContentLoaded", () => {
	enableGlobalButtonSfx(); // enable button sound effects globally
	initBgm(); // initialize background music
});

/**
 * Constants
 */
const ROLL_SIZE = 6;
const GRID_W = 10;
const GRID_H = 10;
const MARKER_OFFSET =10;   // 10 comes from: (80px Square - 60px Icon) / 2 to center it
const CELL_SIZE = 80;     // 80 comes from: 800px Board Width / 10 Columns


/**
 * DOM REFERENCES (Static Elements)
 */
const rollButton = document.getElementById("rollDiceButton");
const diceImage = document.getElementById("diceIcon");
const activeTurnDisplay = document.getElementById("activeTurnPlayerName");
const activeTurnPlayerImg= document.getElementById("activeTurnPlayerImg");
const outcomeSection = document.getElementById("outcome");
const uiShuffleMarker = document.getElementById("shuffleMarker");

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
const uiCardTooltips = [];

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
	[
		3,7,10,
		11,12,
		25,29,30,
		36,37,
		44,
		57,
		64,67,
		75,
		91,92,96,97
	].forEach((target) => {
		// add tiles after transforming 1d to 2d space
		let pos = grid.distToPoint(target-1);
		grid.addTile(new CardTile(
			pos,
		));

		let marker = document.createElement("div");
		marker.className="card-tile-marker";
		//TODO add general function to translatefrom logicspace to boardspace
		marker.style.top= `${80*(GRID_H-pos.y-1)}px`;
		let xIndex = pos.x;
		if (pos.y%2===1) {xIndex = (GRID_W-pos.x-1);}
		marker.style.left= `${80*xIndex}px`;
		playerMarkerContainer.prepend(marker);

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

setUpPlayers();
addCards(); //add empty card buttons
refreshActiveLeaderBoard();

if (challengeElimination){
	updateEliminationFlagPosition();
	uiFlagMarker.hidden=false;
}

if (!challengeShuffle){
	uiShuffleMarker.style.display="none";
}

if (!challengeCards){
	cardContainer.style.display="none";
} else {
	updateCardVisuals(game.current);
}

/**
 * End of Setup Script
 */

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

// weightedRoll cheat , not that you will have to press end turn to go to the next one
// an obviously there is a way to automate that but i am tired T-T
window.weightedRoll = function(n) {
	// Check win condition
	//if (game.winQueue.length > 0) {return;}  // go to leaderboard


	if (!rollButton.classList.contains("active")){
		if (!rollButton.classList.contains("end-turn")||!challengeCards){
			rollButton.disabled = true;
			diceImage.src = "../assets/images/dice-animation.gif";

			let result = n;
			setTimeout(() => {
				diceImage.src = "../assets/images/cheat.jpeg";

				updatePositionsUI(result).then(()=>{

					// Note: button becomes enabled after all visual effects and animations are done
					rollButton.disabled = false;
					if (challengeCards){
						toggleNextTurnButton(rollButton);
						// toggleDescription(outcomeSection);
					} else {
						activePlayerLeaderboardHighlight();
					}
				});


			}, 1000);

		} else {
			activePlayerLeaderboardHighlight();
			toggleNextTurnButton(rollButton);
			// toggleDescription(outcomeSection);
		}


	} else {
		toggleNextTurnButton(rollButton);
		toggleDescription(outcomeSection);
	}
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
		if (challengeNoOverlap){
			clonedPlayerMarker.classList.add("dangerous");
		}
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
	// uiPlayerMarkers[index].style.left = ${xPx}px;
	// uiPlayerMarkers[index].style.top = ${yPx}px;

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

	//  ADDED: Move sound (player starts moving after dice roll)
	// Sound for player movement
	play("move", { volume: 0.55, restart: true });

	// ADDED: detect snake/ladder by comparing distance before/after effects
	const beforePos = game.players.get(game.current).position;
	const beforeDist = beforePos.y * GRID_W + beforePos.x + 1;

	// advance player
	let effects = game.advancePlayer(game.current,result);

	await updateMarkerPosition(game.current);

	// process roll result
	game.processEffects(game.current,effects);

	// ADDED: After effects (snake/ladder) apply, detect if player jumped
	const afterPos = game.players.get(game.current).position;
	const afterDist = afterPos.y * GRID_W + afterPos.x + 1;

	// If the move changed more than the dice roll, it means a portal (snake/ladder) happened
	const jumpDelta = afterDist - (beforeDist + result);

	if (jumpDelta > 0) {
		// Sound for ladder climb
		play("ladder", { volume: 0.8, restart: true }); // Ladder sound
	} else if (jumpDelta < 0) {
		// Sound for snake slide
		play("snake", { volume: 0.8, restart: true }); // Snake sound
	}

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
	window.localStorage.setItem("challengesUnlocked", JSON.stringify(true));
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
	// uiFlagMarker.style.top=${80*(GRID_H-currentEliminationRow-1)}px;
}

/**
 * Card UI Changes
 *
 */
// function activePlayerPowerUps(){

// }
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
		const cardDiv = document.createElement("div");
		cardDiv.style.position="relative";
		const card = document.createElement("button");
		card.className = "card";
		const image = document.createElement("img");
		image.className= "card-icon";
		image.style.display = "none";
		const tooltip = document.createElement("p");
		tooltip.className= "tooltiptext";
		tooltip.innerText="no card available";


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
		uiCardTooltips.push(tooltip);

		card.appendChild(image);
		cardDiv.appendChild(card);
		cardDiv.appendChild(tooltip);
		cardContainer.append(cardDiv);
	}
}

function updateCardVisuals(playerId){
	for (let i = 0; i < 3; i++) {
		const card = uiCardContainers[i];
		const image = uiCardImages[i];
		const tooltip = uiCardTooltips[i];
		console.log("-----------");
		game.players.forEach((player)=>{
			console.log(player.playerId);
			console.log(player.cards);
		});
		if (game.players.get(playerId).cards.length>i){
			toggleFillCard(card,true);
			//TODO: add mapping from card name to image url
			const cardName = game.players.get(playerId).cards[i].name;
			const cardIndex = nameToCardIndex(cardName);
			image.src = allCards[cardIndex][2];//2 refers to icon for now
			image.style.display = "flex";
			tooltip.textContent=allCards[cardIndex][3];//3 refers to description;
		} else {
			toggleFillCard(card,false);
			image.style.display = "none";
			tooltip.textContent="No available card data";
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
				//ADDED: Lose sound when a player gets eliminated (challenge mode)
				play("lose", { volume: 0.9, restart: true });

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

			// ADDED: Dice roll sound when user clicks Roll Dice
			play("dice", { volume: 0.9, restart: true });

			let result = diceRoll(ROLL_SIZE);
			setTimeout(() => {
				diceImage.src = `../assets/images/dice-${result}.png`;

				updatePositionsUI(result).then(()=>{
					// Note: button becomes enabled after all visual effects and animations are done
					rollButton.disabled = false;

					let currentPlayer = game.players.get(game.activeQueue[game.current]);  // case: to go to leaderboard after winning immedeatly
					let hasWon = game.checkWinCondition(currentPlayer);

					if (hasWon) {
						game.updateQueues();
						saveGameState(game);
						goToLeaderBoard();
						return;
					}

					if (challengeCards){
						toggleNextTurnButton(rollButton);
						// toggleDescription(outcomeSection);
					}
					 else {
						//goToLeaderBoard();
						activePlayerLeaderboardHighlight();
					}
				});


			}, 1000);

		} else {
			activePlayerLeaderboardHighlight();
			toggleNextTurnButton(rollButton);
			// toggleDescription(outcomeSection);
		}

	} else {
		toggleNextTurnButton(rollButton);
		toggleDescription(outcomeSection);
	}

}
);

/** ----------------------------------------------------------------------------------------------
 * EVENT LISTENERS
 */
rollButton.addEventListener("click", mainButtonPress);
window.addEventListener("keypress",(event)=>{
	if (event.key === " " || event.code === "Space" || event.code === "Enter") {
		// Prevent the default action (e.g., scrolling the page)
		event.preventDefault();
		if (!rollButton.disabled){
			mainButtonPress();
		}
	}
});