import { readFile } from "../aoc.js";

async function processLineByLine() {
  let input = await readFile('2020/day11.txt')
  input = input.map(line => line.split(''))

  puzzle1(JSON.parse(JSON.stringify(input)))
  puzzle2(JSON.parse(JSON.stringify(input)))
}

function getOccupiedAdjacentSeats (input, row, column) {
  let occupied = 0
  // Get row above
  if (row - 1 >= 0) {
    const topRow = input[row - 1]
    topRow[column-1] === '#' && occupied++
    topRow[column] === '#' && occupied++
    topRow[column+1] === '#' && occupied++
  }
  // Left and right
  const sameRow = input[row]
  sameRow[column-1] === '#' && occupied++
  sameRow[column+1] === '#' && occupied++

  // Bottom row
  if (row + 1 <= input.length - 1) {
    const bottomRow = input[row + 1]
    bottomRow[column-1] === '#' && occupied++
    bottomRow[column] === '#' && occupied++
    bottomRow[column+1] === '#' && occupied++
  }

  return occupied
}

function getOccupiedVisibleSeats (input, row, column) {
  const freeSeatInDirection = (directionY, directionX) => {
    let searchRow = row
    let searchColumn = column
    let searching = true
    let isOccupied = false
    while (searching === true) {
      searchRow += directionY
      searchColumn += directionX

      // Check if we are going out of bounds
      if (searchRow < 0 || searchRow > input.length - 1) {
        isOccupied = false
        break
      } else if (searchColumn < 0 || searchColumn > input[row].length - 1) {
        isOccupied = false
        break
      }

      // See if we have a occupied or free seat (ignore floor (.))
      const seat = input[searchRow][searchColumn]
      if (seat === 'L') {
        isOccupied = false
        searching = false
        break
      } else if (seat === '#') {
        isOccupied = true
        searching = false
        break
      }
    }


    return isOccupied
  }
  
  let occupied = 0
  freeSeatInDirection(-1, -1) && occupied++ // top left  
  freeSeatInDirection(-1, 0) && occupied++ // top
  freeSeatInDirection(-1, 1) && occupied++ // top right
  freeSeatInDirection(0, -1) && occupied++ // left
  freeSeatInDirection(0, 1) && occupied++ // right
  freeSeatInDirection(1, -1) && occupied++ // bottom left
  freeSeatInDirection(1, 0) && occupied++ // bottom
  freeSeatInDirection(1, 1) && occupied++ // bottom right

  return occupied
}

function solve(input, occupiedSeatFunc, thresholdLeaveSeat) {
  let seatsChanged = true
  while (seatsChanged === true) {
    const copy = JSON.parse(JSON.stringify(input))
    let seatsChangedCurrentRound = false

    for (let row = 0; row < copy.length; row++) {
      for (let column = 0; column < copy[0].length; column++) {
        const currentSeat = copy[row][column]
        if (currentSeat === '.') {
          continue
        }
        const occupiedSeats = occupiedSeatFunc(copy, row, column)        
        if (currentSeat === 'L' && occupiedSeats === 0) {
          // If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
          input[row][column] = '#'
          seatsChangedCurrentRound = true
        } else if (currentSeat === '#' && occupiedSeats >= thresholdLeaveSeat) {
          // If a seat is occupied (#) and more then {thresholdLeaveSeat} seats adjacent to it are also occupied, the seat becomes empty.
          input[row][column] = 'L'
          seatsChangedCurrentRound = true
        }
      }
    }
    seatsChanged = seatsChangedCurrentRound
  }

  // Count rows that are occupied
  const totalSeatsOccupied = input.reduce((prev, current) => {
    const seatsInThisRowOccupied = current.join('').match(new RegExp("#", "g")) || []
    prev += seatsInThisRowOccupied.length
    return prev
  }, 0)
  return totalSeatsOccupied
}

function puzzle1(input) {
  const totalSeatsOccupied = solve(input, getOccupiedAdjacentSeats, 4)
  console.log(`Puzzle 1: ${totalSeatsOccupied}`)
}

function puzzle2(input) {
  const totalSeatsOccupied = solve(input, getOccupiedVisibleSeats, 5)
  console.log(`Puzzle 2: ${totalSeatsOccupied}`)
}

processLineByLine();
