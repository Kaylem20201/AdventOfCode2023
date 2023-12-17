import { inputToLines } from "../util.js";

const DAYNUMBER = 5;
const lines = await inputToLines(DAYNUMBER);

interface SeedRange {
    start: number,
    range: number
}

interface ParsedInput {
    seeds: number[],
    mapSet: MapSet
}

interface MapSet {
    seedToSoilMaps: MapInfo[],
    soilToFertilizerMaps: MapInfo[],
    fertilizerToWaterMaps: MapInfo[],
    waterToLightMaps: MapInfo[],
    lightToTemperatureMaps: MapInfo[],
    temperatureToHumidityMaps: MapInfo[],
    humidityToLocationMaps: MapInfo[]
}

interface MapInfo {
    sourceStart: number,
    destinationStart: number,
    range: number
}

function parseInput(inputLines: string[], mode?: number) {
    const SEEDEXP = /seeds:(?:\s*((?:\s*\d+\s*)+)\s*)+/;
    const SEEDTOSOILEXP = /seed\-to\-soil map\:/;
    const SOILTOFERTILIZEREXP = /soil\-to\-fertilizer map\:/;
    const FERTILIZERTOWATEREXP = /fertilizer\-to\-water map\:/;
    const WATERTOLIGHTEXP = /water\-to\-light map\:/;
    const LIGHTTOTEMPERATUREEXP = /light\-to\-temperature map\:/;
    const TEMPERATURETOHUMIDITYEXP = /temperature\-to\-humidity map\:/;
    const HUMIDITYTOLOCATIONEXP = /humidity\-to\-location map\:/;
    const MAPEXP = /^(?<source>\d+) (?<destination>\d+) (?<range>\d+)$/;

    const seedMatch = inputLines[0].match(SEEDEXP);
    if (seedMatch === null) process.exit(1);
    const seedsStrings = seedMatch[1].trim().split(' ');
    const seeds = seedsStrings.map((seedString) => Number.parseInt(seedString));

    let lineIndex = 1;
    const seedToSoilMaps = parseMapLines(inputLines, lineIndex, SEEDTOSOILEXP);
    lineIndex += seedToSoilMaps.length + 2;
    const soilToFertilizerMaps = parseMapLines(inputLines, lineIndex, SOILTOFERTILIZEREXP);
    lineIndex += soilToFertilizerMaps.length + 2;
    const fertilizerToWaterMaps = parseMapLines(inputLines, lineIndex, FERTILIZERTOWATEREXP);
    lineIndex += fertilizerToWaterMaps.length + 2;
    const waterToLightMaps = parseMapLines(inputLines, lineIndex, WATERTOLIGHTEXP);
    lineIndex += waterToLightMaps.length + 2;
    const lightToTemperatureMaps = parseMapLines(inputLines, lineIndex, LIGHTTOTEMPERATUREEXP);
    lineIndex += lightToTemperatureMaps.length + 2;
    const temperatureToHumidityMaps = parseMapLines(inputLines, lineIndex, TEMPERATURETOHUMIDITYEXP);
    lineIndex += temperatureToHumidityMaps.length + 2;
    const humidityToLocationMaps = parseMapLines(inputLines, lineIndex, HUMIDITYTOLOCATIONEXP);

    if (mode === 2) {
        const result: ParsedInput = {
            seeds: seeds,
            mapSet: {
                seedToSoilMaps: sortMapsByDestination(seedToSoilMaps),
                soilToFertilizerMaps: sortMapsByDestination(soilToFertilizerMaps),
                fertilizerToWaterMaps: sortMapsByDestination(fertilizerToWaterMaps),
                waterToLightMaps: sortMapsByDestination(waterToLightMaps),
                lightToTemperatureMaps: sortMapsByDestination(lightToTemperatureMaps),
                temperatureToHumidityMaps: sortMapsByDestination(temperatureToHumidityMaps),
                humidityToLocationMaps: sortMapsByDestination(humidityToLocationMaps)
            }
        }
    }

    const result: ParsedInput = {
        seeds: seeds,
        mapSet: {
            seedToSoilMaps: sortMapsBySource(seedToSoilMaps),
            soilToFertilizerMaps: sortMapsBySource(soilToFertilizerMaps),
            fertilizerToWaterMaps: sortMapsBySource(fertilizerToWaterMaps),
            waterToLightMaps: sortMapsBySource(waterToLightMaps),
            lightToTemperatureMaps: sortMapsBySource(lightToTemperatureMaps),
            temperatureToHumidityMaps: sortMapsBySource(temperatureToHumidityMaps),
            humidityToLocationMaps: sortMapsBySource(humidityToLocationMaps)
        }
    };

    return result;

}

function parseMapLines(fullInput: string[], startingLineIndex: number, headerRegex: RegExp) {

    const MAPEXP = /^(?<destination>\d+) (?<source>\d+) (?<range>\d+)$/;
    let lineIndex = startingLineIndex;
    const maps: MapInfo[] = [];

    //Find header
    let headerMatch = fullInput[lineIndex].match(headerRegex);
    while (headerMatch === null) {
        lineIndex++;
        headerMatch = fullInput[lineIndex].match(headerRegex);
    }
    lineIndex++;

    //Parse from header
    let mapMatch = fullInput[lineIndex].match(MAPEXP);
    while (mapMatch !== null) {
        maps.push({
            sourceStart: Number.parseInt(mapMatch.groups!['source']),
            destinationStart: Number.parseInt(mapMatch.groups!['destination']),
            range: Number.parseInt(mapMatch.groups!['range'])
        });
        lineIndex++;
        if (lineIndex >= fullInput.length) break;
        mapMatch = fullInput[lineIndex].match(MAPEXP);
    }

    return maps;

}

