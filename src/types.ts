export type TSlot = number;
export type TSlots = TSlot[][];

export type TPokemonListing = {
  count: number
  next: string | null
  previous: string | null
  results: {
    name: string
    url: string
  }[]
}
