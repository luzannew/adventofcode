import { readFile } from '../../aoc.js'

async function processLineByLine() {
  const input = await readFile('2020/day6/input.txt')

  let groupIndex = 0;
  const groups = []
  let currentGroup = []
  for (const answers of input) {
    // Newline? Then the answers should be added to the list
    if (answers === '') {
      groups[groupIndex] = currentGroup
      groupIndex++;
      currentGroup = []
      continue;
    }
    currentGroup.push(answers)
  }

  // Add last groupIndex
  groups[groupIndex] = currentGroup

  puzzle1(groups)
  puzzle2(groups)
}

function filterDuplicates (data) {
  return [...data.join('')]
    .filter((value, index, self) => self.indexOf(value) === index)
    .join('')
}

function puzzle1(input) {
  console.log(`Puzzle 1: ${input.reduce((prev, cur) => prev + filterDuplicates(cur).length, 0)}`)
}

function puzzle2(input) {
  // console.log(input)
  const totalAnsers = input.reduce((prev, cur) => {
    const answersTheSame = cur.reduce((prevAnswers, currentAnswer, index) => {
      // Add first answer, that will be the starting point
      if (index === 0) {
        return currentAnswer
      }
      // Compare next answer with previous to filter out non-duplicates
      return [...prevAnswers].filter(value => currentAnswer.includes(value)).join('')
    }, '').length
    return prev + answersTheSame
  }, 0)
  console.log(`Puzzle 2: ${totalAnsers}`)
}

processLineByLine();
