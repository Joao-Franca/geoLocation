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
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useLocation from '../hooks/useLocation';
import { UsersContext } from '../context/UsersContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FormScreen({ navigation }) {
  const { geocodeAddress } = useLocation();
  const { addUser } = useContext(UsersContext);

  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [city, setCity] = useState('');
  const [stateUf, setStateUf] = useState('');

  const clearForm = () => {
    setName('');
    setStreet('');
    setNumber('');
    setCity('');
    setStateUf('');
  };

  const saveUserToStorage = async (user) => {
    try {
      const existing = await AsyncStorage.getItem('@users');
      const users = existing ? JSON.parse(existing) : [];
      users.push(user);
      await AsyncStorage.setItem('@users', JSON.stringify(users));
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const handleSubmit = async () => {
    if (![name, street, number, city, stateUf].every(Boolean)) {
      return Alert.alert('Erro', 'Preencha todos os campos.');
    }

    const fullAddress = `${street}, ${number} - ${city}, ${stateUf}`;
    try {
      const results = await geocodeAddress(fullAddress);
      if (!results || results.length === 0) {
        return Alert.alert('Erro', 'Endereço não encontrado.');
      }
      const { latitude, longitude } = results[0];
      const newUser = {
        id: Date.now().toString(),
        name,
        address: fullAddress,
        coords: { latitude, longitude }
      };

      // adiciona ao contexto e storage
      addUser(newUser);
      await saveUserToStorage(newUser);

      // limpa campos
      clearForm();

      // navega para o Map, passando coordenadas para centralizar no novo usuário
      navigation.navigate('Map', {
        userCoords: { latitude, longitude },
        userName: name
      });
    } catch (err) {
      Alert.alert('Erro na geocodificação', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.content}>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate('Home')}>
              <Ionicons name="close" size={30} color="black" />
            </TouchableOpacity>

            <Text style={styles.title}>User Registration</Text>
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Street or Avenue"
                placeholderTextColor="#999"
                value={street}
                onChangeText={setStreet}
              />
              <TextInput
                style={styles.input}
                placeholder="Number"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={number}
                onChangeText={setNumber}
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="#999"
                value={city}
                onChangeText={setCity}
              />
              <TextInput
                style={styles.input}
                placeholder="State (UF)"
                placeholderTextColor="#999"
                value={stateUf}
                onChangeText={text => setStateUf(text.toUpperCase())}
                maxLength={2}
              />
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Add User</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F5F9' },
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  content: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  closeButton: { position: 'absolute', top: 20, right: 20 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 32, textAlign: 'center' },
  formContainer: { width: '100%', alignItems: 'center' },
  input: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '80%'
  },
  button: { height: 50, backgroundColor: '#356E0D', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 24, width: '80%' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' }
});
