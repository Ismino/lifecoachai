// app/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Spara senaste sessionens ID
export const saveLastSession = async (sessionId) => {
  try {
    await AsyncStorage.setItem('lastSession', String(sessionId));
    console.log("Senaste session sparad:", sessionId);
  } catch (error) {
    console.error("Fel vid sparning av senaste session:", error);
  }
};

// Hämta senaste sessionens ID
export const getLastSession = async () => {
  try {
    const sessionId = await AsyncStorage.getItem('lastSession');
    return sessionId ? Number(sessionId) : null;
  } catch (error) {
    console.error("Fel vid hämtning av senaste session:", error);
    return null;
  }
};


