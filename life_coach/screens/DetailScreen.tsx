
import { StackParamList } from '../types/types';
import React from 'react';
import { View, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';

// Typen för route-parametern
type DetailScreenRouteProp = RouteProp<StackParamList, 'DetailScreen'>;

// Props-typen som innehåller route
type Props = {
  route: DetailScreenRouteProp;
};

export default function DetailScreen({ route }: Props) {
  // Destrukturera session-parametern från route
  const { session } = route.params;

  // Returnera layouten med sessionens title
  return (
    <View>
      <Text>{session.title}</Text>
    </View>
  );
}

