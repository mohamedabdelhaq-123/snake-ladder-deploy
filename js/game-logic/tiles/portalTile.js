import Tile from "../tiles.js";

/**
 * Parent class for any tile that sends the player somewhere
 * such as snakes or ladders
 * @augments Tile
 */
export default class PortalTile extends Tile {
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
