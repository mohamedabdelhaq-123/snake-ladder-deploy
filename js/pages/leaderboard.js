let homeBtn = document.getElementById("home-button");
let instructionBtn = document.getElementById("instruction-button");
let playAgainBtn = document.getElementById("play-again-button");
homeBtn.addEventListener("click",()=>location.assign("../html/home.html"));
instructionBtn.addEventListener("click",()=>location.assign("../html/instruction.html"))
playAgainBtn.addEventListener("click",()=>location.assign("../html/gameBoardScreen.html"))
