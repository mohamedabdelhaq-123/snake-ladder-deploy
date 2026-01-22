import Game from "../game-logic/game.js";

/**
 * Saves game logic data such as position and cards held by each player, the active queue,etc ....
 * @param {Game} game
 */
export function saveGameState(game){
	// serialize game
	let gameState = game.toJson();

	// store the updated version
	window.localStorage.setItem("gameState", gameState);
}

export function loadGameState(game){
	// data from storage
	const data = window.localStorage.getItem("gameState");
	if (data === null){
		// if doesn't exist create new
		return false;
	}

	// serialize and update game components
	game.fromJson(data);
	return true;
}