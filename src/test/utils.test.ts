import { generateSlotsArray, hasWon } from "../utils"

test('generateSlotsArray', () => {
  const result = generateSlotsArray(3, 10)
  expect(result.length).toEqual(3)
  expect(result[0].length).toEqual(10)
  expect(result[1].length).toEqual(10)
  expect(result[2].length).toEqual(10)
})

test('hasWon', () => {
  expect(hasWon([0, 0, 0])).toEqual(true)
  expect(hasWon([0, 1, 0])).toEqual(false)
  expect(hasWon([0, 1, 3])).toEqual(false)
})