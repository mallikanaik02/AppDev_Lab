import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getTypeColor, theme } from '../utils/colors';
import { width } from '../styles/globalStyles';

const PokemonCard = ({ pokemon, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.pokemonCard}
      onPress={() => onPress(pokemon)}
      activeOpacity={0.8}
    >
      <View style={styles.pokemonHeader}>
        <Text style={styles.pokemonId}>#{pokemon.id.toString().padStart(3, '0')}</Text>
      </View>
      
      <Image source={{ uri: pokemon.image }} style={styles.pokemonImage} />
      
      <Text style={styles.pokemonName}>{pokemon.name}</Text>
      
      <View style={styles.typesContainer}>
        {pokemon.types.map((type, index) => (
          <View 
            key={index} 
            style={[styles.typeTag, { backgroundColor: getTypeColor(type) }]}
          >
            <Text style={styles.typeText}>{type}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>H: {pokemon.height/10}m  W: {pokemon.weight/10}kg</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pokemonCard: {
    backgroundColor: 'white',
    margin: 5,
    padding: 15,
    borderRadius: 20,
    width: width * 0.43,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  pokemonHeader: {
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  pokemonId: {
    fontSize: 12,
    color: '#999',
    fontWeight: 'bold',
  },
  pokemonImage: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.secondary,
    textTransform: 'capitalize',
    textAlign: 'center',
    marginBottom: 8,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    margin: 2,
  },
  typeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  statsContainer: {
    alignItems: 'center',
  },
  statText: {
    fontSize: 11,
    color: theme.textLight,
    fontWeight: '500',
  },
});

export default PokemonCard;
