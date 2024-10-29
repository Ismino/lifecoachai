// app/(tabs)/ChatScreen.tsx
// app/(tabs)/ChatScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native'; // Lägg till Platform
import Constants from 'expo-constants';
import { createMessagesTable, saveMessage, getMessagesBySession } from '../database';
import { useLocalSearchParams } from 'expo-router';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Lägg till laddningsstatus
  const { sessionId } = useLocalSearchParams();
  const openaiApiKey = Constants.expoConfig?.extra?.openaiApiKey;

  useEffect(() => {
    if (Platform.OS !== 'web') {
      createMessagesTable();
      loadMessages();
    }
  }, [sessionId]);

  const loadMessages = () => {
    if (Platform.OS !== 'web' && sessionId) {
      getMessagesBySession(Number(sessionId), (loadedMessages: { id: number; text: string; sender: string }[]) => {
        const formattedMessages = loadedMessages.map(msg => ({
          id: String(msg.id),
          text: msg.text,
          sender: msg.sender as 'user' | 'ai',
        }));
        setMessages(formattedMessages);
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return; // Returnera direkt om inmatningen är tom eller om ett anrop redan pågår

    // Lägg till användarens meddelande direkt
    const userMessage: Message = { id: String(messages.length + 1), text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    if (Platform.OS !== 'web') {
      saveMessage(input, 'user', Number(sessionId));
    }
    setInput('');
    setIsLoading(true); // Starta laddningsindikatorn

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: 'system', content: 'Du är en hjälpande AI och ska svara på svenska.' },
            { role: 'user', content: input }
          ],
          max_tokens: 50,
        }),
      });

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "Ingen respons från AI";
      const aiMessage: Message = { id: String(messages.length + 2), text: aiResponse, sender: 'ai' };

      setMessages(prevMessages => [...prevMessages, aiMessage]);
      if (Platform.OS !== 'web') {
        saveMessage(aiResponse, 'ai', Number(sessionId));
      }
    } catch (error) {
      console.error("Error fetching ChatGPT response:", error);
    } finally {
      setIsLoading(false); // Stäng av laddningsindikatorn
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        style={styles.chatList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Skriv ditt meddelande..."
          value={input}
          onChangeText={setInput}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" /> // Visa laddningsindikator om ett anrop pågår
          ) : (
            <Text style={styles.sendButtonText}>Skicka</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8', padding: 20 },
  chatList: { flex: 1, marginBottom: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, padding: 10, marginRight: 10, backgroundColor: '#fff' },
  sendButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
  messageContainer: { padding: 10, borderRadius: 5, marginVertical: 5, maxWidth: '80%' },
  userMessage: { backgroundColor: '#007BFF', alignSelf: 'flex-end' },
  aiMessage: { backgroundColor: '#e0e0e0', alignSelf: 'flex-start' },
  messageText: { color: '#fff' },
});
