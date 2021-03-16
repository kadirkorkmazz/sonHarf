import names from "./en-names.json"

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new window.SpeechRecognition();
recognition.lang = 'en-US';

const synthesis = window.speechSynthesis;


class SonHarfApp {
    constructor(options) {
        let {
            textsSelector,
            startButtonSelector,
            stopButtonSelector
        } = options;

        this.$texts = document.querySelector(textsSelector);
        this.$startButton = document.querySelector(startButtonSelector);
        this.$stopButton = document.querySelector(stopButtonSelector);
    }

    speechListen() {
        let p = document.createElement('p');
        recognition.addEventListener('result', (e) => {

            const text = Array.from(e.results[0][0].transcript)
                .join('');
            console.log(text);
            p.innerText = text;
            this.$texts.appendChild(p);

            if (e.results[0].isFinal) {
                names.forEach(name => {
                    if (text === name) {
                        p = document.createElement('p');
                        p.classList.add('replay');
                        p.innerText = name;
                        this.$texts.appendChild(p);
                    }
                })
                p = document.createElement('p');
            }

        });

        this.startAgain();
    }

    startAgain() {
        recognition.addEventListener('end', () => {
            recognition.start();
        })

    }

    speechListenn() {
        recognition.onresult = function (event) {
            console.log('You said: ', event.results[0][0].transcript);
        }
    }

    speechSynt() {
        let konus = "Welcome";
        let utter = new SpeechSynthesisUtterance(konus);
        utter.volume = 3;
        utter.rate = 1;
        utter.pitch = 1;
        synthesis.speak(utter);
    }

    checkNames() {
        names.forEach(name => {
            if (name === "joe") {
                console.log("joe found");
            }
        }
        );
    }

    randomName() {
        const keys = Object.keys(names)
        const randomIndex = Math.floor(Math.random() * keys.length)
        const name = names[randomIndex]
        return name;
    }

    start() {

        this.$startButton.addEventListener("click", function () {
            recognition.start();
        });
    }

    stop() {

    }



    init() {
        this.speechListen();
        this.speechSynt();
        this.checkNames();
        this.start();
        this.stop();
    }
}

export default SonHarfApp;
