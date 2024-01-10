import { inputToLines } from '../util.js'
import { Debug } from '../util.js';
import { Coordinates } from '../types/Coordinates.js';

const DAYNUMBER = 11;
const lines = await inputToLines(DAYNUMBER);
const debug = new Debug();

interface ParsedInput {
    columns: number,
    rows: number,
    galaxyCoordinates: Coordinates[]
}

function parseInput(inputLines : string[]) : ParsedInput {
    const columns = inputLines[0].length;
    const rows = inputLines.length;
    const galaxyCoordinates : Coordinates[] = [];
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            if (inputLines[y].charAt(x) === '#') galaxyCoordinates.push({x : x, y : y});
        }
    }
    return  { columns, rows, galaxyCoordinates };
}


/**
 * Counts the number of rows that have no galaxies in a given range
 * @remarks startRow exclusive, endRow exclusive. Order doesnt matter.
 *
 **/
function numEmptyRowsInRange(startRow : number, endRow : number, galaxyCoordinates : Coordinates[]) : number {

    const low = Math.min(startRow, endRow);
    const high = Math.max(startRow, endRow);

    let sum = 0
    for (let i = low; i < high; i++) {
        if (!isGalaxyInRow(i, galaxyCoordinates)) sum += 1;
    }
    return sum;

}

/**
 * Counts the number of columns that have no galaxies in a given range
 * @remarks startColumn exclusive, endColumn exclusive. Order doesnt matter.
 * 
 *
 **/
function numEmptyColumnsInRange(startColumn : number, endColumn : number, galaxyCoordinates : Coordinates[]) : number {

    const low = Math.min(startColumn, endColumn);
    const high = Math.max(startColumn, endColumn);

    let sum = 0
    for (let i = low+1; i < high; i++) {
        if (!isGalaxyInColumn(i, galaxyCoordinates)) sum += 1;
    }
    return sum;

}

function isGalaxyInColumn(column : number, galaxyCoordinates : Coordinates[]) : boolean {

    return galaxyCoordinates.some( (coordinates) => {
        return coordinates.x === column;
    });

}

function isGalaxyInRow(row : number, galaxyCoordinates : Coordinates[]) : boolean {

    return galaxyCoordinates.some( (coordinates) => {
        return coordinates.y === row;
    });

}

function getRealDistance(pointA : Coordinates, pointB : Coordinates, galaxyCoordinates : Coordinates[], challengePart = 1) : number {

    const distanceToAdd = ((challengePart === 2) ? 999999 : 1 );

    const unadjustedXDiff = Math.abs(pointB.x - pointA.x);
    debug.print(unadjustedXDiff);
    const unadjustedYDiff = Math.abs(pointB.y - pointA.y);
    debug.print(unadjustedYDiff);
    const adjustedXDiff = unadjustedXDiff + (distanceToAdd * numEmptyColumnsInRange(pointA.x, pointB.x, galaxyCoordinates));
    const adjustedYDiff = unadjustedYDiff + (distanceToAdd * numEmptyRowsInRange(pointA.y, pointB.y, galaxyCoordinates));
    const distance = adjustedXDiff + adjustedYDiff;
    return distance;

}


function part1Main(inputLines : string[]) : number {

    const input = parseInput(inputLines);
    const galaxyCoordinates = input.galaxyCoordinates;
    let sum = 0;
    for (let indexA = 0; indexA < galaxyCoordinates.length - 1; indexA++) {
        for (let indexB = indexA+1; indexB < galaxyCoordinates.length; indexB++) {
            const distance = getRealDistance(galaxyCoordinates[indexA], galaxyCoordinates[indexB], galaxyCoordinates);
            debug.print("Distance between :",
                galaxyCoordinates[indexA],
                galaxyCoordinates[indexB],
                distance);
            sum += distance;
        }
    }
    return sum;

}


function part2Main(inputLines : string[]) {

    const input = parseInput(inputLines);
    const galaxyCoordinates = input.galaxyCoordinates;
    let sum = 0;
    for (let indexA = 0; indexA < galaxyCoordinates.length - 1; indexA++) {
        for (let indexB = indexA+1; indexB < galaxyCoordinates.length; indexB++) {
            const distance = getRealDistance(galaxyCoordinates[indexA], galaxyCoordinates[indexB], galaxyCoordinates, 2);
            debug.print("Distance between :",
                galaxyCoordinates[indexA],
                galaxyCoordinates[indexB],
                distance);
            sum += distance;
        }
    }
    return sum;

}

// debug.activate();
console.log('Part 1 Result:' + part1Main(lines));
console.log('Part 2 Result:' + part2Main(lines));
