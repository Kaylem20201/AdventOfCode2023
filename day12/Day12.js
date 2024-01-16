import { inputToLines } from '../util.js';
import { Debug } from '../util.js';
const DAYNUMBER = 12;
const lines = await inputToLines(DAYNUMBER);
const debug = new Debug();
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
function isValidArrangement(puzzle) {
    const tiles = [...puzzle.tiles];
    const hints = [...puzzle.hints];
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] === TileTypes.unknown)
            throw new Error();
        if (tiles[i] === TileTypes.good)
            continue;
        if (hints.length === 0)
            return false;
        const hintRange = tiles.slice(i, i + hints[0]);
        if (!hintRange.every((tile) => tile === TileTypes.bad))
            return false;
        const indexAfter = i + hints[0];
        const tileAfter = tiles[indexAfter];
        if (tileAfter === TileTypes.bad)
            return false;
        //Valid hint depleted 
        i = indexAfter - 1;
        hints.shift();
    }
    if (hints.length > 0)
        return false;
    return true;
}
function convertUnknowns(puzzle) {
    const possWithUnknowns = [puzzle];
    const convertedPossibilites = [];
    while (possWithUnknowns.length > 0) {
        const poss = possWithUnknowns.shift();
        if (poss === undefined)
            throw new Error();
        const converted = convertSingleUnknown(poss);
        if (converted === undefined) {
            //No unknown tiles left
            convertedPossibilites.push(poss);
            continue;
        }
        //Some unknowns may be left
        possWithUnknowns.push(...converted);
    }
    return convertedPossibilites;
}
function convertSingleUnknown(puzzle) {
    const tiles = puzzle.tiles;
    const hints = puzzle.hints;
    if (!tiles.includes(TileTypes.unknown))
        return undefined;
    const firstUnknownIndex = tiles.indexOf(TileTypes.unknown);
    const goodTiles = tiles.slice(0, firstUnknownIndex).concat(TileTypes.good, tiles.slice(firstUnknownIndex + 1));
    const goodPoss = { tiles: goodTiles, hints: hints };
    const badTiles = tiles.slice(0, firstUnknownIndex).concat(TileTypes.bad, tiles.slice(firstUnknownIndex + 1));
    const badPoss = { tiles: badTiles, hints: hints };
    const result = [goodPoss, badPoss];
    return result;
}
function part1Main(inputLines) {
    const input = parseInput(inputLines);
    const puzzles = input.puzzles;
    debug.print(puzzles);
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
