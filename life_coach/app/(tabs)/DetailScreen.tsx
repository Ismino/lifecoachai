
/*import { StackParamList } from '@/types/types';
import React from 'react';
import { View, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';

type DetailScreenRouteProp = RouteProp<StackParamList, 'Details'>;

type Props = {
  route: DetailScreenRouteProp;
};

export default function DetailScreen({ route }: Props) {
  const { session } = route.params;  // Hämta session från route
  return (
    <View>
      <Text>{session.title}</Text>
    </View>
  );
}/*/

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Import the hook

export default function DetailScreen() {
  const params = useLocalSearchParams(); // Get local search parameters
  const sessionId = params.sessionId; // Access sessionId from parameters

  return (
    <View style={styles.container}>
      {sessionId ? (
        <Text style={styles.title}>Details for Session ID: {sessionId}</Text>
      ) : (
        <Text style={styles.error}>No session ID provided.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
});

















