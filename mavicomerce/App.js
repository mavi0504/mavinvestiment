// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importações dos componentes
import HomeScreen from './src/screens/HomeScreen';
import AlertsScreen from './src/screens/AlertsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#0052CC',
          tabBarInactiveTintColor: '#6B778C',
          tabBarStyle: { paddingBottom: 5, height: 60 }
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ tabBarLabel: 'Cotações' }}
        />
        <Tab.Screen 
          name="Alertas" 
          component={AlertsScreen} 
          options={{ tabBarLabel: 'Alertas' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
