import { inputToLines } from "../util.js";
import { binaryInsertionSearch } from "../util.js";

const DAYNUMBER = 8;
const lines = await inputToLines(DAYNUMBER);

interface ParsedInput {
    directions: string[],
    nodes: Map<string, NodeInfo>
}

interface NodeInfo {
    index: string,
    nextLeft: string,
    nextRight: string
}

class Directions {
    private readonly directions : string[];
    private index : number;

    constructor(characters : string[]) {
        this.directions = characters;
        this.index = -1;
    }

    next() : string {
        this.index++;
        if (this.index === this.directions.length) this.index = 0;
        return(this.directions[this.index]);
    }
}

function parseInput(inputLines: string[]): ParsedInput {

    const directions = inputLines[0].split('');
    const nodes = new Map<string, NodeInfo>;

    for (let i = 2; i < inputLines.length; i++) {
        const line = inputLines[i];
        const newNode: NodeInfo = {
            index: line.substring(0, 3),
            nextLeft: line.substring(7, 10),
            nextRight: line.substring(12, 15)
        }
        nodes.set(newNode.index, newNode);
    }

    return { directions, nodes };

}

function part1Main(inputLines: string[]) {
    
    const input : ParsedInput = parseInput(inputLines);
    const directions = new Directions(input.directions);
    const nodes = input.nodes;
    let steps = 0;

    let currentNode = nodes.get('AAA');
    if (currentNode === undefined) throw new Error("Node not found");
    while(currentNode.index !== 'ZZZ') {
        console.log(currentNode);
        const direction = directions.next();
        let nextIndex;
        if (direction === 'L') nextIndex = currentNode.nextLeft;
        else if (direction === 'R') nextIndex = currentNode.nextRight;
        else throw new Error("Incorrect Direction");
        currentNode = nodes.get(nextIndex);
        if (currentNode === undefined) throw new Error("Node not found");
        steps++;
    }

    console.log(steps);

}

part1Main(lines);