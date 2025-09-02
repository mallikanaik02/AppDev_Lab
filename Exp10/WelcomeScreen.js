import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hiee! What’s your name?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        onChangeText={setName}
        value={name}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Todo', { name })}
      >
        <Text style={styles.buttonText}>Let's Start 🍓</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9eaf5ff',fontWeight: 'bold' },
  title: { fontSize: 28, marginBottom: 30, fontFamily: 'Cochin', color: '#ff8eacff' },
  input: { borderWidth: 1, borderColor: '#EFA4B8', borderRadius: 25, padding: 10, width: '60%', color: '#5e5555ff', textAlign: 'center', backgroundColor: '#FFFDF9' },
  button: { marginTop: 30, backgroundColor: '#ffd1f1ff', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 25 },
  buttonText: { fontSize: 14, color: '#4B4B4B', fontWeight: 'bold' },
});
