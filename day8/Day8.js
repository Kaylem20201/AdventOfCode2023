import { inputToLines } from "../util.js";
const DAYNUMBER = 8;
const lines = await inputToLines(DAYNUMBER);
class Directions {
    directions;
    index;
    constructor(characters) {
        this.directions = characters;
        this.index = -1;
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
    for (let i = 2; i < inputLines.length; i++) {
        const line = inputLines[i];
        const newNode = {
            index: line.substring(0, 3),
            nextLeft: line.substring(7, 10),
            nextRight: line.substring(12, 15)
        };
        nodes.set(newNode.index, newNode);
    }
    return { directions, nodes };
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
part1Main(lines);
