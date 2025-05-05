// src/pages/FormScreen.js

import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useLocation from '../hooks/useLocation';
import { UsersContext } from '../context/UsersContext';

export default function FormScreen({ navigation }) {
  const { geocodeAddress } = useLocation();
  const { addUser }        = useContext(UsersContext);

  const [name, setName]       = useState('');
  const [street, setStreet]   = useState('');
  const [number, setNumber]   = useState('');
  const [city, setCity]       = useState('');
  const [stateUf, setStateUf] = useState('');

  const handleSubmit = async () => {
    if (![name, street, number, city, stateUf].every(Boolean)) {
      return Alert.alert('Erro', 'Preencha todos os campos.');
    }
    const fullAddress = `${street}, ${number} - ${city}, ${stateUf}`;
    try {
      const results = await geocodeAddress(fullAddress);
      if (!results.length) {
        return Alert.alert('Erro', 'Endereço não encontrado.');
      }
      const { latitude, longitude } = results[0];
      addUser({ name, address: fullAddress, coords: { latitude, longitude } });

      // limpa form
      setName(''); setStreet(''); setNumber(''); setCity(''); setStateUf('');
      navigation.navigate('Map');
    } catch (err) {
      Alert.alert('Erro na geocodificação', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Cadastro de Usuário</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Rua"
            placeholderTextColor="#999"
            value={street}
            onChangeText={setStreet}
          />

          <TextInput
            style={styles.input}
            placeholder="Número"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={number}
            onChangeText={setNumber}
          />

          <TextInput
            style={styles.input}
            placeholder="Cidade"
            placeholderTextColor="#999"
            value={city}
            onChangeText={setCity}
          />

          <TextInput
            style={styles.input}
            placeholder="Estado (UF)"
            placeholderTextColor="#999"
            value={stateUf}
            onChangeText={setStateUf}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Adicionar Usuário</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F5F9',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 40,     // empurra o conteúdo pra baixo
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    height: 48,
    backgroundColor: '#3498DB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
