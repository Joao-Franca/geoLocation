import React, { useContext, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { UsersContext } from '../context/UsersContext';
import useLocation from '../hooks/useLocation';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListScreen({ navigation }) {
  const { users, updateUser, deleteUser } = useContext(UsersContext);
  const { geocodeAddress } = useLocation();

  const [editingIndex, setEditingIndex] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [loadingGeo, setLoadingGeo] = useState(false);

  const updateStorage = async (updatedUsers) => {
    try {
      await AsyncStorage.setItem('@users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.error('Erro ao atualizar AsyncStorage:', error);
      throw error;
    }
  };

  const startEditing = (index, user) => {
    setEditingIndex(index);
    setEditName(user.name);
    setEditAddress(user.address);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditName('');
    setEditAddress('');
  };

  const saveEdit = async () => {
    if (!editName.trim() || !editAddress.trim()) {
      return Alert.alert('Erro', 'Nome e endereço não podem ficar vazios.');
    }
    setLoadingGeo(true);
    try {
      const results = await geocodeAddress(editAddress);
      if (!results.length) {
        return Alert.alert('Erro', 'Endereço não encontrado.');
      }
      const { latitude, longitude } = results[0];
      
      const updatedUser = {
        name: editName,
        address: editAddress,
        coords: { latitude, longitude }
      };
      
      
      updateUser(editingIndex, updatedUser);
      
      
      const updatedUsers = [...users];
      updatedUsers[editingIndex] = updatedUser;
      await updateStorage(updatedUsers);
      
      cancelEditing();
    } catch (err) {
      Alert.alert('Erro', err.message || 'Ocorreu um erro ao atualizar o usuário.');
    } finally {
      setLoadingGeo(false);
    }
  };

  const handleDelete = async (index) => {
    try {
      
      deleteUser(index);
      
      
      const updatedUsers = users.filter((_, i) => i !== index);
      await updateStorage(updatedUsers);
      
      Alert.alert('Sucesso', 'Usuário removido com sucesso.');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível remover o usuário.');
    }
  };

  const renderItem = ({ item, index }) => {
    const isEditing = index === editingIndex;
    return (
      <View style={styles.card}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Nome completo"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              value={editAddress}
              onChangeText={setEditAddress}
              placeholder="Endereço completo"
              placeholderTextColor="#999"
            />
            {loadingGeo ? (
              <ActivityIndicator size="small" color="#3498DB" style={{ marginTop: 8 }} />
            ) : (
              <View style={styles.actions}>
                <TouchableOpacity style={[styles.iconButton, styles.save]} onPress={saveEdit}>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconButton, styles.cancel]} onPress={cancelEditing}>
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.address}>{item.address}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.iconButton, styles.edit]}
                onPress={() => startEditing(index, item)}
              >
                <Image source={require('../../assets/Edit.png')} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, styles.delete]}
                onPress={() => handleDelete(index)}
              >
                <Image source={require('../../assets/Delete.png')} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="close" size={30} color="black" />
        </TouchableOpacity>
        
        <Text style={styles.title}>User List</Text>
        {users.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No users registered.</Text>
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id} 
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={renderItem}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F5F9',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16,  
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginTop: 12,
    marginBottom: 12,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  address: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'flex-end',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  save: {
    backgroundColor: '#2ECC71',
  },
  cancel: {
    backgroundColor: '#95A5A6',
  },
  input: {
    height: 44,
    backgroundColor: '#F9F9F9',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  icon: {
    width: 30,
    height: 30,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    zIndex: 1,
  },
});
