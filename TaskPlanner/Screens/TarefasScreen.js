import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../styles/styles.js';
import { Database } from '../data/database.js';

export default function TarefasScreen({ route }) {
  const { projetoId } = route.params;
  const [todasTarefas, setTodasTarefas] = useState([]);
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [pesquisa, setPesquisa] = useState('');

  const carregarTarefas = async () => {
    const t = await Database.getTarefas();
    setTodasTarefas(t);
    setListaFiltrada(t.filter(item => item.projetoId === projetoId));
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarTarefas();
    }, [projetoId])
  );

  const adicionarTarefa = async () => {
    if (!novaTarefa.trim()) {
      Alert.alert('Erro', 'Insira o nome da tarefa.');
      return;
    }

    const tarefa = {
      id: Date.now(),
      projetoId: projetoId,
      nome: novaTarefa.trim(),
      concluida: false
    };

    const atualizadas = [...todasTarefas, tarefa];
    await Database.saveTarefas(atualizadas);
    setNovaTarefa('');
    carregarTarefas();
  };

  const alternar = async (id) => {
    const tarefasAtualizadas = todasTarefas.map(item =>
      item.id === id ? { ...item, concluida: !item.concluida } : item
    );

    await Database.saveTarefas(tarefasAtualizadas);
    carregarTarefas();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tarefas</Text>

      <TextInput
        style={[styles.input, { borderColor: '#4CAF50', borderWidth: 1 }]}
        placeholder="🔍 Pesquisar tarefa..."
        placeholderTextColor="#aaa"
        value={pesquisa}
        onChangeText={setPesquisa}
      />

      <View style={{ marginBottom: 15, marginTop: 10 }}>
        <TextInput
          style={styles.input}
          placeholder="Nome da nova tarefa..."
          placeholderTextColor="#aaa"
          value={novaTarefa}
          onChangeText={setNovaTarefa}
        />
        <TouchableOpacity style={styles.button} onPress={adicionarTarefa}>
          <Text style={styles.buttonText}>+ Adicionar Tarefa</Text>
        </TouchableOpacity>
      </View>

      {listaFiltrada
        .filter(item => item.nome.toLowerCase().includes(pesquisa.toLowerCase()))
        .map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => alternar(item.id)}
          >
            <Text style={styles.cardText}>
              {item.concluida ? '✅' : '⬜'} {item.nome}
            </Text>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
}