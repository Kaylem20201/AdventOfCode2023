import { inputToLines } from "../util.js";
const DAYNUMBER = 4;
const lines = await inputToLines(DAYNUMBER);
function part1Main() {
    const cards = lines.map((lineString) => parseCard(lineString));
    const scores = cards.map((card) => getCardScore(card));
    console.log(scores.reduce((accumulator, currentValue) => accumulator += currentValue));
}
function part2Main() {
    const cards = lines.map((lineString) => parseCard(lineString));
    const copiesOfCards = new Map();
    for (const card of cards) {
        copiesOfCards.set(card.id, 1);
    }
    for (let i = 0; i < cards.length; i++) {
        const cardId = cards[i].id;
        const copiesOfCard = copiesOfCards.get(i);
        const winningNumbers = getCardTotalWinningNumbers(cards[i]);
        for (let j = 1; j <= winningNumbers; j++) {
            const currentCopies = copiesOfCards.get(cardId);
            const targetCopies = copiesOfCards.get(cardId + j);
            if ((currentCopies === undefined) || (targetCopies === undefined))
                process.exit(1);
            copiesOfCards.set(cardId + j, targetCopies + (currentCopies));
        }
    }
    let total = 0;
    for (const copies of copiesOfCards.values()) {
        //console.log(copies);
        total += copies;
    }
    console.log(total);
}
function parseCard(cardLine) {
    const CARDEXP = /Card\s*(\d+)/;
    const WINNERSEXP = /:(?:\s*((?:\s*\d+\s*)+)\s*)+\|/;
    const GIVENEXP = /\|(?:\s*((?:\s*\d\s*)+)\s*)$/;
    const idMatch = cardLine.match(CARDEXP);
    if (idMatch === null)
        process.exit();
    const cardId = idMatch[1];
    //console.log(cardId);
    const winningMatch = cardLine.match(WINNERSEXP);
    if (winningMatch === null)
        process.exit();
    const winningNumbers = winningMatch[1].split(' ').filter((element) => element !== '');
    //console.log(winningNumbers);
    const givenMatch = cardLine.match(GIVENEXP);
    if (givenMatch === null)
        process.exit();
    const givenNumbers = givenMatch[1].split(' ').filter((element) => element !== '');
    //console.log(givenNumbers);
    const card = {
        id: Number.parseInt(cardId),
        winningNumbers: winningNumbers.map((numberString) => Number.parseInt(numberString)),
        givenNumbers: givenNumbers.map((numberString) => Number.parseInt(numberString))
    };
    return card;
}
function getCardTotalWinningNumbers(cardInfo) {
    let matchingNumbers = 0;
    const winningNumbers = cardInfo.winningNumbers;
    const givenNumbers = cardInfo.givenNumbers;
    for (const winningNumber of winningNumbers) {
        if (givenNumbers.includes(winningNumber)) {
            matchingNumbers += 1;
        }
    }
    return matchingNumbers;
}
function getCardScore(cardInfo) {
    const matchingNumbers = getCardTotalWinningNumbers(cardInfo);
    const score = (matchingNumbers === 0) ? 0 :
        2 ** (matchingNumbers - 1);
    return score;
}
//part1Main();
part2Main();
process.exit();
