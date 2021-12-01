import { readFile } from '../../aoc.js'

async function processLineByLine() {
  const input = await readFile('2021/day1/input.txt')

  const numbers = input.map(Number)

  puzzle1(numbers)
  puzzle2(numbers)
}

const howManyIncreased = (numbers) => {
  let count = 0
  for (let i = 1; i < numbers.length; i++) {
    if(numbers[i] > numbers[i-1]) {
      count++
    }
  }

  return count
}

function puzzle1(numbers) {
  console.log(`Puzzle 1: ${howManyIncreased(numbers)}`)
}

function puzzle2(numbers) {
  // Get total from sliding window over 3 entries
  const grouped = numbers.reduce((prev, curr, index) => {
    if (index < numbers.length - 2) {
      prev.push(curr + numbers[index + 1] + numbers[index + 2])
    }
    return prev
  }, [])

  console.log(`Puzzle 2: ${howManyIncreased(grouped)}`)
}

processLineByLine()
