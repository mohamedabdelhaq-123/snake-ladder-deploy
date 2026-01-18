import { Tile } from "./tiles.js";
import { Point, diceRoll, CyclicQueue } from "./utils.js";


/**
 * Contains the information about the grid being played on
 * @property {Map} tiles - map of tiles in the grid
 */
export class Grid {
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
		newDistance = Math.min(newDistance,this.#width*this.#height-1);

		let newX = newDistance%this.#width;
		let newY = Math.floor(newDistance/this.#width);
		player.position = new Point(newX,newY);

		// TODO: we could make it so effects are triggered on advancement
		// for now, the effects are sent after everything is calculated

		return this.getTile(player.position);
	}

	/**
	 * Adds a tile to the tiles map and returns other tiles placed there if they exist
	 * @param {Tile} tile the Tile object carrying the effect
	 * @param {Point} position optionally alter position of tile before adding it
	 */
	addTile(tile,position) {
		if (!(tile instanceof Tile)){
			throw new Error("Only tiles are accepted!");
		}

		//TODO: delegate error check to tile
		if (position !== undefined){
			if (!(position instanceof Point)){
				throw new Error("Only points are accepted!");
			}
			Tile.position = position;
		}

		let temp = this.#tiles.get(tile.position.key());
		this.#tiles.set(tile.position.key(),tile);
		return temp;
	}

	/**
	 * get tile at specific position
	 * @param {Point} position Place to get tile from
	 * @returns Returns tile at place in the map
	 */
	getTile(position) {
		return this.#tiles.get(position.key());
	}

	get goal(){
		return this.#goal;
	}
}

/**
 * Includes the data for a player's instance during gameplay
 * Separately from the GUI and other interfaces and uses the playerId
 * to allow cross referencing
 *
 * currently only contains position
 * @property {Number} playerId - the id for player for cross referencing with the gui and other interfaces
 * @property {Point} position - the starting position of the player
 *
 */
export class PlayerGameData {
	#playerId;
	#position;

	/**
	 * @param {Point} initialPosition optionally specifies starting position
	 */
	constructor(playerId,initialPosition) {
		// TODO: player id not validated
		this.#playerId = playerId;
		if (initialPosition !== undefined){
			// using this.position instead of this.#position to trigger validation
			this.position = initialPosition;
		}
		else {
			this.position = new Point(0,0);
		}
	}

	get position(){
		return this.#position;
	}

	set position(val){
		if (!(val instanceof Point)){
			throw new Error("Only accepts points!");
		}
		this.#position = val;
	}

	get playerId(){
		return this.#playerId;
	}
}

/**
 * Class containing the game state as well as game logic
 * @property {Map} players - game data about players such as location
 * @property {Grid} grid - the tilemap the players are moving on
 * @property {CyclicQueue} activeQueue - keeps track of player play order
 * @property {array} winQueu - keeps track of order of players who won
 */
export class Game {
	/**@type {Map<number,PlayerGameData>} */
	#players = new Map();

	/**@type {Grid} */
	#grid;

	/**@type {CyclicQueue<number>} */
	#activeQueue = new CyclicQueue();

	/**@type {Array<number>} */
	#winQueue = [];

	constructor(playerIds,grid) {
		// TODO: add validation for parameters

		let queueData = this.#activeQueue.data;

		playerIds.forEach((playerId)=>{
			this.#players.set(playerId,new PlayerGameData(playerId));
			queueData.push(playerId);
		});

		this.#grid = grid;
	}

	/**
	 * Roll the dice and move forward to the next turn
	 */
	playTurn(){
		// TODO: declare constant somewhere else (or make it dynamic)
		const DICE_SIDE_COUNT = 6;

		// setup scope
		let playerId = this.#activeQueue.current;
		let currentPlayer = this.#players.get(playerId);

		// roll dice
		let result = diceRoll(DICE_SIDE_COUNT);

		// process roll result
		// TODO:named effects for now, maybe multiple will be sent later
		let effects = this.#grid.advance(currentPlayer,result);

		// handle effects
		if (effects instanceof Tile){
			effects.effect(this,currentPlayer);
		}

		// check win condition
		// TODO: maybe check conditions for all players in case effects made another player win
		let hasWon = this.checkWinCondition(currentPlayer);

		// process turn result
		if (hasWon){
			this.#activeQueue.remove(playerId);
			this.#winQueue.push(playerId);
		} else {
			this.#activeQueue.next();
		}

	}

	/**
	 * Check if player has won this game
	 * @param {PlayerGameData} player
	 * @returns
	 */
	checkWinCondition(player){
		// note that we need to use key function to check equality
		return player.position.key() === this.#grid.goal.key();
	}

	/**
	 * returns a copy of the winQueue
	 */
	get winQueue(){
		return this.#winQueue.slice();
	}

	/**
	 * returns a copy of the activeQueue
	 */
	get activeQueue(){
		return this.#activeQueue.data.slice();
	}

	get current(){
		return this.#activeQueue.current;
	}

	//TODO: make more restrictive, usedd this way for debugging purposes
	get players(){
		return this.#players;
	}

	// TODO: add other getters
}