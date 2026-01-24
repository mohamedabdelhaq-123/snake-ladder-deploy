import {getCard} from "../../utils/fetchRandomCard.js";
import Tile from "../tiles.js";
/**
 * Parent class for any tile that sends the player somewhere
 * such as snakes or ladders
 * @augments Tile
 */
export default class CardTile extends Tile {
  /**
   * @param {Point} start which the parent already has we will call his constructor
   * 
   */
  constructor(start) {
    //TODO: validate
    super(start);
  }

  /**
   * @override
   */
  get name(){
    return "card";
  }

  /**
   * add a power-up card to the player 
   * @inheritdoc
   * @override
   * @param {PlayerGameData} player the player who stepped on it
   */
  effect(game,player) {
    // Note: this relies on Points being immutable
    // otherwise we should copy data firs
    // TODO: confirm if this is fine
    console.log("i have been pushed");
    let card = getCard();
    player.pushCard(card)
  }
}