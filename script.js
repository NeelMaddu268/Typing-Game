var timeLeft = 60;
var timer;
var data = [];
var dataCallsLeft = 3;
var currentWordSplit;
var gamePlaying = false;
var lettersDone=0;
var score = 0;
var difficulty;
var wordPiece;

//Home Screen Stuff
var homeScreen = document.getElementById("homeScreen");
var difficultySelector = document.getElementById("difficultySelector");
var startButton = document.getElementById("startButton");

//Game Screen Stuff
var gameScreen = document.getElementById("gameScreen");
var wordPieces = document.getElementById("wordPieces");
var scoreHolder = document.getElementById("score");
var timerHolder = document.getElementById("timer");

//Game Over Screen Stuff
var gameOverScreen = document.getElementById("gameOverScreen");
var gameOverScore = document.getElementById("gameOverScore");
var gameOverDifficulty = document.getElementById("gameOverDifficulty");


gameOverScreen.style.display = "none";
gameScreen.style.display = "none";


getData();

function getData() {

    fetch('https://random-word-api.herokuapp.com/word?number=25&length=6')
        .then(response => response.json())
        .then(data => declareData(data));

    fetch('https://random-word-api.herokuapp.com/word?number=25&length=4')
        .then(response => response.json())
        .then(data => declareData(data));

    fetch('https://random-word-api.herokuapp.com/word?number=50&length=5')
        .then(response => response.json())
        .then(data => declareData(data));


}
  
function declareData(d) {
        data = data.concat(d);
        data.sort(function (a, b) {
            return 0.5 - Math.random();
        });
        dataCallsLeft--;

        if(dataCallsLeft == 0) {
        startButton.disabled = false;
    }   
}

function start() {

    difficulty = difficultySelector.value;
    gameScreen.style.display = "block";
    homeScreen.style.display = "none";

    gamePlaying = true;
    setupWord();

    timer = setInterval(function () {
        timeLeft--;
        updateTimerOnScreen();
        checkTimerDone()
    }, 1000);
}

function setupWord(){
    lettersDone = 0;
    currentWordSplit = data[0].split("");

    wordPieces = document.getElementById("wordPieces");
    while (wordPieces.firstChild) {
        wordPieces.removeChild(wordPieces.firstChild);
    }


    for (var i = 0; i < currentWordSplit.length; i++) {
        wordPiece = document.createElement("span");
        wordPiece.className = "wordPiece";
        wordPiece.innerHTML = currentWordSplit[i];
        wordPieces.appendChild(wordPiece);
    }


    data.shift();
}

function checkKey(key){
    if ((currentWordSplit[0]) == key.toLowerCase()) {
        lettersDone++;
        currentWordSplit.shift();

        wordPieces = document.getElementById("wordPieces");
        wordPieces.children[lettersDone - 1].classList.remove("incorrect");
        wordPieces.children[lettersDone - 1].classList.add("correct");
    }
    else{
        wordPieces.children[lettersDone].classList.add("incorrect");
        if(difficulty == "Hard"){
            timeLeft -= 5;
            if(timeLeft < 1){
                checkTimerDone();
                timeLeft = 0;
                updateTimerOnScreen()
            }else{
                updateTimerOnScreen();
            }
        }
    }

    if(currentWordSplit.length == 0){
        score++;
        scoreHolder.innerHTML = "Score: " + score;
        setupWord();
    }
}

function updateTimerOnScreen() {
    timerHolder.innerHTML = timeLeft;
}

function checkTimerDone() {
    if (timeLeft < 1) {
        gamePlaying = false;
        clearInterval(timer);
        gameOver();
    }
}

function gameOver(){
    gameScreen.style.display = "none";
    gameOverScreen.style.display = "block";
    gameOverScore.innerHTML = "Score: " + score;
    gameOverDifficulty.innerHTML = "Difficulty: " + difficulty;
}

function restart(){
    location.reload();
}

document.addEventListener("keydown", function (event) {
    if (gamePlaying) {
        checkKey(event.key);
    }
});