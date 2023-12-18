import { inputToLines } from "../util.js";
import { binaryInsertionSearch } from "../util.js";

const DAYNUMBER = 7;
const lines = await inputToLines(DAYNUMBER);

interface HandInfo {
    hand : number[],
    bet : number
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

function parseInput(inputLines : string[]) : HandInfo[] {

    const HANDEXP = /(\S{5}) (\d+)/;

    const hands : HandInfo[] = [];
    for (const line of inputLines) {
        const handMatch = line.match(HANDEXP);
        if (handMatch === null || handMatch.length < 3) process.exit(1);
        const cardsRaw = handMatch[1].split('');
        const cards  = cardsRaw.map( convertCharToRank );
        const bet : number = Number.parseInt(handMatch[2]);
        hands.push({ hand: cards, bet : bet });
    }

    return hands;

}

function convertCharToRank(character : string) : number {

    enum FaceCards {
        T = 10,
        J = 11,
        Q = 12,
        K = 13,
        A = 14
    }

    if (character.length > 1) process.exit(1);

    switch (character) {
        case 'T':   return FaceCards.T;
        case 'J':   return FaceCards.J;
        case 'Q':   return FaceCards.Q;
        case 'K':   return FaceCards.K;
        case 'A':   return FaceCards.A;
        default:    return Number.parseInt(character);
    }

}

function sortHands(handA : HandInfo, handB : HandInfo) : number {

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

function calculateHandRank(hand : HandInfo) : HandRank {
    
    const cards = hand.hand;
    
    const cardMatches = [];
    for (const card of cards) {
        cardMatches.push(cards.filter( (filterCard) => card === filterCard).length);
    }
    
    //FiveOfAKind
    if (cardMatches.includes(5)) return HandRank.fiveOfAKind;

    //FourOfAKind
    if (cardMatches.includes(4)) return HandRank.fourOfAKind;

    //FullHouse
    if (cardMatches.includes(3) && cardMatches.includes(2)) return HandRank.fullHouse;

    //ThreeOfAKind
    if (cardMatches.includes(3)) return HandRank.threeOfAKind;

    //TwoPair
    if (cardMatches.filter( (match) => {return match === 2}).length === 4) return HandRank.twoPair;

    //OnePair
    if (cardMatches.includes(2)) return HandRank.onePair;

    //HighCard
    return HandRank.highCard;

}

function part1Main(inputLines : string[]) {

    const hands : HandInfo[] = parseInput(inputLines);
    //const sortedHands : HandInfo[] = [];
    const sortedHands : HandInfo[] = hands.sort(sortHands);

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
        sum += sortedHands[i].bet * (i+1);
    }
    console.log(sortedHands);
    console.log(sum);

}

part1Main(lines);