import Game from "../game-logic/game.js";
import { diceRoll } from "../utils/utils.js";
import { loadGameState, saveGameState } from "../utils/saving-and-loading.js";
import Grid from "../game-logic/grid.js";
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
const players = ["Momo", "ZoZ", "Andrew", "Haneen"];
const playerIcons = [1,2,4,3];

// Build game
const playerIds = [];
for (let i in players){ // NOTE!!!: js for ... in returns index only i.e [0,1,2,3]
	playerIds.push(Number(i));
}
let grid = new Grid(GRID_W,GRID_H);

// grid.addTile(new PortalTile(new Point(2,3),new Point(0,0)));
// grid.addTile(new PortalTile(new Point(1,3),new Point(0,0)));

let game = new Game(playerIds,grid);
loadGameState(game);

/**
 * DOM REFERENCES (Static Elements)
 */
const rollButton = document.getElementById("rollDiceButton");
const diceImage = document.getElementById("diceIcon");
const activeTurnDisplay = document.getElementById("activeTurnPlayerName");

// Containers
const leaderboardContainer = document.getElementById("playersLeaderboard");
const logContainer = document.getElementById("gameLogPlayersList");
const playerMarkerContainer = document.getElementById("playerMarkerContainer");

// Templates
const playerTemplate = document.getElementById("playerInfo");
const logTemplate = document.getElementById("gameLogPlayers");
const playerMarkerTemplate = document.getElementById("playerMarker");

/**
 * UI REFERENCES (Dynamic Elements)
 * stored in arrays so we never have to use querySelector again
 */
const uiSquareValues = [];
const uiCardContainers = [];
const uiLogs = [];
const uiPlayerMarkers = [];

/**
 * INITIALIZATION: setUpPlayers
 */
function setUpPlayers() {
	// Clear containers in case of a game reset TODO: Reset Button
	leaderboardContainer.innerHTML = "";
	logContainer.innerHTML = "";

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
		const clonedLogTempalte = logTemplate.content.cloneNode(true);
		const clonedPlayerLog = clonedLogTempalte.firstElementChild;

		clonedPlayerLog.textContent = `${name} rolled a 0 and moved to Square 1`;

		// Store reference to the log item
		uiLogs.push(clonedPlayerLog);
		logContainer.appendChild(clonedPlayerLog);
	});

	players.forEach((_,index)=>{
		updateMarkerPosition(index,true);
	});


	// Set initial turn text
	updateTurnDisplay();  /* Make first player active turn */
}

function updateMarkerPosition(index,instant=false){
	//TODO:implement animations
	if (instant||true/*currently defaults to instant */){

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

		uiPlayerMarkers[index].style.left = `${xPx}px`;
		uiPlayerMarkers[index].style.top = `${yPx}px`;

		// Update visual square number using our array reference
		let distance = pos.y*GRID_W+pos.x+1;
		uiSquareValues[index].textContent = `Square ${distance}`;

		// animations ==> loop move
	}
}

function updateTurnDisplay() {
	activeTurnDisplay.textContent = `${players[game.current]}'s Turn`;
}

// Execute setup on script load
setUpPlayers();

/**
 * advances player and displays the changes along the way
 * @param {number} result
 */
function updatePositionsUI(result) {
	// TODO: currently a player wins even if they roll too high
	// if that needs to change update the advance function in grid

	// advance player
	let effects = game.advancePlayer(game.current,result);

	updateMarkerPosition(game.current);

	// process roll result
	game.processEffects(game.current,effects);

	updateMarkerPosition(game.current);

	// Update the game log text using our array reference
	const pos = game.players.get(game.current).position;  /* (x,y) ==> in css (x,y) but from up*/
	let distance = pos.y*GRID_W+pos.x+1;
	uiLogs[game.current].textContent = `${players[game.current]} rolled a ${result} and moved to Square ${distance}`;
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

	// 3. Highlight the new player
	uiCardContainers[game.current].classList.add("PickedPlayerTurn");

	updateTurnDisplay();
}

/**
 * EVENT LISTENERS
 */
rollButton.addEventListener("click", () => {
	// Check win condition
	if (game.winQueue.length > 0) {return;}

	rollButton.disabled = true;
	diceImage.src = "../assets/images/dice-animation.gif";


	let result = diceRoll(ROLL_SIZE);

	setTimeout(() => {
		diceImage.src = `../assets/images/dice-${result}.png`;

		updatePositionsUI(result);
		activePlayerLeaderboardHighlight();

		// Saving
		saveGameState(game);

		rollButton.disabled = false;
	}, 1000);
});