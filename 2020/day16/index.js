import { readFile } from '../../aoc.js'

async function processLineByLine() {
  let input = await readFile('2020/day16/input.txt')

  let rules = []
  let yourTicket
  let nearbyTickets

  for (let i = 0; i < input.length; i++) {
    const currentLine = input[i]
    if (currentLine.length === 0) {
      continue
    }

    if (currentLine === 'your ticket:') {
      yourTicket = input[i+1].split(',').map(Number)
      i++
      continue
    }

    if (currentLine === 'nearby tickets:') {
      nearbyTickets = input.slice(i + 1, input.length).map(x => x.split(',').map(Number))
      break
    }

    if (!yourTicket) {
      const [type, validation] = currentLine.split(': ')
      // Still reading rules if 'your ticket' is still empty
      const match = /(\d+)-(\d+) or (\d+)-(\d+)/gm.exec(validation.trim())
      if (match) {
        rules.push({
          type,
          validColumns: [],
          set1: {
            min: Number(match[1]),
            max: Number(match[2])
          },
          set2: {
            min: Number(match[3]),
            max: Number(match[4])
          }
        })
      }
      continue
    }
  }

  puzzle1(rules, yourTicket, nearbyTickets)
  puzzle2(rules, yourTicket, nearbyTickets)
}

function isTicketValid(rules, ticket) {
  // console.log('Check ticket ' + ticket)
  const invalidNumbers = ticket.filter(x => {
    return false === rules.some(rule => (rule.set1.min <= x && x <= rule.set1.max) || (rule.set2.min <= x && x <= rule.set2.max))
  })
  // if (invalidNumbers.length) {
  //   console.log('Found invalid numbers: ' + invalidNumbers.join(','))
  // }

  return {
    valid: invalidNumbers.length === 0,
    errors: invalidNumbers
  }
}

function puzzle1(rules, yourTicket, nearbyTickets) {
  let invalidNumbers = []

  for(let i = 0; i < nearbyTickets.length; i++) {
    const { valid, errors } = isTicketValid(rules, nearbyTickets[i])
    if (valid === false) {
      invalidNumbers = [
        ...invalidNumbers,
        ...errors
      ]
    }
  }
  console.log(`Puzzle 1: ${invalidNumbers.reduce((prev, curr) => prev + curr, 0)}`)
}

function puzzle2(rules, yourTicket, nearbyTickets) {
  // Step 1: Get a list of valid tickets
  const validTickets = nearbyTickets.filter(t => {
    const { valid } = isTicketValid(rules, t)
    return valid
  })
  console.log(`${validTickets.length}/${nearbyTickets.length} valid tickets`)
  
  // Step 2: Generate a list of valid columns for each rule where every number validates against one of the sets
  rules.forEach(rule => {
    for (let columnIndex = 0; columnIndex < yourTicket.length; columnIndex++) {
      let valid = true
      for (let i = 0; i < validTickets.length; i++) {
        const ticket = validTickets[i]
        const ticketNumber = ticket[columnIndex]
        if (false === ((rule.set1.min <= ticketNumber && ticketNumber <= rule.set1.maticketNumber) || (rule.set2.min <= ticketNumber && ticketNumber <= rule.set2.max))) {
          valid = false
        }
      }

      if (valid) {
        rule.validColumns.push(columnIndex)
      }
    }
  })

  // Step 3: Find rules that match exactly 1 column and remove that column for other columns
  // Do this until every rule has exactly 1 matching column
  while (rules.filter(x => x.validColumns.length === 1).length !== rules.length) {
    // Find rules that match exactly 1 column
    rules
      .filter(x => x.validColumns.length === 1)
      .forEach(rule => {
        rules.forEach(x => {
          // Ignore current type
          if (x.type === rule.type) {
            return
          }
          // Remove that column for other columns
          if (x.validColumns.indexOf(rule.validColumns[0]) >= 0) {
            x.validColumns = x.validColumns.filter(y => y !== rule.validColumns[0])
          }
        })
      })
  }

  // Step 4: Look for the six fields on your ticket that start with the word departure. What do you get if you multiply those six values together?
  const departureSum = rules
    .filter(x => x.type.indexOf('departure') === 0)
    .reduce((prev, curr) => {
    prev *= yourTicket[curr.validColumns[0]]
    return prev
  }, 1)
  
  console.log(`Puzzle 2: ${departureSum}`)
}

processLineByLine();
