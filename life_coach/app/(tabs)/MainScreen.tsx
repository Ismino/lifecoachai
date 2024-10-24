/*/import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../types/types';

type MainScreenProps = {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>; // Change to 'Main'
};

export default function MainScreen({ navigation }: MainScreenProps) {
  const sessions = [
    { id: '1', title: 'Coach Session 1' },
    { id: '2', title: 'Coach Session 2' },
  ];

  return (
    <View>
      <Text>Main Screen</Text>
      <FlatList
        data={sessions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text onPress={() => navigation.navigate('Details', { session: item })}>
            {item.title}
          </Text>
        )}
      />
    </View>
  );
}
/*/
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Link } from 'expo-router';

const sessions = [
  { id: '1', title: 'Coach Session 1' },
  { id: '2', title: 'Coach Session 2' },
];

export default function MainScreen() {
  return (
    <View>
      <Text>Main Screen</Text>
      <FlatList
        data={sessions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Link href={`./details?sessionId=${item.id}`} style={{ padding: 10 }}>
            <Text>{item.title}</Text>
          </Link>
        )}
      />
    </View>
  );
}


