import { inputToLines } from "../util.js";
import { lcm } from "../util.js";
const DAYNUMBER = 8;
const lines = await inputToLines(DAYNUMBER);
class Directions {
    directions;
    index;
    constructor(characters) {
        this.directions = characters;
        this.index = -1;
    }
    curr() {
        return (this.directions[this.index]);
    }
    next() {
        this.index++;
        if (this.index === this.directions.length)
            this.index = 0;
        return (this.directions[this.index]);
    }
}
function parseInput(inputLines) {
    const directions = inputLines[0].split('');
    const nodes = new Map;
    const startingNodeIndices = [];
    const endingNodeIndices = [];
    for (let i = 2; i < inputLines.length; i++) {
        const line = inputLines[i];
        const newNode = {
            index: line.substring(0, 3),
            nextLeft: line.substring(7, 10),
            nextRight: line.substring(12, 15)
        };
        nodes.set(newNode.index, newNode);
        if (newNode.index.match(/..A/))
            startingNodeIndices.push(newNode.index);
        else if (newNode.index.match(/..Z/))
            endingNodeIndices.push(newNode.index);
    }
    return { directions, nodes, startingNodeIndices, endingNodeIndices };
}
function findNextIndex(currentNode, direction) {
    if (direction === 'L')
        return currentNode.nextLeft;
    if (direction === 'R')
        return currentNode.nextRight;
    throw new Error('Invalid Direction');
}
function findPeriodOfGhost(startingNodeIndex, directions, nodes) {
    let period = 0;
    let currNode = nodes.get(startingNodeIndex);
    if (currNode === undefined)
        throw new Error('Node not found');
    while (!currNode.index.match(/..Z/)) {
        const nextIndex = findNextIndex(currNode, directions.next());
        currNode = nodes.get(nextIndex);
        if (currNode === undefined)
            throw new Error('Node not found');
        period++;
    }
    return period;
}
function part1Main(inputLines) {
    const input = parseInput(inputLines);
    const directions = new Directions(input.directions);
    const nodes = input.nodes;
    let steps = 0;
    let currentNode = nodes.get('AAA');
    if (currentNode === undefined)
        throw new Error("Node not found");
    while (currentNode.index !== 'ZZZ') {
        console.log(currentNode);
        const direction = directions.next();
        let nextIndex;
        if (direction === 'L')
            nextIndex = currentNode.nextLeft;
        else if (direction === 'R')
            nextIndex = currentNode.nextRight;
        else
            throw new Error("Incorrect Direction");
        currentNode = nodes.get(nextIndex);
        if (currentNode === undefined)
            throw new Error("Node not found");
        steps++;
    }
    console.log(steps);
}
function part2Main(inputLines) {
    const input = parseInput(inputLines);
    const nodes = input.nodes;
    const startingNodeIndices = input.startingNodeIndices;
    if (startingNodeIndices === undefined)
        throw new Error("No Starting Index");
    const periods = [];
    for (const index of startingNodeIndices) {
        const directions = new Directions(input.directions);
        periods.push(findPeriodOfGhost(index, directions, nodes));
    }
    const shortest = periods.reduce((min, curr) => lcm(min, curr));
    console.log(shortest);
}
//part1Main(lines);
part2Main(lines);
