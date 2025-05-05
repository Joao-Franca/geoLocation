// src/pages/MapScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { UsersContext } from '../context/UsersContext';

export default function MapScreen() {
  const { users } = useContext(UsersContext);

  if (!users || users.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Nenhum usuário cadastrado.</Text>
      </View>
    );
  }

  // Centraliza no último usuário
  const last = users[users.length - 1];
  const initialRegion = {
    latitude:       last.coords.latitude,
    longitude:      last.coords.longitude,
    latitudeDelta:  0.1,
    longitudeDelta: 0.1,
  };

  return (
    <MapView style={styles.map} region={initialRegion}>
      {users.map((u, i) => (
        <Marker
          key={i}
          coordinate={u.coords}
          title={u.name}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex:            1,
    justifyContent:  'center',
    alignItems:      'center',
    paddingHorizontal: 16,
  },
  message: {
    fontSize: 16,
    color:    '#666',
  },
});
