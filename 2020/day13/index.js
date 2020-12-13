import { readFile } from '../../aoc.js'

async function processLineByLine() {
  let input = await readFile('2020/day13/input.txt')

  const department = Number(input[0])
  const buslines = input[1]
    .split(',')
    .map(x => x === 'x' ? x : Number(x))

  puzzle1(department, buslines)
  puzzle2(buslines)
}

function puzzle1(department, buslines) {
  let departments = []
  buslines.forEach(busId => {
    if (busId === 'x') {
      return
    }
    let calc = busId
    // Increase until bus ID exceeds our department time
    while(calc < department) {
      calc += busId
    }
    departments.push({ busId, leave: calc })
  })

  // Sort ascending to find first bus to leave
  departments = departments.sort((a, b) => a.leave - b.leave)

  const firstbus = departments[0]
  const needToWait = firstbus.leave - department
  
  console.log(`Puzzle 1: ${needToWait * firstbus.busId}`)
}

function puzzle2(buslines) {
  // Setup first jump and remove it from the initial array
  let jump = buslines[0]
  buslines = buslines.slice(1)

  const start = Date.now()
  let bussesMatched = 1
  for (let t = jump; t < Number.MAX_VALUE; t += jump) {
    const subsequent = buslines.every((busId) => {
      if (busId === 'x') {
        // Skip 'x' and remove from list
        bussesMatched++
        buslines = buslines.slice(1)
        return true
      }
      if ((t + bussesMatched) % busId === 0) {
        // We found a bus which leaves at t + index
        bussesMatched++
        buslines = buslines.slice(1)
        // Increase jump distance since there is a pattern after each bus
        jump *= busId
        return true
      }
      return false
    })

    if (subsequent) {
      console.log(`Puzzle 2: ${t}, took ${Date.now() - start}ms`)
      break
    }
  }
}

processLineByLine();
