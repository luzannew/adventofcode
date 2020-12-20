import { readFile } from '../../aoc.js'

const seamonster = [
  "                  # ".split(''),
  "#    ##    ##    ###".split(''),
  " #  #  #  #  #  #   ".split('')
]

const rotate = array => array[0].map((_, colIndex) => array.map(row => row[colIndex]).reverse())
const transpose = array => array[0].map((_, colIndex) => array.map(row => row[colIndex]))
const reverseString = string => string.split('').reverse().join('')

class Tile {
  constructor(id) {
    this.id = id
    this.tiles = []
    this.matchingTiles = []
    this.fitted = false
  }

  addTileLine(line) {
    this.tiles.push(line.split(''))
  }

  generateEdges() {
    this.top = [...this.tiles[0]].join('')
    this.right = this.tiles.map(x => x[x.length - 1]).join('')
    this.bottom = [...this.tiles[this.tiles.length - 1]].join('')
    this.left = this.tiles.map(x => x[0]).join('')

    this.flippedtop = `${this.left}`
    this.flippedright = `${this.bottom}`
    this.flippedbottom = `${this.right}`
    this.flippedleft = `${this.top}`

    this.edges = [
      this.top, this.right, this.bottom, this.left,
      reverseString(`${this.top}`), reverseString(`${this.right}`), reverseString(`${this.bottom}`), reverseString(`${this.left}`)
    ]
  }

  rotate () {
    this.tiles = rotate(this.tiles)
    this.generateEdges()
  }

  flip () {
    this.tiles = transpose(this.tiles)
    this.generateEdges()
  }

  adjacentTile (otherTile) {
    this.edges.forEach((edge) => {
      const foundEdgeIndex = otherTile.edges.findIndex(e => e === edge)
      if (foundEdgeIndex >= 0 && this.matchingTiles.indexOf(otherTile.id) === -1) {
        this.matchingTiles.push(otherTile.id)
      }
    })
  }

  fit (otherTile) {
    const processMatch = (direction, otherDirection) => {
      if (this[direction] === otherTile[`flipped${otherDirection}`]) {
        otherTile.flip()
        while (this[direction] !== otherTile[otherDirection]) {
          otherTile.rotate()
        }
      } else if (this[direction] !== otherTile[otherDirection]) {
        return false
      }

      this[`matched${direction}tile`] = otherTile.id
      otherTile[`matched${otherDirection}tile`] = this.id
      return true
    }
    for (let i = 0; i < 4; i++) {
      if (processMatch('top', 'bottom') || 
          processMatch('right', 'left') ||
          processMatch('bottom', 'top') || 
          processMatch('left', 'right')) {
        break;
      }

      otherTile.rotate()
    }
  }
}

async function processLineByLine() {
  let input = await readFile('2020/day20/input.txt')

  const images = []
  let currentTile = null
  input.forEach(line => {
    if (line.startsWith('Tile ')) {
      currentTile = new Tile(Number(line.substring(5, 9)))
    } else if (line === '') {
      currentTile.generateEdges()
      images.push(currentTile)
    } else {
      currentTile.addTileLine(line)
    }
  })

  currentTile.generateEdges()
  images.push(currentTile)

  // Prepare list with adjacent tiles
  images.forEach(tile => {
    const otherTiles = images.filter(x => x.id !== tile.id)
    otherTiles.forEach(otherTile => tile.adjacentTile(otherTile))
    console.log('Tile ' + tile.id + ' found ' + tile.matchingTiles.length + ' adjacent tiles')
  })

  puzzle1(images)
  puzzle2(images)
}

function puzzle1(input) {
  const corners = input.filter(tile => tile.matchingTiles.length === 2)
  console.log(`Puzzle 1: ${corners[0].id * corners[1].id * corners[2].id * corners[3].id}`)
}

function findSeamonster(image, x, y, replace = false) {
  let foundSeaMonster = true

  for (let sy = 0; sy < seamonster.length; sy++) {
    for (let sx = 0; sx < seamonster[sy].length; sx++) {
      const seamonsterchar = seamonster[sy][sx]
      if (seamonsterchar === '#') {
        if (image[y+sy][x+sx] === '#') {
          if (replace) {
            image[y+sy][x+sx] = 'X'
          }
        }
        else {
          foundSeaMonster = false
          break;
        }
      }
    }
    if (foundSeaMonster === false) {
      break
    }
  }

  return foundSeaMonster
}

function puzzle2(input) {
  const corners = input.filter(tile => tile.matchingTiles.length === 2)
  const firstCorner = corners[0]

  const findMatchingTiles = (tile) => {
    tile.matchingTiles.forEach(matchingTileId => {
      const otherTile = input.find(x => x.id === matchingTileId)
      tile.fit(otherTile)
      // Remove this id from other tiles
      input.forEach(x => {
        x.matchingTiles = x.matchingTiles.filter(x => x !== matchingTileId)
      })
      findMatchingTiles(otherTile)
    })
  }

  findMatchingTiles(firstCorner)

  // Build actual image by rotating/flipping tiles
  let start = corners.find(x => x.matchedbottomtile != null && x.matchedrighttile != null)
  const totalimage = []

  while (start != null) {
    let right = start
    const tiles = [start.tiles]
    while (right != null) {
      right = input.find(x => x.id === right.matchedrighttile)
      if (right) {
        tiles.push(right.tiles)
      }
    }

    start = input.find(x => x.id === start.matchedbottomtile)
    
    totalimage.push(tiles)
  }
  
  let actualImage = []
  // Remove borders from image
  totalimage.forEach(row => {
    for (let x = 1; x < row[0].length - 1; x++) {
      let rowArray = []
      for (let y = 0; y < row.length; y++) {
        rowArray.push(row[y][x].join('').substring(1, 9))
      }
      actualImage.push(rowArray.join('').split(''))
    }
  })

  let seaMonsterLocations = []
  let rotateStep = 0

  while (seaMonsterLocations.length === 0) {
    for (let y = 0; y < actualImage.length - seamonster.length; y++) {
      for (let x = 0; x < actualImage[y].length - seamonster[0].length; x++) {
        let foundSeaMonster = findSeamonster(actualImage, x, y, false)
        if (foundSeaMonster) {
          seaMonsterLocations.push([x, y])
        }
      }
    }

    // Monster not found, try to rotate/flip the image
    if (seaMonsterLocations.length === 0) {
      if (rotateStep === 270) {
        actualImage = transpose(actualImage)
        rotateStep = 0
      } else {
        actualImage = rotate(actualImage)
        rotateStep += 90
      }
    }
  }

  // Replace the monster locations with an 'X' so it won't be counted as habitat
  seaMonsterLocations.forEach(location => {
    findSeamonster(actualImage, location[0], location[1], true)
  })

  const habitatCount = actualImage.reduce((prev, curr) => {
    prev += curr.filter(x => x === '#').length
    return prev
  }, 0)
  console.log(`Puzzle 2: ${habitatCount}`)
}

processLineByLine();
