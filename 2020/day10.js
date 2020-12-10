import { readFile } from "../aoc.js";

async function processLineByLine() {
  let input = await readFile('2020/day10.txt')
  input = input
    .map(Number)
    .sort((a, b) => a - b)

  puzzle1(input)
  puzzle2(input)
}

function stackAdapters (input) {
  let adapters = []
  for (let i = 0; i < input.length; i++) {
    const currentAdapter = input[i]
    const lastAdapter = adapters.length ? adapters[adapters.length - 1] : null
    if (!lastAdapter) {
      // No adapters yet, start with first one
      adapters.push(currentAdapter)
      continue
    }

    if (currentAdapter > lastAdapter && currentAdapter <= lastAdapter + 3) {
      adapters.push(currentAdapter)
    }
  }
  return adapters
}

function puzzle1(input) {
  const result = stackAdapters(input)

  const usedAdapterRatings = [3]
  for (let i = result.length - 1; i >= 0; i--) {
    const current = result[i]
    const previous = i === 0 ? 0 : result[i - 1]
    usedAdapterRatings.push(current - previous)
  }
  console.log(`Puzzle 1: ${usedAdapterRatings.filter(x => x === 1).length * usedAdapterRatings.filter(x => x === 3).length}`)
}

function puzzle2(input) {
  // Add start and end
  input = [
    0,
    ...input,
    input[input.length - 1] + 3
  ]

  // lengths of found blocks of values
  // for example 0, 1, 2, 3, 6, 7, 10, 11, 14
  // would result in [4, 2, 2] because 0-3 is a block of 4 numbers, 6-7 is a block of 2, and 10-11 is a block of 2.
  // last entry is ignored
  const blocks = []
  for (let i = 0; i < input.length - 1; i++) {
    if (input[i + 1] - input[i] === 1) {
      const start = i
      while (input[i + 1] - input[i] === 1) {
        i++
      }
      blocks.push(i - start + 1)
    }
  }

  // result[i] = 1 + 1 + 2 + ... 
  const result = blocks
    .map((group) => Array.from({ length: group - 1 })
    .reduce((acc, _, index) => acc + index, 1));

  // All numbers of possible result multiplied
  console.log(`Puzzle 2: ${result.reduce((a, v) => a * v, 1)}`)
}

processLineByLine();
