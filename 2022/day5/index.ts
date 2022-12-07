import { readFile } from '../../aoc'

interface Move {
  amount: number
  position: number
  destination: number
}

async function processLineByLine() {
  const input = await readFile('2022/day5/input.txt')

  const stacks: string[][] = []
  const moves: Move[] = []
  input.forEach(line => {
    // Parse stack configuration, see demo.txt on example
    if (line.includes('[')) {
      for (var i = 0; i < line.length; i += 4) {
        const crate = line[i+1]

        const index = i / 4
        let stack: string[] = []
        if (index < stacks.length) {
          stack = stacks[index]
        }

        // Ignore 'empty' create
        if (crate !== ' ') {
          stack.push(crate)
        }
        
        if (index < stacks.length) {
          // Update current stack
          stacks[index] = stack
        } else {
          // New stack
          stacks.push(stack)
        }
      }
    }

    // Parse movements
    if (line.includes('move')) {
      const matches = line.match(/move (\d+) from (\d+) to (\d+)/)
      if (matches != null) {
        moves.push({
          amount: Number(matches[1]),
          position: Number(matches[2]),
          destination: Number(matches[3]),
        })
      }
    }
  })

  puzzle1(stacks, moves)
  puzzle2(stacks, moves)
}

function puzzle1(stacks: string[][], moves: Move[]) {
  // Lazy copy...
  var workingStacks = JSON.parse(JSON.stringify(stacks)) as string[][];
  moves.forEach(move => {
    // Crates are moved 1 at a time, so move them one by one
    for (var i = 0; i < move.amount; i++) {
      const crate = workingStacks[move.position - 1].shift()
      if (crate) {
        workingStacks[move.destination - 1].unshift(crate)
      }
    }
  })

  // Print which crate end up on top of each stack
  console.log(workingStacks.map(stack => stack.shift()).join(''))
}

function puzzle2(stacks: string[][], moves: Move[]) {
  // Lazy copy...
  var workingStacks = JSON.parse(JSON.stringify(stacks)) as string[][];
  moves.forEach(move => {
    // Pick X amount of crates
    const crates = workingStacks[move.position - 1].splice(0, move.amount)
    if (crates) {
      // And insert them in the same order
      workingStacks[move.destination - 1].unshift(...crates)
    }
  })

  // Print which crate end up on top of each stack
  console.log(workingStacks.map(stack => stack.shift()).join(''))
}

processLineByLine()
