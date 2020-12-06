import { readFile } from "../aoc.js";

async function processLineByLine() {
  const input = await readFile('2020/day2.txt')

  /**
   * Input: 8-9 x: xxxxxxxrk
   * Each line gives the password policy and then the password.
   * The password policy indicates the lowest and highest number of times a given letter must appear for the password to be valid.
   * For example, 1-3 a means that the password must contain a at least 1 time and at most 3 times.
   */
  const passwords = input.map(line => {    
    // Split everything on ':' to separate policy and password
    const [validation, password] = line.split(':')
    // Split on 'space' to get the occurences + character
    const [amount, character] = validation.split(' ')
    // Finally split on '-' to get the min/max
    const [min, max] = amount.split('-');
    return {
      min: Number(min),
      max: Number(max),
      character: character,
      password: password.trim()
    }
  })

  puzzle1(passwords)
  puzzle2(passwords)
}

function puzzle1(input) {
  let valid = 0;
  for (const entry of input) {
    // Create regexp and count the number of occurences
    const match = entry.password.match(new RegExp(entry.character, 'g'));
    const amount = match ? match.length : -1
    // Validate if we are between the limits
    if (entry.min <= amount && amount <= entry.max) {
      valid++
    }
  }
  console.log('Puzzle 1: ' + valid)
}

function puzzle2(input) {
  let valid = 0;
  for (const entry of input) {
    const firstchar = entry.password[entry.min - 1] === entry.character
    const lastchar = entry.password[entry.max - 1] === entry.character
    if ((firstchar || lastchar) && !(firstchar && lastchar)) {
      valid++
    }
  }
  console.log('Puzzle 2: ' + valid)
}

processLineByLine();
