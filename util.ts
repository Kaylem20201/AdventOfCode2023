import fs from 'node:fs';
import readline from 'node:readline';

export function memoize<Args extends unknown[], ResultType> (
    fn : (...args : Args) => ResultType
) : (...args : Args) => ResultType {

    const memoMap = new Map<string, ResultType>();

    const returnFunction = (...args : Args) => {
	const argsString = JSON.stringify(args);
	if (memoMap.has(argsString)) return memoMap.get(argsString)!;
	//Arguments not seen before
	const newResult = fn(...args);
	memoMap.set(argsString, newResult);
	return newResult;
    }

    return returnFunction;

}

export async function inputToLines(dayNumber: Number) {
    const fileStream = fs.createReadStream('day' + dayNumber.toString() + '/input.txt');

    const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
    });

    const lines: string[] = [];

    for await (const line of rl) {
	lines.push(line);
    }

    return lines;
}

/**
 * Debugging tool
 */
export class Debug {
    active : boolean = false;
    logging : boolean = false;

    constructor() {
    }

    /**
	 * Activate debug mode.
	 * @remarks
	 * 
    */
    activate(...opts : string[]) : void {
	if (!this.active) console.log("Debugging mode activated.");
	this.active = true;
	if(opts.includes('logs')) { this.logging = true; }
    }

    /**
	 * Deactivates debug mode
    */
    deactivate() : void {
	if (this.active) console.log("Debugging deactivated");
	this.active = false;
	// if(this.logging) { this.log(); }
    }

    /**
	 * Prints only if debugging is active
	 * @param args Arguments to print
    */
    print(...args : any[]) : void {
	if (this.active) { console.log(...args) };
    }

    /*
	 * log() : string {
	 * }
	 */

    /* error(errorArg : Error) {
		if (this.logging) { 
			const filename = this.log();
			errorArg.message = errorArg.message + '\nLogs at:' + filename;
		}
		throw errorArg;
    } */
}

/**
 *  Binary search on an array.
 *  Returns the appropriate index for insertion on a sorted array.
 *
 * @param a Input Array
 * @param item Item to search for
 * @param low Bottom Range
 * @param high Top Range
 * @param sortingFunction Function used for determining sorting order
 * @returns Index
 */
export function binaryInsertionSearch<Type>(a: Type[], item: any, low: number, high: number, sortingFunction: Function) {

    if (high <= low) return (sortingFunction(item, a[low]) > 0) ? (low + 1) : low;

    let mid = Math.floor((low + high) / 2);

    const midSortResult = sortingFunction(item, a[mid]);

    if (midSortResult === 0) return mid + 1;

    if (midSortResult > 0) return binaryInsertionSearch(a, item, mid + 1, high, sortingFunction);

    return binaryInsertionSearch(a, item, low, mid - 1, sortingFunction);
}

export function lcm(a: number, b: number): number {
    return  (a * b) / gcd(a, b);
}

export function gcd(a: number, b: number): number {
    return (b === 0) ? a : gcd(b, a % b);
}
