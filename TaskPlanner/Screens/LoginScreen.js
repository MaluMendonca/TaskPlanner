import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles/styles.js';
import { Database } from '../data/database.js';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const logar = async () => {
    if (!email.trim() || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      const usuarios = await Database.getUsers();
      
      // 1. Procura se existe alguma conta com o e-mail digitado
      const usuarioExiste = usuarios && Array.isArray(usuarios) ? usuarios.find(
        u => u && u.email && u.email.toLowerCase() === email.trim().toLowerCase()
      ) : null;

      if (!usuarioExiste) {
        Alert.alert('Erro', 'Esta conta não existe. Por favor, faça o cadastro primeiro.');
        return;
      }

      // 2. Se a conta existe, verifica se a senha está correta
      if (usuarioExiste.senha !== senha) {
        Alert.alert('Erro', 'Senha incorreta. Tente novamente.');
        return;
      }

      // Login efetuado com sucesso
      await Database.setLoggedUser(usuarioExiste.email);
      setEmail('');
      setSenha('');
      navigation.navigate('Projetos');

    } catch (error) {
      Alert.alert('Erro de Sistema', 'Erro ao fazer login: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Planner</Text>

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

      <TouchableOpacity style={styles.button} onPress={logar}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#555' }]}
        onPress={() => navigation.navigate('Cadastro')}
      >
        <Text style={styles.buttonText}>Criar uma Conta</Text>
      </TouchableOpacity>
    </View>
  );
}