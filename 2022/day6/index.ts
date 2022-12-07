import { readFile } from '../../aoc'

async function processLineByLine() {
  const input = await readFile('2022/day6/input.txt')

  puzzle1(input)
  puzzle2(input)
}

/**
 * Returns true or false whether the array has duplicates inside
 */
function hasDuplicatesInArray(array: string[]) {
  return new Set(array).size !== array.length
}

function getPositionForMarker(packet: string[], length: number): number {
  for (var i = 0; i < packet.length - (length - 1); i++) {
    if (hasDuplicatesInArray(packet.slice(i, i + length))) {
      continue
    }
    return i + length
  }

  return -1
}

function puzzle1(input: string[]) {
  input.forEach(packet => {
    const packetArray = packet.split('')
    const markerAppearedAt = getPositionForMarker(packetArray, 4)

    console.log(`Start-of-packet marker appeared at ${markerAppearedAt}`)
  })
}

function puzzle2(input: string[]) {
  input.forEach(packet => {
    const packetArray = packet.split('')
    const markerAppearedAt = getPositionForMarker(packetArray, 14)

    console.log(`Start-of-message marker appeared at ${markerAppearedAt}`)
  })
}

processLineByLine()
