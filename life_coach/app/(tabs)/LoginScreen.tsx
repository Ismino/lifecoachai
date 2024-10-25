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


// app/(tabs)/LoginScreen.tsx

import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../../config/firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigate to Main screen after successful login
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError('Login error: ' + errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
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
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
      <Link href="/(tabs)/MainScreen">
        <Text style={styles.link}>Go to Main Screen</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8', // Light background color
    padding: 20,
    justifyContent: 'center', // Center content vertically
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2c3e50', // Darker text color for the header
    marginBottom: 30,
    textAlign: 'center', // Center the header text
  },
  input: {
    height: 50,
    borderColor: '#ccc', // Light border color
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff', // White background for input fields
  },
  button: {
    backgroundColor: '#007BFF', // Primary color for buttons
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff', // White text color for button text
    fontSize: 18,
    textAlign: 'center',
  },
  error: {
    fontSize: 16,
    color: 'red', // Red text color for error messages
    marginBottom: 10,
  },
  link: {
    color: '#007BFF', // Link color
    textAlign: 'center',
    marginTop: 20,
  },
});
/*/

// app/(tabs)/LoginScreen.tsx

// app/(tabs)/LoginScreen.tsx

import React, { useState } from 'react';
import { auth } from '../../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router'; // Import useRouter

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and registration
  const router = useRouter(); // Initialize router for navigation

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    
    // Validation checks
    if (!trimmedEmail || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
      // Navigate to Main screen after successful login
      router.push('/(tabs)/MainScreen'); // Update to your actual MainScreen path
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError('Login error: ' + errorMessage);
    }
  };

  const handleRegister = async () => {
    const trimmedEmail = email.trim();
    
    // Validation checks
    if (!trimmedEmail || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      // Navigate to Main screen after successful registration
      router.push('/(tabs)/MainScreen'); // Update to your actual MainScreen path
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
          <Button title="Register" onPress={handleRegister} />
          <TouchableOpacity onPress={() => setIsRegistering(false)}>
            <Text style={styles.toggleText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Button title="Login" onPress={handleLogin} />
          <TouchableOpacity onPress={() => setIsRegistering(true)}>
            <Text style={styles.toggleText}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
      <Link href="/(tabs)/MainScreen">
        <Text>Go to Main Screen</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  error: {
    fontSize: 16,
    color: 'red',
  },
  toggleText: {
    color: '#007BFF', // Link color
    marginTop: 10,
    textAlign: 'center',
  },
});
