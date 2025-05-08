import React, { useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { UsersContext } from '../context/UsersContext';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen({ navigation, route }) {
  const { users, isLoading, error } = useContext(UsersContext);
  const mapRef = useRef(null);

  // pega coords vindas do FormScreen (se houver)
  const { userCoords } = route.params || {};

  // quando vier params, anima centralização no novo usuário
  useEffect(() => {
    if (userCoords && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...userCoords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }, [userCoords]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#356E0D" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error loading users.</Text>
      </View>
    );
  }

  if (!users || users.length === 0) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="close" size={30} color="black" />
        </TouchableOpacity>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: -23.5505,
            longitude: -46.6333,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        />
        <View style={styles.centeredMessage}>
          <Text style={styles.message}>No registered users.</Text>
        </View>
      </View>
    );
  }

  // mostra último usuário cadastrado se nenhum param novo foi passado
  const lastUser = users[users.length - 1];
  const initialRegion = userCoords
    ? { ...userCoords, latitudeDelta: 0.01, longitudeDelta: 0.01 }
    : {
        latitude: lastUser.coords.latitude,
        longitude: lastUser.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

  const handleMarkerPress = (user) => {
    Alert.alert(
      `User: ${user.name}`,
      `Latitude: ${user.coords.latitude.toFixed(6)}\nLongitude: ${user.coords.longitude.toFixed(6)}`,
      [{ text: 'OK', style: 'cancel' }]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="close" size={30} color="black" />
      </TouchableOpacity>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
      >
        {users.map((user) => (
          <Marker
            key={user.id}
            coordinate={user.coords}
            onPress={() => handleMarkerPress(user)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredMessage: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 16,
  },
  message: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
  },
});
