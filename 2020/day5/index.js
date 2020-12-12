import { readFile } from '../../aoc.js'

async function processLineByLine() {
  const input = await readFile('2020/day5/input.txt')

  const seatIds = []
  for (const boardingpass of input) {
    // seatIds.push(getSeatId(boardingpass))
    seatIds.push(getSeatIdBinary(boardingpass))
  }

  puzzle1(seatIds)
  puzzle2(seatIds)
}

// eslint-disable-next-line no-unused-vars
function getSeatId (data) {
  let rowRange = [0, 127]
  let seatRange = [0, 7]
  for (const dir of data) {
    switch (dir) {
      case 'F':
        rowRange = [rowRange[0], rowRange[1] - Math.ceil((rowRange[1] - rowRange[0]) / 2)]
        break;
      case 'B':
        rowRange = [rowRange[0] + Math.ceil((rowRange[1] - rowRange[0]) / 2), rowRange[1]]
        break;
      case 'L':
        seatRange = [seatRange[0], seatRange[1] - Math.ceil((seatRange[1] - seatRange[0]) / 2)]
        break;
      case 'R':
        seatRange = [seatRange[0] + Math.ceil((seatRange[1] - seatRange[0]) / 2), seatRange[1]]
        break;
      default:
        break;
    }
  }
  return rowRange[0] * 8 + seatRange[0]
}

function getSeatIdBinary (boardingpass) {
  return parseInt([...boardingpass].map((c) => (c === 'B' || c === 'R' ? 1 : 0)).join(''), 2)
}

function puzzle1(seatIds) {
  console.log('Puzzle 1: ' + Math.max(...seatIds))
}

function puzzle2(seatIds) {
  const sortedSeats = seatIds.sort((a, b) => a - b)
  
  // Find the next empty seat by checking if there is an empty seat behind the current one
  for (let i = 0; i < sortedSeats.length; i++) {
    const isSeatEmptyAfter = sortedSeats[i+1] - sortedSeats[i] !== 1
    if (isSeatEmptyAfter) {
      console.log('Puzzle 2: ' + (sortedSeats[i] + 1))
      break;
    }
  }
}

processLineByLine();
