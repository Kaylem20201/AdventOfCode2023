import { inputToLines } from '../util.js';
const DAYNUMBER = 13;
const lines = await inputToLines(DAYNUMBER);
function parseInput(inputLines) {
    const splitStrings = [];
    let accLines = [];
    for (let i = 0; i < inputLines.length; i++) {
        const currLine = inputLines[i];
        if (currLine.length === 0) {
            splitStrings.push(accLines);
            accLines = [];
            continue;
        }
        accLines.push(currLine);
    }
    if (accLines.length > 0)
        splitStrings.push(accLines);
    return { grids: splitStrings };
}
function findVerticalMirror(grid) {
    //Returns the index of the line right of the mirror 
    //i.e. if it returns 5, the mirror is between columns 4 and 5
    const gridWidth = grid[0].length;
    for (let i = 0; i < gridWidth - 1; i++) {
        if (checkSymmetryFromX(i))
            return i + 1;
    }
    return -1;
    function checkSymmetryFromX(centerX) {
        let i = centerX;
        let j = centerX + 1;
        while ((i >= 0) && (j < grid[0].length)) {
            let leftColumn = grid.map(row => (row[i]));
            let rightColumn = grid.map(row => (row[j]));
            if (leftColumn.toString() !== rightColumn.toString())
                return false;
            i -= 1;
            j += 1;
        }
        return true;
    }
}
function findHorizontalMirror(grid) {
    //Returns the index of the line below the mirror
    const gridHeight = grid.length;
    for (let i = 0; i < gridHeight - 1; i++) {
        if (checkSymmetryFromY(i))
            return i + 1;
    }
    return -1;
    function checkSymmetryFromY(centerY) {
        let i = centerY;
        let j = centerY + 1;
        while ((i >= 0) && (j < grid.length)) {
            let topRow = grid[i];
            let bottomRow = grid[j];
            if (topRow.toString() !== bottomRow.toString())
                return false;
            i -= 1;
            j += 1;
        }
        return true;
    }
}
function part1Main(inputLines) {
    const input = parseInput(inputLines);
    const grids = input.grids;
    let sum = 0;
    let gridIndex = -1;
    for (const grid of grids) {
        // console.log(findVerticalMirror(grid));
        gridIndex += 1;
        const vertResult = findVerticalMirror(grid);
        if (vertResult != -1) {
            sum += vertResult;
            continue;
        }
        const horizResult = findHorizontalMirror(grid);
        if (horizResult === -1) {
            console.log("Error on grid " + gridIndex + ":");
            console.log(grid);
            return -1;
        }
        sum += horizResult * 100;
    }
    return sum;
}
function part2Main(inputLines) {
    const input = parseInput(inputLines);
}
console.log('Part 1 Result:' + part1Main(lines));
console.log('Part 2 Result:' + part2Main(lines));
