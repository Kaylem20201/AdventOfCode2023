import { start } from 'repl';
import { inputToLines } from '../util.js'

const DAYNUMBER = 10;
const lines = await inputToLines(DAYNUMBER);

interface ParsedInput {
    tileArray: Array<Array<Tile>>,
    startingTile: Tile
}

type Tile = {
    type: string,
    coordinates: Coordinates,
    connectedCoordinates?: Coordinates[]
}

type Coordinates = {
    x: number,
    y: number
}

function parseInput(inputLines: string[]): ParsedInput {
    const inputWidth = inputLines[0].length;
    let tileArray: Array<Array<Tile>> = new Array(inputWidth);
    for (let i = 0; i < inputWidth; i++) {
        tileArray[i] = new Array<Tile>(10);
    }
    let startingX = 0;
    let startingY = 0;
    for (let x = 0; x < inputWidth; x++) {
        for (let y = 0; y < inputLines.length; y++) {
            const tile = createTile(inputLines[y].charAt(x), {x:x,y:y});
            if (tile === undefined) throw new Error();
            tileArray[x][y] = tile;
            if (tile.type === 'start') { startingX = x; startingY = y; }
        }
    }
    const startingTile = getTile({x:startingX,y:startingY}, tileArray);
    if (startingTile === undefined) throw new Error('Starting Tile not found');
    return {
        tileArray: tileArray,
        startingTile: startingTile
    }
}

function createTile(character: string, coordinates: Coordinates): Tile | undefined {
    if (character.length !== 1) return undefined;

    let tileType: string;
    let connections: Coordinates[] | undefined
    switch (character) {
        case '.': tileType = 'ground'; break;
        case 'S': tileType = 'start'; break;
        case '|': 
        case '-': 
        case 'L': 
        case 'J': 
        case '7': 
        case 'F': tileType = 'pipe'; break;
        default: return undefined;
    }
    connections = findConnections(character, coordinates);


    const resultTile: Tile = {
        type: tileType,
        coordinates: coordinates,
        connectedCoordinates: connections
    };

    return resultTile;
}

function findOppositePipeSteps(
    startingTile: Tile,
    tileArray: Array<Array<Tile>>)
    : number{

    const loopTiles = mapPipeLoop(startingTile, tileArray);
    const loopSize = loopTiles.length;
    return loopSize/2;

}

function mapPipeLoop(
    startingTile : Tile,
    tileArray: Array<Array<Tile>>)
    : Array<Tile> 
{

    const rightTileCoordinates = {x:startingTile.coordinates.x+1,y:startingTile.coordinates.y};
    const downTileCoordinates = {x:startingTile.coordinates.x,y:startingTile.coordinates.y+1};
    const leftTileCoordinates = {x:startingTile.coordinates.x-1,y:startingTile.coordinates.y};
    const upTileCoordinates = {x:startingTile.coordinates.x,y:startingTile.coordinates.y-1};
    const rightTile = getTile(rightTileCoordinates, tileArray);
    const downTile = getTile(downTileCoordinates, tileArray);
    const leftTile = getTile(leftTileCoordinates, tileArray);
    const upTile = getTile(upTileCoordinates, tileArray);
    const tilesToCheck = [rightTile,downTile,leftTile,upTile];

    for (const tile of tilesToCheck) {
        if (tile === undefined) continue;
        if (!(tile.connectedCoordinates?.some((coordinates) => {
            return (coordinates.x === startingTile.coordinates.x &&
                coordinates.y === startingTile.coordinates.y);
        }))) continue;
        let currentTile : Tile | undefined = tile;
        let prevTile : Tile | undefined = startingTile;
        let path : Array<Tile> | undefined = [prevTile, currentTile];
        do {
            currentTile = path.at(-1);
            prevTile = path.at(-2);
            if (prevTile === undefined || currentTile === undefined) throw new Error();
            path = traverseLoop(prevTile,currentTile, tileArray, path);
        //@ts-expect-error : path.at is never undefined
        } while (path !== undefined && (path.at(-1).type !== 'start'))
        if (path === undefined) continue;
        path.pop();
        return path;        
    }
    throw new Error("Couldn't map path");

}

