import { readFile } from '../../aoc.js'

async function processLineByLine() {
  let input = await readFile('2020/day18/input.txt')

  puzzle1(input)
  puzzle2(input)
}

// Check if input is a numeric thingy
function isNumeric(input) {
  return !isNaN(parseFloat(input)) && isFinite(input);
}

// Remove empty items from array
function clean(input) {
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '') {
      input.splice(i, 1);
    }
  }
  return input;
}

const ACCEPTED_TOKENS = "*+-"
/**
 * https://en.wikipedia.org/wiki/Shunting-yard_algorithm
 */
function infixToPostfix(infix, operators) {
  let output = ""
  const operatorStack = []

  // Prepare, remove spaces + empty items
  infix = infix.replace(/\s+/g, "")
  infix = clean(infix.split(/([+\-*()])/))
  for (let i = 0; i < infix.length; i++) {
    const token = infix[i]

    // if the token is a number, then: push it to the output queue.
    if (isNumeric(token)) {
      output += token + " "
      continue;
    }

    // if the token is an operator then:
    // while ((there is an operator at the top of the operator stack)
    //     and ((the operator at the top of the operator stack has greater precedence)
    //       or (the operator at the top of the operator stack has equal precedence and the token is left associative))
    //     and (the operator at the top of the operator stack is not a left parenthesis)):
    //   pop operators from the operator stack onto the output queue.
    // push it onto the operator stack.
    if (ACCEPTED_TOKENS.indexOf(token) !== -1) {
      const currentOperator = token
      let operatorOnStack = operatorStack[operatorStack.length - 1]
      while (ACCEPTED_TOKENS.indexOf(operatorOnStack) !== -1 && (operators[currentOperator].precedence <= operators[operatorOnStack].precedence)) {
        output += operatorStack.pop() + " "
        operatorOnStack = operatorStack[operatorStack.length - 1]
      }
      operatorStack.push(currentOperator)
      continue;
    }

    // if the token is a left parenthesis (i.e. "("), then: push it onto the operator stack.
    if (token === "(") {
      operatorStack.push(token)
      continue;
    }

    // while the operator at the top of the operator stack is not a left parenthesis:
    // pop the operator from the operator stack onto the output queue.
    if (token === ")") {
      while (operatorStack[operatorStack.length - 1] !== "(") {
        output += operatorStack.pop() + " "
      }
      operatorStack.pop()
      continue;
    }
  }

  // while there are still operator tokens on the stack:
  // pop the operator from the operator stack onto the output queue.
  while (operatorStack.length > 0) {
    output += operatorStack.pop() + " "
  }
  return output
}

function execute(postfix) {
  const result = []
  postfix = postfix.split(" ")
  for (let i = 0; i < postfix.length; i++) {
    const token = postfix[i]

    // If it is a number, push it to the result queue
    if (isNumeric(token)) {
      result.push(token)
      continue;
    }

    // If we encounter an operator, pop the two items from the result queue, calculate the result and push that back onto the result queue
    const left = result.pop()
    const right = result.pop()
    switch (token) {
      case '+':
        result.push(parseInt(left) + parseInt(right))
        break;
      case '-':
        result.push(parseInt(left) - parseInt(right))
        break;
      case '*':
        result.push(parseInt(left) * parseInt(right))
        break;
    }
  }

  // Pop last item which should be the result
  return result.pop()
}


function puzzle1(input) {
  const operators = {
    "*": { precedence: 2 },
    "+": { precedence: 2 },
    "-": { precedence: 2 }
  }

  const result = input.reduce((prev, curr) => {
    const postfix = infixToPostfix(curr.replace(/\s/g, ''), operators).trim()
    // console.log(`Infix: ${line}`);
    // console.log(`Postfix: ${postfix}`);
    // console.log(`Result: ${execute(postfix)}`);
    prev += execute(postfix)
    return prev 
  }, 0)
  console.log(`Puzzle 1: ${result}`)
}

function puzzle2(input) {
  const operators = {
    "*": { precedence: 2 },
    "+": { precedence: 3 },
    "-": { precedence: 2 }
  }

  const result = input.reduce((prev, curr) => {
    const postfix = infixToPostfix(curr.replace(/\s/g, ''), operators).trim()
    // console.log(`Infix: ${curr}`);
    // console.log(`Postfix: ${postfix}`);
    // console.log(`Result: ${execute(postfix)}`);
    prev += execute(postfix)
    return prev 
  }, 0)
  console.log(`Puzzle 2: ${result}`)
}

processLineByLine();
