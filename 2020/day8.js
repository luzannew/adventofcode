import { readFile } from "../aoc.js";

const corruptedInstructions = ['nop', 'jmp']
async function processLineByLine() {
  const input = await readFile('2020/day8.txt')

  const instructions = []
  for (const instruction of input) {
    const parsedInstruction = /([a-z]{3})\s(-|\+)(\d+)/g.exec(instruction)
    instructions.push({
      visited: false,
      instruction: parsedInstruction[1],
      mightBeCorrupted: corruptedInstructions.indexOf(parsedInstruction[1]) >= 0,
      argument: parsedInstruction[2] === '+' ? Number(parsedInstruction[3]) : -Number(parsedInstruction[3])
    })
  }

  puzzle1(instructions)
  puzzle2(instructions)
}

function program (input) {
  let stopProgram = false
  let currentInstructionIndex = 0
  let result = 0
  while (stopProgram !== true) {
    // Check if we are out of bounds and at the end of the program
    if (currentInstructionIndex >= input.length) {
      stopProgram = true;
      continue
    }
    const currentInstruction = input[currentInstructionIndex]
    if (currentInstruction.visited) {
      // Infinite loop detected!! We cannot visit the same instruction again
      return {
        exitedEarly: true,
        result: result
      }
    }
    currentInstruction.visited = true
    switch(currentInstruction.instruction) {
      case 'nop':
        // Ignore and go to next step
        currentInstructionIndex++;
        break;
      case 'acc':
        // Adjust result and go to next step
        result += currentInstruction.argument
        currentInstructionIndex++;
        break;
      case 'jmp': {
        // Jump to next instruction
        const nextInstruction = currentInstructionIndex + currentInstruction.argument
        currentInstructionIndex = nextInstruction
        break;
      }
    }
  }

  return {
    exitedEarly: false,
    result: result
  }
}

function puzzle1(input) {
  // Make copy of list including values
  const copy = JSON.parse(JSON.stringify(input))
  const result = program(copy)
  console.log('Puzzle 1: ' + result.result)
}

function puzzle2(input) {
  let foundCorruptedInstruction = false

  // Loop through the instruction and try every time 1 other instruction
  while(foundCorruptedInstruction !== true) {
    // Make copy of list including values
    const newInput = JSON.parse(JSON.stringify(input))

    // Find an instruction which might be corrupted and mark it as 'fixed'
    const mightBeCorrupted = newInput.find(x => x.mightBeCorrupted)
    const originalIndex = newInput.indexOf(mightBeCorrupted)
    input[originalIndex].mightBeCorrupted = false

    // Switch to other instruction
    // console.log(`Flip instruction at index ${originalIndex} with instruction ${mightBeCorrupted.instruction}`)
    mightBeCorrupted.instruction = mightBeCorrupted.instruction === 'jmp' ? 'nop' : 'jmp'

    // When the program exits early we encountered an infinite loop. Try again with the next instruction :)
    const result = program(newInput)
    if (result.exitedEarly === false) {
      // Program terminated successfully! We fixed the 1 bad instruction!
      console.log('Puzzle 2: ' + result.result)
      foundCorruptedInstruction = true
    }
  }
}

processLineByLine();
