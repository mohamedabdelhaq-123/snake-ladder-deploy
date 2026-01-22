export default class PlayerAccountData{
  #name
  #imgNumber
  #score
  constructor(name,imgNumber,score=0){
    this.#name = name;
    this.#imgNumber = imgNumber;
    this.#score = score;
  }

  get name(){
    return this.#name;
  }

  get imgNumber(){
    return this.#imgNumber;
  }

  get score(){
    return this.#score;
  }

  set score(newScore){
    this.#score = newScore;
  }
  set name(newName){
    this.#name = newName;
  }
  set imgNumber(newImgNumber){
    this.#imgNumber = newImgNumber;
  } 
  toJSON() {
    return{
      name : this.#name,
      imgNumber: this.#imgNumber,
      score: this.#score
    }
  }
}