import './styles/main.css';

import SonHarfApp from './app';

let sonHarfApp = new SonHarfApp({
    textsSelector: '.texts',
    startButtonSelector: '.startButton',
    stopButtonSelector: '.stopButton'

});

sonHarfApp.init();

















/*

const texts = document.querySelector('.texts');


window.SpeechRecognition = window.webkitSpeechRecognition;
const recognition = new window.SpeechRecognition();
recognition.interimResults = true; // for real time results

let p = document.createElement('p');

recognition.addEventListener('result', (e) => {
    const text = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
    console.log(text);
    p.innerText = text;
    texts.appendChild(p);

    if (e.results[0].isFinal) {

        if (text.includes('Hello')) {
            p = document.createElement('p');
            p.classList.add('replay');
            p.innerText = 'Hi broomm';
            texts.appendChild(p);
        }


        p = document.createElement('p');
    }


});

recognition.addEventListener('end', () => {
    recognition.start();
})

recognition.start();



let synth = window.speechSynthesis;

let konus = "Hadi len ordan kestane";
let utter = new SpeechSynthesisUtterance(konus);

utter.volume = 3;
utter.rate = 1;
utter.pitch = 1;
synth.speak(utter);
*/