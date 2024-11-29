// app/(tabs)/MainScreen.tsx

// Importerar React och nödvändiga komponenter från 'react-native' och 'expo-router'
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // Importerar useRouter för att navigera mellan skärmar

// En array som representerar sessionsdata
const sessions = [
  { id: '1', title: 'Coach Session 1' }, // Ett objekt som representerar en session
  { id: '2', title: 'Coach Session 2' }, // Ett annat objekt som representerar en session
];

export default function MainScreen() {
  const router = useRouter(); // Skapar en instans av useRouter för navigering

  // Funktion för att navigera till detaljerad skärm för en specifik session
  const navigateToDetail = (sessionId: string) => {
    router.push(`/DetailScreen?sessionId=${sessionId}`); 
    // Skickar användaren till en detaljerad skärm och inkluderar sessionens ID som en query-parameter
  };

  return (
    <View style={styles.container}>
      {/* Yttre View-container som håller skärmens layout */}
      <Text style={styles.header}>Available Sessions</Text>
      {/* Header för skärmen som visar rubriken */}
      <FlatList
        data={sessions} // Tilldelar sessionsdata till FlatList för att rendera en lista
        keyExtractor={(item) => item.id} // Anger en unik nyckel för varje element i listan
        renderItem={({ item }) => (
          // Renderar varje session i listan som en knapp
          <TouchableOpacity
            onPress={() => navigateToDetail(item.id)} // Navigerar till sessionsdetaljer när knappen trycks
            style={styles.sessionButton}
          >
            <Text style={styles.sessionTitle}>{item.title}</Text>
            {/* Visar sessionens titel */}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// Skapar stilar för komponenterna
const styles = StyleSheet.create({
  container: {
    flex: 1, // Gör att container fyller hela skärmen
    backgroundColor: '#FFE5B4', // Ljus bakgrundsfärg för en behaglig design
    padding: 20, // Lägger till padding runt innehållet
  },
  header: {
    fontSize: 30, // Stor textstorlek för rubriken
    fontWeight: 'bold', // Fetstil för att framhäva texten
    color: '#CC735A', // Mörkare textfärg för rubriken
    marginBottom: 20, // Lägger till mellanrum under rubriken
    textAlign: 'center', // Centrerar texten horisontellt
  },
  sessionButton: {
    backgroundColor: '#FFA07A', // Färg för sessionens knapp
    padding: 15, // Lägger till padding runt knappen
    borderRadius: 25, // Gör knappen rundad
    marginVertical: 10, // Vertikalt mellanrum mellan knappar
    shadowColor: '#000', // Skugga för att ge en upphöjd effekt
    shadowOffset: {
      width: 0, // Ingen horisontell förskjutning av skuggan
      height: 2, // Vertikal förskjutning av skuggan
    },
    shadowOpacity: 0.2, // Genomskinlighet för skuggan
    shadowRadius: 2, // Radie för skuggan
    elevation: 3, // Android-skuggning (lyfter upp komponenten)
  },
  sessionTitle: {
    color: '#fff', // Vit textfärg för bättre kontrast mot knappens bakgrund
    fontSize: 18, // Textstorlek för sessionstiteln
    textAlign: 'center', // Centrerar texten horisontellt
  },
});
