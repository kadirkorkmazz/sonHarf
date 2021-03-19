import names from "./en-names.json"

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new window.SpeechRecognition();

const synthesis = window.speechSynthesis;
let utter = new SpeechSynthesisUtterance();

let usedNames = [];
let lastChar = "j";

class SonHarfApp {
    constructor(options) {
        let {
            textsSelector,
            startRecButtonSelector,
            startGameButtonSelector,
            resetGameButtonSelector,
        } = options;

        this.$texts = document.querySelector(textsSelector);
        this.$startRecButton = document.querySelector(startRecButtonSelector);
        this.$startGameButton = document.querySelector(startGameButtonSelector);
        this.$resetGameButton = document.querySelector(resetGameButtonSelector);
    }

    startGame() {
        this.$startGameButton.addEventListener('click', () => {
            this.aiSpeechName();
        });
    }

    startAgain() {
        recognition.addEventListener('end', () => {
            recognition.start();
        })
    }

    startRec() {
        this.$startRecButton.addEventListener("click", () => {
            recognition.start();
        });
    }

    aiSpeechName() {
        let randomName = this.randomName();
        if (!(this.checkUsedNames(randomName))) {
            utter.text = randomName;
            synthesis.speak(utter);
            this.addNameToScreen(randomName);
        } else {
            console.log("Bu isim söylendi");
        }
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

    addNameToScreen(name) {
        let p = document.createElement('p');
        p.innerText = name;
        this.$texts.appendChild(p);
        usedNames.push(name);
        lastChar = this.returnLastLetter(name);
    }

    speechListen() {
        recognition.addEventListener('result', (e) => {
            const text = Array.from(e.results[0][0].transcript)
                .join('');
            this.checkGrammar(text);
        });
        this.startAgain();
    }

    checkGrammar(userSaid) {
        let filteredNames = this.filterNames();
        filteredNames.forEach(name => {
            if (userSaid) {
                let splitUserSaid = userSaid.toLowerCase().split(" ");
                if (splitUserSaid.includes(name.toLowerCase())) {
                    console.log("Kelime eşleşti!");
                    if (!(this.checkUsedNames(name))) {
                        this.addNameToScreen(name);
                    } else {
                        console.log("Bunu söyledin");
                    }
                }
            }
        }
        );
    }

    resetGame() {
        this.$resetGameButton.addEventListener("click", () => {
            usedNames = [];
            this.$texts.innerText = "";
        })
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
        this.speechListen();
        this.checkGrammar();
        this.startRec();
        this.startGame();
        this.resetGame();
    }
}

export default SonHarfApp;
