import { inputToLines } from '../util.js';
import { memoize } from '../util.js';
const DAYNUMBER = 12;
const lines = await inputToLines(DAYNUMBER);
var TileTypes;
(function (TileTypes) {
    TileTypes["good"] = ".";
    TileTypes["bad"] = "#";
    TileTypes["unknown"] = "?";
})(TileTypes || (TileTypes = {}));
function parseInput(inputLines) {
    const puzzles = [];
    for (const line of inputLines) {
        const stringParts = line.split(' ');
        const puzzle = {
            tiles: stringParts[0].split('').map((tile) => parseTile(tile)),
            hints: stringParts[1].split(',').map((char) => parseInt(char))
        };
        puzzles.push(puzzle);
    }
    return { puzzles };
}
function unfoldLine(inputLine) {
    const stringParts = inputLine.split(' ');
    const originalTileString = stringParts[0];
    const originalHintString = stringParts[1];
    const newTileString = originalTileString.concat(("?" + originalTileString).repeat(4));
    const newHintString = originalHintString.concat(("," + originalHintString).repeat(4));
    return newTileString + " " + newHintString;
}
function parseTile(character) {
    switch (character) {
        case '.': return TileTypes.good;
        case '#': return TileTypes.bad;
        case '?': return TileTypes.unknown;
        default: throw new Error();
    }
}
const numPossibilitiesForPuzzle = memoize((puzzle) => {
    //Shallow copies
    const tiles = [...puzzle.tiles];
    const hints = [...puzzle.hints];
    //Base case
    if (tiles.length === 0) {
        if (hints.length > 0)
            return 0;
        return 1;
    }
    if (hints.length === 0) {
        if (tiles.includes(TileTypes.bad))
            return 0;
        return 1;
    }
    //Recursive cases
    const nextTile = tiles[0];
    if (nextTile === TileTypes.bad) {
        const tilesToCheck = tiles.slice(0, hints[0]);
        const isInvalidRun = (tilesToCheck.includes(TileTypes.good) ||
            tiles.length < hints[0] ||
            tiles[hints[0]] === TileTypes.bad);
        if (!isInvalidRun) {
            const newPuzzle = {
                tiles: tiles.slice(hints[0] + 1),
                hints: hints.slice(1)
            };
            return numPossibilitiesForPuzzle(newPuzzle);
        }
        return 0;
    }
    if (nextTile === TileTypes.good) {
        const newPuzzle = {
            tiles: tiles.slice(1),
            hints: hints
        };
        return numPossibilitiesForPuzzle(newPuzzle);
    }
    if (nextTile === TileTypes.unknown) {
        const newGoodTiles = [parseTile('.'), ...(tiles.slice(1).map(parseTile))];
        const newBadTiles = [parseTile('#'), ...tiles.slice(1).map(parseTile)];
        const newGoodPuzzle = {
            tiles: newGoodTiles,
            hints: hints
        };
        const newBadPuzzle = {
            tiles: newBadTiles,
            hints: hints
        };
        return (numPossibilitiesForPuzzle(newGoodPuzzle) +
            numPossibilitiesForPuzzle(newBadPuzzle));
    }
    throw new Error();
});
function part1Main(inputLines) {
    const input = parseInput(inputLines);
    const puzzles = input.puzzles;
    let sum = 0;
    let lineNo = 1;
    for (const puzzle of puzzles) {
        const newPoss = numPossibilitiesForPuzzle(puzzle);
        console.log('Line ' + lineNo++ + ': ' + newPoss);
        sum += newPoss;
    }
    return sum;
}
function part2Main(inputLines) {
    const unfoldedLines = inputLines.map(unfoldLine);
    const input = parseInput(unfoldedLines);
    const puzzles = input.puzzles;
    let sum = 0;
    let lineNo = 1;
    for (const puzzle of puzzles) {
        const newPoss = numPossibilitiesForPuzzle(puzzle);
        console.log('Line ' + lineNo++ + ': ' + newPoss);
        sum += newPoss;
    }
    return sum;
}
console.log('Part 1 Result:' + part1Main(lines));
console.log('Part 2 Result:' + part2Main(lines));
