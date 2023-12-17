import fs from 'node:fs';
import readline from 'node:readline';
export async function inputToLines(dayNumber) {
    const fileStream = fs.createReadStream('day' + dayNumber.toString() + '/input.txt');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    const lines = [];
    for await (const line of rl) {
        lines.push(line);
    }
    return lines;
}
