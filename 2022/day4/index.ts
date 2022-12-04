import { readFile } from '../../aoc'

interface Pair {
  elf1: number[];
  elf2: number[];
}
async function processLineByLine() {
  const input = await readFile('2022/day4/input.txt')
  const pairs = input.map(x => {
    // 2-8,3-7
    // Split in 2-8 and 3-7
    const [group1, group2] = x.split(',')
    // And then split the 2 groups into separate numbers
    return {
      elf1: group1.split('-').map(Number),
      elf2: group2.split('-').map(Number),
    }
  })

  puzzle1(pairs)
  puzzle2(pairs)
}

function puzzle1(input: Pair[]) {
  const hasOverlap = (elf: number[], otherElf: number[]): boolean => {
    // Check if there is a full overlap
    // For example, 2-8 fully contains 3-7, and 6-6 is fully contained by 4-6.
    if (elf[0] >= otherElf[0] && elf[1] <= otherElf[1]) {
      return true
    }

    return false
  }
  const overlapPairs = input.filter(pair => {
    // Data structure: pair = { elf1: [2,8], elf2: [3, 7] }

    // Check if there is overlap between the two elves
    if (hasOverlap(pair.elf1, pair.elf2) || hasOverlap(pair.elf2, pair.elf1)) {
      return true
    }
    return false
  })
  console.log(overlapPairs.length)
}

function puzzle2(input: Pair[]) {
  const hasOverlap = (elf: number[], otherElf: number[]): boolean => {
    // Check if elf start position has overlap with otherElf
    if (elf[0] >= otherElf[0] && elf[0] <= otherElf[1]) {
      return true
    }
    // Check if elf end position has overlap with otherElf
    if (elf[1] >= otherElf[0] && elf[1] <= otherElf[1]) {
      return true
    }
    return false
  }
  const overlapPairs = input.filter(pair => {
    // Data structure: pair = { elf1: [2,8], elf2: [3, 7] }

    // Check if there is overlap between the two elves
    if (hasOverlap(pair.elf1, pair.elf2) || hasOverlap(pair.elf2, pair.elf1)) {
      return true
    }
    return false
  })
  console.log(overlapPairs.length)
}

processLineByLine()
