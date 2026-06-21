import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../styles/styles.js';
import { Database } from '../data/database.js';

export default function ProjetosScreen({ navigation }) {
  const [listaProjetos, setListaProjetos] = useState([]);
  const [novoProjeto, setNovoProjeto] = useState('');
  const [pesquisa, setPesquisa] = useState('');

  const carregarProjetos = async () => {
    const p = await Database.getProjetos();
    setListaProjetos(p);
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarProjetos();
    }, [])
  );

  const adicionarProjeto = async () => {
    if (!novoProjeto.trim()) {
      Alert.alert('Erro', 'Insira o nome do projeto.');
      return;
    }

    const projeto = {
      id: Date.now(),
      nome: novoProjeto.trim()
    };

    const updated = [...listaProjetos, projeto];
    await Database.saveProjetos(updated);
    setNovoProjeto('');
    carregarProjetos();
  };

  const projetosFiltrados = listaProjetos.filter(projeto =>
    projeto.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Projetos</Text>

      <TextInput
        style={[styles.input, { borderColor: '#4CAF50', borderWidth: 1 }]}
        placeholder="🔍 Pesquisar projeto..."
        placeholderTextColor="#aaa"
        value={pesquisa}
        onChangeText={setPesquisa}
      />

      <View style={{ marginBottom: 15, marginTop: 10 }}>
        <TextInput
          style={styles.input}
          placeholder="Nome do novo projeto..."
          placeholderTextColor="#aaa"
          value={novoProjeto}
          onChangeText={setNovoProjeto}
        />
        <TouchableOpacity style={styles.button} onPress={adicionarProjeto}>
          <Text style={styles.buttonText}>+ Adicionar Projeto</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={projetosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Tarefas', { projetoId: item.id })}
          >
            <Text style={styles.cardText}>📁 {item.nome}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#555', marginTop: 15 }]} 
        onPress={() => navigation.navigate('Perfil')}
      >
        <Text style={styles.buttonText}>Ver Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}