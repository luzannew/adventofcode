import { readFile } from '../../aoc.js'

function print(coords) {
  let maxX = 0
  let maxY = 0

  coords.forEach(line => {
    const {x, y} = line
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
  })

  for (var y = 0; y <= maxY; y++) {
    let printString = ''
    for (var x = 0; x <= maxX; x++) {
      if (coords.filter(c => c.x === x && c.y === y).length !== 0) {
        printString += '#'
      } else {
        printString += '.'
      }
    }

    console.log(printString)
  }
}

function fold(coords, folds) {
  let workingset = [...coords]
  folds.forEach(fold => {
    const [direction, p] = fold.split('=')
    const foldingLine = Number(p)

    workingset = workingset.map(c => {
      // direction contains x or y
      if (c[direction] > foldingLine) {
        return {
          ...c,
          [direction]: foldingLine - (c[direction] - foldingLine)
        }
      }

      return c
    })

    // console.log(`Fold: ${fold}`)
    // print(workingset)
  })

  return workingset
}

async function processLineByLine() {
  const input = await readFile('2021/day13/input.txt')

  const coords = []
  const folds = []
 
  input.forEach(i => {
    if (i.indexOf('fold along') !== -1) {
      folds.push(i.replace('fold along ', ''))
    } else if(i === '') {
      return
    } else {
      const [x, y] = i.split(',').map(Number)
      coords.push({ x, y })
    }
  })

  puzzle1(coords, folds.slice(0, 1))
  puzzle2(coords, folds)
}

/**
 * 
 * @param {array[]} input
 * @param {array} folds
 */
function puzzle1(coords, folds) {
  const result = fold(coords, folds)

  let unique = [...new Set(result.map(x => `${x.x}-${x.y}`))];
  
  console.log(`Puzzle 1: ${unique.length}`)
}
/**
 * 
 * @param {array[]} input
 * @param {array} folds
 */
 function puzzle2(coords, folds) {
  const result = fold(coords, folds)

  print(result)
  
  console.log(`Puzzle 2: Read above text`)
}

processLineByLine()
