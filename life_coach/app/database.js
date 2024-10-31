// app/database.js

import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db;

if (Platform.OS !== 'web') {
  db = SQLite.openDatabase('messages.db');
}

export const createMessagesTable = () => {
  if (Platform.OS === 'web') return;
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        sender TEXT NOT NULL,
        sessionId INTEGER NOT NULL,
        timestamp TEXT
      );`
    );
  });
};

export const saveMessage = (text, sender, sessionId) => {
  if (Platform.OS === 'web') return;
  const timestamp = new Date().toISOString();

  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO messages (text, sender, sessionId, timestamp) VALUES (?, ?, ?, ?);',
      [text, sender, sessionId, timestamp],
      (txObj, resultSet) => {
        console.log("Message saved to SQLite:", resultSet.insertId, { text, sender, sessionId });
      },
      (txObj, error) => {
        console.error("Error saving message to SQLite:", error);
      }
    );
  });
};


export const getMessagesBySession = (sessionId, callback) => {
  if (Platform.OS === 'web') return;
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM messages WHERE sessionId = ? ORDER BY timestamp ASC;',
      [sessionId],
      (_, { rows }) => {
        callback(rows._array);
      }
    );
  });
};

export const getAllSessions = (callback) => {
  if (Platform.OS === 'web') return;
  db.transaction(tx => {
    tx.executeSql(
      'SELECT DISTINCT sessionId FROM messages ORDER BY sessionId DESC;',
      [],
      (_, { rows }) => {
        console.log("Fetched sessions:", rows._array); // Lägg till denna rad för att se om sessionerna hämtas korrekt
        callback(rows._array);
      }
    );
  });
};