function getTile(coordinates: Coordinates, tileArray: Array<Array<Tile>>)
    : Tile | undefined {
    const tilesWidth = tileArray.length;
    const tilesLength = tileArray[0].length;

    if (coordinates.x >= tilesWidth ||
        coordinates.x < 0 ||
        coordinates.y >= tilesLength ||
        coordinates.y < 0) {
        return undefined;
    }

    return tileArray[coordinates.x][coordinates.y];
}

function traverseLoop(previousTile: Tile,
    currentTile: Tile,
    tileArray: Array<Array<Tile>>,
    traversedTiles: Array<Tile>)
    : Array<Tile> | undefined {

    const previousCoordinates = previousTile.coordinates;
    const currentCoordinates = currentTile.coordinates;
    if (currentTile.connectedCoordinates === undefined) throw new Error();
    const nextCoordinates = currentTile.connectedCoordinates.filter( (connectionCoordinates) => {
        if (connectionCoordinates.x !== previousCoordinates.x) return true;
        if (connectionCoordinates.y !== previousCoordinates.y) return true;
        return false;
    })[0];
    const nextTile = getTile(nextCoordinates, tileArray);
    if (nextTile === undefined) return undefined;
    if (nextTile.type === 'start') return traversedTiles.concat(nextTile);
    if (!checkTileConnections(nextTile, currentTile)) return undefined
    const newTraversedTiles = traversedTiles.concat(nextTile);
    return newTraversedTiles;

}

function findConnections(tileCharacter: string, coordinates: Coordinates): Coordinates[] | undefined {
    if (tileCharacter.length !== 1) return undefined;

    let connections: Coordinates[] | undefined
    switch (tileCharacter) {
        case '|':
            connections = [{ x: coordinates.x, y: coordinates.y - 1 }, { x: coordinates.x, y: coordinates.y + 1 }];
            break;
        case '-':
            connections = [{ x: coordinates.x - 1, y: coordinates.y }, { x: coordinates.x + 1, y: coordinates.y }];
            break;
        case 'L':
            connections = [{ x: coordinates.x, y: coordinates.y - 1 }, { x: coordinates.x + 1, y: coordinates.y }];
            break;
        case 'J':
            connections = [{ x: coordinates.x, y: coordinates.y - 1 }, { x: coordinates.x - 1, y: coordinates.y }];
            break;
        case '7':
            connections = [{ x: coordinates.x, y: coordinates.y + 1 }, { x: coordinates.x - 1, y: coordinates.y }];
            break;
        case 'F':
            connections = [{ x: coordinates.x, y: coordinates.y + 1 }, { x: coordinates.x + 1, y: coordinates.y }];
            break;
        default: return undefined;
    }

    return connections;
}

function checkTileConnections(tileA: Tile, tileB: Tile) : boolean {
    const tileACoordinates = tileA.coordinates;
    const tileBCoordinates = tileB.coordinates;
    const tileAConnections = tileA.connectedCoordinates;
    const tileBConnections = tileB.connectedCoordinates;

    const tileAValidatedConnections = tileAConnections?.filter( (connectionCoordinate) => {
        if (connectionCoordinate.x !== tileB.coordinates.x) return false;
        if (connectionCoordinate.y !== tileB.coordinates.y) return false;
        return true;
    });
    const tileBValidatedConnections = tileBConnections?.filter( (connectionCoordinate) => {
        if (connectionCoordinate.x !== tileA.coordinates.x) return false;
        if (connectionCoordinate.y !== tileA.coordinates.y) return false;
        return true;
    });
    if (tileAValidatedConnections === undefined || tileAValidatedConnections.length !== 1) return false;
    if (tileBValidatedConnections === undefined || tileBValidatedConnections.length !== 1) return false;
    return true;
}

function part1Main(inputLines: string[]) {

    const input: ParsedInput = parseInput(inputLines);
    const startingTile = input.startingTile;
    const tileArray = input.tileArray;
    console.log(findOppositePipeSteps(startingTile, tileArray));

}

part1Main(lines);