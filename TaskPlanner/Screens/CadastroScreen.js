import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles/styles.js';
import { Database } from '../data/database.js';

export default function CadastroScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');

  const cadastrar = async () => {
    if (!email.trim() || !senha || !confirmar) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (senha !== confirmar) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    try {
      const usuarios = await Database.getUsers();
      
      // Validação segura contra registos nulos ou corrompidos
      const usuarioExiste = usuarios && Array.isArray(usuarios) ? usuarios.find(
        u => u && u.email && u.email.toLowerCase() === email.trim().toLowerCase()
      ) : null;

      if (usuarioExiste) {
        Alert.alert('Erro', 'Este e-mail já está registado.');
        return;
      }

      await Database.saveUser(email.trim().toLowerCase(), senha);
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro de Sistema', 'Não foi possível salvar: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmar}
        onChangeText={setConfirmar}
      />

      <TouchableOpacity style={styles.button} onPress={cadastrar}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}