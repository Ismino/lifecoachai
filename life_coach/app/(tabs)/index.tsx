// index.tsx
//import React from 'react';
/*/import ReactDOM from 'react-dom';
import App from '../app';

// Create a root element for React 18+
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);/*/

import React from 'react';
import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View>
      <Text>Welcome to the Home Screen!</Text>
      <Link href="./login">
        <Text>Go to Login</Text>
      </Link>
    </View>
  );
}


