import { inputToLines } from "../util.js";

const DAYNUMBER = 6;
const lines = await inputToLines(DAYNUMBER);

interface RaceInfo {
    time : number,
    recordDistance : number
}

function parseInput(inputLines : string[]) : RaceInfo[] {

    const TIMEEXP = /Time:(?:\s*((?:\s*\d+\s*)+)\s*)+/;
    const DISTANCEEXP = /Distance:(?:\s*((?:\s*\d+\s*)+)\s*)+/

    const timeMatch = inputLines[0].match(TIMEEXP);
    const distanceMatch = inputLines[1].match(DISTANCEEXP);

    if (timeMatch === null || distanceMatch === null) process.exit(1);

    const times = timeMatch[1].trim().split(/\s+/);
    const distances = distanceMatch[1].trim().split(/\s+/);

    const races : RaceInfo[] = [];
    for (let i = 0; i < times.length; i++) {
        races.push({
            time : Number.parseInt(times[i]),
            recordDistance : Number.parseInt(distances[i])
        });
    }

    return races;

}

function parseInputPart2(inputLines : string[]) : RaceInfo[] {

    const TIMEEXP = /Time:(?:\s*((?:\s*\d+\s*)+)\s*)+/;
    const DISTANCEEXP = /Distance:(?:\s*((?:\s*\d+\s*)+)\s*)+/

    const timeMatch = inputLines[0].match(TIMEEXP);
    const distanceMatch = inputLines[1].match(DISTANCEEXP);

    if (timeMatch === null || distanceMatch === null) process.exit(1);

    const time = timeMatch[1].replaceAll(/\s+/g,'');
    const distance = distanceMatch[1].replaceAll(/\s+/g,'');

    const races : RaceInfo[] = [{
        time : Number.parseInt(time),
        recordDistance : Number.parseInt(distance)
    }];

    return races;

}

function calculateDistance(totalTime : number, buttonTime : number) {

    const speed = buttonTime;
    const distance = speed*(totalTime-buttonTime);
    return distance;

}

function findTimeLimits(raceInfo : RaceInfo) : [number,number] {

    const totalTime = raceInfo.time;
    const recordDistance = raceInfo.recordDistance;
    
    const lowerTimeLimitFloat = (totalTime - Math.sqrt((totalTime ** 2) - (4 * recordDistance)))/2;
    const higherTimeLimitFloat = (totalTime + Math.sqrt((totalTime ** 2) - (4 * recordDistance)))/2;

    const lowerTimeLimit = Math.floor(lowerTimeLimitFloat)+1;
    const higherTimeLimit = Math.ceil(higherTimeLimitFloat)-1;

    console.log('Time Limits: [%d,%d]',lowerTimeLimit,higherTimeLimit);
    return [lowerTimeLimit, higherTimeLimit];
}

function part1Main(inputLines : string[]) {

    const races = parseInput(inputLines);

    const limits = [];
    for (const race of races) { limits.push(findTimeLimits(race)); }

    const ranges = [];
    for (const limit of limits) { 
        ranges.push(limit[1]-limit[0]+1);
    }

    return ranges.reduce( 
        (mult, curr) => mult * curr,
        1
    );


}

function part2Main(inputLines : string[]) {

    const races = parseInputPart2(inputLines);

    const limits = [];
    for (const race of races) { limits.push(findTimeLimits(race)); }

    const ranges = [];
    for (const limit of limits) { 
        ranges.push(limit[1]-limit[0]+1);
    }

    return ranges.reduce( 
        (mult, curr) => mult * curr,
        1
    );


}

console.log(part2Main(lines));

