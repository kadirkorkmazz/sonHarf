import names from "./en-names.json"
import { sortingList, createTableElement, changeTurn, returnLastLetter, filterNamesbyFirstLetter, randomNumber, chooseDifficulty } from "./helpers"
import { getScoreFromApi, addScoreToApi } from "./data"

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new window.SpeechRecognition();
recognition.lang = "en-EN";

const synthesis = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

let usedNamesList = [];
let lastLetter = "j";
let timeleft = 15;
let myTimer;
let gameState = "on";
let gameTurn = "computer";
let playerScore = 0;
let highscoreList = [];

class SonHarfApp {
    constructor(options) {
        const {
            nameAreaSelector,
            startMicButtonSelector,
            startGameButtonSelector,
            reloadGameButtonSelector,
            timerSelector,
            playerNameInputSelector,
            scoreTableElSelector,
            liveScoreSelector,
            scoreTableSelector,
            difficultyAreaSelector,
            introductionSelector
        } = options;

        this.$nameArea = document.querySelector(nameAreaSelector);
        this.$startMicButton = document.getElementById(startMicButtonSelector);
        this.$startGameButton = document.querySelector(startGameButtonSelector);
        this.$reloadGameButton = document.querySelector(reloadGameButtonSelector);
        this.$timerP = document.querySelector(timerSelector);
        this.$playerNameInput = document.querySelector(playerNameInputSelector);
        this.$liveScore = document.querySelector(liveScoreSelector);
        this.$scoreTableEl = document.getElementsByTagName(scoreTableElSelector);
        this.$scoreTable = document.querySelector(scoreTableSelector);
        this.$difficultyArea = document.querySelector(difficultyAreaSelector);
        this.$introduction = document.querySelector(introductionSelector);
    }

    startGame() {
        this.beforeStart();
        this.$startGameButton.addEventListener('click', () => {
            this.resetVariables();
            this.startGameEvents();
        });
    }

    startGameEvents() {
        this.computerSpeak();
        gameState = "on";
        this.$timerP.style.display = "inline-block";
        this.$playerNameInput.style.display = "none";
        this.$startGameButton.style.display = "none";
        this.$difficultyArea.style.display = "none";
        this.$introduction.style.visibility = "hidden";
    }

    afterGameScene() {
        this.$startGameButton.innerHTML = "🔄 Play Again!"
        this.$startGameButton.style.display = "inline-block";
    }

    beforeStart() {
        this.$timerP.style.display = "none";
    }

    resetVariables() {
        usedNamesList = [];
        this.$nameArea.innerText = "";
        this.$timerP.className = "badge badge-pill badge-dark";
        clearInterval(myTimer);
        this.$timerP.innerText = 15;
        playerScore = 0;
        this.$liveScore.innerHTML = 0;
    }

    resetGame() {
        this.$reloadGameButton.addEventListener("click", () => {
            window.location.reload();
        })
    }

    startMic() {
        this.$startMicButton.addEventListener("click", () => {
            recognition.start();
            this.$startMicButton.style.color = "#DC3545";
        });
    }

    startMicAgain() {
        recognition.addEventListener('end', () => {
            recognition.start();
        })
    }

    computerSpeakTurn() {
        const computerChance = chooseDifficulty();
        const random = randomNumber(1, 100);
        if (computerChance > random) {
            this.computerSpeak();
        }
        else {
            setTimeout(() => {
                gameTurn = "computer";
                this.gameOver();

            }, 4000);
        }
    }

    computerSpeak() {
        gameTurn = "computer";
        const from = "computer";
        const thinkTime = randomNumber(3, 5);
        setTimeout(() => {
            const randomName = this.getRandomName();
            if (!(this.isNameUsed(randomName)) && gameState === "on") {
                utterance.text = randomName;
                synthesis.speak(utterance);
                this.addNameToScreen(randomName, from);
            }
        }, thinkTime * 1000);
    }

