let homeBtn = document.getElementById("home-button");
let instructionBtn = document.getElementById("instruction-button");
let playAgainBtn = document.getElementById("play-again-button");
homeBtn.addEventListener("click",()=>window.location.assign("../html/home.html"));
instructionBtn.addEventListener("click",()=>window.location.assign("../html/instruction.html"));
playAgainBtn.addEventListener("click",()=>window.location.assign("../html/gameBoardScreen.html"));
