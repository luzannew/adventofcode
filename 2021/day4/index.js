import { readFile } from '../../aoc.js'

async function processLineByLine() {
  const input = await readFile('2021/day4/input.txt')

  const drawNumbers = input[0].split(',').map(Number)
  const bingocards = []
  let bingocard = []
  input.slice(2).forEach(line => {
    if (line === '') {
      if (bingocard.length > 0) {
        bingocards.push(bingocard)
        bingocard = []
      }
    } else {
      bingocard.push(line.split(' ').filter(x => x !== '').map(Number))
    }
  })

  // Add last bingocard
  bingocards.push(bingocard)

  // puzzle1(drawNumbers, [...bingocards])
  puzzle2(drawNumbers, [...bingocards])
}

function puzzle1(drawNumbers, bingocards) {
  let winner = null
  let lastCalled = -1
  drawNumbers.forEach(num => {
    if (winner) {
      return;
    }
    lastCalled = num
    bingocards.forEach(bingocard => {
      bingocard.forEach(row => {
        const numberIndex = row.indexOf(num)
        if (numberIndex !== -1) {
          row[numberIndex] = '#'

          // Check if we have a winner
          if(row.join('') === '#####' || bingocard.map(x => x[numberIndex]).join('') === '#####') {
            console.log('Winner!', bingocard)
            winner = bingocard
          }
        }
      })
    })
  })

  const sum = winner.flat().filter(x => x !== '#').reduce((prev, curr) => prev += curr, 0)

  console.log(`Puzzle 1: ${sum * lastCalled}`)
}

/**
 * 
 * @param {array} drawNumbers 
 * @param {array} bingocards 
 */
function puzzle2(drawNumbers, bingocards) {
  let lastWinner = null
  let lastCalled = -1
  let toRemove = []
  drawNumbers.forEach(num => {
    if (bingocards.length === 0) {
      return
    }
    console.log('Draw ' + num)
    lastCalled = num
    toRemove = []
    bingocards.forEach(bingocard => {
      bingocard.forEach(row => {
        const numberIndex = row.indexOf(num)
        if (numberIndex !== -1) {
          row[numberIndex] = '#'

          // Check if we have a winner
          if (row.join('') === '#####' || bingocard.map(x => x[numberIndex]).join('') === '#####') {
            console.log('Winner!', bingocard)
            lastWinner = bingocard
            toRemove.push(bingocard)
          }
        }
      })
    })

    if (toRemove.length > 0) {
      toRemove.forEach(r => {
        const rIndex = bingocards.indexOf(r)
        bingocards.splice(rIndex, 1)
      })

      console.log(`${bingocards.length} left`)
    }
  })

  const sum = lastWinner.flat().filter(x => x !== '#').reduce((prev, curr) => prev += curr, 0)

  console.log(`Puzzle 2: ${sum * lastCalled}`)
}

processLineByLine()
