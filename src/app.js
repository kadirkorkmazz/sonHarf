import names from "./en-names.json"

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new window.SpeechRecognition();

const synthesis = window.speechSynthesis;
let utter = new SpeechSynthesisUtterance();

let usedNames = [];
let lastChar = "j";
let timeleft = 15;
let myTimer;
let gameState = "on";
let turn = "ai";
let aiScore = 0;
let userScore = 0;

class SonHarfApp {
    constructor(options) {
        let {
            textsSelector,
            startRecButtonSelector,
            startGameButtonSelector,
            resetGameButtonSelector,
            timerSelector
        } = options;

        this.$texts = document.querySelector(textsSelector);
        this.$startRecButton = document.getElementById(startRecButtonSelector);
        this.$startGameButton = document.querySelector(startGameButtonSelector);
        this.$resetGameButton = document.querySelector(resetGameButtonSelector);
        this.$timerP = document.querySelector(timerSelector);
    }



    startGame() {
        this.$startGameButton.addEventListener('click', () => {
            this.startGameEvents();
        });
    }

    startGameEvents() {
        this.aiSpeechName();
        gameState = "on";
        //this.$startGameButton.style.visibility = "hidden";
        this.$timerP.style.visibility = "visible";

    }

    beforeStart() {
        this.$timerP.style.visibility = "hidden";
    }

    resetGame() {
        this.$resetGameButton.addEventListener("click", () => {
            this.beforeStart();
            usedNames = [];
            this.$texts.innerText = "";
            this.$timerP.className = "badge badge-pill badge-dark";
            clearInterval(myTimer);
            this.$timerP.innerText = 15;
            //this.$startGameButton.style.visibility = "visible";


        })
    }

    startAgain() {
        recognition.addEventListener('end', () => {
            recognition.start();
        })
    }

    startRec() {
        this.$startRecButton.addEventListener("click", () => {
            recognition.start();
            this.$startRecButton.style.color = "red";
        });
    }


    aiSpeechName() {
        turn = "ai";
        let from = "ai";
        let time = this.aiRandomThinkTime();
        console.log(time);
        setTimeout(() => {
            let randomName = this.randomName();
            if (!(this.checkUsedNames(randomName)) && gameState === "on") {
                utter.text = randomName;
                synthesis.speak(utter);
                this.addNameToScreen(randomName, from);
            } else {
                console.log("Bu isim söylendi && Oyun bitti");
            }
        }, time * 1000);
    }

    randomName() {
        let filteredNames = this.filterNames();
        const keys = Object.keys(filteredNames)
        const randomIndex = Math.floor(Math.random() * keys.length)
        const name = filteredNames[randomIndex]
        return name;
    }

    checkUsedNames(saidName) {
        let result = usedNames.filter(item => item.toLowerCase() === saidName.toLowerCase());
        if (result.length > 0) {
            return true;
        }
        return false
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
            clearInterval(myTimer);
            this.$timerP.innerText = "Game Over"
            gameState = "off";
            this.gameOver();
            if (turn === "ai") {
                this.$timerP.innerText = "User Win!"
                this.$timerP.className = "badge badge-pill badge-primary";

            } else {
                this.$timerP.innerText = "Ai Win!"
                this.$timerP.className = "badge badge-pill badge-danger";
            }
        }
    }

    addNameToScreen(name, from) {

        let p = document.createElement('p');
        p.innerText = name;

        let fromWho = (from === "ai") ? "ai" : "user";
        p.classList.add(fromWho);

        if (fromWho === "ai") {
            turn = "user";
        }
        this.$texts.appendChild(p);
        usedNames.push(name);
        lastChar = this.returnLastLetter(name);
        this.reTimer();

    }

    speechListen() {
        recognition.addEventListener('result', (e) => {
            const text = Array.from(e.results[0][0].transcript)
                .join('');
            this.checkGrammar(text);
            console.log(text);
        });
        this.startAgain();
    }


    aiRandomThinkTime() {
        let min = 1;
        let max = 3;
        let rand = Math.floor(Math.random() * (max - min + 1) + min); //Generate Random number between 5 - 10
        return rand;
    }

    gameOver() {
        recognition.stop();
    }

    checkGrammar(userSaid) {
        let filteredNames = this.filterNames();
        filteredNames.forEach(name => {
            if (userSaid) {
                let splitUserSaid = userSaid.toLowerCase().split(" ");
                if (splitUserSaid.includes(name.toLowerCase())) {
                    console.log("Kelime eşleşti!");
                    if (!(this.checkUsedNames(name)) && gameState === "on") {
                        this.addNameToScreen(name);
                        this.aiSpeechName();
                    } else {
                        console.log("Bunu söyledin");
                    }
                }
            }
        }
        );
    }



    returnLastLetter(saidName) {
        let lastLetter = saidName.slice(-1);
        return lastLetter;
    }

    filterNames() {
        let filteredNames = names.filter(name => name[0].toLowerCase() === lastChar);
        return filteredNames;
    }

    init() {
        this.beforeStart();
        this.speechListen();
        this.checkGrammar();
        this.startRec();
        this.startGame();
        this.resetGame();
    }
}

export default SonHarfApp;
