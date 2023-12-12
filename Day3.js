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
part1Main();
process.exit();
