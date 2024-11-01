// app/(tabs)/ChatScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatName, setChatName] = useState<string | null>(null);
  const { sessionId } = useLocalSearchParams();
  const openaiApiKey = Constants.expoConfig?.extra?.openaiApiKey;
  const router = useRouter();

  useEffect(() => {
    loadSessionData();
  }, [sessionId]);

  const loadSessionData = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(`session_${sessionId}`);
      const storedChatName = await AsyncStorage.getItem(`name_${sessionId}`);
      if (storedMessages) setMessages(JSON.parse(storedMessages));
      if (storedChatName) setChatName(storedChatName);
    } catch (error) {
      console.error("Error loading session data:", error);
    }
  };

  const saveSessionData = async (newMessages: Message[], name?: string) => {
    try {
      await AsyncStorage.setItem(`session_${sessionId}`, JSON.stringify(newMessages));
      if (name) {
        await AsyncStorage.setItem(`name_${sessionId}`, name);
      }
    } catch (error) {
      console.error("Error saving session data:", error);
    }
  };

  const generateChatName = async (initialMessage: string) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: 'user', content: `Vad handlar följande om i ett ord eller två: "${initialMessage}"` }],
          max_tokens: 10,
        }),
      });
      const data = await response.json();
      const suggestedName = data.choices[0]?.message?.content || "Namnlös chatt";
      setChatName(suggestedName);
      return suggestedName;
    } catch (error) {
      console.error("Error generating chat name:", error);
      return "Namnlös chatt";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: String(messages.length + 1), text: input, sender: 'user' };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    if (!chatName) {
      const name = await generateChatName(input);
      await saveSessionData(updatedMessages, name);
    } else {
      saveSessionData(updatedMessages);
    }

    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: 'user', content: input }],
          max_tokens: 50,
        }),
      });

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "Ingen respons från AI";
      const aiMessage: Message = { id: String(messages.length + 2), text: aiResponse, sender: 'ai' };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      saveSessionData(finalMessages);
    } catch (error) {
      console.error("Error fetching ChatGPT response:", error);
    } finally {
      setIsLoading(false);
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
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Skicka</Text>
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/DetailScreen')}>
        <Text style={styles.backButtonText}>Tillbaka till Tidigare Chattar</Text>
      </TouchableOpacity>
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
  backButton: { backgroundColor: '#6c757d', padding: 10, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  backButtonText: { color: '#fff', fontSize: 16 },
});
