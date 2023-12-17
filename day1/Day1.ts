import { inputToLines } from '../util.js'

const DigitMatch : RegExp = new RegExp("(one)|(two)|(three)|(four)|(five)|(six)|(seven)|(eight)|(nine)");

function convertDigitStringToNumber(input : string) {
    switch (input) {
        case "one":
            return 1;
            break;
        case "two":
            return 2;
            break;
        case "three":
            return 3;
            break;
        case "four":
            return 4;
            break;
        case "five":
            return 5;
            break;
        case "six":
            return 6;
            break;
        case "seven":
            return 7;
            break;
        case "eight":
            return 8;
            break;
        case "nine":
            return 9;
            break;
        default:
            return NaN;
    }
}

function findFirstDigit(line : string) {
    for(let i = 0; i <= line.length; i++) {
        const substring = line.substring(0,i);
        const digitResult = substring.match(/\d/);
        if (digitResult !== null)
            return Number.parseInt(digitResult[0]);
        const stringResult = substring.match(DigitMatch);
        if (stringResult !== null)
            return convertDigitStringToNumber(stringResult[0]);
    }
    return 0;
}

function findLastDigit(line : string) {
    for(let i = line.length-1; i >=0; i--) {
        const substring = line.substring(i,line.length);
        const digitResult = substring.match(/\d/);
        if (digitResult !== null)
            return Number.parseInt(digitResult[0]);
        const stringResult = substring.match(DigitMatch);
        if (stringResult !== null)
            return convertDigitStringToNumber(stringResult[0]);
    }
    return 0;
}

let sum = 0;
const lines = await inputToLines(1);

for (const line of lines) {
    const firstDigit = findFirstDigit(line);
    const lastDigit = findLastDigit(line);
    //console.log(firstDigit*10 + lastDigit);
    sum += (firstDigit*10) + lastDigit;
}

console.log(sum);
process.exit(0);