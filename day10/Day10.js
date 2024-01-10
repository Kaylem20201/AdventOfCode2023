import { inputToLines } from '../util.js';
const DAYNUMBER = 10;
const lines = await inputToLines(DAYNUMBER);
function parseInput(inputLines) {
    const inputWidth = inputLines[0].length;
    let tileArray = new Array(inputWidth);
    for (let i = 0; i < inputWidth; i++) {
        tileArray[i] = new Array(inputLines.length);
    }
    let startingX = 0;
    let startingY = 0;
    for (let x = 0; x < inputWidth; x++) {
        for (let y = 0; y < inputLines.length; y++) {
            const tile = createTile(inputLines[y].charAt(x), { x: x, y: y });
            if (tile === undefined)
                throw new Error();
            tileArray[x][y] = tile;
            if (tile.type === 'start') {
                startingX = x;
                startingY = y;
            }
        }
    }
    const startingTile = getTile({ x: startingX, y: startingY }, tileArray);
    if (startingTile === undefined)
        throw new Error('Starting Tile not found');
    return {
        tileArray: tileArray,
        startingTile: startingTile
    };
}
function createTile(character, coordinates) {
    if (character.length !== 1)
        return undefined;
    let tileType;
    let connections;
    let isCornerPipe = undefined;
    switch (character) {
        case '.':
            tileType = 'ground';
            break;
        case 'S':
            tileType = 'start';
            break;
        case '|':
        case '-':
            tileType = 'pipe';
            break;
        case 'L':
        case 'J':
        case '7':
        case 'F':
            tileType = 'pipe';
            isCornerPipe = true;
            break;
        default: return undefined;
    }
    connections = findConnections(character, coordinates);
    const resultTile = {
        type: tileType,
        coordinates: coordinates,
        connectedCoordinates: connections,
        isCornerPipe: isCornerPipe
    };
    return resultTile;
}
function findOppositePipeSteps(startingTile, tileArray) {
    const loopTiles = mapPipeLoop(startingTile, tileArray);
    const loopSize = loopTiles.length;
    return loopSize / 2;
}
function mapPipeLoop(startingTile, tileArray) {
    const rightTileCoordinates = { x: startingTile.coordinates.x + 1, y: startingTile.coordinates.y };
    const downTileCoordinates = { x: startingTile.coordinates.x, y: startingTile.coordinates.y + 1 };
    const leftTileCoordinates = { x: startingTile.coordinates.x - 1, y: startingTile.coordinates.y };
    const upTileCoordinates = { x: startingTile.coordinates.x, y: startingTile.coordinates.y - 1 };
    const rightTile = getTile(rightTileCoordinates, tileArray);
    const downTile = getTile(downTileCoordinates, tileArray);
    const leftTile = getTile(leftTileCoordinates, tileArray);
    const upTile = getTile(upTileCoordinates, tileArray);
    const tilesToCheck = [rightTile, downTile, leftTile, upTile];
    for (const tile of tilesToCheck) {
        if (tile === undefined)
            continue;
        if (!(tile.connectedCoordinates?.some((coordinates) => {
            return (coordinates.x === startingTile.coordinates.x &&
                coordinates.y === startingTile.coordinates.y);
        })))
            continue;
        let currentTile = tile;
        let prevTile = startingTile;
        let path = [prevTile, currentTile];
        do {
            currentTile = path.at(-1);
            prevTile = path.at(-2);
            if (prevTile === undefined || currentTile === undefined)
                throw new Error();
            path = traverseLoop(prevTile, currentTile, tileArray, path);
            //@ts-expect-error : path.at is never undefined
        } while (path !== undefined && (path.at(-1).type !== 'start'));
        if (path === undefined)
            continue;
        path.pop();
        return path;
    }
    throw new Error("Couldn't map path");
}
function getVertices(loopTiles, tileArray) {
    const vertices = [];
    for (const tile of loopTiles) {
        if (tile.type === 'start') {
            const startCoordinates = tile.coordinates;
            const leftTile = getTile({ x: startCoordinates.x - 1, y: startCoordinates.y }, tileArray);
            const downTile = getTile({ x: startCoordinates.x, y: startCoordinates.y + 1 }, tileArray);
            const rightTile = getTile({ x: startCoordinates.x + 1, y: startCoordinates.y }, tileArray);
            const upTile = getTile({ x: startCoordinates.x, y: startCoordinates.y - 1 }, tileArray);
            if (leftTile !== undefined &&
                loopTiles.includes(leftTile) &&
                rightTile !== undefined &&
                loopTiles.includes(rightTile)) {
                continue;
            }
            if (upTile !== undefined &&
                loopTiles.includes(upTile) &&
                downTile !== undefined &&
                loopTiles.includes(downTile)) {
                continue;
            }
            vertices.push(tile);
            continue;
        }
        if (tile.isCornerPipe === true)
            vertices.push(tile);
    }
    return vertices;
}
function getTile(coordinates, tileArray) {
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
function traverseLoop(previousTile, currentTile, tileArray, traversedTiles) {
    const previousCoordinates = previousTile.coordinates;
    const currentCoordinates = currentTile.coordinates;
    if (currentTile.connectedCoordinates === undefined)
        throw new Error();
    const nextCoordinates = currentTile.connectedCoordinates.filter((connectionCoordinates) => {
        if (connectionCoordinates.x !== previousCoordinates.x)
            return true;
        if (connectionCoordinates.y !== previousCoordinates.y)
            return true;
        return false;
    })[0];
    const nextTile = getTile(nextCoordinates, tileArray);
    if (nextTile === undefined)
        return undefined;
    if (nextTile.type === 'start')
        return traversedTiles.concat(nextTile);
    if (!checkTileConnections(nextTile, currentTile))
        return undefined;
    const newTraversedTiles = traversedTiles.concat(nextTile);
    return newTraversedTiles;
}
function getAreaByShoelace(verticesArray) {
    let sum = 0;
    for (let i = 0; i < verticesArray.length - 1; i++) {
        const ySum = verticesArray[i].y + verticesArray[i + 1].y;
        const xDiff = verticesArray[i].x - verticesArray[i + 1].x;
        const prod = ySum * xDiff;
        sum += prod;
    }
    //
    //@ts-expect-error : .at is never undefined
    const ySum = verticesArray.at(-1).y + verticesArray.at(0).y;
    //@ts-expect-error : .at is never undefined
    const xDiff = verticesArray.at(-1).x - verticesArray.at(0).x;
    const prod = ySum * xDiff;
    sum += prod;
    const res = Math.abs(sum / 2);
    return res;
}
function findConnections(tileCharacter, coordinates) {
    if (tileCharacter.length !== 1)
        return undefined;
    let connections;
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
function checkTileConnections(tileA, tileB) {
    const tileACoordinates = tileA.coordinates;
    const tileBCoordinates = tileB.coordinates;
    const tileAConnections = tileA.connectedCoordinates;
    const tileBConnections = tileB.connectedCoordinates;
    const tileAValidatedConnections = tileAConnections?.filter((connectionCoordinate) => {
        if (connectionCoordinate.x !== tileB.coordinates.x)
            return false;
        if (connectionCoordinate.y !== tileB.coordinates.y)
            return false;
        return true;
    });
    const tileBValidatedConnections = tileBConnections?.filter((connectionCoordinate) => {
        if (connectionCoordinate.x !== tileA.coordinates.x)
            return false;
        if (connectionCoordinate.y !== tileA.coordinates.y)
            return false;
        return true;
    });
    if (tileAValidatedConnections === undefined || tileAValidatedConnections.length !== 1)
        return false;
    if (tileBValidatedConnections === undefined || tileBValidatedConnections.length !== 1)
        return false;
    return true;
}
function isInside(startTile, tileArray, loopTiles) {
    let intersections = 0;
    function nextCoordinates() {
        return {
            x: currTile.coordinates.x + 1,
            y: currTile.coordinates.y
        };
    }
    function nextAfterCoordinates() {
        return {
            x: currTile.coordinates.x + 2,
            y: currTile.coordinates.y
        };
    }
    if (loopTiles.includes(startTile)) {
        return false;
    }
    let currTile = startTile;
    let nextTile = getTile(nextCoordinates(), tileArray);
    let currOnLoop = false;
    while (nextTile !== undefined) {
        let nextOnLoop = loopTiles.includes(nextTile);
        if (nextOnLoop === true && currOnLoop === false) {
            let nextAfterTile = getTile(nextAfterCoordinates(), tileArray);
            if (nextAfterTile !== undefined) {
                let nextAfterOnLoop = loopTiles.includes(nextAfterTile);
                if (nextAfterOnLoop === false)
                    intersections += 1;
            }
        }
        currTile = nextTile;
        currOnLoop = nextOnLoop;
        nextTile = getTile(nextCoordinates(), tileArray);
    }
    //console.log('Tile: ' + startTile.coordinates.x + ',' + startTile.coordinates.y);
    //console.log('Intersections: ' + intersections);
    //console.log('Inside: ' + !((intersections % 2) === 0));
    return !((intersections % 2) === 0);
}
function part1Main(inputLines) {
    const input = parseInput(inputLines);
    const startingTile = input.startingTile;
    const tileArray = input.tileArray;
    console.log(findOppositePipeSteps(startingTile, tileArray));
}
function part2Main(inputLines) {
    const input = parseInput(inputLines);
    const tileArray = input.tileArray;
    const pipeTiles = mapPipeLoop(input.startingTile, tileArray);
    const vertices = getVertices(pipeTiles, tileArray);
    const vertexCoordinates = vertices.map((vertex) => vertex.coordinates);
    const area = getAreaByShoelace(vertexCoordinates);
    const perimeterPoints = pipeTiles.length;
    //Pick's formula: Area = InteriorPoints + (PerimeterPoints / 2) - 1
    //InteriorPoints = Area - (PerimeterPoints / 2) + 1
    const interiorPoints = area - (perimeterPoints / 2) + 1;
    console.log(interiorPoints);
}
part2Main(lines);
