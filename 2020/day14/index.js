import { readFile } from '../../aoc.js'

async function processLineByLine() {
  let input = await readFile('2020/day14/input.txt')

  puzzle1(input)
  puzzle2(input)
}

function puzzle1(input) {
  let mask = null
  const memory = []
  for (let i = 0; i < input.length; i++) {
    const currentLine = input[i]
    if (currentLine.includes('mask')) {
      mask = currentLine.replace('mask = ', '').split('').reverse()
      continue
    }

    const [mem, value] = input[i].split(' = ')
    const valueBinary = Number(value).toString(2).split('').reverse()
    const result = mask.map((maskChar, index) => {
      if (index >= valueBinary.length) {
        return maskChar !== 'X' ? Number(maskChar) : 0
      }
      return maskChar !== 'X' ? Number(maskChar) : Number(valueBinary[index])
    }).reverse().join('')

    memory[Number(mem.replace('mem[', '').replace(']', ''))] = result
  }

  const result = memory.reduce((prev, curr) => prev += parseInt(curr, 2), 0)
  console.log(`Puzzle 1: ${result}`)
}

function setCharAt(str,index,chr) {
  if (index > str.length-1) return str;
  return str.substring(0,index) + chr + str.substring(index+1);
}

function fillValue (input) {
  const combinations = []
  const replace = (value,  index) => { 
    if (index == input.length)
    {
      combinations.push(value)
      return
    }
  
    if (value[index] === 'X') {
      // replace 'X' by '0' and continue with loop
      replace(setCharAt(value, index, '0'), index + 1)
      // replace 'X' by '1' and continue with loop
      replace(setCharAt(value, index, '1'), index + 1)
    } else {
      replace(value, index + 1)
    }
  }

  replace(input, 0)
  return combinations
}

function puzzle2(input) {
  let mask = null
  const memory = new Map()
  for (let i = 0; i < input.length; i++) {
    const currentLine = input[i]
    if (currentLine.includes('mask')) {
      mask = currentLine.replace('mask = ', '').split('')
      continue
    }
    const [memoryLocation, value] = input[i].split(' = ')
    const address = Number(memoryLocation.replace('mem[', '').replace(']', ''))

    const valueBinary = Number(address).toString(2).padStart(36, '0').split('')
    const result = mask.map((maskChar, index) => {
      if (maskChar === 'X' || maskChar === '1') {
        return maskChar
      }

      if (maskChar === '0') {
        return Number(valueBinary[index])
      }
    })
    const addresses = fillValue(result.join(''))

    addresses.forEach(x => {
      memory.set(parseInt(x, 2), Number(value))
    })
  }

  let result = 0
  memory.forEach(value => {
    result += value
  })
  console.log(`Puzzle 2: ${result}`)
}

processLineByLine();
