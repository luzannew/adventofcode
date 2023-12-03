import { readFile } from '../../aoc'

interface Game {
  id: number
  sets: {
    amount: number
    color: string
  }[][]
}

async function processLineByLine() {
  const lines = await readFile('2023/day2/input.txt')

  const games: Game[] = [];
  lines.forEach(line => {
    const [game, config] = line.split(': ')
    const id = parseInt(game!.split(' ')[1]!);
    const subsets = config!.split('; ').map(subset => {
      const set = subset.split(', ')
      return set.map(cubes => {
        const [amount, color] = cubes.split(' ')
        return {
          amount: parseInt(amount!),
          color: color!
        }
      })
    });

    games.push({
      id: id,
      sets: subsets
    });
  })

  // puzzle1(games)
  puzzle2(games)
}

function isGameValid(game: Game, restrictions: Record<string, number>) {
  return game.sets.every(set => {
    return set.every(s => s.amount <= (restrictions[s.color] ?? 0));
  })
}

function puzzle1(input: Game[]) {
  const restrictions = {
    red: 12,
    green: 13,
    blue: 14,
  }
  let count = 0;
  input.forEach(game => {
    const isValid = isGameValid(game, restrictions);
    console.log(game.id, isValid);
    if (isValid) {
      count += game.id;
    }
  });

  console.log(count)
}

function puzzle2(input: Game[]) {
  let count = 0;
  input.forEach(game => {
    const result = game.sets.reduce((acc, curr) => {
      curr.forEach(x => {
        if (acc[x.color] == null) {
          acc[x.color] = x.amount
        } else {
          acc[x.color] = Math.max(acc[x.color]!, x.amount);
        }
      })
      return acc;
    }, {} as Record<string, number>)
    count += result['green']! * result['blue']! * result['red']!
  });

  console.log(count)
}

processLineByLine()
