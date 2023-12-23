import { inputToLines } from '../util.js'

const DAYNUMBER = 9;
const lines = await inputToLines(DAYNUMBER);

interface ParsedInput {
    histories : number[][]
}

function parseInput(inputLines : string[]) : ParsedInput {
    const histories : number[][] = [];

    for (const line of inputLines) {
        histories.push(line.split(' ').map( (value) => parseInt(value)));
    }

    return { histories };
}

function extrapolateNextValue(history : number[])  : number{

    let differences = getDifferences(history);
    if (differences === undefined) throw new Error();

    //base case
    if (differences?.every( (value) => value===0)) { return history[history.length-1] }

    //recursive case
    return (history[history.length-1] + extrapolateNextValue(differences));

}

function getDifferences(values : number[]) : number[] | undefined {

    if (values.length < 2) return undefined;

    const differences = [];

    for (let i = 0; i < values.length-1; i++) {
        differences.push(values[i+1] - values[i]);
    }

    return differences;

}

function part1Main(inputLines : string[]) {

    const input : ParsedInput = parseInput(inputLines);
    
    const extrapolatedValues = [];
    for (const history of input.histories) {
        extrapolatedValues.push(extrapolateNextValue(history));
    }

    const result = extrapolatedValues.reduce( (acc, curr) => acc + curr);

    console.log(result);

}

part1Main(lines);