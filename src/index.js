import './styles/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SonHarfApp from './app';

let sonHarfApp = new SonHarfApp({
    textsSelector: '.texts',
    startRecButtonSelector: '.startRecButton',
    startGameButtonSelector: '.startGameButton',
    resetGameButtonSelector: '.resetGameButton'
});

sonHarfApp.init();