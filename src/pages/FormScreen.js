import React, { useState, useContext, useEffect } from 'react';
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
import { Ionicons } from '@expo/vector-icons'; // Para o ícone de sair
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FormScreen({ navigation }) {
  const { geocodeAddress } = useLocation();
  const { addUser } = useContext(UsersContext);

  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [city, setCity] = useState('');
  const [stateUf, setStateUf] = useState('');

  // Função para salvar os dados no AsyncStorage
  const saveUserData = async () => {
    try {
      const userData = { name, street, number, city, stateUf };
      await AsyncStorage.setItem('userData', JSON.stringify(userData)); // Salva os dados no AsyncStorage
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  // Função para carregar os dados do AsyncStorage
  const loadUserData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('userData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setName(parsedData.name);
        setStreet(parsedData.street);
        setNumber(parsedData.number);
        setCity(parsedData.city);
        setStateUf(parsedData.stateUf);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    }
  };

  // Carregar os dados quando o componente for montado
  useEffect(() => {
    loadUserData();
  }, []);

  const handleSubmit = async () => {
    if (![name, street, number, city, stateUf].every(Boolean)) {
      return Alert.alert('Erro', 'Preencha todos os campos.');
    }

    const fullAddress = `${street}, ${number} - ${city}, ${stateUf}`;
    
    try {
      const results = await geocodeAddress(fullAddress);
      if (!results || results.length === 0) {
        return Alert.alert('Erro', 'Endereço não encontrado. Verifique os dados informados.');
      }

      const { latitude, longitude } = results[0];
      addUser({
        name, 
        address: fullAddress, 
        coords: { latitude, longitude }
      });

      // Salva os dados no AsyncStorage
      await saveUserData();

      // Limpa o formulário
      setName('');
      setStreet('');
      setNumber('');
      setCity('');
      setStateUf('');
      
      // Navega para a tela do Mapa
      navigation.navigate('Map');
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
            {/* Botão de sair no canto superior direito */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Ionicons name="close" size={30} color="black" />
            </TouchableOpacity>

            {/* Título centralizado */}
            <Text style={styles.title}>User Registration</Text>

            {/* Formulário centralizado */}
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
                onChangeText={(text) => setStateUf(text.toUpperCase())}
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
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F5F9',
  },
  container: {
    flex: 1,
    justifyContent: 'center',  // Alinha o conteúdo verticalmente no centro
    padding: 20,               // Adiciona padding em torno do formulário
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',  // Garante que o conteúdo vai estar centralizado verticalmente
    alignItems: 'center',      // Centraliza o conteúdo horizontalmente
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 32,
    color: '#000000',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',  // Garante que o formulário ocupe toda a largura disponível
    alignItems: 'center',  // Centraliza os itens do formulário
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '80%',  // Reduz a largura para que o formulário não ocupe toda a tela
  },
  button: {
    height: 50,
    backgroundColor: '#356E0D',  // Verde para o botão
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    width: '80%',  // Ajusta a largura do botão
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
