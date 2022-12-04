import { readFile } from '../../aoc'

enum Shape {
  Unknown = 0,
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}
interface Round {
  opponent: string
  us: string
}
async function processLineByLine() {
  const input = await readFile('2022/day2/input.txt')

  const moves: Round[] = input.map(x => {
    const [opponent, _, us] = x.split('')
    
    return { opponent, us }
  })

  puzzle1(moves)
  puzzle2(moves)
}

const getShape = (input: string): Shape => {
  switch (input) {
    case 'A':
    case 'X':
      return Shape.Rock
    case 'B':
    case 'Y':
      return Shape.Paper
    case 'C':
    case 'Z':
      return Shape.Scissors
    default:
      return Shape.Unknown
  }
}

function score(move1: Shape, move2: Shape) {
  if (move1 === Shape.Paper) {
    switch (move2) {
      case Shape.Rock:
        return 6
      case Shape.Scissors:
        return 0
      case Shape.Paper:
        return 3
    }
  }
  if (move1 === Shape.Rock) {
    switch (move2) {
      case Shape.Rock:
        return 3
      case Shape.Scissors:
        return 6
      case Shape.Paper:
        return 0
    }
  }
  if (move1 === Shape.Scissors) {
    switch (move2) {
      case Shape.Rock:
        return 0
      case Shape.Scissors:
        return 3
      case Shape.Paper:
        return 6
    }
  }
  return 0
}

function puzzle1(moves: Round[]) {
  const scoreList = moves.map(({ opponent, us }) => {
    const usShape = getShape(us)
    return usShape + score(usShape, getShape(opponent))
  })
  const totalScore = scoreList.reduce((prev, curr) => prev + curr, 0)
  console.log(totalScore)
}

function puzzle2(moves: Round[]) {
  const scoreList = moves.map(({ opponent, us }) => {
    const opponentShape = getShape(opponent)
    // By default assign 'draw' symbol
    let usShape = opponentShape
    switch (us) {
      case 'X':
        // Lose scenario
        switch (opponentShape) {
          case Shape.Paper:
            usShape = Shape.Rock
            break
          case Shape.Rock:
            usShape = Shape.Scissors
            break
          case Shape.Scissors:
            usShape = Shape.Paper
            break
        }
        break;
      case 'Z':
        // Win scenario
        switch (opponentShape) {
          case Shape.Paper:
            usShape = Shape.Scissors
            break
          case Shape.Rock:
            usShape = Shape.Paper
            break
          case Shape.Scissors:
            usShape = Shape.Rock
            break
        }
        break;
    }
    return usShape + score(usShape, opponentShape)
  })
  
  const totalScore = scoreList.reduce((prev, curr) => prev + curr, 0)
  console.log(totalScore)
}

processLineByLine()
