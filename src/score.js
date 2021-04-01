import { sortingList, createTableElement } from './helpers';
import { getScoreFromApi, addScoreToApi } from './data';

const $scoreTableEl = document.getElementsByTagName('tr');
const $scoreTable = document.querySelector('#table-tbody');
const $playerNameInput = document.querySelector('#playerNameInput');
let highscoreList = [];

const fillScoreboard = (scoreList) => {
  for (let i = 0; i < 5; i += 1) {
    const { score, player } = scoreList[i];
    const $newScoreEl = document.createElement('tr');
    $newScoreEl.innerHTML = createTableElement(i, player, score);
    $scoreTable.appendChild($newScoreEl);
  }
};

export const getScores = () => {
  getScoreFromApi()
    .then((scores) => {
      scores.forEach((score) => {
        highscoreList.push(score);
      });
    })
    .then(() => {
      fillScoreboard(highscoreList);
    });
};

const updateScoreboard = (scoreList) => {
  for (let i = 0; i < 5; i += 1) {
    const { score, player } = scoreList[i];
    $scoreTableEl[i + 1].innerHTML = createTableElement(i, player, score);
  }
};

export const addScores = (pScore) => {
  const playerName = $playerNameInput.value === '' ? 'Anonymous' : $playerNameInput.value;
  const gameResult = { player: playerName, score: pScore };
  addScoreToApi(gameResult).then(() => {
    highscoreList.push(gameResult);
    highscoreList = sortingList(highscoreList);
    updateScoreboard(highscoreList);
  });
};
