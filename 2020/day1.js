import { readFile } from "../aoc.js";

async function processLineByLine() {
  const input = await readFile('2020/day1.txt')

  const numbers = input
    .map(Number)
    .sort((a, b) => a - b)

  puzzle1(numbers)
  puzzle2(numbers)
}

function puzzle1(numbers) {
  for (let first = 0; first < numbers.length; first++) {
    for (let second = first; second < numbers.length; second++) {
      if (numbers[first] + numbers[second] === 2020) {
        console.log(`Puzzle 1: ${numbers[first] * numbers[second]}`)
        return
      }
    }
  }
}

function puzzle2(numbers) {
  for (let first = 0; first < numbers.length; first++) {
    for (let second = first; second < numbers.length; second++) {
      for (let third = second; third < numbers.length; third++) {
        if (numbers[first] + numbers[second] + numbers[third] === 2020) {
          console.log(`Puzzle 2: ${numbers[first] * numbers[second] * numbers[third]}`)
          return
        }
      }
    }
  }
}

processLineByLine();
