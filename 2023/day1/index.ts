import { readFile } from '../../aoc'

async function processLineByLine() {
  const lines = await readFile('2023/day1/input.txt')

  puzzle1(lines)
  puzzle2(lines)
}
const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
const textDigits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function puzzle1(input: string[]) {
  let score = 0;
  input.forEach(line => {
    const onlyDigits = line.split('').filter(value => digits.includes(value))
    const scoreForLine = parseInt(`${onlyDigits.at(0)}${onlyDigits.at(-1)}`);
    console.log(`[${scoreForLine}] Line ${line}`)
    score += scoreForLine;
  })
  console.log(score)
}

function puzzle2(input: string[]) {
  let score = 0;

  input.forEach(line => {
    let startIndex = line.length;
    let startDigit = null;
    let endIndex = 0;
    let endDigit = null;
    digits.concat(textDigits).forEach(d => {
      const i = line.indexOf(d);
      if (i !== -1 && i < startIndex) {
        startIndex = i;
        startDigit = d;
      }

      const li = line.lastIndexOf(d);
      if (li !== -1 && li > endIndex) {
        endIndex = li;
        endDigit = d;
      }
    })

    const a = textDigits.indexOf(startDigit ?? '');
    if (a !== -1) {
      startDigit = digits[a];
    }
    
    const b = textDigits.indexOf(endDigit ?? '');
    if (b !== -1) {
      endDigit = digits[b];
    }

    const scoreForLine = parseInt(`${startDigit}${endDigit ?? startDigit}`);
    console.log(`[${scoreForLine}] Line ${line}`)
    score += scoreForLine;
  })
  console.log(score)
}

processLineByLine()
