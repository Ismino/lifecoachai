// app/(tabs)/DetailScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getMessagesBySession } from '../database';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function DetailScreen() {
  const { sessionId } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (sessionId) {
      getMessagesBySession(Number(sessionId), (loadedMessages: { id: number; text: string; sender: string }[]) => {
        const formattedMessages: Message[] = loadedMessages.map((msg) => ({
          id: String(msg.id),
          text: msg.text,
          sender: msg.sender as 'user' | 'ai',
        }));
        setMessages(formattedMessages);
      });
    }
  }, [sessionId]);

  const handleGoToChat = () => {
    router.push('/(tabs)/ChatScreen'); // Navigera till ChatScreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Session Details for ID: {sessionId}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={handleGoToChat}>
        <Text style={styles.buttonText}>Chat with AI Coach</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f8' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  messageContainer: { padding: 10, borderRadius: 5, marginVertical: 5 },
  userMessage: { backgroundColor: '#007BFF', alignSelf: 'flex-end' },
  aiMessage: { backgroundColor: '#e0e0e0', alignSelf: 'flex-start' },
  messageText: { color: '#fff' },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18 },
});
