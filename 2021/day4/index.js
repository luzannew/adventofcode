import { readFile } from '../../aoc.js'

class BingoCard {
  constructor(rows) {
    this.rows = rows
  }

  mark(number) {
    for (var i = 0; i < this.rows.length; i++) {
      const row = this.rows[i]
      const numberIndex = row.indexOf(number)
      if (numberIndex !== -1) {
        row[numberIndex] = '#'

        // Check if we have a winner
        if (row.join('') === '#####' || this.rows.map(x => x[numberIndex]).join('') === '#####') {
          // console.log('Bingo!', this)
          return true
        }
      }
    }

    return false
  }

  sum() {
    return this.rows
      .flat()
      .filter(x => x !== '#')
      .reduce((prev, curr) => prev += curr, 0)
  }
}

async function processLineByLine() {
  const input = await readFile('2021/day4/input.txt')

  const drawNumbers = input[0].split(',').map(Number)
  const bingocards = []
  let bingocard = []
  input.slice(2).forEach(line => {
    if (line === '') {
      if (bingocard.length > 0) {
        bingocards.push(new BingoCard(bingocard))
        bingocard = []
      }
    } else {
      bingocard.push(line.split(' ').filter(x => x !== '').map(Number))
    }
  })

  // Add last bingocard
  bingocards.push(new BingoCard(bingocard))

  puzzle1(drawNumbers, [...bingocards])
  puzzle2(drawNumbers, [...bingocards])
}

/**
 * 
 * @param {number[]} drawNumbers 
 * @param {BingoCard[]} bingocards 
 */
function puzzle1(drawNumbers, bingocards) {
  let winner = null
  let lastCalled = -1
  for (var i = 0; i < drawNumbers.length; i++) {
    const num = drawNumbers[i]
    // console.log('Draw ' + num)
    lastCalled = num
    bingocards.forEach(bingocard => {
      const hasBingo = bingocard.mark(num)
      if (hasBingo && !winner) {
        winner = bingocard
      }
    })

    if (winner) {
      break
    }
  }

  console.log(`Puzzle 1: ${winner.sum() * lastCalled}`)
}

/**
 * 
 * @param {number[]} drawNumbers 
 * @param {BingoCard[]} bingocards 
 */
function puzzle2(drawNumbers, bingocards) {
  let lastWinner = null
  let lastCalled = -1
  for(var i = 0; i < drawNumbers.length; i++) {
    const num = drawNumbers[i]
    if (bingocards.length === 0) {
      break;
    }
    // console.log('Draw ' + num)
    lastCalled = num
    const toRemove = []
    bingocards.forEach(bingocard => {
      const hasBingo = bingocard.mark(num)
      if (hasBingo) {
        lastWinner = bingocard
        toRemove.push(bingocard)
      }
    })

    if (toRemove.length > 0) {
      toRemove.forEach(r => {
        const rIndex = bingocards.indexOf(r)
        bingocards.splice(rIndex, 1)
      })

      // console.log(`${bingocards.length} left`)
    }
  }

  console.log(`Puzzle 1: ${lastWinner.sum() * lastCalled}`)
}

processLineByLine()
