// app/(tabs)/ChatScreen.tsx
// Importerar React och nödvändiga komponenter
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants'; // För att hämta API-nycklar från app-konfigurationen
import AsyncStorage from '@react-native-async-storage/async-storage'; // För lokal datahantering
import { useLocalSearchParams, useRouter } from 'expo-router'; // För navigering och parametermanipulation

// Gränssnitt för att definiera ett meddelandeobjekt
interface Message {
  id: string; // Unikt ID för meddelandet
  text: string; // Meddelandetext
  sender: 'user' | 'ai'; // Avsändare: användare eller AI
}

// Huvudkomponenten för chatt-skärmen
export default function ChatScreen() {
  // State-hantering för användarinput, meddelanden, laddningstillstånd och chattnamn
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatName, setChatName] = useState<string | null>(null);

  // Hämtar session-ID från URL-parametrar
  const { sessionId } = useLocalSearchParams();
  const openaiApiKey = Constants.expoConfig?.extra?.openaiApiKey; // Hämtar API-nyckeln för OpenAI från Expo-konfigurationen
  const router = useRouter(); // För navigering mellan sidor

  // Körs vid initial rendering eller när session-ID ändras, för att ladda sessionsdata
  useEffect(() => {
    loadSessionData();
  }, [sessionId]);

  // Funktion för att ladda sparade meddelanden och chattnamn från AsyncStorage
  const loadSessionData = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(`session_${sessionId}`); // Hämtar sparade meddelanden
      const storedChatName = await AsyncStorage.getItem(`name_${sessionId}`); // Hämtar chattens namn
      if (storedMessages) setMessages(JSON.parse(storedMessages)); // Om meddelanden finns, uppdatera state
      if (storedChatName) setChatName(storedChatName); // Om chattnamn finns, uppdatera state
    } catch (error) {
      console.error("Error loading session data:", error); // Logga eventuella fel
    }
  };

  // Funktion för att spara meddelanden och chattnamn i AsyncStorage
  const saveSessionData = async (newMessages: Message[], name?: string) => {
    try {
      await AsyncStorage.setItem(`session_${sessionId}`, JSON.stringify(newMessages)); // Sparar meddelanden i AsyncStorage
      if (name) {
        await AsyncStorage.setItem(`name_${sessionId}`, name); // Sparar chattens namn om det tillhandahålls
      }
    } catch (error) {
      console.error("Error saving session data:", error); // Logga eventuella fel
    }
  };

  // Genererar ett chattnamn baserat på det första meddelandet med hjälp av OpenAI API
  const generateChatName = async (initialMessage: string) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`, // API-nyckeln används för autentisering
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // Modellen som används
          messages: [{ role: 'user', content: `Vad handlar följande om i ett ord eller två: "${initialMessage}"` }], // Fråga till modellen
          max_tokens: 10, // Begränsning för antalet tokens i svaret
        }),
      });
      const data = await response.json(); // Hämtar svaret från OpenAI
      const suggestedName = data.choices[0]?.message?.content || "Namnlös chatt"; // Förslag eller standardnamn
      setChatName(suggestedName); // Uppdaterar chattens namn i state
      return suggestedName;
    } catch (error) {
      console.error("Error generating chat name:", error); // Logga eventuella fel
      return "Namnlös chatt"; // Återgå till standardnamn vid fel
    }
  };

  // Hanterar när användaren skickar ett meddelande
  const handleSend = async () => {
    if (!input.trim() || isLoading) return; // Avbryt om input är tom eller om laddning pågår

    const userMessage: Message = { id: String(messages.length + 1), text: input, sender: 'user' }; // Skapa användarens meddelande
    const updatedMessages = [...messages, userMessage]; // Lägg till användarens meddelande i meddelandelistan
    setMessages(updatedMessages); // Uppdatera state med det nya meddelandet

    // Generera och spara chattnamn om det inte finns
    if (!chatName) {
      const name = await generateChatName(input);
      await saveSessionData(updatedMessages, name);
    } else {
      saveSessionData(updatedMessages);
    }

    setInput(''); // Rensa inputfältet
    setIsLoading(true); // Sätt laddningstillstånd till true

    try {
      // Skicka meddelandet till OpenAI API och hämta svar
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: 'user', content: input }],
          max_tokens: 200, // Begränsning för AI-svar
        }),
      });

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "Ingen respons från AI"; // Hämta AI:s svar eller en standardtext
      const aiMessage: Message = { id: String(messages.length + 2), text: aiResponse, sender: 'ai' }; // Skapa AI:s meddelande

      const finalMessages = [...updatedMessages, aiMessage]; // Lägg till AI:s meddelande i meddelandelistan
      setMessages(finalMessages); // Uppdatera state
      saveSessionData(finalMessages); // Spara meddelandena
    } catch (error) {
      console.error("Error fetching ChatGPT response:", error); // Logga eventuella fel
    } finally {
      setIsLoading(false); // Stäng av laddningstillstånd
    }
  };

  return (
    <View style={styles.container}>
      {/* Lista över meddelanden */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id} // Unik nyckel för varje meddelande
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        style={styles.chatList}
      />
      {/* Inputfält och skicka-knapp */}
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
      {/* Tillbaka-knapp */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/DetailScreen')}>
        <Text style={styles.backButtonText}>Tillbaka till Tidigare Chattar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Stilar för layout och komponenter
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFE5B4', padding: 20 },
  chatList: { flex: 1, marginBottom: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFE5B4' },
  input: { flex: 1, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, padding: 10, marginRight: 10, backgroundColor: '#FFF5E5' },
  sendButton: { backgroundColor: '#FFA07A', padding: 10, borderRadius: 25 },
  sendButtonText: { color: '#fff', fontWeight: 'bold', backgroundColor: '#FFA07A' },
  messageContainer: { padding: 10, borderRadius: 5, marginVertical: 5, maxWidth: '80%', backgroundColor: '#FFE5B4' },
  userMessage: { backgroundColor: '#FFA07A', alignSelf: 'flex-end' },
  aiMessage: { backgroundColor: '#CC735A', alignSelf: 'flex-start' },
  messageText: { color: '#fff' },
  backButton: { backgroundColor: '#FFA07A', padding: 10, borderRadius: 25, marginTop: 20, alignItems: 'center' },
  backButtonText: { color: '#fff', fontSize: 16, backgroundColor: '#FFA07A' },
});
