// App.js
// Importerar React för att skapa en React-komponent och `useEffect` för att hantera sid-effekter
import React, { useEffect } from 'react';

// Importerar funktionen `createMessagesTable` från `./database` för att hantera databastabellen
import { createMessagesTable } from './database';

// Huvudkomponenten för applikationen
export default function App() {
  // Använder `useEffect` för att köra kod vid komponentens första rendering
  useEffect(() => {
    // Anropar `createMessagesTable` för att säkerställa att databastabellen skapas
    createMessagesTable();
  }, []); // Tom array som beroende innebär att detta endast körs en gång vid första rendering

  // Returnerar appens huvudkomponent. Ersätt `YourAppRootComponent` med din huvudkomponent.
  return <YourAppRootComponent />;
}

