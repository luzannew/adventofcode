import { readFile } from '../../aoc.js'

async function processLineByLine() {
  const input = await readFile('2020/day21/input.txt')

  puzzle1(input)
  puzzle2(input)
}
function puzzle1(input) {
  console.log(`Puzzle 1: ${null}`)
}

function puzzle2(input) {
  console.log(`Puzzle 2: ${null}`)
}

processLineByLine();
