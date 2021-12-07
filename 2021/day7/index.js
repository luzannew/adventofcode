import { readFile } from '../../aoc.js'

async function processLineByLine() {
  const input = await readFile('2021/day7/input.txt')

  let crabs = input[0].split(',').map(Number)
  crabs = crabs.sort((a, b) => a - b)

  puzzle1(crabs)
  puzzle2(crabs)
}

/**
 * 
 * @param {array[]} crabs
 */
function puzzle1(crabs) {
  const results = []

  const min = crabs[0]
  const max = crabs[crabs.length - 1]

  for(var pos = min; pos <= max; pos++) {
    const fuel = crabs.reduce((acc, curr) => {
      acc += Math.abs(curr - pos)
      return acc
    }, 0)

    results.push({ fuel, pos})
  }

  // console.table(results)

  // Get position with least amount of fuel
  const winner = results.sort((a, b) => a.fuel - b.fuel)[0]
  console.log(`Puzzle 1: Fuel ${winner.fuel} on position ${winner.pos}`)
}
/**
 * 
 * @param {array[]} crabs
 */
function puzzle2(crabs) {
  const results = []

  const cost = new Map();

  function getCost (steps) {
    if (cost.has(steps)) {
      return cost.get(steps)
    }

    if (steps === 0) {
      return 0
    }

    const newCost = getCost(steps-1) + steps
    cost.set(steps, newCost)

    return newCost
  }
  
  const min = crabs[0]
  const max = crabs[crabs.length - 1]

  for(var pos = min; pos <= max; pos++) {
    const fuel = crabs.reduce((acc, curr) => {
      acc += getCost(Math.abs(curr - pos))
      return acc
    }, 0)

    results.push({ fuel, pos})
  }

  // console.table(results)

  // Get position with least amount of fuel
  const winner = results.sort((a, b) => a.fuel - b.fuel)[0]
  console.log(`Puzzle 2: Fuel ${winner.fuel} on position ${winner.pos}`)
}

processLineByLine()
