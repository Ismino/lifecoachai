// app/database.js

import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db = null;
if (Platform.OS !== 'web') {
  db = SQLite.openDatabase('messages.db');
}

export const createMessagesTable = () => {
  if (!db) return;

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
  if (!db) return;

  const timestamp = new Date().toISOString();
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO messages (text, sender, sessionId, timestamp) values (?, ?, ?, ?);',
      [text, sender, sessionId, timestamp]
    );
  });
};

export const getMessagesBySession = (sessionId, callback) => {
  if (!db) return;

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
