import { inputToLines } from '../util.js';
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
function numPossibilitiesForPuzzle(puzzle) {
    //Shallow copies
    const tiles = [...puzzle.tiles];
    const hints = [...puzzle.hints];
    const wipPossibilites = [{ tiles, hints }];
    const confirmedPossibilites = [];
    while (wipPossibilites.length > 0) {
        const curr = wipPossibilites.shift();
        if (curr === undefined)
            throw new Error();
        const firstHintUsed = consumeFirstHint(curr);
        if (firstHintUsed === undefined)
            continue;
        const newWips = firstHintUsed.filter((puzzle) => {
            return puzzle.hints.length > 0;
        });
        const newCompletes = firstHintUsed.filter((puzzle) => {
            if (puzzle.tiles.includes(TileTypes.bad))
                return false;
            return puzzle.hints.length === 0;
        });
        wipPossibilites.push(...newWips);
        confirmedPossibilites.push(...newCompletes);
    }
    return confirmedPossibilites.length;
}
function consumeFirstHint(puzzle) {
    const tiles = [...puzzle.tiles];
    const hints = [...puzzle.hints];
    const hint = hints[0];
    if (hint === undefined)
        return undefined;
    let possibilitiesFromFirstHint = [];
    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        if (tile === TileTypes.good)
            continue;
        if (tile === TileTypes.bad) {
            //Check if hint works starting from this tile 
            const res = hintCheck(tiles.slice(i), hint);
            if (res)
                possibilitiesFromFirstHint.push({
                    tiles: tiles.slice(i + hint + 1),
                    hints: hints.slice(1)
                });
            return possibilitiesFromFirstHint;
        }
        if (tile === TileTypes.unknown) {
            //Check if hint works starting from this tile 
            const res = hintCheck(tiles.slice(i), hint);
            if (res)
                possibilitiesFromFirstHint.push({
                    tiles: tiles.slice(i + hint + 1),
                    hints: hints.slice(1)
                });
            continue;
        }
        //Tile type unrecognized
        console.log(tile);
        throw new Error();
    }
    return possibilitiesFromFirstHint;
    function hintCheck(subTiles, hint) {
        for (let i = 0; i < hint; i++) {
            const tile = subTiles[i];
            if (tile === undefined)
                return false;
            if (tile === TileTypes.good)
                return false;
        }
        if (subTiles[hint] === TileTypes.bad)
            return false;
        return true;
    }
}
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
    const input = parseInput(inputLines);
}
console.log('Part 1 Result:' + part1Main(lines));
console.log('Part 2 Result:' + part2Main(lines));
