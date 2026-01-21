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

/**
 * Includes the data for a player's instance during gameplay
 * Separately from the GUI and other interfaces and uses the playerId
 * to allow cross referencing
 *
 * currently only contains position
 * @property {Number} playerId - the id for player for cross referencing with the gui and other interfaces
 * @property {Point} position - the starting position of the player
 * @property {Card} cards - the list of cards the player currently has
 */
export class PlayerGameData {
	#playerId;
	#position;
	#cards = [];

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

	get cards(){
		return this.#cards;
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
	#grid;            /* game board */

	/**@type {CyclicQueue<number>} */
	#activeQueue = new CyclicQueue();  /* track whose turn it is 1,2,3,1,2,3,.... */

	/**@type {Array<number>} */
	#winQueue = [];               /* 3,1,2 ==> player 3 reached 100 then player 1,... */

	constructor(playerIds,grid) {
		// TODO: add validation for parameters

		let queueData = this.#activeQueue.data;  /* take direct access to turn order (to add player simply)*/

		playerIds.forEach((playerId)=>{
			this.#players.set(playerId,new PlayerGameData(playerId)); /* key(id),,value(obj(id,position [will be undef==>(0,0)] ) */
			queueData.push(playerId);
		});

		this.#grid = grid;
	}

	/**
	 * consumes card from player's inventory and triggers its effect
	 * @param {number} playerId id of Player playing the card
	 * @param {number} cardId id of card being played
	 * @param {*} params any other parameters the card requires
	 */
	playCard(playerId,cardId,params){
		let player = this.#players.get(playerId);
		let card = player.cards[cardId];
		player.cards.splice(cardId,1);
		card.effect(this,player,params);
	}

	/**
	 * Processes the effects cause by a player's movement
	 * @param {number} playerId
	 * @param {*} effects
	 */
	processEffects(playerId,effects){
		let player = this.#players.get(playerId);
		// handle effects
		if (effects instanceof Tile){
			effects.effect(this,player);
		}
	}

	/**
	 * Adances the current player forward on the board
	 * @param {number} result
	 * @returns effects triggered due to advancement
	 */
	advancePlayer(playerId,result){
		let player = this.#players.get(playerId);
		return this.#grid.advance(player,result);
	}

	/**
	 * updates the active and winning queue
	 */
	updateQueues(){
		let anyWins = false;
		this.#activeQueue.data.forEach((playerId)=>{
			let player = this.#players.get(playerId);
			let hasWon = this.checkWinCondition(player);
			anyWins|=hasWon;
			// process turn result
			if (hasWon){ /* if was true */
				this.#activeQueue.remove(playerId);
				this.#winQueue.push(playerId);
			}
		});

		if (!anyWins) {
			this.#activeQueue.next(); /* if no one won so go to the second turn */
		}
	}

	/**
	 * Plays an entire turn from start to finish:
	 * - rolls dice
	 * - advances player
	 * - process tile effects
	 * - updates queues
	 *
	 * note: this doesn't include playing cards
	 */
	playTurn(){
		// TODO: declare constant somewhere else (or make it dynamic)
		const DICE_SIDE_COUNT = 6;

		// roll dice
		let result = diceRoll(DICE_SIDE_COUNT);

		// advance player
		let effects = this.advancePlayer(this.current,result); /* this.current = this.#activeQueue.current; */

		// process roll result
		this.processEffects(this.current,effects);

		// check win condition & switch turns
		this.updateQueues();

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

	//TODO: make more restrictive, used this way for debugging purposes
	get players(){
		return this.#players;
	}

	// TODO: add other getters
}