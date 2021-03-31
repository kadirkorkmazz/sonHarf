const difficultyInput = document.querySelector("#difficultyInput");

export const sortingList = (list) => {
    list.sort((a, b) => (b.score - a.score));
    return list;
}

export const createTableElement = (i, player, score) => `<th scope="row"><h6>${i + 1}</h6></th><td>${player}</td><td>${score}</td>`

export const randomNumber = (min, max) => {
    const randomNum = Math.floor(Math.random() * (max - min + 1) + min);
    return randomNum
}

export const changeTurn = (turn) => {
    if (turn === "computer") {
        return "user"
    }
    return "computer"
}

export const returnLastLetter = (saidName) => {
    const lastCharacter = saidName.slice(-1);
    return lastCharacter;
}

export const filterNamesbyFirstLetter = (names, lastLetter) => {
    const filteredNames = names.filter(name => name[0].toLowerCase() === lastLetter);
    return filteredNames;
}

export const chooseDifficulty = () => {
    const difficulty = difficultyInput.value;
    let computerChance;
    switch (difficulty) {
        case "easy":
            computerChance = 70;
            break;
        case "medium":
            computerChance = 85;
            break;
        case "hard":
            computerChance = 101;
            break;
        default:
            computerChance = 70;
    }
    return computerChance;
}

