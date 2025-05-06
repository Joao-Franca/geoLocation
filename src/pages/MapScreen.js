// src/pages/MapScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { UsersContext } from '../context/UsersContext';
import { Ionicons } from '@expo/vector-icons'; // Para o ícone de sair

export default function MapScreen({ navigation }) {
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
    <View style={styles.container}>
      {/* Botão de sair no canto superior direito */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="close" size={30} color="black" />
      </TouchableOpacity>

      <MapView style={styles.map} region={initialRegion}>
        {users.map((u, i) => (
          <Marker
            key={i}
            coordinate={u.coords}
            title={u.name}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',  // Para garantir que o botão de fechar fique no topo
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  message: {
    fontSize: 16,
    color: '#666',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    zIndex: 1, // Garante que o botão fique acima do mapa
  },
});
