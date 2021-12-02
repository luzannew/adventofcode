import { readFile } from '../../aoc.js'

async function processLineByLine() {
  const input = await readFile('2021/day2/input.txt')

  const actions = input.map(x => x.split(' '))

  puzzle1(actions)
  puzzle2(actions)
}

function puzzle1(actions) {
  let horizontal = 0
  let depth = 0
  actions.forEach(a => {
    switch(a[0]){
      case 'up':
        depth -= Number(a[1])
        break;
      case 'down':
        depth += Number(a[1])
        break;
      case 'forward':
        horizontal += Number(a[1])
        break;
    }

    // console.log(`Horizontal: ${horizontal}. Depth: ${depth}`)
  })
  console.log(`Puzzle 1: ${horizontal * depth}`)
}

function puzzle2(actions) {
  let horizontal = 0
  let depth = 0
  let aim = 0
  actions.forEach(a => {
    switch(a[0]){
      case 'up':
        aim -= Number(a[1])
        break;
      case 'down':
        aim += Number(a[1])
        break;
      case 'forward':
        horizontal += Number(a[1])
        depth += aim * Number(a[1])
        break;
    }

    // console.log(`Horizontal: ${horizontal}. Depth: ${depth}. Aim: ${aim}`)
  })

  console.log(`Puzzle 2: ${horizontal * depth}`)
}

processLineByLine()
