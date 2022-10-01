import { TSlots } from "./types";

export function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateSlotsArray(columns: number, rows: number): TSlots {
  const slots = [];
  for (let i = 0; i < columns; i++) {
    slots.push([...Array(rows).keys()].sort((a, b) => Math.random() - 0.5));
  }
  return slots;
}