import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import AdminScreen from './src/screens/AdminScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LevelScreen from './src/screens/LevelScreen';
import FlashcardsScreen from './src/screens/FlashcardsScreen';
import QuizScreen from './src/screens/QuizScreen';
import './src/db/firebase';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Auth">
          <Stack.Screen name="Auth" component={AuthScreen} options={{ title: 'RetoVoc' }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'RetoVoc' }} />
          <Stack.Screen name="Level" component={LevelScreen} options={({ route }) => ({ title: route.params?.label || 'Nivel' })} />
          <Stack.Screen name="Flashcards" component={FlashcardsScreen} options={{ title: 'Flashcards' }} />
          <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Mi Perfil' }} />
          <Stack.Screen name="Admin" component={AdminScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
