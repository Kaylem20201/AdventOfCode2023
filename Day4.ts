import { inputToLines } from "./util.js";

const DAYNUMBER = 4;
const lines = await inputToLines(DAYNUMBER);

interface CardInfo {
    id : number,
    winningNumbers : number[],
    givenNumbers : number[]
}

function part1Main() {
    const cards = lines.map( (lineString) => parseCard(lineString));
    const scores = cards.map( (card) => getCardScore(card));
    console.log(scores.reduce( (accumulator,currentValue) => accumulator += currentValue));
}

function parseCard(cardLine : string) : CardInfo {
    const CARDEXP = /Card\s*(\d+)/;
    const WINNERSEXP = /:(?:\s*((?:\s*\d+\s*)+)\s*)+\|/;
    const GIVENEXP = /\|(?:\s*((?:\s*\d\s*)+)\s*)$/;

    const idMatch = cardLine.match(CARDEXP);
    if (idMatch === null) process.exit();
    const cardId = idMatch[1];
    //console.log(cardId);

    const winningMatch = cardLine.match(WINNERSEXP);
    if (winningMatch === null) process.exit();
    const winningNumbers = winningMatch[1].split(' ').filter((element) => element !== '');
    //console.log(winningNumbers);

    const givenMatch = cardLine.match(GIVENEXP);
    if (givenMatch === null) process.exit();
    const givenNumbers = givenMatch[1].split(' ').filter((element) => element !== '');
    //console.log(givenNumbers);

    const card = {
        id : Number.parseInt(cardId),
        winningNumbers : winningNumbers.map((numberString) => Number.parseInt(numberString)),
        givenNumbers : givenNumbers.map((numberString) => Number.parseInt(numberString))
    }
    
    return card;

}

function getCardScore(cardInfo : CardInfo) : number {
    let matchingNumbers = 0;
    const winningNumbers = cardInfo.winningNumbers;
    const givenNumbers = cardInfo.givenNumbers;

    for (const winningNumber of winningNumbers) {
        if (givenNumbers.includes(winningNumber)) {matchingNumbers += 1;}
    }

    const score = (matchingNumbers === 0) ? 0 :
        2 ** (matchingNumbers-1);

    return score;

}

part1Main();
process.exit();