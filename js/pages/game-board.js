import { Game, Grid } from "../game-logic/game.js";
import { PortalTile } from "../game-logic/tiles.js";
import { diceRoll, Point } from "../game-logic/utils.js";
/**
 * Constants
 */
const ROLL_SIZE = 6;
const GRID_W = 10;
const GRID_H = 10;

/**
 * Received Data
 */
const players = ["Momo", "ZoZ", "Andrew", "Haneen"];

// Build game
const playerIds = [];
for (let i in players){ // NOTE!!!: js for ... in returns index only i.e [0,1,2,3]
	playerIds.push(i);
}
let grid = new Grid(GRID_W,GRID_H);

// grid.addTile(new PortalTile(new Point(2,3),new Point(0,0)));
// grid.addTile(new PortalTile(new Point(1,3),new Point(0,0)));

let game = new Game(playerIds,grid);

/**
 * DOM REFERENCES (Static Elements)
 */
const rollButton = document.getElementById("rollDiceButton");
const diceImage = document.getElementById("diceIcon");
const activeTurnDisplay = document.getElementById("activeTurnPlayerName");

// Containers
const leaderboardContainer = document.getElementById("playersLeaderboard");
const logContainer = document.getElementById("gameLogPlayersList");

// Templates
const cardTemplate = document.getElementById("playerInfo");
const logTemplate = document.getElementById("gameLogPlayers");

/**
 * UI REFERENCES (Dynamic Elements)
 * stored in arrays so we never have to use querySelector again
 */
const uiSquareValues = [];
const uiCardContainers = [];
const uiLogs = [];

/**
 * INITIALIZATION: setUpPlayers
 */
function setUpPlayers() {
	// Clear containers in case of a game reset
	leaderboardContainer.innerHTML = "";
	logContainer.innerHTML = "";

	players.forEach((name, index) => {
		// 1. Create Leaderboard Card
		const cardFragment = cardTemplate.content.cloneNode(true);

		const cardContainer = cardFragment.querySelector(".playerInfo");
		const nameHeading = cardFragment.querySelector("h5");
		const positionSpan = cardFragment.querySelector(".currentPlayerSquareNumber");

		nameHeading.textContent = name;
		positionSpan.textContent = "0";
		if (index === 0) {
			cardContainer.classList.add("PickedPlayerTurn");
		}

		// Store reference to the span so we can update it later by index
		uiCardContainers.push(cardContainer);
		uiSquareValues.push(positionSpan);
		leaderboardContainer.appendChild(cardFragment);

		// 2. Create Game Log Entry
		const logFragment = logTemplate.content.cloneNode(true);
		const logItem = logFragment.querySelector(".gameLogPlayers");

		logItem.textContent = `${name} rolled a 0 and moved to Square 0`;

		// Store reference to the log item
		uiLogs.push(logItem);
		logContainer.appendChild(logFragment);
	});

	// Set initial turn text
	updateTurnDisplay();
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

	// TODO: effects are currently processed at th same time. maybe do it in steps

	// process roll result
	game.processEffects(game.current,effects);

	// Update visual square number using our array reference
	// No querySelector needed here!
	let pos = game.players.get(game.current).position;
	let distance = pos.y*GRID_W+pos.x+1;
	uiSquareValues[game.current].textContent = `Square ${distance}`;

	// Update the game log text using our array reference
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

		rollButton.disabled = false;
	}, 1000);
});