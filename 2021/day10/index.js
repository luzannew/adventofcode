import { readFile } from '../../aoc.js'

const startingChars = ['(', '[', '{', '<']
const endingChars = [')', ']', '}', '>']

function process(input) {
  return input.map(l => {
    const acc = []
    for (var i = 0; i < l.length; i++) {
      const curr = l[i]

      if (startingChars.indexOf(curr) >= 0) {
        acc.push(curr)
      } else {
        const lastChar = acc.pop()

        // Get expected char based on last char
        var expectedChar = endingChars[startingChars.indexOf(lastChar)]
        if (expectedChar !== curr) {
          // console.log(`${l.join('')} - Expected ${expectedChar}, but found ${curr} instead`)
          return {
            invalid: true,
            lastChar: curr
          }
        }
      }
    }

    // Left over chars, fix incomplete string
    if (acc.length > 0) {
      let completionString = ''
      while(acc.length !== 0) {
        var char = acc.pop()
        completionString += endingChars[startingChars.indexOf(char)]
      }
      // console.log(`${l.join('')} - Complete by adding ${completionString}`)
      return {
        incomplete: true,
        completionString
      }
    }
  })
}

async function processLineByLine() {
  const input = await readFile('2021/day10/input.txt')
 
  let map = input.map(i => [...i])

  const processed = process(map)

  puzzle1(processed)
  puzzle2(processed)
}

/**
 * 
 * @param {array} input
 */
function puzzle1(input) {
  const scoreList = [3, 57, 1197, 25137]
  let score = 0
  input
    .filter(x => x.invalid)
    .forEach(x => {
      score += scoreList[endingChars.indexOf(x.lastChar)]
    })
  
  console.log(`Puzzle 1: ${score}`)
}
/**
 * 
 * @param {array} input
 */
 function puzzle2(input) {
  const scoreList = [1, 2, 3, 4]
  let scores = []
  input
    .filter(x => x.incomplete)
    .forEach(x => {
      scores.push([...x.completionString].reduce((points, curr) => {
        points *= 5
        points += scoreList[endingChars.indexOf(curr)]
        // console.log(acc)
        return points
      }, 0))
    })

  const sortedScores = scores.sort((a, b) => a - b)
  const middleScore = sortedScores[Math.floor(scores.length / 2)]
  console.log(`Puzzle 2: ${middleScore}`)
}

processLineByLine()
