import { inputToLines } from "./util.js";
const DAYNUMBER = 3;
const SLIDINGWINDOW = 3;
const lines = await inputToLines(DAYNUMBER);
function part1Main() {
    const inputWidth = lines[0].length;
    const inputRows = lines.length;
    let resultSum = 0;
    for (let i = 0; i < inputRows; i++) {
        //console.log(findNumberIndexes(lines[i]));
        const indexes = findNumberIndexes(lines[i]);
        const windowLines = [];
        const topLimit = Math.max(i - Math.floor(SLIDINGWINDOW / 2), 0);
        const bottomLimit = Math.min(i + Math.floor(SLIDINGWINDOW / 2), inputRows - 1);
        for (let j = topLimit; j <= bottomLimit; j++) {
            windowLines.push(lines[j]);
        }
        for (const substringIndex of indexes) {
            const symbolTest = testForSymbols(windowLines, substringIndex);
            //console.log("Line Index: %d, Substring: %d,%d, symbolTest: ", i, substringIndex[0], substringIndex[1], symbolTest);
            if (symbolTest)
                resultSum += Number.parseInt(lines[i].slice(substringIndex[0], substringIndex[1]));
        }
    }
    console.log(resultSum);
}
function part2Main() {
    const inputWidth = lines[0].length;
    const inputRows = lines.length;
    let resultSum = 0;
    for (let i = 0; i < inputRows; i++) {
        const windowLines = [];
        for (let j = i - 1; j <= i + 1; j++) {
            if (j === -1)
                windowLines.push("");
            else if (j === inputRows)
                windowLines.push("");
            else
                windowLines.push(lines[j]);
        }
        resultSum += getGearRatiosForLine(windowLines);
    }
    console.log(resultSum);
}
function testForSymbols(inputLines, indices) {
    const trimmedLines = inputLines.map((line) => {
        const fixedIndices = [Math.max(indices[0] - 1, 0), Math.min(indices[1] + 1, line.length)];
        return line.slice(fixedIndices[0], fixedIndices[1]);
    });
    //console.log(trimmedLines);
    //Match anything that's not whitespace, a digit, or aperiod
    const symbolRegexp = /[^\d^\s^\.]/;
    for (const line of trimmedLines) {
        if (symbolRegexp.test(line))
            return true;
    }
    return false;
}
function getGearRatiosForLine(inputLines) {
    //console.log("gear function called");
    let ratioSum = 0;
    const matches = inputLines[1].matchAll(/\*/g);
    for (const match of matches) {
        //console.log(match);
        if (match.index == undefined)
            continue;
        const adjacentNumbers = getAdjacentNumbers(inputLines, match.index);
        if (adjacentNumbers.length === 2)
            ratioSum += adjacentNumbers[0] * adjacentNumbers[1];
    }
    return ratioSum;
}
function getAdjacentNumbers(inputLines, indexOfCenter) {
    //console.log("function called");
    const adjacentNumbers = [];
    const min = Math.max(indexOfCenter - 1, 0);
    const max = Math.min(indexOfCenter + 1, inputLines[1].length);
    const indexRange = convertToRange(min, max);
    const lineMatchIterators = inputLines
        .map((line) => line.matchAll(/\d+/g))
        .filter((element) => element !== null);
    const matches = getMatchesFromIterators(lineMatchIterators);
    for (const match of matches) {
        if (match === null)
            continue;
        const matchBeginningIndex = match.index;
        if (matchBeginningIndex === undefined)
            process.exit(2);
        const matchEndIndex = matchBeginningIndex + match[0].length - 1;
        const matchRange = convertToRange(matchBeginningIndex, matchEndIndex);
        if (matchRange.some((index) => indexRange.includes(index))) {
            adjacentNumbers.push(match[0]);
        }
    }
    const parsedNumbers = adjacentNumbers.map((numberString) => Number.parseInt(numberString));
    //console.log(parsedNumbers);
    return parsedNumbers;
}
function getMatchesFromIterators(iterators) {
    const matches = [];
    for (const iterator of iterators) {
        let curr = iterator.next();
        while (!curr.done) {
            matches.push(curr.value);
            curr = iterator.next();
        }
    }
    return matches;
}
function convertToRange(rangeMin, rangeMax) {
    const range = [];
    for (let i = rangeMin; i <= rangeMax; i++)
        range.push(i);
    return range;
}
function findNumberIndexes(inputLine) {
    const digitMatch = /\d+/gd;
    const matches = inputLine.matchAll(digitMatch);
    const indices = [];
    let match = matches.next();
    while (!match.done) {
        if (match.value.indices !== undefined) {
            indices.push(match.value.indices);
        }
        match = matches.next();
    }
    const indiceSubstrings = indices.map((array) => {
        return array[0]; //strips the 'groups' property
    });
    return indiceSubstrings;
}
//part1Main();
part2Main();
process.exit();