    getRandomName() {
        const filteredNames = filterNamesbyFirstLetter(names, lastLetter);
        const filteredNamesKeys = Object.keys(filteredNames)
        const randomIndex = Math.floor(Math.random() * filteredNamesKeys.length)
        const randomName = filteredNames[randomIndex]
        return randomName;
    }

    isNameUsed(saidName) {
        const nameStatus = usedNamesList.filter(usedName => usedName.toLowerCase() === saidName.toLowerCase());
        if (nameStatus.length > 0) {
            return true;
        }
        return false
    }

    listenSpeech() {
        recognition.addEventListener('result', (spoken) => {
            const userSaid = Array.from(spoken.results[0][0].transcript)
                .join('');
            this.checkGrammar(userSaid);
        });
        this.startMicAgain();
    }

    checkGrammar(userSaid) {
        gameTurn = "user";
        const filteredNames = filterNamesbyFirstLetter(names, lastLetter);
        const splitUserSaid = userSaid.toLowerCase().split(" ");

        filteredNames.forEach(name => {
            if (splitUserSaid.includes(name.toLowerCase())) {
                if (!(this.isNameUsed(name)) && gameState === "on" && gameTurn === "user") {
                    this.addNameToScreen(name, gameTurn);
                    this.computerSpeakTurn();
                }
            }
        }
        );
    }

    addNameToScreen(name, from) {
        const p = document.createElement('p');
        p.innerText = name;
        p.classList.add(from);
        this.$nameArea.appendChild(p);
        this.afterTurn(name, from);
    }

    afterTurn(name, fromWho) {
        if (fromWho === "user") {
            playerScore += 1;
            this.$liveScore.innerHTML = playerScore;
        }
        gameTurn = changeTurn(fromWho);
        usedNamesList.push(name);
        lastLetter = returnLastLetter(name);
        this.reTimer();
    }

    gameOver() {
        clearInterval(myTimer);
        gameState = "off";
        if (gameTurn === "computer") {
            playerScore += 5;
            this.$timerP.innerText = `🥳You won!\n Score:${playerScore}`;
            this.$timerP.className = "badge badge-pill badge-primary";
        } else {
            this.$timerP.innerText = `😓You Lost!\n Score:${playerScore}`;
            this.$timerP.className = "badge badge-pill badge-danger";
        }
        this.addScores();
        this.afterGameScene();
    }

    timer() {
        myTimer = setInterval(() => {
            this.$timerP.innerText = timeleft;
            timeleft -= 1;
            this.checkTimer();
        }, 1000);
    }

    reTimer() {
        clearInterval(myTimer);
        timeleft = 15;
        this.timer();
    }

    checkTimer() {
        if (timeleft < 0) {
            this.gameOver();
        }
    }

    getScores() {
        getScoreFromApi().then((scores) => {
            scores.forEach((score) => {
                highscoreList.push(score);
            });
        }).then(() => {
            this.fillScoreboard(highscoreList)
        })
    }

    fillScoreboard(scoreList) {
        for (let i = 0; i < 5; i += 1) {
            const { score, player } = scoreList[i];
            const $newScoreEl = document.createElement('tr');
            $newScoreEl.innerHTML = createTableElement(i, player, score);
            this.$scoreTable.appendChild($newScoreEl);
        }
    }

    updateScoreboard(scoreList) {
        for (let i = 0; i < 5; i += 1) {
            const { score, player } = scoreList[i];
            this.$scoreTableEl[i + 1].innerHTML = createTableElement(i, player, score);
        }
    }

    addScores() {
        const playerName = (this.$playerNameInput.value === "") ? "Anonymous" : this.$playerNameInput.value;
        const gameResult = { player: playerName, score: playerScore }
        addScoreToApi(gameResult).then(() => {
            highscoreList.push(gameResult);
            highscoreList = sortingList(highscoreList);
            this.updateScoreboard(highscoreList);
        });
    }

    init() {
        this.listenSpeech();
        this.startMic();
        this.startGame();
        this.resetGame();
        this.getScores();
    }
}

export default SonHarfApp;
