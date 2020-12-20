import { readFile } from '../../aoc.js'

const seamonster = [
  "                  # ".split(''),
  "#    ##    ##    ###".split(''),
  " #  #  #  #  #  #   ".split('')
]

class Tile {
  constructor() {
    this.id = null
    this.tiles = []
    this.matchingTiles = []
    this.fitted = false
  }
  setId(id) {
    this.id = id
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
      this.top,
      this.right,
      this.bottom,
      this.left,
      [...this.top].reverse().join(''),
      [...this.right].reverse().join(''),
      [...this.bottom].reverse().join(''),
      [...this.left].reverse().join('')
    ]
  }

  rotate () {
    this.tiles = this.tiles[0].map((_, colIndex) => this.tiles.map(row => row[colIndex]).reverse())
    this.generateEdges()
  }

  flip () {
    this.tiles = this.tiles[0].map((_, colIndex) => this.tiles.map(row => row[colIndex]))
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
    for (let i = 0; i < 4; i++) {
      if (this.top === otherTile.bottom) {
        this.matchedtoptile = otherTile.id
        otherTile.matchedbottomtile = this.id
        this.fitted = true
        return
      } else if (this.top === otherTile.flippedbottom) {
        otherTile.flip()
        while (this.top !== otherTile.bottom) {
          otherTile.rotate()
        }
        this.matchedtoptile = otherTile.id
        otherTile.matchedbottomtile = this.id
        this.fitted = true
        return
      } else if (this.right === otherTile.left) {
        this.matchedrighttile = otherTile.id
        otherTile.matchedlefttile = this.id
        this.fitted = true
        return
      } else if (this.right === otherTile.flippedleft) {
        otherTile.flip()
        while(this.right !== otherTile.left) {
          otherTile.rotate()
        }
        this.matchedrighttile = otherTile.id
        otherTile.matchedlefttile = this.id
        this.fitted = true
        return
      } else if (this.bottom === otherTile.top) {
        this.matchedbottomtile = otherTile.id
        otherTile.matchedtoptile = this.id
        this.fitted = true
        return
      } else if (this.bottom === otherTile.flippedtop) {
        otherTile.flip()
        while(this.bottom !== otherTile.top) {
          otherTile.rotate()
        }
        this.matchedbottomtile = otherTile.id
        otherTile.matchedtoptile = this.id
        this.fitted = true
        return
      } else if (this.left === otherTile.right) {
        this.matchedlefttile = otherTile.id
        otherTile.matchedrighttile = this.id
        this.fitted = true
        return
      } else if (this.left === otherTile.flippedright) {
        otherTile.flip()
        while(this.left !== otherTile.right) {
          otherTile.rotate()
        }
        this.matchedlefttile = otherTile.id
        otherTile.matchedrighttile = this.id
        this.fitted = true
        return
      }

      otherTile.rotate()
    }
  }
}

async function processLineByLine() {
  let input = await readFile('2020/day20/input.txt')

  const images = []
  let currentTile = new Tile()
  input.forEach(line => {
    if (line.startsWith('Tile ')) {
      currentTile.setId(Number(line.substring(5, 9)))
    } else if (line === '') {
      currentTile.generateEdges()
      images.push(currentTile)
      currentTile = new Tile()
    } else {
      currentTile.addTileLine(line)
    }
  })

  currentTile.generateEdges()
  images.push(currentTile)

  puzzle1(images)
  puzzle2(images)
}

function puzzle1(input) {
  input.forEach(tile => {
    // console.log('Check tile ' + tile.id)
    const otherTiles = input.filter(x => x.id !== tile.id)
    otherTiles.forEach(otherTile => tile.adjacentTile(otherTile))
    console.log('Tile ' + tile.id + ' found ' + tile.matchingTiles.length + ' adjacent tiles')
  })

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
          continue
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

const rotate = (array) => array[0].map((_, colIndex) => array.map(row => row[colIndex]).reverse())
const transpose = (array) => array[0].map((_, colIndex) => array.map(row => row[colIndex]))

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
  // Remove borders from image + log image to debug
  totalimage.forEach(row => {
    for (let x = 1; x < row[0].length - 1; x++) {
      let rowStr = []
      for (let y = 0; y < row.length; y++) {
        rowStr.push(row[y][x].join('').substring(1, 9))
      }

      actualImage.push(rowStr.join('').split(''))
      // console.log(rowStr.join(' '))
    }
    // console.log('')
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
