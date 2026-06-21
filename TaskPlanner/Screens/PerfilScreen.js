import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../styles/styles.js';
import { Database } from '../data/database.js';

export default function PerfilScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [projetosAtivos, setProjetosAtivos] = useState(0);
  const [projetosConcluidos, setProjetosConcluidos] = useState(0);
  const [tarefasConcluidas, setTarefasConcluidas] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const carregarDadosPerfil = async () => {
        const userEmail = await Database.getLoggedUser();
        const projetos = await Database.getProjetos();
        const tarefas = await Database.getTarefas();

        setEmail(userEmail);
        
        let ativos = 0;
        let concluidos = 0;

        projetos.forEach(p => {
          const tarefasDoProjeto = tarefas.filter(t => t.projetoId === p.id);
          
          if (tarefasDoProjeto.length > 0 && tarefasDoProjeto.every(t => t.concluida)) {
            concluidos++;
          } else {
            ativos++;
          }
        });

        setProjetosAtivos(ativos);
        setProjetosConcluidos(concluidos);
        
        const totalConcluidas = tarefas.filter(t => t.concluida === true).length;
        setTarefasConcluidas(totalConcluidas);
      };

      carregarDadosPerfil();
    }, [])
  );

  const handleLogout = async () => {
    await Database.clearLoggedUser();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>👤 Usuário: {email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardText}>⏳ Projetos Ativos: {projetosAtivos}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardText}>🏆 Projetos Concluídos: {projetosConcluidos}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardText}>✅ Tarefas Concluídas: {tarefasConcluidas}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardText}>⏱️ Tempo Total: 15h</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}