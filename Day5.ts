import { inputToLines } from "./util.js";

const DAYNUMBER = 5;
const lines = await inputToLines(DAYNUMBER);

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

function parseInput(inputLines: string[]) {
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

    const result: ParsedInput = {
        seeds: seeds,
        mapSet: {
            seedToSoilMaps: sortMaps(seedToSoilMaps),
            soilToFertilizerMaps: sortMaps(soilToFertilizerMaps),
            fertilizerToWaterMaps: sortMaps(fertilizerToWaterMaps),
            waterToLightMaps: sortMaps(waterToLightMaps),
            lightToTemperatureMaps: sortMaps(lightToTemperatureMaps),
            temperatureToHumidityMaps: sortMaps(temperatureToHumidityMaps),
            humidityToLocationMaps: sortMaps(humidityToLocationMaps)
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
        for (const map of currentSet) {
            if (map.sourceStart > currentResult) continue;
            if (map.sourceStart + map.range <= currentResult) continue;
            console.log('Found route. Current: %d, SourceStart: %d, DestinationStart: %d, Range: %d', 
                currentResult, map.sourceStart, map.destinationStart, map.range);
            currentResult = (map.destinationStart + (currentResult-map.sourceStart));
            console.log('Calculated new number: %d', currentResult);
            break;
        }
    }

    return(currentResult);

}

function sortMaps(mapArray : MapInfo[]) {
    const sortedArray = [...mapArray].sort( (a, b) => a.sourceStart - b.sourceStart );
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

part1Main();
