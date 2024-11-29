// app/index.tsx

// Importerar React och nödvändiga komponenter från 'react-native' och 'expo-router'.
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Link } from 'expo-router'; // Link används för att navigera mellan sidor i en Expo Router-applikation.

export default function HomeScreen() {
  return (
    <View style={styles.container}> 
      {/* Den yttre View fungerar som en container för hela sidan */}
      <Text style={styles.title}>Welcome to Life Coach AI</Text>
      {/* Titeltexten för appens startsida */}
      <Text style={styles.subtitle}>Your journey to self-improvement starts here!</Text>
      {/* Undertext som introducerar syftet med appen */}
      
      <Link href="/(tabs)/LoginScreen" style={styles.link}>
        {/* Navigationslänk som tar användaren till inloggningssidan */}
        <Text style={styles.linkText}>Login</Text>
        {/* Text som visas på knappen för navigering */}
      </Link>
      <Link href="/(tabs)/MainScreen" style={styles.link}>
        {/* Navigationslänk som tar användaren till huvudskärmen där sessionsdata kan visas */}
        <Text style={styles.linkText}>View Sessions</Text>
        {/* Text som visas på knappen för navigering */}
      </Link>
    </View>
  );
}

// Skapar stilar för komponenterna med hjälp av StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1, // Gör att vyn fyller hela tillgängliga höjden
    backgroundColor: '#FFE5B4', // Sätter bakgrundsfärgen till en ljus nyans
    justifyContent: 'center', // Centrerar innehållet vertikalt
    padding: 20, // Lägger till lite padding runt innehållet
  },
  title: {
    fontSize: 32, // Storlek på titeln
    fontWeight: 'bold', // Fet stil för att framhäva titeln
    color: '#CC735A', // Sätter textfärgen till en mörkare nyans
    marginBottom: 20, // Lägger till mellanrum nedanför titeln
    textAlign: 'center', // Centrerar texten horisontellt
  },
  subtitle: {
    fontSize: 20, // Storlek på undertexten
    color: '#CC735A', // Samma färg som titeln för enhetlighet
    marginBottom: 40, // Lägger till större mellanrum efter undertexten
    textAlign: 'center', // Centrerar texten horisontellt
  },
  link: {
    backgroundColor: '#FFA07A', // Sätter en primär färg för länkar/knappar
    padding: 20, // Ger knappen/länken en generös padding
    borderRadius: 25, // Gör kanterna runda
    marginVertical: 15, // Lägger till vertikalt mellanrum mellan knapparna
    textAlign: 'center', // Centrerar innehållet i knappen/länken
    margin: 60, // Justerar knapparnas avstånd från andra element
  },
  linkText: {
    color: '#fff', // Sätter textfärgen till vit för kontrast mot bakgrunden
    fontSize: 18, // Textstorlek på knapparna
    textAlign: 'center', // Centrerar texten horisontellt
  },
});
