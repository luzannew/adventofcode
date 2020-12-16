async function processLineByLine() {
  tests()
  puzzle1()
  puzzle2()
}

function memoryGame(input, spokenNumber) {
  // Keep a map of each spoken number + the last two turns
  let spoken = new Map()
  input.forEach((x, index) => {
    spoken.set(x, [{
      turn: index + 1
    }])
  })
  let lastNumberSpoken = input[input.length - 1]
  for (let i = spoken.size; i < spokenNumber; i++) {
    const lastSpoken = spoken.get(lastNumberSpoken)

    // If that was the first time the number has been spoken, the current player says 0.
    // Otherwise, the number had been spoken before; the current player announces how many turns apart the number is from when it was previously spoken.
    lastNumberSpoken = lastSpoken.length === 1 ? 0 : lastSpoken[0].turn - lastSpoken[1].turn
    
    // Number spoken before?
    const temp = spoken.get(lastNumberSpoken)
    if (temp) {
      // Yes, add current turn + move 'last' turn to second place
      spoken.set(lastNumberSpoken, [{
        turn: i + 1
      }, temp[0]])
    }
    else {
      // No, create new entry
      spoken.set(lastNumberSpoken, [{
        turn: i + 1
      }])
    }
  }

  return lastNumberSpoken
}

function puzzle1() {
  console.log(`Puzzle 1: ${memoryGame([14,1,17,0,3,20], 2020)}`)
}

function puzzle2() {
  console.log(`Puzzle 2: ${memoryGame([14,1,17,0,3,20], 30000000)}`)
}

function tests () {
  // console.log('1,3,2, the 2020th number spoken is 1', memoryGame([1,3,2], 2020) === 1)
  // console.log('2,1,3, the 2020th number spoken is 10', memoryGame([2,1,3], 2020) === 10)
  // console.log('1,2,3, the 2020th number spoken is 27', memoryGame([1,2,3], 2020) === 27)
  // console.log('2,3,1, the 2020th number spoken is 78', memoryGame([2,3,1], 2020) === 78)
  // console.log('3,2,1, the 2020th number spoken is 438', memoryGame([3,2,1], 2020) === 438)
  // console.log('3,1,2, the 2020th number spoken is 1836', memoryGame([3,1,2], 2020) === 1836)
}

processLineByLine();
