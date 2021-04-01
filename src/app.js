import namesEn from '../public/en-names.json';
import namesTur from '../public/tr-names.json';
import { langTur } from './lang-tr';
import { langEn } from './lang-en';
import { getScores, addScores } from './score';
import {
    changeTurn,
    returnLastLetter,
    filterNamesbyFirstLetter,
    randomNumber,
    chooseDifficulty,
} from './helpers';

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new window.SpeechRecognition();
recognition.lang = 'en-EN';

const synthesis = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();
utterance.lang = 'en-EN';

let usedNamesList = [];
let gameTurn = 'computer';
let gameState = 'on';
let lastLetter = 'j';
let playerScore = 0;
let timeleft = 8;
let myTimer;
let names;

class SonHarfApp {
    constructor(options) {
        const {
            nameAreaSelector,
            startMicButtonSelector,
            startGameButtonSelector,
            reloadGameButtonSelector,
            timerSelector,
            playerNameInputSelector,
            liveScoreSelector,
            difficultyAreaSelector,
            introductionSelector,
            languageInputSelector,
            languageAreaSelector,
        } = options;

        this.$nameArea = document.querySelector(nameAreaSelector);
        this.$startMicButton = document.getElementById(startMicButtonSelector);
        this.$startGameButton = document.querySelector(startGameButtonSelector);
        this.$reloadGameButton = document.querySelector(reloadGameButtonSelector);
        this.$timerP = document.querySelector(timerSelector);
        this.$liveScore = document.querySelector(liveScoreSelector);
        this.$difficultyArea = document.querySelector(difficultyAreaSelector);
        this.$introduction = document.querySelector(introductionSelector);
        this.$languageInput = document.querySelector(languageInputSelector);
        this.$languageArea = document.querySelector(languageAreaSelector);
        this.$playerNameInput = document.getElementById(playerNameInputSelector);
    }

    startGame() {
        this.beforeStart();
        this.fillByLang();
        this.$startGameButton.addEventListener('click', () => {
            this.resetVariables();
            this.startGameEvents();
        });
    }

    startGameEvents() {
        this.computerSpeak();
        gameState = 'on';
        this.$timerP.style.display = 'inline-block';
        this.$playerNameInput.style.display = 'none';
        this.$startGameButton.style.display = 'none';
        this.$difficultyArea.style.display = 'none';
        this.$introduction.style.visibility = 'hidden';
        this.$languageArea.style.display = 'none';
    }

    afterGameScene() {
        this.$startGameButton.innerHTML = '🔄Play Again!';
        this.$startGameButton.style.display = 'inline-block';
    }

    beforeStart() {
        this.$timerP.style.display = 'none';
    }

    resetVariables() {
        clearInterval(myTimer);
        this.$nameArea.innerText = '';
        this.$timerP.className = 'badge badge-pill badge-dark';
        this.$timerP.innerText = 8;
        this.$liveScore.innerHTML = 0;
        playerScore = 0;
        usedNamesList = [];
    }

    reloadGame() {
        this.$reloadGameButton.addEventListener('click', () => {
            window.location.reload();
        });
    }

    startMic() {
        this.$startMicButton.addEventListener('click', () => {
            recognition.start();
            this.$startMicButton.style.color = '#DC3545';
        });
    }

    startMicAgain() {
        recognition.addEventListener('end', () => {
            recognition.start();
        });
    }

    computerSpeak() {
        gameTurn = 'computer';
        const from = 'computer';
        const thinkTime = randomNumber(2, 5);
        setTimeout(() => {
            const randomName = this.getRandomName();
            if (!this.isNameUsed(randomName) && gameState === 'on') {
                utterance.text = randomName;
                synthesis.speak(utterance);
                this.addNameToScreen(randomName, from);
            }
        }, thinkTime * 1000);
    }

    computerSpeakTurn() {
        const computerChance = chooseDifficulty();
        const random = randomNumber(1, 100);
        if (computerChance > random) {
            this.computerSpeak();
        } else {
            setTimeout(() => {
                gameTurn = 'computer';
                this.gameOver();
            }, 3500);
        }
    }

    getRandomName() {
        const filteredNames = filterNamesbyFirstLetter(names, lastLetter);
        const filteredNamesKeys = Object.keys(filteredNames);
        const randomIndex = Math.floor(Math.random() * filteredNamesKeys.length);
        const randomName = filteredNames[randomIndex];
        return randomName;
    }

    isNameUsed(saidName) {
        const nameStatus = usedNamesList.filter(
            (usedName) => usedName.toLowerCase() === saidName.toLowerCase(),
        );
        if (nameStatus.length > 0) {
            return true;
        }
        return false;
    }

    listenSpeech() {
        recognition.addEventListener('result', (spoken) => {
            const userSaid = Array.from(spoken.results[0][0].transcript).join('');
            this.checkGrammar(userSaid);
        });
        this.startMicAgain();
    }

    checkGrammar(userSaid) {
        gameTurn = 'user';
        const filteredNames = filterNamesbyFirstLetter(names, lastLetter);
        const splitUserSaid = userSaid.toLowerCase().split(' ');
        filteredNames.forEach((name) => {
            if (splitUserSaid.includes(name.toLowerCase())) {
                if (!this.isNameUsed(name) && gameState === 'on' && gameTurn === 'user') {
                    this.addNameToScreen(name, gameTurn);
                    this.computerSpeakTurn();
                }
            }
        });
    }

    addNameToScreen(name, from) {
        const p = document.createElement('p');
        p.innerText = name;
        p.classList.add(from);
        this.$nameArea.appendChild(p);
        this.afterTurn(name, from);
    }

    afterTurn(name, fromWho) {
        if (fromWho === 'user') {
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
        gameState = 'off';
        if (gameTurn === 'computer') {
            playerScore += 5;
            this.$timerP.innerText = `🥳You won!\n Score:${playerScore}`;
            this.$timerP.className = 'badge badge-pill badge-primary';
        } else {
            this.$timerP.innerText = `😓You Lost!\n Score:${playerScore}`;
            this.$timerP.className = 'badge badge-pill badge-danger';
        }
        addScores(playerScore);
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
        timeleft = 8;
        this.timer();
    }

    checkTimer() {
        if (timeleft < 0) {
            this.gameOver();
        }
    }

    changeLang() {
        this.$languageInput.addEventListener('change', () => {
            this.fillByLang();
        });
    }

    fillByLang() {
        switch (this.$languageInput.value) {
            case 'english':
                this.$introduction.innerHTML = langEn.introduction;
                names = namesEn;
                recognition.lang = 'en-EN';
                utterance.lang = 'en-EN';
                break;
            case 'turkish':
                this.$introduction.innerHTML = langTur.introduction;
                names = namesTur;
                recognition.lang = 'tr-TR';
                utterance.lang = 'tr-TR';
                break;
            default:
                break;
        }
    }

    init() {
        this.listenSpeech();
        this.startMic();
        this.startGame();
        this.reloadGame();
        this.changeLang();
        getScores();

    }
}

export default SonHarfApp;
