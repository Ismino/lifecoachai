// app/database.js

// Importerar SQLite från 'expo-sqlite' och Platform från React Native
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Initialiserar databasen endast om appen inte körs på webben
let db;
if (Platform.OS !== 'web') {
  // Öppnar eller skapar en SQLite-databas med namnet 'messages.db'
  db = SQLite.openDatabase('messages.db');
}

// Funktion för att skapa en tabell för meddelanden i SQLite
export const createMessagesTable = () => {
  // Returnerar direkt om appen körs på webben (SQLite stöds inte i webbläsaren)
  if (Platform.OS === 'web') return;

  // Startar en transaktion för att skapa tabellen
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unikt ID för varje meddelande
        text TEXT NOT NULL,                    -- Textinnehållet i meddelandet
        sender TEXT NOT NULL,                  -- Avsändare av meddelandet ('user' eller 'ai')
        sessionId INTEGER NOT NULL,            -- ID för sessionen meddelandet tillhör
        timestamp TEXT                         -- Tidsstämpel för när meddelandet skapades
      );`
    );
  });
};

// Funktion för att spara ett meddelande i SQLite-databasen
export const saveMessage = (text, sender, sessionId) => {
  // Returnerar direkt om appen körs på webben
  if (Platform.OS === 'web') return;

  // Skapar en tidsstämpel för meddelandet
  const timestamp = new Date().toISOString();

  // Startar en transaktion för att infoga meddelandet i databasen
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO messages (text, sender, sessionId, timestamp) VALUES (?, ?, ?, ?);',
      [text, sender, sessionId, timestamp], // Skickar meddelandets data som parametrar
      (txObj, resultSet) => {
        console.log("Message saved to SQLite:", resultSet.insertId, { text, sender, sessionId });
        // Loggar det infogade meddelandets ID vid framgång
      },
      (txObj, error) => {
        console.error("Error saving message to SQLite:", error); // Loggar fel vid problem
      }
    );
  });
};

// Funktion för att hämta alla meddelanden för en specifik session
export const getMessagesBySession = (sessionId, callback) => {
  // Returnerar direkt om appen körs på webben
  if (Platform.OS === 'web') return;

  // Startar en transaktion för att hämta meddelanden från databasen
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM messages WHERE sessionId = ? ORDER BY timestamp ASC;',
      [sessionId], // Använder sessionens ID som parameter för att filtrera resultatet
      (_, { rows }) => {
        callback(rows._array); // Returnerar resultatet som en array via callback-funktionen
      }
    );
  });
};

// Funktion för att hämta alla sessioner från databasen
export const getAllSessions = (callback) => {
  // Returnerar direkt om appen körs på webben
  if (Platform.OS === 'web') return;

  // Startar en transaktion för att hämta alla unika session-ID:n
  db.transaction(tx => {
    tx.executeSql(
      'SELECT DISTINCT sessionId FROM messages ORDER BY sessionId DESC;',
      [], // Ingen parameter behövs för denna fråga
      (_, { rows }) => {
        console.log("Fetched sessions:", rows._array); // Loggar de hämtade sessionerna
        callback(rows._array); // Returnerar resultatet som en array via callback-funktionen
      }
    );
  });
};
