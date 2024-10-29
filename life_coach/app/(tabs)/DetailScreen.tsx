// app/(tabs)/DetailScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllSessions } from '../database';

interface Session {
  sessionId: number;
}

export default function DetailScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    getAllSessions((loadedSessions: { sessionId: number }[]) => {
      console.log("Loaded sessions:", loadedSessions); // Lägg till denna logg
      setSessions(loadedSessions);
    });
  };

  const handleGoToChat = (sessionId?: number) => {
    router.push({ pathname: '/(tabs)/ChatScreen', params: { sessionId: String(sessionId || new Date().getTime()) } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Alla Tidigare Chattar</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.sessionId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.sessionItem} onPress={() => handleGoToChat(item.sessionId)}>
            <Text style={styles.sessionText}>Session ID: {item.sessionId}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Inga tidigare chattar tillgängliga</Text>}
      />
      <TouchableOpacity style={styles.newChatButton} onPress={() => handleGoToChat()}>
        <Text style={styles.buttonText}>Starta ny chatt</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f8' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  sessionItem: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  sessionText: { color: '#fff', fontSize: 18, textAlign: 'center' },
  emptyText: { color: '#555', fontSize: 18, textAlign: 'center', marginTop: 20 },
  newChatButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18 },
});
