import { readFile } from "../aoc.js";

async function processLineByLine() {
  const input = await readFile('2020/day3.txt')

  const test1result = walkinforest(input, 3, 1)
  console.log('Puzzle 1: ' + test1result)

  const test2result = walkinforest(input, 1, 1)
  const test3result = walkinforest(input, 5, 1)
  const test4result = walkinforest(input, 7, 1)
  const test5result = walkinforest(input, 1, 2)
  console.log('Puzzle 2: ' + test2result * test1result * test3result * test4result * test5result)
}

function setCharAt(str,index,chr) {
  if(index > str.length-1) return str;
  return str.substring(0,index) + chr + str.substring(index+1);
}

function walkinforest(input, right, down) {
  let forest = [...input]
  // Start position
  let x = 0
  let y = 0
  let treesEncountered = 0

  while(y < forest.length - 1) {
    // Next position
    x += right
    y += down

    while (x >= forest[y].length) {
      // Expand forest to the right if we are at the border
      forest[y] = forest[y] + forest[y].substring(0, input[0].length)
    }
    const newPos = forest[y][x]
    if (newPos === '#') {
      treesEncountered++;
      forest[y] = setCharAt(forest[y], x, 'X') // Replace character to debug it visually
    } else if (newPos === '.') {
      forest[y] = setCharAt(forest[y], x, '0') // Replace character to debug it visually
    }
  }

  // console.log(forest)
  return treesEncountered
}

processLineByLine();
