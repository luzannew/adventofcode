import { readFile } from "../../aoc.js";

async function processLineByLine() {
  let input = await readFile('2020/day12/input.txt')
  input = input.map(line => {
    return {
      action: line.substring(0, 1),
      units: Number(line.substring(1, line.length))
    }
  })

  puzzle1(input)
  puzzle2(input)
}

function sail (location, action, units, waypointMode) {
  if (waypointMode) {
    location.x += units * location.waypoint.x
    location.y += units * location.waypoint.y
    return location
  }

  location = move(location, action, units)
  return location
}

function moveWaypoint (location, action, units) {
  location.waypoint = move(location.waypoint, action, units)
  return location
}

function move (location, action, units) {
  switch (action) {
    case 'N':
      location.y -= units
      break;
    case 'E':
      location.x += units
      break;
    case 'S':
      location.y += units
      break;
    case 'W':
      location.x -= units
      break;
  }

  return location
}

const directions = ['N', 'E', 'S', 'W']
function rotateShip (currentLocation, direction, degrees) {
  const a = degrees / 90;

  let directionIndex = directions.indexOf(currentLocation.direction)
  if (direction === 'R') {
    directionIndex = (directionIndex + a) % 4
  } else if (direction === 'L') {
    directionIndex = (directionIndex - a)
    if (directionIndex < 0) {
      directionIndex += 4
    }
  }

  currentLocation.direction = directions[directionIndex]
  return currentLocation
}

function rotate(cx, cy, x, y, angle) {
  const radians = (Math.PI / 180) * angle
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx
  const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy
  return [nx, ny];
}

function rotateWaypoint (currentLocation, direction, degrees) {
  const [newY, newX] = rotate(0, 0, currentLocation.waypoint.y, currentLocation.waypoint.x, direction === 'L' ? degrees * -1 : degrees)
  currentLocation.waypoint.x = Math.round(newX)
  currentLocation.waypoint.y = Math.round(newY)
  return currentLocation
}

function next (currentLocation, action, units, waypointMode) {
  switch (action) {
    case 'R':
    case 'L':
      return waypointMode ? rotateWaypoint(currentLocation, action, units) : rotateShip(currentLocation, action, units)
    case 'F':
      return sail(currentLocation, currentLocation.direction, units, waypointMode)
    default:
      return waypointMode ? moveWaypoint(currentLocation, action, units) : sail(currentLocation, action, units)
  }
}

function puzzle1(input) {
  const result = input.reduce(
    (prev, curr) => next(prev, curr.action, curr.units, false),
    { direction: 'E', x: 0, y: 0 }
  )

  console.log(`Puzzle 1: ${Math.abs(result.x) + Math.abs(result.y)}`)
}

function puzzle2(input) {
  const result = input.reduce(
    (prev, curr) => next(prev, curr.action, curr.units, true),
    { direction: 'E', x: 0, y: 0, waypoint: { x: 10, y: -1 } }
  )

  console.log(`Puzzle 2: ${Math.abs(result.x) + Math.abs(result.y)}`)
}

processLineByLine();
