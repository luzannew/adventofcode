import { readFile } from '../../aoc.js'

async function processLineByLine() {
  const input = await readFile('2021/day9/input.txt')
 
  let map = input.map(i => [...i].map(Number))

  puzzle1(map)
  puzzle2(map)
}

function getLowestPoints(input) {
  const result = []
  for (var row = 0; row < input.length; row++) {
    for (var column = 0; column < input[row].length; column++) {
      const currentHeight = input[row][column]
      // Top. Check out of bounds + if top is lower than current height
      if (row > 0 && input[row-1][column] <= currentHeight) {
        continue
      }

      // Bottom. Check out of bounds + if bottom is lower than current height
      if (row < input.length - 1 && input[row+1][column] <= currentHeight) {
        continue
      }

      // Left. Check out of bounds + if left is lower than current height
      if (column > 0 && input[row][column-1] <= currentHeight) {
        continue
      }

      // Right. Check out of bounds + if right is lower than current height
      if (column < input[row].length - 1 && input[row][column+1] <= currentHeight) {
        continue
      }

      // Found lowest point
      result.push({ height: currentHeight, pos: { row, column }})
    }
  }

  return result
}

function getKeyRC(row, column) {
  return `${row}|${column}`
}

/**
 * 
 * @param {array[]} input
 */
function puzzle1(input) {
  const lowestPoints = getLowestPoints(input)
  const sum = lowestPoints.reduce((acc, curr) => {
    acc += (curr.height + 1)
    return acc
  }, 0)
  console.log(`Puzzle 1: ${sum}`)
}

/**
 * 
 * @param {array[]} input
 */
function puzzle2(input) {
  const lowestPoints = getLowestPoints(input)
  const basinSizes = []

  lowestPoints.forEach(p => {
    const basin = new Map()

    /**
     * 
     * Check if current tile is already added to current basin.
     * If yes: skip processing
     * If no: add it to the basin and check the adjacent tiles
     * 
     * @param {number} row 
     * @param {number} column 
     */
    const checkAdjacentTile = (row, column) => {
      if (basin.has(getKeyRC(row, column)) === false) {
        basin.set(getKeyRC(row, column), 1)
        checkAdjacentTiles(row, column)
      }
    }

    /**
     * 
     * Check if 1 of the adjacent tiles is part of current basin by checking out of bounds + if it is a 9.
     * Locations of height 9 do not count as being in any basin, and all other locations will always be part of exactly one basin.
     * 
     * @param {number} row 
     * @param {number} column 
     */
    const checkAdjacentTiles = (row, column) => {
      // up
      if (row > 0 && input[row-1][column] !== 9) {
        checkAdjacentTile(row-1, column)
      }

      // bottom
      if (row < input.length - 1 && input[row+1][column] !== 9) {
        checkAdjacentTile(row+1, column)
      }

      // left
      if (column > 0 && input[row][column-1] !== 9) {
        checkAdjacentTile(row, column-1)
      }

      // right
      if (column < input[row].length - 1 && input[row][column+1] !== 9) {
        checkAdjacentTile(row, column+1)
      }
    }

    // Add initial starting point
    basin.set(getKeyRC(p.pos.row, p.pos.column), 1)

    // And start checking the other tiles
    checkAdjacentTiles(p.pos.row, p.pos.column)
    // console.log(basin)
    basinSizes.push(basin.size)
  })

  const [top1, top2, top3] = basinSizes.sort((a, b) => b - a)
  console.log(`Puzzle 2: ${top1 * top2 * top3}`)
}

processLineByLine()
