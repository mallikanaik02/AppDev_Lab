import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  StatusBar,
  StyleSheet 
} from 'react-native';
import { getTypeColor, theme } from '../utils/colors';

const PokemonModal = ({ visible, pokemonDetails, loading, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
        
        <View style={styles.modalHeader}>
          <Text style={styles.modalHeaderText}>Pokemon Details</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalScrollView}>
          {loading ? (
            <View style={styles.modalLoading}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={styles.loadingText}>Loading details...</Text>
            </View>
          ) : pokemonDetails ? (
            <View style={styles.modalContent}>
              <View style={styles.modalImageContainer}>
                <Image 
                  source={{ uri: pokemonDetails.sprites.front_default }} 
                  style={styles.modalImage} 
                />
                <Text style={styles.modalTitle}>
                  #{pokemonDetails.id.toString().padStart(3, '0')} {pokemonDetails.name}
                </Text>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Basic Information</Text>
                <View style={styles.basicInfoRow}>
                  <View style={styles.basicInfoItem}>
                    <Text style={styles.basicInfoLabel}>Height</Text>
                    <Text style={styles.basicInfoValue}>{pokemonDetails.height/10}m</Text>
                  </View>
                  <View style={styles.basicInfoItem}>
                    <Text style={styles.basicInfoLabel}>Weight</Text>
                    <Text style={styles.basicInfoValue}>{pokemonDetails.weight/10}kg</Text>
                  </View>
                  <View style={styles.basicInfoItem}>
                    <Text style={styles.basicInfoLabel}>Experience</Text>
                    <Text style={styles.basicInfoValue}>{pokemonDetails.baseExperience}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Types</Text>
                <View style={styles.typesContainer}>
                  {pokemonDetails.types.map((type, index) => (
                    <View 
                      key={index} 
                      style={[styles.typeTagLarge, { backgroundColor: getTypeColor(type) }]}
                    >
                      <Text style={styles.typeTextLarge}>{type}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Abilities</Text>
                <View style={styles.abilitiesContainer}>
                  {pokemonDetails.abilities.map((ability, index) => (
                    <View key={index} style={styles.abilityTag}>
                      <Text style={styles.abilityText}>{ability}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Base Stats</Text>
                {pokemonDetails.stats.map((stat, index) => (
                  <View key={index} style={styles.statRow}>
                    <Text style={styles.statName}>{stat.stat.name}</Text>
                    <View style={styles.statBarContainer}>
                      <View 
                        style={[
                          styles.statBar, 
                          { width: `${(stat.base_stat / 200) * 100}%` }
                        ]} 
                      />
                      <Text style={styles.statValue}>{stat.base_stat}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: theme.background,
  },
  modalHeader: {
    backgroundColor: theme.primary,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalScrollView: {
    flex: 1,
  },
  modalLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.secondary,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
  },
  modalImageContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  modalImage: {
    width: 150,
    height: 150,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.secondary,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  detailSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.secondary,
    marginBottom: 15,
  },
  basicInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  basicInfoItem: {
    alignItems: 'center',
  },
  basicInfoLabel: {
    fontSize: 12,
    color: theme.textLight,
    marginBottom: 5,
  },
  basicInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.secondary,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  typeTagLarge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
  },
  typeTextLarge: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  abilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  abilityTag: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 3,
  },
  abilityText: {
    color: theme.secondary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statName: {
    width: 80,
    fontSize: 14,
    color: theme.textLight,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  statBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    height: 8,
    borderRadius: 4,
    marginLeft: 10,
    marginRight: 10,
  },
  statBar: {
    backgroundColor: theme.primary,
    height: 8,
    borderRadius: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.secondary,
    minWidth: 30,
    textAlign: 'right',
  },
});

export default PokemonModal;
