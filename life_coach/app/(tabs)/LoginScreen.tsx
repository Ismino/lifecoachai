// app/(tabs)/LoginScreen.tsx

import React, { useState } from 'react';
import { auth } from '../../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
      router.push('/(tabs)/MainScreen'); 
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError('Login error: ' + errorMessage);
    }
  };

  const handleRegister = async () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      router.push('/(tabs)/MainScreen');
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError('Registration error: ' + errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
        style={styles.input} 
      />
      
      {isRegistering ? (
        <>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleRegister} style={styles.authButton}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setIsRegistering(false)}>
            <Text style={styles.toggleText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleLogin} style={styles.authButton}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setIsRegistering(true)}>
            <Text style={styles.toggleText}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
      <Link href="/(tabs)/MainScreen">
        <Text style={styles.linkText}>Go to Main Screen</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5B4',
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: '#FFA07A',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginVertical: 10,
    borderRadius: 25,
    overflow: 'hidden',
    width: '80%',
    alignSelf: 'center',
  },
  authButton: {
    backgroundColor: '#FFA07A',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  toggleText: {
    color: '#FFA07A',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  linkText: {
    color: '#007BFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
