import { readFile } from '../../aoc.js'

const DEBUG = false

function debug(message) {
  DEBUG && console.log(message)
}

async function processLineByLine() {
  const input = await readFile('2020/day22/input.txt')

  const split = input.indexOf('')
  const player1 = input.slice(1, split).map(Number)
  const player2 = input.slice(split + 2, input.length).map(Number)

  puzzle1([...player1], [...player2])
  puzzle2([...player1], [...player2])
}

/**
 * 
 * @param {Number} game 
 * @param {Array} player1 
 * @param {Array} player2 
 */
function playgame(simple, game, player1, player2) {
  debug(`=== Game ${game} ===`)
  const cache = new Set()
  let round = 0
  while(player1.length > 0 && player2.length > 0) {
    round++
    debug(`-- Round ${round} (Game ${game}) --`)
    debug(`Player 1's deck: ${player1.join(', ')}`)
    debug(`Player 2's deck: ${player2.join(', ')}`)

    if (simple === false) {
      const key = `${player1.join(',')}-${player2.join(',')}`
      if (cache.has(key)) {
        debug(`Infinite game detected! Player 1 is the winner of this game ${game}`)
        return {
          winner: 1,
          cards: player1
        }
      } else {
        cache.add(key)
      }
    }
    const [player1card] = player1.splice(0, 1)
    const [player2card] = player2.splice(0, 1)
    debug(`Player 1 plays: ${player1card}`)
    debug(`Player 2 plays: ${player2card}`)

    let player1wins = false
    if (simple === false && player1.length >= player1card && player2.length >= player2card) {
      debug('Playing a sub-game to determine the winner...')
      player1wins = playgame(simple, game + 1, [...player1.slice(0, player1card)], [...player2.slice(0, player2card)]).winner === 1
    } else {
      player1wins = player1card > player2card
    }

    if (player1wins) {
      debug(`Player 1 wins round ${round} of game ${game}!`)
      player1.push(player1card)
      player1.push(player2card)
    } else {
      debug(`Player 2 wins round ${round} of game ${game}!`)
      player2.push(player2card)
      player2.push(player1card)
    }
    debug('')
  }
  const winner = player1.length > 0 ? 1 : 2
  debug(`The winner of game ${game} is player ${winner}!`)
  debug('')
  return {
    winner: winner,
    cards: winner === 1 ? player1 : player2
  }
}

/**
 * 
 * @param {Array} player1 
 * @param {Array} player2 
 */
function puzzle1(player1, player2) {
  const result = playgame(true, 1, player1, player2)
  const score = result.cards.reverse().reduce((acc, curr, index) => {
    acc += curr * (index + 1)
    return acc
  })
  console.log(`Puzzle 1: ${score}`)
}

/**
 * 
 * @param {Array} player1 
 * @param {Array} player2 
 */
function puzzle2(player1, player2) {
  const result = playgame(false, 1, player1, player2)
  const score = result.cards.reverse().reduce((acc, curr, index) => {
    acc += curr * (index + 1)
    return acc
  })
  console.log(`Puzzle 2: ${score}`)
}

processLineByLine();
