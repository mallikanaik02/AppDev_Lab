export const pokemonService = {
  // Fetch Pokemon list from API
  fetchPokemonList: async (limit = 50) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch Pokemon');
      }
      
      const data = await response.json();
      
      // Get detailed info for each Pokemon (including images)
      const pokemonWithDetails = await Promise.all(
        data.results.map(async (poke) => {
          const detailResponse = await fetch(poke.url);
          const detail = await detailResponse.json();
          return {
            id: detail.id,
            name: poke.name,
            image: detail.sprites.front_default,
            types: detail.types.map(type => type.type.name),
            height: detail.height,
            weight: detail.weight,
            url: poke.url
          };
        })
      );
      
      return pokemonWithDetails;
    } catch (error) {
      throw error;
    }
  },

  // Search for specific Pokemon
  searchPokemon: async (name) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      
      if (!response.ok) {
        return null;
      }
      
      const detail = await response.json();
      return {
        id: detail.id,
        name: detail.name,
        image: detail.sprites.front_default,
        types: detail.types.map(type => type.type.name),
        height: detail.height,
        weight: detail.weight,
        url: `https://pokeapi.co/api/v2/pokemon/${detail.id}/`
      };
    } catch (error) {
      return null;
    }
  },

  // Fetch detailed Pokemon info
  fetchPokemonDetails: async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      return {
        name: data.name,
        id: data.id,
        height: data.height,
        weight: data.weight,
        baseExperience: data.base_experience,
        types: data.types.map(type => type.type.name),
        abilities: data.abilities.map(ability => ability.ability.name),
        stats: data.stats,
        sprites: data.sprites
      };
    } catch (error) {
      throw error;
    }
  }
};
