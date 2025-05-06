import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import useLocation from './hooks/useLocation';

export default function Main() {
  const { geocodeAddress, errorMsg: locError } = useLocation();

  // estados do formulário
  const [name, setName]       = useState('');
  const [street, setStreet]   = useState('');
  const [number, setNumber]   = useState('');
  const [city, setCity]       = useState('');
  const [stateUf, setStateUf] = useState('');

  // array de usuários cadastrados
  const [users, setUsers] = useState([]);

  // fallback de região
  const initialRegion = {
    latitude: -23.55,
    longitude: -46.63,
    latitudeDelta:  0.5,
    longitudeDelta: 0.5,
  };

  const handleAddUser = async () => {
    if (![name, street, number, city, stateUf].every(Boolean)) {
      return Alert.alert('Erro', 'Preencha todos os campos.');
    }
  
    // Cria múltiplas variações do endereço para melhorar a geocodificação
    const addressVariations = [
      `${street}, ${number} - ${city}, ${stateUf}`,
      `${street} ${number}, ${city}, ${stateUf}`,
      `${street}, ${number}, ${city} ${stateUf}`
    ];
  
    try {
      let results = [];
      
      // Tenta todas as variações até encontrar um resultado válido
      for (const address of addressVariations) {
        results = await geocodeAddress(address);
        if (results.length > 0) break;
      }
  
      if (results.length === 0) {
        return Alert.alert('Erro', 'Endereço não encontrado. Tente incluir o estado (UF).');
      }
  
      const { latitude, longitude } = results[0];
      
      setUsers(old => [
        ...old,
        { name, coords: { latitude, longitude } }
      ]);
  
      // Limpa inputs
      setName('');
      setStreet('');
      setNumber('');
      setCity('');
      setStateUf('');
      
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível encontrar o endereço. Verifique os dados ou tente outro formato.');
    }
  };

  if (locError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{locError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* formulário */}
      <KeyboardAvoidingView
        style={styles.formWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Rua"
            value={street}
            onChangeText={setStreet}
          />
          <TextInput
            style={styles.input}
            placeholder="Número"
            value={number}
            onChangeText={setNumber}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Cidade"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={styles.input}
            placeholder="Estado (UF)"
            value={stateUf}
            onChangeText={setStateUf}
          />
          <View style={styles.buttonWrapper}>
            <Button title="Adicionar Usuário" onPress={handleAddUser} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* mapa */}
      <MapView
        style={styles.map}
        region={
          users.length > 0
            ? {
                ...users[users.length - 1].coords,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }
            : initialRegion
        }
      >
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
  container:    { flex: 1 },
  formWrapper:  { backgroundColor: '#fff' },
  form:         { padding: 16 },
  input:        {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom:     12,
    paddingVertical:  6,
    fontSize:         16,
  },
  buttonWrapper:{ marginTop: 8 },
  map:          { flex: 1 },
  center:       {
    flex:             1,
    justifyContent:   'center',
    alignItems:       'center',
    paddingHorizontal: 16,
  },
  errorText:    { fontSize: 16, color: 'red', textAlign: 'center' },
});
