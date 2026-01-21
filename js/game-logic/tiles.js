import Point from "../utils/point.js";
import Game from "./game.js";
import PlayerGameData from "./player.js";

/**
 * Tiles are special entities placed on the board
 * which trigger an event of some sort when the player presses on them
 */
export default class Tile {
	#position;
	/**
	 * @param {Point} position location to check on the board
	 */
	constructor(position) {
		//TODO: only works because Point is immutable, should copy otherwise
		//TODO: validate
		this.#position = position;
	}

	/**
	 * A function intended to be applied when the tile is pressed on
	 * @param {Game} game game state to affect
	 * @param {PlayerGameData} player the player who stepped on it
	 */
	effect(_game,_player) {}

	/**
	 * returns name to identify for other interfaces
	 */
	static get name(){
		return "tile";
	}
	get position(){
		return this.#position;
	}

}