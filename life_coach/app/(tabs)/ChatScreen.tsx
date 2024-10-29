// app/(tabs)/ChatScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const openaiApiKey = Constants.expoConfig?.extra?.openaiApiKey; // Använd `expoConfig` istället för `manifest` om du använder nyare Expo

  const handleSend = async () => {
    if (input.trim()) {
      // Lägg till användarens meddelande
      setMessages(prevMessages => [
        ...prevMessages,
        { id: String(prevMessages.length + 1), text: input, sender: 'user' }
      ]);

      // Skicka meddelandet till OpenAI API
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo", // Korrekt modellnamn (ändra till "gpt-4" om du har tillgång)
            messages: [{ role: 'user', content: input }],
            max_tokens: 50,
          }),
        });

        const data = await response.json();
        const aiResponse = data.choices[0]?.message?.content || "Ingen respons från AI"; // Kontrollera att AI svarar

        // Lägg till AI:s svar i chatten
        setMessages(prevMessages => [
          ...prevMessages,
          { id: String(prevMessages.length + 1), text: aiResponse, sender: 'ai' }
        ]);
      } catch (error) {
        console.error("Error fetching ChatGPT response:", error);
      }

      // Rensa inmatningsfältet
      setInput('');
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
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  chatList: {
    flex: 1,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#007BFF',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
  },
});
