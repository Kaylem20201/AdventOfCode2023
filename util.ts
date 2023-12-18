import fs from 'node:fs';
import readline from 'node:readline';

export async function inputToLines(dayNumber : Number) {
    const fileStream = fs.createReadStream('day' + dayNumber.toString() + '/input.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    const lines : string[] = [];

    for await (const line of rl) {
        lines.push(line);
    }

    return lines;
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

export function binaryInsertionSearch<Type>(a : Type[], item : any, low : number, high : number, sortingFunction : Function)
{
  
    if (high <= low) return (sortingFunction(item, a[low]) > 0) ? (low + 1) : low;
  
    let mid = Math.floor((low + high) / 2);

    const midSortResult = sortingFunction(item, a[mid]);
  
    if(midSortResult === 0) return mid + 1;
  
    if(midSortResult > 0) return binaryInsertionSearch(a, item, mid + 1, high, sortingFunction);
          
    return binaryInsertionSearch(a, item, low, mid - 1, sortingFunction);
}