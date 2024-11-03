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
      await AsyncStorage.removeItem(`session_${sessionId}`);
      await AsyncStorage.removeItem(`name_${sessionId}`);
      setSessions((prevSessions) => prevSessions.filter((session) => session.sessionId !== sessionId));
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Alla Tidigare Chattar</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.sessionId}
        contentContainerStyle={{ alignItems: 'center' }}
        renderItem={({ item }) => (
          <View style={styles.sessionItemContainer}>
            <TouchableOpacity
              style={styles.sessionButton}
              onPress={() => handleGoToChat(item.sessionId)}
            >
              <Text style={styles.sessionTitle}>{item.name}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5B4',
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#CC735A',
    marginBottom: 20,
    textAlign: 'center',
  },
  sessionItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  sessionButton: {
    backgroundColor: '#FFA07A',
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: '70%', // 70% width for responsiveness
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    alignItems: 'center',
    marginRight: 10,
  },
  sessionTitle: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF7F50',
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
    width: '70%', // 70% width for responsiveness
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
    width: '70%', // 70% width for responsiveness
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontSize: 18, textAlign: 'center' },
});

