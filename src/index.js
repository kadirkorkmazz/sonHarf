import './styles/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SonHarfApp from './app';

const sonHarfApp = new SonHarfApp({
    nameAreaSelector: '.nameArea',
    startMicButtonSelector: 'startMicButton',
    startGameButtonSelector: '#startGameButton',
    reloadGameButtonSelector: '.reloadGameButton',
    timerSelector: '#timerP',
    liveScoreSelector: '#liveScore',
    difficultyAreaSelector: '.difficultyArea',
    introductionSelector: '#introduction',
    languageInputSelector: '#languageInput',
    languageAreaSelector: '.languageArea',
    playerNameInputSelector: 'playerNameInput'
});

sonHarfApp.init();