function routeSeedToLocation(seedNumber: number, mapSet: MapSet) {

    let currentResult = seedNumber;
    let orderedMapSet = [
        mapSet.seedToSoilMaps,
        mapSet.soilToFertilizerMaps,
        mapSet.fertilizerToWaterMaps,
        mapSet.waterToLightMaps,
        mapSet.lightToTemperatureMaps,
        mapSet.temperatureToHumidityMaps,
        mapSet.humidityToLocationMaps
    ];

    for (const currentSet of orderedMapSet) {
        currentResult = sourceToDestination(currentResult, currentSet);
    }

    return (currentResult);

}

function sourceToDestination(startingNumber: number, mapArray: MapInfo[]) {
    let currentResult = startingNumber;
    for (const map of mapArray) {
        if (map.sourceStart > currentResult) continue;
        if (map.sourceStart + map.range <= currentResult) continue;
        //console.log('Found route. Current: %d, SourceStart: %d, DestinationStart: %d, Range: %d', 
        //currentResult, map.sourceStart, map.destinationStart, map.range);
        currentResult = (map.destinationStart + (currentResult - map.sourceStart));
        //console.log('Calculated new number: %d', currentResult);
        break;
    }
    return currentResult;
}

function destinationToStart(startingNumber: number, mapArray: MapInfo[]) {
    let currentResult = startingNumber;
    for (const map of mapArray) {
        if (map.destinationStart > currentResult) continue;
        if (map.destinationStart + map.range <= currentResult) continue;
        //console.log('Found route. Current: %d, SourceStart: %d, DestinationStart: %d, Range: %d', 
        //currentResult, map.sourceStart, map.destinationStart, map.range);
        currentResult = (map.sourceStart + (currentResult - map.destinationStart));
        //console.log('Calculated new number: %d', currentResult);
        break;
    }
    return currentResult;
}

function getBreakpoints(mapSet: MapSet, seedRanges: SeedRange[]) {
    const orderedMapSet = [
        mapSet.humidityToLocationMaps,
        mapSet.temperatureToHumidityMaps,
        mapSet.lightToTemperatureMaps,
        mapSet.waterToLightMaps,
        mapSet.fertilizerToWaterMaps,
        mapSet.soilToFertilizerMaps,
        mapSet.seedToSoilMaps
    ];

    let breakpoints: number[] = [];
    for (const currentSet of orderedMapSet) {
        //convert old breakpoints
        breakpoints = breakpoints.map((breakpoint) => {
            return destinationToStart(breakpoint, currentSet);
        });

        //add new breakpoints
        if (!breakpoints.includes(0)) breakpoints.push(0);
        for (const map of currentSet) breakpoints.push(map.sourceStart);
    }
    //Remove any numbers that don't fit in seed ranges
    breakpoints = breakpoints.filter((seedNumber) => {
        for (const seedRange of seedRanges) {
            if (seedRange.start > seedNumber) continue;
            if (seedRange.start + seedRange.range <= seedNumber) continue;
            return true;
        }
        return false;
    });
    //Finally, add the beginning of every seed range
    for (const seedRange of seedRanges) {
        if (!breakpoints.includes(seedRange.start)) breakpoints.push(seedRange.start);
    }

    return breakpoints;

}

function sortMapsBySource(mapArray: MapInfo[]) {
    const sortedArray = [...mapArray].sort((a, b) => a.sourceStart - b.sourceStart);
    return sortedArray;
}

function sortMapsByDestination(mapArray: MapInfo[]) {
    const sortedArray = [...mapArray].sort((a, b) => a.destinationStart - b.destinationStart);
    return sortedArray;
}

function part1Main() {
    const parsedInput = parseInput(lines);
    const seeds = parsedInput.seeds;
    const mapSet = parsedInput.mapSet;

    let minimumLocation = Infinity;

    for (const seed of seeds) {
        const seedLoc = routeSeedToLocation(seed, mapSet);
        minimumLocation = (minimumLocation <= seedLoc) ? minimumLocation : seedLoc;
    }

    console.log(minimumLocation);
}

function part2Main() {

    const parsedInput = parseInput(lines, 2); //Sort maps by destination
    const parsedSeedLine = parsedInput.seeds;
    const mapSet = parsedInput.mapSet;

    const seedRanges = new Array<SeedRange>(parsedSeedLine.length / 2);
    for (let i = 0; i < seedRanges.length; i++) {
        seedRanges[i] = { start: parsedSeedLine[i * 2], range: parsedSeedLine[i * 2 + 1] };
    }
    seedRanges.sort((a, b) => a.start - b.start);

    const breakpoints : number[] = getBreakpoints(mapSet, seedRanges);

    console.log(breakpoints)

    let minimumLocation = Infinity;

    for (const breakpoint of breakpoints) {
        const location = routeSeedToLocation(breakpoint, mapSet);
        minimumLocation = (location < minimumLocation) ? location : minimumLocation;
    }

    console.log(minimumLocation);

}

part2Main();
