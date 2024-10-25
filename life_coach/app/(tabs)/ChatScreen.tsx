// app/(tabs)/ChatScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai'; // Bestäm om meddelandet är från användaren eller AI
}

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = () => {
    if (input.trim()) {
      // Lägg till användarmedelande
      setMessages(prevMessages => [
        ...prevMessages,
        { id: String(prevMessages.length + 1), text: input, sender: 'user' }
      ]);
      
      // Simulera AI-respons
      const aiResponse = `AI Response to: ${input}`; // Simulerad AI-respons

      // Lägg till AI-meddelande efter en kort fördröjning
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { id: String(prevMessages.length + 1), text: aiResponse, sender: 'ai' }
        ]);
      }, 1000); // Simulera fördröjning för AI-respons

      // Töm inmatningsfältet
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
    backgroundColor: '#f0f4f8', // Ljus bakgrundsfärg
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
    backgroundColor: '#fff', // Vit bakgrund för inmatningsfältet
  },
  sendButton: {
    backgroundColor: '#007BFF', // Primär färg för knappar
    padding: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff', // Vit textfärg för knapptext
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    maxWidth: '80%', // Begränsa meddelandets bredd
  },
  userMessage: {
    backgroundColor: '#007BFF', // Användarmedelande bakgrundsfärg
    alignSelf: 'flex-end', // Justera användarmedelanden till höger
  },
  aiMessage: {
    backgroundColor: '#e0e0e0', // AI-meddelande bakgrundsfärg
    alignSelf: 'flex-start', // Justera AI-meddelanden till vänster
  },
  messageText: {
    color: '#fff',
  },
});
