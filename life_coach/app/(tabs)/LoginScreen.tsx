/*/import React, { useState } from 'react';
import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { View, TextInput, Button, Text } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Logga in lyckades, navigera till nästa skärm
    } catch (err) {
        const errorMessage = (err as Error).message;
        setError('Fel vid inloggning: ' + errorMessage);
      }
         
  };

  return (
    <View>
      <TextInput placeholder="E-post" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Lösenord" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Logga in" onPress={handleLogin} />
      {error && <Text>{error}</Text>}
    </View>
  );
}
/*/

import React, { useState } from 'react';
import { auth } from '../../config/firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { View, TextInput, Button, Text } from 'react-native';
import { Link } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigate to Main screen after successful login
      // You would typically use navigation from props, but you might also redirect
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError('Login error: ' + errorMessage);
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
      {error && <Text>{error}</Text>}
      <Link href="/(tabs)/MainScreen">
        <Text>Go to Main Screen</Text>
      </Link>
    </View>
  );
}
