import { readFile } from '../../aoc.js'

async function processLineByLine() {
  const input = await readFile('2021/day5/input.txt')

  const lines = input.map(line => {
    const [start, end] = line.split(' -> ')
    return [
      start.split(',').map(Number),
      end.split(',').map(Number)
    ]
  })

  puzzle1(lines)
  puzzle2(lines)
}

/**
 * 
 * @param {array[]} lines
 * @param {boolean} includeDiagonal
 */
function run(lines, includeDiagonal = false){
  let maxX = 0
  let maxY = 0

  const workingset = lines.filter(line => {
    const [[x1, y1], [x2, y2]] = line
    const horOrVerSame = x1 == x2 || y1 == y2
    if (horOrVerSame || includeDiagonal) {
      maxX = Math.max(maxX, Math.max(x1, x2))
      maxY = Math.max(maxY, Math.max(y1, y2))
    }

    return horOrVerSame || includeDiagonal
  })

  const field = Array(maxY + 1).fill().map(() => Array(maxX + 1).fill(0));
  workingset.forEach(line => {
    const [[x1, y1], [x2, y2]] = line
    const xModifier = x1 === x2 ? 0 : x1 < x2 ? 1 : -1
    const yModifier = y1 === y2 ? 0 : y1 < y2 ? 1 : -1
    let currX = x1
    let currY = y1
    while (true) {
      const point = field[currY][currX]
      field[currY][currX] = point + 1

      if (currX === x2 && currY === y2) {
        break;
      }

      currX += xModifier
      currY += yModifier
    }
    
    // console.log(`Line: ${x1},${y1} -> ${x2},${y2}`)
    // field.forEach(f => console.log(f.join('')))
  })

  return field.flat().filter(x => x >= 2).length
}

/**
 * 
 * @param {array[]} lines
 */
function puzzle1(lines) {
  console.log(`Puzzle 1: ${run(lines)}`)
}
/**
 * 
 * @param {array[]} lines
 */
 function puzzle2(lines) {
  console.log(`Puzzle 2: ${run(lines,true)}`)
}

processLineByLine()
