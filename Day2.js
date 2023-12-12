import { inputToLines } from './util.js';
const lines = await inputToLines(2);
let sumOfIDs = 0;
var LimitOf;
(function (LimitOf) {
    LimitOf[LimitOf["Red"] = 12] = "Red";
    LimitOf[LimitOf["Green"] = 13] = "Green";
    LimitOf[LimitOf["Blue"] = 14] = "Blue";
})(LimitOf || (LimitOf = {}));
const redExp = new RegExp(/(?<cubes>\d+) red/);
const greenExp = new RegExp(/(?<cubes>\d+) green/);
const blueExp = new RegExp(/(?<cubes>\d+) blue/);
function checkSet(setString) {
    const redMatch = setString.match(redExp);
    const greenMatch = setString.match(greenExp);
    const blueMatch = setString.match(blueExp);
    //Parse to int with null handling
    const redCubes = (redMatch !== null && (redMatch.groups !== undefined)) ? Number.parseInt(redMatch?.groups['cubes']) : 0;
    const greenCubes = (greenMatch !== null && (greenMatch.groups !== undefined)) ? Number.parseInt(greenMatch?.groups['cubes']) : 0;
    const blueCubes = (blueMatch !== null && (blueMatch.groups !== undefined)) ? Number.parseInt(blueMatch?.groups['cubes']) : 0;
    return ((redCubes <= LimitOf.Red) &&
        (greenCubes <= LimitOf.Green) &&
        (blueCubes <= LimitOf.Blue));
}
for (let i = 0; i < lines.length; i++) {
    const id = i + 1;
    const sets = lines[i].split(';');
    let gameFlag = true;
    for (const set of sets) {
        gameFlag = checkSet(set);
        if (!gameFlag)
            break;
    }
    //console.log('Game %d: ', id, gameFlag);
    if (gameFlag)
        sumOfIDs = sumOfIDs + id;
}
console.log(sumOfIDs);
