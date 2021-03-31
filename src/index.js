import './styles/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SonHarfApp from './app';

const sonHarfApp = new SonHarfApp({
    nameAreaSelector: '.nameArea',
    startMicButtonSelector: 'startMicButton',
    startGameButtonSelector: '#startGameButton',
    reloadGameButtonSelector: '.reloadGameButton',
    timerSelector: '#timerP',
    playerNameInputSelector: '#playerNameInput',
    scoreTableElSelector: 'tr',
    liveScoreSelector: '#liveScore',
    scoreTableSelector: '#table-tbody',
    difficultyAreaSelector: '.difficultyArea',
    introductionSelector: '#introduction'
});

sonHarfApp.init();