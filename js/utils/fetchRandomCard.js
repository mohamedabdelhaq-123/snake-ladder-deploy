
import jumpCard from "../game-logic/cards/jumpCard.js";
import { diceRoll } from "./utils.js";
/**
 * simply gets you a random card by using math.random.
 *
 */


export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let numberOfCardTypes = 1;

export function getCard() {
  randomCard = diceRoll(numberOfCardTypes);
  switch (randomCard) {
    case 1:
      return jumpCard(5);

    case 2:
      //
      return;
    case 3:
      //
      return;
    case 4:
      //
      return;
    case 5:
      //
      return;
    case 6:
      //
      return;
    case 7:
      //
      return;
    case 8:
      return;
    case 9:
      return;
  }
}
