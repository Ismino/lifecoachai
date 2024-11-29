// app/(tabs)/DetailScreen.tsx

// Importerar nödvändiga bibliotek och komponenter
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Används för navigering
import AsyncStorage from '@react-native-async-storage/async-storage'; // För att lagra och hämta data lokalt

// Typdefiniering för sessionerna
interface Session {
  sessionId: string;
  name: string;
}

// Huvudfunktionen för detaljskärmen
export default function DetailScreen() {
  const [sessions, setSessions] = useState<Session[]>([]); // State för att lagra sessionerna
  const router = useRouter(); // Router för att navigera mellan skärmar

  // Anropas när komponenten laddas, för att hämta tidigare sessioner
  useEffect(() => {
    loadSessions();
  }, []);

  // Funktion för att hämta och ladda tidigare sessioner från AsyncStorage
  const loadSessions = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys(); // Hämtar alla nycklar från AsyncStorage
      const sessionKeys = keys.filter((key) => key.startsWith('session_')); // Filtrerar nycklar relaterade till sessioner
      const loadedSessions = await Promise.all(
        sessionKeys.map(async (key) => {
          const sessionId = key.replace('session_', ''); // Extraherar session-ID från nyckeln
          const name = (await AsyncStorage.getItem(`name_${sessionId}`)) || 'Unnamed Chat'; // Hämtar sessionens namn eller standardnamn
          return { sessionId, name }; // Returnerar sessionens data
        })
      );
      setSessions(loadedSessions); // Uppdaterar state med de laddade sessionerna
    } catch (error) {
      console.error("Error loading sessions:", error); // Loggar eventuella fel
    }
  };

  // Navigerar till en chatt för det valda session-ID:t
  const handleGoToChat = (sessionId: string) => {
    router.push({ pathname: '/(tabs)/ChatScreen', params: { sessionId } }); // Navigerar till ChatScreen med session-ID som parameter
  };

  // Navigerar tillbaka till startsidan
  const handleGoHome = () => {
    router.push('/'); // Navigerar till startsidan
  };

  // Tar bort en chatt (session) från AsyncStorage och uppdaterar listan
  const handleDeleteChat = async (sessionId: string) => {
    try {
      await AsyncStorage.removeItem(`session_${sessionId}`); // Tar bort session-ID från AsyncStorage
      await AsyncStorage.removeItem(`name_${sessionId}`); // Tar bort namnet kopplat till session-ID
      setSessions((prevSessions) => prevSessions.filter((session) => session.sessionId !== sessionId)); // Uppdaterar listan i state
    } catch (error) {
      console.error("Error deleting session:", error); // Loggar eventuella fel
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Alla Tidigare Chattar</Text> {/* Header för sidan */}
      <FlatList
        data={sessions} // Data för listan
        keyExtractor={(item) => item.sessionId} // Unik nyckel för varje item
        contentContainerStyle={{ alignItems: 'center' }} // Centrerar listans innehåll
        renderItem={({ item }) => (
          <View style={styles.sessionItemContainer}>
            <TouchableOpacity
              style={styles.sessionButton}
              onPress={() => handleGoToChat(item.sessionId)} // Öppnar chatten när knappen trycks
            >
              <Text style={styles.sessionTitle}>{item.name}</Text> {/* Visar sessionens namn */}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteChat(item.sessionId)} // Raderar chatten när knappen trycks
            >
              <Text style={styles.deleteButtonText}>Radera</Text> {/* Text för radera-knappen */}
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Inga tidigare chattar tillgängliga</Text>} // Text som visas om listan är tom
      />
      
      {/* Knapp för att starta en ny chatt */}
      <TouchableOpacity style={styles.newChatButton} onPress={() => handleGoToChat(new Date().getTime().toString())}>
        <Text style={styles.buttonText}>Starta ny chatt</Text>
      </TouchableOpacity>

      {/* Knapp för att gå tillbaka till startsidan */}
      <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
        <Text style={styles.buttonText}>Till Startsidan</Text>
      </TouchableOpacity>
    </View>
  );
}

// Stilar för komponenterna
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5B4', // Ljus bakgrundsfärg
    padding: 20,
  },
  header: {
    fontSize: 30, // Stor textstorlek för headern
    fontWeight: 'bold', // Fet text
    color: '#CC735A', // Textfärg
    marginBottom: 20,
    textAlign: 'center', // Centrerar texten
  },
  sessionItemContainer: {
    flexDirection: 'row', // Lägger knapparna på samma rad
    alignItems: 'center',
    marginVertical: 10, // Mellanrum mellan chattobjekt
  },
  sessionButton: {
    backgroundColor: '#FFA07A', // Färg för session-knappar
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: '70%',
    shadowColor: '#000', // Skugga
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    alignItems: 'center',
    marginRight: 10,
  },
  sessionTitle: {
    color: '#fff', // Vit textfärg
    fontSize: 18,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF7F50', // Färg för radera-knappen
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  deleteButtonText: { color: '#fff', fontSize: 14, textAlign: 'center' },
  emptyText: { color: '#555', fontSize: 18, textAlign: 'center', marginTop: 20 },
  newChatButton: {
    backgroundColor: '#FFA07A',
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  homeButton: {
    backgroundColor: '#FFA07A',
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontSize: 18, textAlign: 'center' },
});
