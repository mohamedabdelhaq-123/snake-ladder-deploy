import Game from "./game.js";
import PlayerGameData from "./player.js";

/**
 * Tiles are special entities placed on the board
 * which trigger an event of some sort when the player presses on them
 */
export default class Card {
	constructor() {}

	/**
	 * A function intended to be applied when the tile is pressed on
	 * @param {Game} game game state to affect
	 * @param {PlayerGameData} player the player who stepped on it
	 * @param {*} params extra parameters like the other player for example
	 */
	effect(_game,_player,_params) {}

	/**
	 * returns description about tiles for displaying in game
	 */
	get name(){
		return "card";
	}

}
