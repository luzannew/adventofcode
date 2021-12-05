import { readFile } from '../../aoc.js'

async function processLineByLine() {
  const input = await readFile('2021/day3/input.txt')

  puzzle1(input)
  puzzle2(input)
}

/**
 * 
 * @param {array} input 
 * @param {number} pos 
 * @returns array
 */
function getCount(input, pos) {
  const sorted = input.sort((a, b) => {
    return a[pos] - b[pos]
  })
  const bit1Pos = sorted.map(x => x[pos]).indexOf('1')
  const total0 = bit1Pos
  const total1 = sorted.length - bit1Pos

  return [total0, total1, sorted]
}

function puzzle1(input) {
  let gammarate = ''
  let epsilonrate = ''
  
  for (var pos = 0; pos < input[0].length; pos++) {
    const [total0, total1] = getCount(input, pos)
    
    gammarate += total0 > total1 ? '0' : '1'
    epsilonrate += total0 < total1 ? '0' : '1'
  }
  const powerconsumption = parseInt(gammarate, 2) * parseInt(epsilonrate, 2)

  console.log(`Puzzle 1: ${powerconsumption}`)
}

function puzzle2(input) {
  let oxygenGeneratorRating = ''
  let co2scrubberrating = ''

  let workingset = [...input]

  // To find oxygen generator rating, determine the most common value (0 or 1)
  // in the current bit position, and keep only numbers with that bit in that
  // position. If 0 and 1 are equally common, keep values with a 1 in the
  // position being considered.
  for (var pos = 0; pos < input[0].length; pos++) {
    const [total0, total1, sorted] = getCount(workingset, pos)
    if (total1 >= total0) {
      workingset = sorted.slice(total0)
    } else {
      workingset = sorted.slice(0, total0)
    }

    if (workingset.length === 1) {
      oxygenGeneratorRating = workingset[0]
      break;
    }
  }

  workingset = [...input]

  // To find CO2 scrubber rating, determine the least common value (0 or 1) in
  // the current bit position, and keep only numbers with that bit in that
  // position. If 0 and 1 are equally common, keep values with a 0 in the
  // position being considered.
  for (pos = 0; pos < input[0].length; pos++) {
    const [total0, total1, sorted] = getCount(workingset, pos)
    if (total1 >= total0) {
      workingset = sorted.slice(0, total0)
    } else {
      workingset = sorted.slice(total0)
    }

    if (workingset.length === 1) {
      co2scrubberrating = workingset[0]
      break;
    }
  }

  const lifesupport = parseInt(oxygenGeneratorRating, 2) * parseInt(co2scrubberrating, 2)
  console.log(`Puzzle 2: ${lifesupport}`)
}

processLineByLine()
