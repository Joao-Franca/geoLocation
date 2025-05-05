// App.js

import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UsersProvider } from './src/context/UsersContext';
import { Ionicons } from '@expo/vector-icons';

import FormScreen from './src/pages/FormScreen';
import ListScreen from './src/pages/ListScreen';
import MapScreen  from './src/pages/MapScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <UsersProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Form"
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#3498DB',
            tabBarInactiveTintColor: '#777',
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Form') iconName = 'person-add';
              else if (route.name === 'List') iconName = 'list';
              else if (route.name === 'Map')  iconName = 'map';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Form" component={FormScreen} options={{ title: 'Cadastro' }} />
          <Tab.Screen name="List" component={ListScreen} options={{ title: 'Lista' }} />
          <Tab.Screen name="Map"  component={MapScreen}  options={{ title: 'Mapa' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </UsersProvider>
  );
}
