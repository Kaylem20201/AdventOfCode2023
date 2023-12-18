import { inputToLines } from "../util.js";
const DAYNUMBER = 7;
const lines = await inputToLines(DAYNUMBER);
var HandRank;
(function (HandRank) {
    HandRank[HandRank["fiveOfAKind"] = 7] = "fiveOfAKind";
    HandRank[HandRank["fourOfAKind"] = 6] = "fourOfAKind";
    HandRank[HandRank["fullHouse"] = 5] = "fullHouse";
    HandRank[HandRank["threeOfAKind"] = 4] = "threeOfAKind";
    HandRank[HandRank["twoPair"] = 3] = "twoPair";
    HandRank[HandRank["onePair"] = 2] = "onePair";
    HandRank[HandRank["highCard"] = 1] = "highCard";
})(HandRank || (HandRank = {}));
function parseInput(inputLines) {
    const HANDEXP = /(\S{5}) (\d+)/;
    const hands = [];
    for (const line of inputLines) {
        const handMatch = line.match(HANDEXP);
        if (handMatch === null || handMatch.length < 3)
            process.exit(1);
        const cardsRaw = handMatch[1].split('');
        const cards = cardsRaw.map(convertCharToRank);
        const bet = Number.parseInt(handMatch[2]);
        hands.push({ hand: cards, bet: bet });
    }
    return hands;
}
function convertCharToRank(character) {
    let FaceCards;
    (function (FaceCards) {
        FaceCards[FaceCards["T"] = 10] = "T";
        FaceCards[FaceCards["J"] = 11] = "J";
        FaceCards[FaceCards["Q"] = 12] = "Q";
        FaceCards[FaceCards["K"] = 13] = "K";
        FaceCards[FaceCards["A"] = 14] = "A";
    })(FaceCards || (FaceCards = {}));
    if (character.length > 1)
        process.exit(1);
    switch (character) {
        case 'T': return FaceCards.T;
        case 'J': return FaceCards.J;
        case 'Q': return FaceCards.Q;
        case 'K': return FaceCards.K;
        case 'A': return FaceCards.A;
        default: return Number.parseInt(character);
    }
}
function sortHands(handA, handB) {
    const handARank = calculateHandRank(handA);
    const handBRank = calculateHandRank(handB);
    if (handARank !== handBRank)
        return handARank - handBRank;
    //Same rank, find first higher card
    for (let i = 0; i < 5; i++) {
        const diff = handA.hand[i] - handB.hand[i];
        if (diff !== 0)
            return diff;
    }
    return 0;
}
function calculateHandRank(hand) {
    const cards = hand.hand;
    const cardMatches = [];
    for (const card of cards) {
        cardMatches.push(cards.filter((filterCard) => card === filterCard).length);
    }
    //FiveOfAKind
    if (cardMatches.includes(5))
        return HandRank.fiveOfAKind;
    //FourOfAKind
    if (cardMatches.includes(4))
        return HandRank.fourOfAKind;
    //FullHouse
    if (cardMatches.includes(3) && cardMatches.includes(2))
        return HandRank.fullHouse;
    //ThreeOfAKind
    if (cardMatches.includes(3))
        return HandRank.threeOfAKind;
    //TwoPair
    if (cardMatches.filter((match) => { return match === 2; }).length === 4)
        return HandRank.twoPair;
    //OnePair
    if (cardMatches.includes(2))
        return HandRank.onePair;
    //HighCard
    return HandRank.highCard;
}
function part1Main(inputLines) {
    const hands = parseInput(inputLines);
    //const sortedHands : HandInfo[] = [];
    const sortedHands = hands.sort(sortHands);
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
part1Main(lines);
