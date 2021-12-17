import { readFile } from '../../aoc.js'

async function processLineByLine() {
  const input = await readFile('2021/day17/input.txt')
  const regex = input[0].match(/target area: x=([0-9]+)\.\.([0-9]+), y=-([0-9]+)\.\.-([0-9]+)/m)

  const targetArea = {
    xStart: Number(regex[1]),
    xEnd: Number(regex[2]),
    yStart: Number(regex[3]) * -1,
    yEnd: Number(regex[4]) * -1,
  }

  puzzle1(targetArea)
  puzzle2(targetArea)
}

function launch (velocityX, velocityY, area) {
  let probePos = [0,0]
  let steps = []

  while(probePos[0] <= area.xEnd && probePos[1] >= area.yStart) {
    const [x, y] = probePos
    probePos = [x + velocityX, y + velocityY]

    steps.push(probePos)
    if (probePos[0] >= area.xStart && probePos[0] <= area.xEnd && probePos[1] >= area.yStart && probePos[1] <= area.yEnd) {
      // console.log('hit target')
      return { hit: true, steps}
    }

    velocityX = Math.max(0, velocityX - 1)
    velocityY -= 1
  }

  return { hit: false, steps}
}

/**
 * 
 * @param {object} area
 */
function puzzle1(area) {
  let maxY = 0
  for(var x = 0; x < area.xStart; x++) {
    for(var y = 0; y < Math.abs(area.yStart); y++) {
      const res = launch(x, y, area)
      if (res.hit) {
        const heighestStep = res.steps.sort((a, b) => b[1] - a[1])[0]
        maxY = Math.max(maxY, heighestStep[1])
        // console.log(`hit with ${x},${y} and max Y=${heighestStep[1]}`);
      }
    }
  }  

  console.log(`Puzzle 1: ${maxY}`)
}
/**
 * 
 * @param {object} area
 */
 function puzzle2(area) {
  const hits = []
  for(var x = 0; x <= area.xEnd; x++) {
    for(var y = area.yStart; y <= Math.abs(area.yStart); y++) {
      const res = launch(x, y, area)
      if (res.hit) {
        hits.push([x, y])
      }
    }
  }

  console.log(`Puzzle 2: ${hits.length}`)
}

processLineByLine()
