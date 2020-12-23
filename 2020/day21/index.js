import { readFile } from '../../aoc.js'

async function processLineByLine() {
  const input = await readFile('2020/day21/input.txt')

  const foods = input.map(line => {
    const [ingredients, allergens] = line.split(' (contains ')
    return {
      ingredients: new Set(ingredients.split(' ')),
      allergens: new Set(allergens.substring(0, allergens.length - 1).split(', '))
    }
  })

  let ingredients = new Set();
  let allergens = {};
  foods.forEach(food => food.ingredients.forEach(ingredient => ingredients.add(ingredient)))
  foods.forEach(food => food.allergens.forEach(allergen => allergens[allergen] = new Set(ingredients)))

  for (let [allergen, ingredients] of Object.entries(allergens)) {
    for (let food of foods) {
      if (!food.allergens.has(allergen)) {
        continue
      }
      for (let ingredient of new Set(ingredients)) {
        if (!food.ingredients.has(ingredient)) {
          ingredients.delete(ingredient)
        }
      }
    }
  }

  puzzle1(foods, ingredients, allergens)
  puzzle2(allergens)
}
function puzzle1(foods, ingredients, allergens) {
  let safeIngredients = new Set(ingredients)
  for (let ingredients of Object.values(allergens)) {
    ingredients.forEach(ingredient => safeIngredients.delete(ingredient))
  }
  let appearances = 0
  foods.forEach(food => {
    food.ingredients.forEach(ingredient => {
      appearances += safeIngredients.has(ingredient)
    })
  })
  console.log(`Puzzle 1: ${appearances}`)
}

function puzzle2(allergens) {
  let list = [];
  let allergensLeft = new Set(Object.keys(allergens));
  while (list.length < Object.keys(allergens).length) {
    let delAllergen;
    let delIngredient;
    for (let allergen of allergensLeft) {
      if (allergens[allergen].size == 1) {
        delAllergen = allergen;
        delIngredient = [...allergens[allergen]][0];
        list.push({ ingredient: delIngredient, allergen: allergen });
        break;
      }
    }
    allergensLeft.delete(delAllergen);
    for (let [allergen, ingredients] of Object.entries(allergens)) {
      if (allergen != delAllergen) {
        ingredients.delete(delIngredient);
      }
    }
  }

  // Arrange the ingredients alphabetically by their allergen and separate
  // them by commas to produce your canonical dangerous ingredient list
  list = list
    .sort((a, b) => a.allergen < b.allergen ? -1 : a.allergen > b.allergen ? 1 : 0)
    .map(item => item.ingredient)
    .join(',')
  console.log(`Puzzle 2: ${list}`)
}

processLineByLine();
