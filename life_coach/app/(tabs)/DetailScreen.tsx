// app/(tabs)/DetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Session {
  sessionId: string;
  name: string;
}

export default function DetailScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const sessionKeys = keys.filter((key) => key.startsWith('session_'));
      const loadedSessions = await Promise.all(
        sessionKeys.map(async (key) => {
          const sessionId = key.replace('session_', '');
          const name = (await AsyncStorage.getItem(`name_${sessionId}`)) || 'Unnamed Chat';
          return { sessionId, name };
        })
      );
      setSessions(loadedSessions);
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  };

  const handleGoToChat = (sessionId: string) => {
    router.push({ pathname: '/(tabs)/ChatScreen', params: { sessionId } });
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleDeleteChat = async (sessionId: string) => {
    try {
      await AsyncStorage.removeItem(`session_${sessionId}`);
      await AsyncStorage.removeItem(`name_${sessionId}`);
      setSessions((prevSessions) => prevSessions.filter((session) => session.sessionId !== sessionId));
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Detaljer</Text>
      </View>
      
      <Text style={styles.header}>Alla Tidigare Chattar</Text>
      <FlatList
  data={sessions}
  keyExtractor={(item) => item.sessionId}
  contentContainerStyle={{ alignItems: 'center' }} // Center the entire list content
  renderItem={({ item }) => (
    <View style={styles.sessionItemContainer}>
      <TouchableOpacity
        style={styles.sessionItem}
        onPress={() => handleGoToChat(item.sessionId)}
      >
        <Text style={styles.sessionText}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteChat(item.sessionId)}
      >
        <Text style={styles.deleteButtonText}>Radera</Text>
      </TouchableOpacity>
    </View>
  )}
  ListEmptyComponent={<Text style={styles.emptyText}>Inga tidigare chattar tillgängliga</Text>}
/>
      
      <TouchableOpacity style={styles.newChatButton} onPress={() => handleGoToChat(new Date().getTime().toString())}>
        <Text style={styles.buttonText}>Starta ny chatt</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
        <Text style={styles.buttonText}>Till Startsidan</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window'); // För att justera knappstorleken beroende på skärmstorlek
const buttonWidth = width * 0.6; // Anpassa bredden till 40% av skärmbredden

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFE5B4' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  menuButton: { paddingRight: 10 },
  menuText: { fontSize: 24 },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#FFA07A', textAlign: 'center', flex: 1 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#FFA07A', marginBottom: 20, textAlign: 'center' },

  sessionItemContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sessionItem: {
    backgroundColor: '#FFA07A',
    padding: 12,
    borderRadius: 25,
    width: buttonWidth,
    marginRight: 10,
    alignItems: 'center',
  },
  sessionText: { color: '#fff', fontSize: 16, textAlign: 'center' },
deleteButton: {
  backgroundColor: '#FF7F50',
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 25,
  alignItems: 'center',
},
  deleteButtonText: { color: '#fff', fontSize: 14, textAlign: 'center' },

  emptyText: { color: '#555', fontSize: 18, textAlign: 'center', marginTop: 20 },
  newChatButton: {
    backgroundColor: '#FFA07A',
    padding: 12,
    borderRadius: 25,
    width: buttonWidth,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  homeButton: {
    backgroundColor: '#FFA07A',
    padding: 12,
    borderRadius: 25,
    width: buttonWidth,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});
