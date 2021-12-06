import { readFile } from '../../aoc.js'

async function processLineByLine() {
  const input = await readFile('2021/day6/input.txt')

  const initial = input[0].split(',').map(Number)

  // Initial approach
  puzzle1([...initial])

  // Optimized approach
  puzzle2([...initial])
}

/**
 * 
 * @param {array[]} initial
 */
function puzzle1(initial) {
  for (var day = 1; day <= 20; day++) {
    let newFish = 0
    initial = initial.reduce((acc, curr) => {
      if (curr === 0) {
        acc.push(6)
        newFish++
      } else {
        acc.push(curr - 1)
      }
      return acc
    }, [])

    initial = initial.concat(Array(newFish).fill(8))
    // console.log(`Day ${day}\t(${initial.length}): ${initial.join(',')}`)
  }

  console.log(`Puzzle 1: ${initial.length}`)
}
/**
 * 
 * @param {array[]} initial
 */
function puzzle2(initial) {
  const lanternfishMap = new Map()
  for(var i = 0; i <= 8; i++) {
    lanternfishMap.set(i, 0)
  }

  initial.forEach(fish => {
    lanternfishMap.set(fish, lanternfishMap.get(fish) + 1)
  })

  for (var day = 1; day <= 256; day++) {
    let keep = null
    for (var fishAge = 8; fishAge >= 0; fishAge--) {
      if (fishAge === 0) {
        lanternfishMap.set(8, keep)
        lanternfishMap.set(6, lanternfishMap.get(6) + keep)
        continue;
      }
      var currFish = keep ?? lanternfishMap.get(fishAge)
      keep = lanternfishMap.get(fishAge-1)
      lanternfishMap.set(fishAge-1, currFish)
    }

    // let sum = 0;
    // lanternfishMap.forEach(val => sum += val)
    
    // console.log(`Day ${day}\t(${sum}): ${[...lanternfishMap.values()].join(',')}`)
  }
  let sum = 0;
  lanternfishMap.forEach(val => sum += val)

  console.log(`Puzzle 2: ${sum}`)
}

processLineByLine()
