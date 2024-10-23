import React, { useState } from 'react';
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
