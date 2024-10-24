
import { StackParamList } from '../types/types';
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
}


