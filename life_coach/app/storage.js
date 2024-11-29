// app/storage.js
// Importerar AsyncStorage från React Native för att hantera lokal datalagring
import AsyncStorage from '@react-native-async-storage/async-storage';

// Spara senaste sessionens ID i lokal lagring (AsyncStorage)
export const saveLastSession = async (sessionId) => {
  try {
    // Lagrar sessionens ID under nyckeln 'lastSession' i AsyncStorage
    await AsyncStorage.setItem('lastSession', String(sessionId));
    console.log("Senaste session sparad:", sessionId); // Loggar vid framgångsrik lagring
  } catch (error) {
    console.error("Fel vid sparning av senaste session:", error); // Loggar fel vid problem
  }
};

// Hämta senaste sessionens ID från lokal lagring (AsyncStorage)
export const getLastSession = async () => {
  try {
    // Hämtar det sparade session-ID:t från AsyncStorage
    const sessionId = await AsyncStorage.getItem('lastSession');
    // Returnerar session-ID som ett nummer, eller null om det inte finns något sparat värde
    return sessionId ? Number(sessionId) : null;
  } catch (error) {
    console.error("Fel vid hämtning av senaste session:", error); // Loggar fel vid problem
    return null; // Returnerar null om ett fel inträffar
  }
};



