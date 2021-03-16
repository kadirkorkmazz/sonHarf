import './styles/main.css';

import SonHarfApp from './app';

let sonHarfApp = new SonHarfApp({
    textsSelector: '.texts',
    startButtonSelector: '.startButton',
    stopButtonSelector: '.stopButton'

});

sonHarfApp.init();