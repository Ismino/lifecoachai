// app/(tabs)/LoginScreen.tsx

// Importerar React och användbara komponenter
import React, { useState } from 'react';
import { auth } from '../../config/firebaseConfig'; // Importerar Firebase-konfigurationen
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; // Firebase-metoder för autentisering
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native'; // React Native-komponenter
import { Link, useRouter } from 'expo-router'; // Expo-router för navigering

export default function LoginScreen() {
  // State för att hantera användarens input och appens tillstånd
  const [email, setEmail] = useState(''); // Hanterar e-postinput
  const [password, setPassword] = useState(''); // Hanterar lösenord
  const [error, setError] = useState(''); // Hanterar felmeddelanden
  const [isRegistering, setIsRegistering] = useState(false); // Hanterar växling mellan inloggning och registrering
  const router = useRouter(); // Används för att navigera mellan sidor

  // Funktion för att hantera inloggning
  const handleLogin = async () => {
    const trimmedEmail = email.trim(); // Tar bort extra mellanslag

    if (!trimmedEmail || !password) {
      setError('Please enter both email and password.'); // Visar fel om något fält är tomt
      return;
    }

    try {
      // Firebase-inloggning
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
      router.push('/(tabs)/MainScreen'); // Navigerar till huvudskärmen om inloggningen lyckas
    } catch (err) {
      const errorMessage = (err as Error).message; // Fångar och visar felmeddelandet
      setError('Login error: ' + errorMessage);
    }
  };

  // Funktion för att hantera registrering
  const handleRegister = async () => {
    const trimmedEmail = email.trim(); // Tar bort extra mellanslag

    if (!trimmedEmail || !password) {
      setError('Please enter both email and password.'); // Visar fel om något fält är tomt
      return;
    }

    try {
      // Firebase-registrering
      await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      router.push('/(tabs)/MainScreen'); // Navigerar till huvudskärmen efter lyckad registrering
    } catch (err) {
      const errorMessage = (err as Error).message; // Fångar och visar felmeddelandet
      setError('Registration error: ' + errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      {/* Textfält för att mata in e-post */}
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
      />
      {/* Textfält för att mata in lösenord */}
      <TextInput 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
        style={styles.input} 
      />
      
      {isRegistering ? (
        <>
          {/* Om användaren registrerar sig visas registreringsknappen */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleRegister} style={styles.authButton}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
          {/* Länk för att växla tillbaka till inloggning */}
          <TouchableOpacity onPress={() => setIsRegistering(false)}>
            <Text style={styles.toggleText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Om användaren loggar in visas inloggningsknappen */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleLogin} style={styles.authButton}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
          {/* Länk för att växla till registrering */}
          <TouchableOpacity onPress={() => setIsRegistering(true)}>
            <Text style={styles.toggleText}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Felmeddelande visas om det finns ett fel */}
      {error && <Text style={styles.error}>{error}</Text>}
      {/* Direktlänk till huvudskärmen */}
      <Link href="/(tabs)/MainScreen">
        <Text style={styles.linkText}>Go to Main Screen</Text>
      </Link>
    </View>
  );
}

// Stilar för komponenterna
const styles = StyleSheet.create({
  container: {
    flex: 1, // Fyller hela skärmen
    backgroundColor: '#FFE5B4', // Ljus bakgrundsfärg
    padding: 20, // Padding runt innehållet
  },
  input: {
    height: 50, // Höjd på textfältet
    borderColor: '#FFA07A', // Kantfärg
    borderWidth: 1, // Tjocklek på kantlinjen
    borderRadius: 25, // Rundade hörn
    marginBottom: 15, // Mellanrum mellan textfält
    paddingHorizontal: 10, // Padding inuti textfältet
    backgroundColor: '#fff', // Vit bakgrund
  },
  buttonContainer: {
    marginVertical: 10, // Vertikalt mellanrum runt knappen
    borderRadius: 25, // Rundade hörn
    overflow: 'hidden', // Döljer innehåll utanför knappen
    width: '80%', // Bredd på knappen
    alignSelf: 'center', // Centrerar knappen horisontellt
  },
  authButton: {
    backgroundColor: '#FFA07A', // Bakgrundsfärg för knappar
    paddingVertical: 12, // Vertikal padding
    borderRadius: 25, // Rundade hörn
    alignItems: 'center', // Centrerar innehållet horisontellt
  },
  buttonText: {
    color: '#fff', // Vit textfärg
    fontSize: 16, // Textstorlek
    fontWeight: 'bold', // Fetstil
  },
  error: {
    fontSize: 16, // Textstorlek för felmeddelande
    color: 'red', // Röd färg för felmeddelande
    marginTop: 10, // Marginal ovanför felmeddelandet
    textAlign: 'center', // Centrerar texten horisontellt
  },
  toggleText: {
    color: '#FFA07A', // Färg för texten som växlar mellan inloggning och registrering
    fontSize: 16, // Textstorlek
    marginTop: 10, // Marginal ovanför texten
    textAlign: 'center', // Centrerar texten horisontellt
  },
  linkText: {
    color: '#007BFF', // Länkens färg
    fontSize: 16, // Textstorlek
    textAlign: 'center', // Centrerar texten horisontellt
    marginTop: 20, // Marginal ovanför länken
  },
});