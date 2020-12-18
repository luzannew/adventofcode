import { readFile } from '../../aoc.js'

async function processLineByLine() {
  let input = await readFile('2020/day17/input.txt')
  input = input.map(line => line.split(''))

  puzzle1(JSON.parse(JSON.stringify(input)))
  puzzle2(JSON.parse(JSON.stringify(input)))
}

function getNeighbours3d(xOrg, yOrg, zOrg, map) {
  const result = [];
  for (let x = xOrg - 1; x <= xOrg + 1; x++) {
    for (let y = yOrg - 1; y <= yOrg + 1; y++) {
      for (let z = zOrg - 1; z <= zOrg + 1; z++) {
        if (x != xOrg || y != yOrg || z != zOrg) {
          const key = [x, y, z].join(',')
          result.push(map.has(key) ? map.get(key) : false);
        }
      }
    }
  }
  return result;
}

function getNeighbours4d(xOrg, yOrg, zOrg, wOrg, map) {
  const result = [];
  for (let x = xOrg - 1; x <= xOrg + 1; x++) {
    for (let y = yOrg - 1; y <= yOrg + 1; y++) {
      for (let z = zOrg - 1; z <= zOrg + 1; z++) {
        for (let w = wOrg - 1; w <= wOrg + 1; w++) {
          if (x != xOrg || y != yOrg || z != zOrg || w != wOrg) {
            const key = [x, y, z, w].join(',')
            result.push(map.has(key) ? map.get(key) : false);
          }
        }
      }
    }
  }
  return result;
}

function process(x, y, z, w, map, newState, fourthDimension) {
  const neighbours = fourthDimension ? getNeighbours4d(x, y, z, w, map) : getNeighbours3d(x, y, z, map)
  const activeCubes = neighbours.filter(x => x).length
  const key = (fourthDimension ? [x,y,z,w] : [x,y,z]).join(',')
  const isActive = map.has(key) ? map.get(key) : false
  if (isActive && activeCubes !== 2 && activeCubes !== 3) {
    newState.set(key, false)
  } else if (!isActive && activeCubes === 3) {
    newState.set(key, true)
  } else {
    newState.set(key, isActive)
  }
}

function solve(input, fourthDimension) {
  let map = new Map();

  // Setup map with all ids
  input.forEach((line, y) => {
    line.forEach((value, x) => {
      const id = (fourthDimension ? [x, y, 0, 0] : [x, y, 0]).join(',');
      map.set(id, value === '#');
    })
  })  

  for (let cycle = 1; cycle <= 6; cycle++) {
    console.log('Cycle ' + cycle)
    let xMin = null, yMin = null, zMin = null, wMin = null, xMax = null, yMax = null, zMax = null, wMax = null

    for (const key of map.keys()) {
      const [x,y,z,w] = key.split(',').map(x => parseInt(x))
      if (x < xMin) xMin = x
      if (y < yMin) yMin = y
      if (z < zMin) zMin = z
      if (w < wMin && fourthDimension) wMin = w
      if (x > xMax) xMax = x
      if (y > yMax) yMax = y
      if (z > zMax) zMax = z
      if (w > wMax && fourthDimension) wMax = w
    }

    const newState = new Map()

    for (let x = xMin - 1; x <= xMax + 1; x++) {
      for (let y = yMin - 1; y <= yMax + 1; y++) {
        for (let z = zMin - 1; z <= zMax + 1; z++) {
          if (fourthDimension) {
            for (let w = wMin - 1; w <= wMax + 1; w++) {
              process(x, y, z, w, map, newState, true)
            }
          } else {
            process(x, y, z, null, map, newState, false)
          }
        }
      }
    }
    
    map = newState;
  }

  // Count number of active cubes
  let activeCubes = 0;
  map.forEach(cube => {
    if (cube) {
      activeCubes++
    }
  })

  return activeCubes
}


function puzzle1(input) {
  const activeCubes = solve(input, false)
  console.log(`Puzzle 1: ${activeCubes}`)
}

function puzzle2(input) {
  const activeCubes = solve(input, true)
  console.log(`Puzzle 2: ${activeCubes}`)
}

processLineByLine();
