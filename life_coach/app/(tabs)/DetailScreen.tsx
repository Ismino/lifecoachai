// app/(tabs)/DetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
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
      // Radera från AsyncStorage
      await AsyncStorage.removeItem(`session_${sessionId}`);
      await AsyncStorage.removeItem(`name_${sessionId}`);
      
      // Uppdatera listan i gränssnittet
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
        <Text style={styles.buttonText}>Till Hemsida</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f8' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  menuButton: { paddingRight: 10 },
  menuText: { fontSize: 24 },
  headerText: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', flex: 1 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  sessionItemContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sessionItem: { backgroundColor: '#007BFF', padding: 15, borderRadius: 5, flex: 1, marginRight: 10 },
  sessionText: { color: '#fff', fontSize: 18, textAlign: 'center' },
  deleteButton: { backgroundColor: '#dc3545', padding: 10, borderRadius: 5 },
  deleteButtonText: { color: '#fff', fontSize: 14, textAlign: 'center' },
  emptyText: { color: '#555', fontSize: 18, textAlign: 'center', marginTop: 20 },
  newChatButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  homeButton: { backgroundColor: '#ffc107', padding: 15, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18 },
});
