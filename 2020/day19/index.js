import { readFile } from '../../aoc.js'

async function processLineByLine() {
  let input = await readFile('2020/day19/input.txt')

  const split = input.indexOf('')
  const rules = []
  input
    .slice(0, split)
    .forEach(line => {
      let [rulenumber, rest] = line.split(': ')
      if (rest.startsWith('"')) {
        rules[Number(rulenumber)] = { character: rest[1] }
        return
      }
      rules[Number(rulenumber)] = { subrules: rest }
    })
  const answers = input.slice(split + 1)

  // Puzzle 1 generates every possible answer
  puzzle1(rules, answers)

  // Puzzle 2 generates a regex as I discovered puzzle 1 was not able to fix puzzle 2
  // I could have updated puzzle 1, but I wanted to include the other approach
  puzzle2(rules, answers)
}

// Generate every possible combination from the given arrays
// For example:
// ['a', 'b'], ['b', 'a']
// will generate
// ['a', 'b'], ['a', 'a'], ['b', 'b'], ['b', 'a']
const cartesian = (...a) => a.reduce((a, b) => (Array.isArray(a) ? a : [a]).flatMap(d => (Array.isArray(b) ? b : [b]).map(e => [d, e].flat())));
function puzzle1(rules, answers) {
  const loop = (rule) => {
    if (rule.character) return rule.character

    let subrules = []
    rule.subrules
      .split('|')
      .map(r => r.trim().split(' ').map(x => Number(x.trim())))
      .forEach(subrule => {
        const res = []
        subrule.forEach(r => {
          res.push(loop(rules[r]))
        })
        if (res.every(x => typeof x === 'string')) {
          subrules.push(res.join(''))
        }
        else {
          const output = cartesian(...res).map(x => Array.isArray(x) ? x.join('') : x)
          subrules = [
            ...subrules,
            ...output
          ]
        }
      })

    return subrules
  }

  // Generate every possible answer
  const possibleAnswers = loop(rules[0])

  // And check if the given answers are in this 'possible answers' list
  const count = answers.filter(answer => possibleAnswers.indexOf(answer) !== -1).length
  console.log(`Puzzle 1: ${count}`)
}

function puzzle2(rules, answers) {
  rules[8].subrules = '42 | 42 8'
  rules[11].subrules = '42 31 | 42 11 31'

  function buildRegex(step, rule, n8, n11) {
    if (rule.character) return rule.character

    if (step === 8 && n8 === 5) {
      return `(${buildRegex(42, rules[42], n8, n11)})`
    }
    if (step === 11 && n11 === 5) {
      return `(${buildRegex(42, rules[42], n8, n11)}${buildRegex(31, rules[31], n8, n11)})`
    }

    if (step === 8) n8++
    if (step === 11) n11++

    const res = rule.subrules
      .split(' ')
      .reduce((rule, part) => rule + (part == '|' ? '|' : buildRegex(Number(part), rules[Number(part)], n8, n11)), '')
    return `(${res})`
  }

  // Start with first rule
  const rule = new RegExp(`^${buildRegex(0, rules[0], 0, 0)}$`, 'gm')
  const count = answers.filter(a => a.match(rule)).length
  console.log(`Puzzle 2: ${count}`)
}

processLineByLine();
