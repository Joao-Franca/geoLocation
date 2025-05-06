import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UsersProvider } from './src/context/UsersContext';
import HomeScreen from './src/pages/HomeScreen';
import FormScreen from './src/pages/FormScreen';
import ListScreen from './src/pages/ListScreen';
import MapScreen from './src/pages/MapScreen';
import { Image, Keyboard } from 'react-native';
import { useEffect, useState } from 'react';

// Criar o stack e o tab navigator
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarVisible: getTabBarVisibility(route) && !keyboardVisible,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0361AB',
          display: keyboardVisible ? 'none' : 'flex',
        },
        tabBarLabelStyle: {
          color: 'white',  
        },
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === 'Form') {
            iconName = require('./assets/Cadaster.png'); 
          } else if (route.name === 'List') {
            iconName = require('./assets/List.png'); 
          } else if (route.name === 'Map') {
            iconName = require('./assets/Map.png'); 
          }
          return (
            <Image 
              source={iconName} 
              style={{ 
                width: 24, 
                height: 24,
                tintColor: focused ? 'white' : 'rgba(255,255,255,0.5)'
              }} 
            />
          );
        },
      })}
    >
      <Tab.Screen 
        name="Form" 
        component={FormScreen} 
        options={{ title: 'Cadaster' }} 
      />
      <Tab.Screen 
        name="List" 
        component={ListScreen} 
        options={{ title: 'List' }} 
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{ title: 'Map' }} 
      />
    </Tab.Navigator>
  );
}

function getTabBarVisibility(route) {
  return true;
}

export default function App() {
  return (
    <UsersProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </UsersProvider>
  );
}