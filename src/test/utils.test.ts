import { generateSlotsArray } from "../utils"

test('generateSlotsArray', () => {
  const result = generateSlotsArray(3, 10)
  expect(result.length).toEqual(3)
  expect(result[0].length).toEqual(10)
  expect(result[1].length).toEqual(10)
  expect(result[2].length).toEqual(10)
})