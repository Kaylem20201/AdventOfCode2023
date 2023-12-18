import { inputToLines } from "../util.js";
import { binaryInsertionSearch } from "../util.js";

const DAYNUMBER = 7;
const lines = await inputToLines(DAYNUMBER);

interface HandInfo {
    hand: number[],
    bet: number
}

enum HandRank {
    fiveOfAKind = 7,
    fourOfAKind = 6,
    fullHouse = 5,
    threeOfAKind = 4,
    twoPair = 3,
    onePair = 2,
    highCard = 1
}

function parseInput(inputLines: string[], mode?: number): HandInfo[] {

    const HANDEXP = /(\S{5}) (\d+)/;

    const hands: HandInfo[] = [];
    for (const line of inputLines) {
        const handMatch = line.match(HANDEXP);
        if (handMatch === null || handMatch.length < 3) process.exit(1);
        const cardsRaw = handMatch[1].split('');
        let cards;
        if (mode === 2) { cards = cardsRaw.map((card) => convertCharToRank(card, 2)); }
        else { cards = cardsRaw.map(convertCharToRank); }
        const bet: number = Number.parseInt(handMatch[2]);
        hands.push({ hand: cards, bet: bet });
    }

    return hands;

}

function convertCharToRank(character: string, mode?: number): number {

    enum FaceCards {
        T = 10,
        J = 11,
        Q = 12,
        K = 13,
        A = 14
    }

    enum FaceCardsPart2 {
        T = 10,
        J = 1,
        Q = 11,
        K = 12,
        A = 13
    }

    if (character.length > 1) process.exit(1);

    if (mode === 2) {
        switch (character) {
            case 'T': return FaceCardsPart2.T;
            case 'J': return FaceCardsPart2.J;
            case 'Q': return FaceCardsPart2.Q;
            case 'K': return FaceCardsPart2.K;
            case 'A': return FaceCardsPart2.A;
            default: return Number.parseInt(character);
        }
    }

    switch (character) {
        case 'T': return FaceCards.T;
        case 'J': return FaceCards.J;
        case 'Q': return FaceCards.Q;
        case 'K': return FaceCards.K;
        case 'A': return FaceCards.A;
        default: return Number.parseInt(character);
    }

}

function sortHands(handA: HandInfo, handB: HandInfo): number {

    const handARank = calculateHandRank(handA);
    const handBRank = calculateHandRank(handB);

    if (handARank !== handBRank) return handARank - handBRank;

    //Same rank, find first higher card
    for (let i = 0; i < 5; i++) {
        const diff = handA.hand[i] - handB.hand[i];
        if (diff !== 0) return diff;
    }

    return 0;

}

function sortHandsPart2(handA: HandInfo, handB: HandInfo): number {

    const handARank = calculateHandRank(handA,2);
    const handBRank = calculateHandRank(handB,2);

    if (handARank !== handBRank) return handARank - handBRank;

    //Same rank, find first higher card
    for (let i = 0; i < 5; i++) {
        const diff = handA.hand[i] - handB.hand[i];
        if (diff !== 0) return diff;
    }

    return 0;

}

function calculateHandRank(hand: HandInfo, mode?: number): HandRank {

    let jokers;
    let cards;
    if (mode === 2) {
        jokers = hand.hand.filter((filterCard) => filterCard === 1).length;
        cards = hand.hand.filter((filterCard) => filterCard !== 1);
    }
    else {
        cards = hand.hand;
        jokers = 0;
    }

    const cardMatches = [];
    for (const card of cards) {
        cardMatches.push(cards.filter((filterCard) => card === filterCard).length);
    }
    
    let resultRank;

    //FiveOfAKind
    if (cardMatches.includes(5)) resultRank = HandRank.fiveOfAKind;

    //FourOfAKind
    else if (cardMatches.includes(4)) resultRank = HandRank.fourOfAKind;

    //FullHouse
    else if (cardMatches.includes(3) && cardMatches.includes(2)) resultRank = HandRank.fullHouse;

    //ThreeOfAKind
    else if (cardMatches.includes(3)) resultRank = HandRank.threeOfAKind;

    //TwoPair
    else if (cardMatches.filter((match) => { return match === 2 }).length === 4) resultRank = HandRank.twoPair;

    //OnePair
    else if (cardMatches.includes(2)) resultRank = HandRank.onePair;

    //HighCard
    else resultRank = HandRank.highCard;

    //Joker adjustment
    while (jokers > 0) {
        if (resultRank === HandRank.threeOfAKind) { resultRank+=2; }
        else if (resultRank === HandRank.onePair) { resultRank+=2; }
        else if (resultRank === HandRank.twoPair) { resultRank=HandRank.fullHouse; }
        else { resultRank ++; }
        jokers--;
    }

    return (Math.min(resultRank, HandRank.fiveOfAKind));

}

function part1Main(inputLines: string[]) {

    const hands: HandInfo[] = parseInput(inputLines);
    //const sortedHands : HandInfo[] = [];
    const sortedHands: HandInfo[] = hands.sort(sortHands);

    /*
    for (const hand of hands) {
        if (sortedHands.length === 0) {
            sortedHands.push(hand);
            continue;
        }
        sortedHands.splice(binaryInsertionSearch(sortedHands,hand,0,sortedHands.length-1,sortHands),0,hand);
    }*/

    let sum = 0;
    for (let i = 0; i < sortedHands.length; i++) {
        sum += sortedHands[i].bet * (i + 1);
    }
    console.log(sum);

}

function part2Main(inputLines: string[]) {

    const hands: HandInfo[] = parseInput(inputLines, 2);
    //const sortedHands : HandInfo[] = [];
    const sortedHands: HandInfo[] = hands.sort(sortHandsPart2);

    /*
    for (const hand of hands) {
        if (sortedHands.length === 0) {
            sortedHands.push(hand);
            continue;
        }
        sortedHands.splice(binaryInsertionSearch(sortedHands,hand,0,sortedHands.length-1,sortHands),0,hand);
    }*/

    let sum = 0;
    for (let i = 0; i < sortedHands.length; i++) {
        sum += sortedHands[i].bet * (i + 1);
    }
    console.log(sortedHands);
    console.log(sum);

}

part2Main(lines);