import fs from 'fs';
import readline from 'readline';

export async function readFile(filename) {
  const fileStream = fs.createReadStream(filename);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let input = []

  for await (const line of rl) {
    input.push(line)
  }

  return input
}