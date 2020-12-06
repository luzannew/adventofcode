import { readFile } from "../aoc.js";

async function processLineByLine() {
  const input = await readFile('2020/day4.txt')

  let passport = 0;
  const passports = []
  let currentPassport = ''
  for (const l of input) {
    // Newline? Then the passport should be added to the list
    if (l === '') {
      passports[passport] = processPassport(currentPassport)
      passport++;
      currentPassport = ''
      continue;
    }
    currentPassport += l + ' '
  }

  // Add last passport
  passports[passport] = processPassport(currentPassport)

  puzzle1(passports)
  puzzle2(passports)
}

function processPassport (data) {
  // Data: hcl:#cfa07d eyr:2025 pid:166559648 iyr:2011 ecl:brn hgt:59in
  // Split on space, and then split on : and convert to an object
  let target = {}
  data
    .trim()
    .split(" ")
    .forEach(pair => {
      const [key, value] = pair.split(':')
      target[key] = value
    })
  return target
}

const requiredFields = [
  {
    key: 'byr',
    validation: (input) => {
      const n = Number(input)
      return 1920 <= n && n <= 2002
    }
  },
  {
    key: 'iyr',
    validation: (input) => {
      const n = Number(input)
      return 2010 <= n && n <= 2020
    }
  },
  {
    key: 'eyr',
    validation: (input) => {
      const n = Number(input)
      return 2020 <= n && n <= 2030
    }
  },
  {
    key: 'hgt',
    validation: (input) => {
      if (input.endsWith('cm')) {
        const val = Number(input.replace('cm', ''))
        return 150 <= val && val <= 193
      }
      if (input.endsWith('in')) {
        const val = Number(input.replace('in', ''))
        return 59 <= val && val <= 76
      }

      return false
    }
  },
  {
    key: 'hcl',
    validation: (input) => /^#[0-9a-f]{6}$/i.test(input)
  },
  {
    key: 'ecl',
    validation: (input) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].indexOf(input) !== -1
  },
  {
    key: 'pid',
    validation: (input) => /^[0-9]{9}$/i.test(input)
  }
]

function isValidPassport (passport, validation) {
  for (const field of requiredFields) {
    if (passport[field.key]) {
      if (validation) {
        if (field.validation(passport[field.key])) {
          continue
        }
      }
      else {
        continue
      }
    }
    // console.log(`Key ${field.key} missing or invalid in ${passport[field.key]}\t\t${JSON.stringify(passport)}`)
    return false
  }

  return true
}

function puzzle1(input) {
  let valid = 0;
  for (const passport of input) {
    const isValid = isValidPassport(passport, false)
    if (isValid) {
      valid++;
    }
  }

  console.log('Puzzle 1: ' + valid)
}

function puzzle2(input) {
  let valid = 0;
  for (const passport of input) {
    const isValid = isValidPassport(passport, true)
    if (isValid) {
      valid++;
    }
  }

  console.log('Puzzle 2: ' + valid)
}

processLineByLine();
