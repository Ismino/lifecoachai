// app/(tabs)/DetailScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Importera hooks

export default function DetailScreen() {
  const params = useLocalSearchParams(); // Hämta lokala sökparametrar
  const sessionId = params.sessionId; // Få sessionId från parametrar
  const router = useRouter(); // Initiera router för navigering

  const handleGoToChat = () => {
    router.push('/(tabs)/ChatScreen'); // Navigera till ChatScreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Session Details</Text>
      {sessionId ? (
        <Text style={styles.title}>Details for Session ID: {sessionId}</Text>
      ) : (
        <Text style={styles.error}>No session ID provided.</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleGoToChat}>
        <Text style={styles.buttonText}>Chat with AI Coach</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8', // Ljus bakgrundsfärg
    padding: 20,
    justifyContent: 'center', // Centrera innehållet vertikalt
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2c3e50', // Mörk textfärg för headern
    marginBottom: 20,
    textAlign: 'center', // Centrera headertexten
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Mörk textfärg för sessiondetaljer
    marginBottom: 20,
    textAlign: 'center', // Centrera titeltexten
  },
  error: {
    fontSize: 18,
    color: 'red', // Röd textfärg för felmeddelanden
    textAlign: 'center', // Centrera felmeddelandet
  },
  button: {
    backgroundColor: '#007BFF', // Primär färg för knappar
    padding: 15,
    borderRadius: 5,
    marginTop: 20, // Utrymme ovanför knappen
  },
  buttonText: {
    color: '#fff', // Vit textfärg för knapptext
    fontSize: 18,
    textAlign: 'center',
  },
});

