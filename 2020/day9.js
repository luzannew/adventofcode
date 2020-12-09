import { readFile } from "../aoc.js";

async function processLineByLine() {
  let input = await readFile('2020/day9.txt')
  input = input.map(Number)

  puzzle1(input)
  puzzle2(input)
}

function findSum(numbers, sum) {
  for (let first = 0; first < numbers.length; first++) {
    for (let second = first; second < numbers.length; second++) {
      if (numbers[first] + numbers[second] === sum) {
        return sum
      }
    }
  }

  return null
}

function findInvalidNumber (numbers, preamble) {
  for (let validationIndex = preamble; validationIndex < numbers.length; validationIndex++) {
    const validationNumber = numbers[validationIndex]
    // Take {preamble} amount of items to check if there is a pair of two numbers that sums to the 'next' number
    const items = numbers.slice(validationIndex - preamble, validationIndex)
    const isValid = findSum(items, validationNumber)
    if (isValid == null) {
      return validationNumber
    }
  }
}

function puzzle1(input) {
  const invalidNumber = findInvalidNumber(input, 25)
  console.log(`Puzzle 1: ${invalidNumber}`)
}

function puzzle2(input) {
  const invalidNumber = findInvalidNumber(input, 25)
  const index = input.indexOf(invalidNumber)

  // Loop through all numbers until the index of the invalid number
  for (let start = 0; start < index; start++) {
    const startingNumber = input[start]
    let result = startingNumber
    let pair = [startingNumber]

    // Loop through the next numbers until we found the correct set
    for (let next = start + 1; next < index; next++) {
      const nextNumber = input[next]

      pair.push(nextNumber)
      result += nextNumber;

      // Check if the total exceeds the invalid number
      if (result > invalidNumber) {
        break
      }

      // We found the set of numbers which adds up to the invalid number sum
      if (result === invalidNumber) {
        const sorted = pair.sort((a, b) => a - b)
        console.log(`Puzzle 2: ${sorted[0] + sorted[sorted.length - 1]}`)
        return
      }
    }
  }

}

processLineByLine();
