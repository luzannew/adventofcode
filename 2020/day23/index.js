function processLineByLine() {
  // const input = '389125467'.split('').map(Number) // test input
  const input = new Int32Array('614752839'.split('').map(Number)) // puzzle input

  puzzle1([...input])
  puzzle2([...input])
}

function findDestinationCup (input, currentCup) {
  let cupSelection = currentCup - 1
  let destinationCup = null
  let found = false
  while (found === false) {
    destinationCup = input[input.indexOf(cupSelection)]
    if (destinationCup && currentCup !== destinationCup) {
      found = true
    } else {
      cupSelection--
      if (cupSelection < 1) {
        cupSelection = input.length
      }
    }
  }

  return destinationCup
}

function crabCupsGame(input, moves) {
  let currentCupIndex = 0
  for (let round = 1; round <= moves; round++) {
    const currentCup = input[currentCupIndex]

    const correction = Math.min(currentCupIndex, 3)
    if (correction !== 0) {
      const move = input.splice(0, correction)
      input.splice(input.length, 0, ...move)
    }

    const pickup = input.splice(currentCupIndex + 1 - correction, 3)

    const destination = findDestinationCup(input, currentCup)
    const destinationIndex = input.indexOf(destination)
    input.splice(destinationIndex + 1, 0, ...pickup)

    if (correction !== 0 && destinationIndex + correction > currentCupIndex) {
      const move = input.splice(input.length - correction, correction)
      input.splice(0, 0, ...move)
    }

    currentCupIndex++
    if (currentCupIndex >= input.length) {
      currentCupIndex -= input.length
    }
  }
}

/**
 * 
 * @param {Array} input 
 */
function puzzle1(input) {
  crabCupsGame(input, 100, false)

  const index1 = input.findIndex(x => x === 1)
  const move = input.splice(0, index1)
  input.splice(input.length, 0, ...move)
  input.shift() // Remove the 1
  console.log(`Puzzle 1: ${input.join('')}`)
}

function crabGame2(input, cupsAmount, moves) {
  let next = new Int32Array(cupsAmount);
  let prev = new Int32Array(cupsAmount);

  // Prefill and setup a reference to the next/previous cup
  for (let i = 0; i < cupsAmount; i++) {
      next[i] = i + 1;
      prev[i] = i - 1;
  }
  next[cupsAmount - 1] = 0;
  prev[0] = cupsAmount - 1;

  // Add the input + update references
  let current = cupsAmount - 1;
  input.forEach(cup => {
    cup = cup - 1
    next[prev[cup]] = next[cup];
    prev[next[cup]] = prev[cup];
    next[cup] = next[current];
    prev[cup] = current;
    prev[next[current]] = cup;
    next[current] = cup;
    current = cup;
  })

  // Now play the game
  current = cupsAmount - 1;
  let round = 1
  while (round <= moves) {
    current = next[current];

    // Pick three cups
    let firstCup = next[current];
    let secondCup = next[firstCup];
    let thirdCup = next[secondCup];

    // Update references for the current cup and the cup after the 'pickup'
    next[current] = next[thirdCup];
    prev[next[thirdCup]] = current;

    // Get destination
    let destination = current - 1;
    if (destination < 0) {
      destination = cupsAmount - 1
    }
    // Destination cannot be the 'pickup' cups
    while (destination == firstCup || destination == secondCup || destination == thirdCup) {
      destination = destination == 0 ? cupsAmount - 1 : destination - 1;
    }

    // Move pickup cups to the new destination and update references
    next[thirdCup] = next[destination];
    prev[firstCup] = destination;
    prev[next[destination]] = thirdCup;
    next[destination] = firstCup;

    round++
  }

  // Get the two cups after cup 1 (index 0 = cup 1)
  const cup1 = next[0] + 1
  const cup2 = next[next[0]] + 1

  return { cup1, cup2 }
}

function puzzle2(input) {
  const { cup1, cup2 } = crabGame2(input, 1_000_000, 10_000_000)
  console.log(`Puzzle 2: ${cup1 * cup2}`)
}

processLineByLine();
