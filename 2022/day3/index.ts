import { readFile } from '../../aoc'

async function processLineByLine() {
  const input = await readFile('2022/day3/input.txt')

  puzzle1(input)
  puzzle2(input)
}

const scoreList = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
function puzzle1(input: string[]) {
  const duplicates = input.map(x => {
    const part1 = x.slice(0, x.length / 2)
    const part2 = x.slice(x.length / 2)
    const duplicate = [...part1].find(x => part2.includes(x)) ?? ''
    return duplicate
  })
  console.log(duplicates.reduce((prev, curr) => prev + (scoreList.indexOf(curr) + 1), 0))
}

function puzzle2(input: string[]) {
  const badges = []

  // Take groups of 3
  for (let i = 0; i < input.length; i += 3) {
    // Check if there is a char thats the same across all elves
    const badge = [...input[i]].find(x => input[i+1].includes(x) && input[i+2].includes(x)) ?? ''
    badges.push(badge)
  }
  console.log(badges.reduce((prev, curr) => prev + (scoreList.indexOf(curr) + 1), 0))
}

processLineByLine()
