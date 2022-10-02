import { TPokemonListing } from "./types";

export async function getPokemonListing(): Promise<TPokemonListing | undefined> {
  try {
    const pokemon = await fetch('https://pokeapi.co/api/v2/pokemon/');
    return await pokemon.json();
  } catch (err) {
    console.error(err);
  }
}

export const extractPokemonImages = (pokemonListing: TPokemonListing) => {
  return pokemonListing.results.map((pokemon) => {
    const pokemonId = pokemon.url.split('/')[6];
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`
  })
}