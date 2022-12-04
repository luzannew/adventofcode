import { readFile } from '../../aoc'

async function processLineByLine() {
  const input = await readFile('2022/day1/input.txt')

  const elves: number[][] = []
  let elv: number[] = []
  input.forEach(x => {
    if (x === '') {
      elves.push(elv)
      elv = []
      return
    }

    elv.push(Number(x))
  })

  puzzle1(elves)
  puzzle2(elves)
}

function puzzle1(elves: number[][]) {
  const totalByElves = elves.map(x => x.reduce((a, curr) => a + curr, 0))
  const sortedDescending = totalByElves.sort((b, a) => a - b)
  const highestCaloryElv = sortedDescending[0]
  console.log(highestCaloryElv)
}

function puzzle2(elves: number[][]) {
  const totalByElves = elves.map(x => x.reduce((a, curr) => a + curr, 0))
  const [nr1, nr2, nr3] = totalByElves.sort((b, a) => a - b)
  
  console.log(nr1 + nr2 + nr3)
}

processLineByLine()
