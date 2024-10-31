// App.js
import React, { useEffect } from 'react';
import { createMessagesTable } from './database';

export default function App() {
  useEffect(() => {
    createMessagesTable();
  }, []);

  return <YourAppRootComponent />;
}
