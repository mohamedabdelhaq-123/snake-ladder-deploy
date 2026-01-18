import { Point } from "./utils.js";
import { Game, PlayerGameData } from "./game.js";

/**
 * Tiles are special entities placed on the board
 * which trigger an event of some sort when the player presses on them
 */
export class Tile {
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

/**
 * Parent class for any tile that sends the player somewhere
 * such as snakes or ladders
 * @augments Tile
 */
export class PortalTile extends Tile {
	#end;
	/**
	 * @param {Point} start
	 * @param {Point} end
	 */
	constructor(start, end) {
		//TODO: validate
		super(start);
		this.#end= end;
	}

	/**
	 * @override
	 */
	get name(){
		return "portal";
	}

	/**
	 * sends player to the specified end location
	 * @inheritdoc
	 * @override
	 * @param {Game} game game state to affect
	 * @param {PlayerGameData} player the player who stepped on it
	 */
	effect(game,player) {
		// Note: this relies on Points being immutable
		// otherwise we should copy data firs
		// TODO: confirm if this is fine
		player.position = this.#end;
	}
}
