import Tile from "./tiles.js";
import Point from "../utils/point.js";

/**
 * Contains the information about the grid being played on
 * @property {Map} tiles - map of tiles in the grid
 */
export default class Grid {
	/** @type {Map<String, Tile>} */
	#tiles = new Map();
	#width;
	#height; // note: not used for much TODO: check if necessary or useful to keep
	#goal;

	/**
	 *
	 * @param {number} width
	 * @param {number} height
	 */
	constructor(width,height) {
		this.#width = width;
		this.#height = height;
		// goal is at the final corner by default
		this.#goal = new Point(width-1,height-1);
	}

	/**
	 * Advances the player forward on the tilemap
	 * @param {PlayerGameData} player
	 * @param {number} amount
	 */
	advance(player, amount){
		// This uses modular arithmetics to treat the board as a single row
		// we could have defined the board that way, but this make it more flexible
		// TODO: check if that was a reasonable assumption
		let x = player.position.x;
		let y = player.position.y;
		let distance = x+y*this.#width;
		let newDistance = distance+amount;
		// TODO: confirm how win logic applies
		// for now assuming as long as the distance is passed in general

		if (newDistance>99) // testcase TODO
		{
			newDistance=distance;
		}
		newDistance = Math.max(0,Math.min(newDistance,this.#width*this.#height-1));

		let newX = newDistance%this.#width;
		let newY = Math.floor(newDistance/this.#width);
		player.position = new Point(newX,newY);

		// TODO: we could make it so effects are triggered on advancement
		// for now, the effects are sent after everything is calculated

		return this.getTile(player.position);  /* to check if player landed on (snake/ladder/undefined) */
	}

	/**
	 * Adds a tile to the tiles map and returns other tiles placed there if they exist
	 * @param {Tile} tile the Tile object carrying the effect
	 * @param {Point} position optionally alter position of tile before adding it
	 */
	addTile(tile,position) {                 /* add a special tile (Snake/ladder) */
		if (!(tile instanceof Tile)){
			throw new Error("Only tiles are accepted!");
		}

		//TODO: delegate error check to tile
		if (position !== undefined){
			if (!(position instanceof Point)){
				throw new Error("Only points are accepted!");
			}
			Tile.position = position;          /* check if point (x,y) */
		}

		/* to check if there is snake/ladder in this position */
		let temp = this.#tiles.get(tile.position.key());   /*key (x,y)==> "x,y" to use it in map */
		this.#tiles.set(tile.position.key(),tile); /* set new snake/ladder to this postion */
		return temp;  /* if was undefined (no tile) else to know the replaced snake/ladder  (undo/warn/swapping)*/
	}

	/**
	 * get tile at specific position
	 * @param {Point} position Place to get tile from
	 * @returns Returns tile at place in the map
	 */
	getTile(position) {
		return this.#tiles.get(position.key()); // as string
	}

	get goal(){
		return this.#goal;
	}
}