import { readFile } from '../../aoc.js'

async function processLineByLine() {
  const input = await readFile('2020/day7/input.txt')

  // Convert the input to a map of bags, each entry contains an array with name + amount of bags it can hold
  const bags = new Map()
  for (const answers of input) {
    // Parse bag + content
    const groups = /([a-z]+\s[a-z]+)\sbags contain\s([a-z0-9\s,]+)+/g.exec(answers)
    const [, parent, children] = groups

    // Do additional string split on the content to see which bags fit inside this bag and filter out empty entries
    const childrenBags = children
      .split(', ')
      .map(val => {
        if (val === 'no other bags') {
          return null
        }
        const a = /([0-9]+)\s([a-z]+\s[a-z]+)\sbags?/.exec(val)
        return {
          name: a[2],
          amount: Number(a[1])
        }
      })
      .filter(Boolean)

    bags.set(parent, childrenBags)
  }

  puzzle1(bags)
  puzzle2(bags)
}

function puzzle1(input) {
  const containsShinyGold = (bag) => {
    const entry = input.get(bag)
    return entry
      ? entry.some(x => x.name === "shiny gold" || containsShinyGold(x.name))
      : false
  }
  let bagsFound = 0
  // loop through all bags to check if we can contain (somewhere) a shiny gold bag
  for (let bag of input.keys()) {
    if (containsShinyGold(bag)) {
      bagsFound++
    }
  }

  console.log('Puzzle 1: ' + bagsFound)
}

function puzzle2(input) {
  const countContent = (bag) => {
    let count = 0
    if (bag) {
      bag.forEach(element => {
        // Count the amount of bags + amount of bags * the bags within those bags
        count += element.amount + element.amount * countContent(input.get(element.name))
      });
    }
    
    return count
  }

  const result = countContent(input.get('shiny gold'))
  console.log('Puzzle 2: ' + result)
}

processLineByLine();
