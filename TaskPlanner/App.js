import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './Screens/LoginScreen';
import CadastroScreen from './Screens/CadastroScreen';
import ProjetosScreen from './Screens/ProjetosScreen';
import TarefasScreen from './Screens/TarefasScreen';
import PerfilScreen from './Screens/PerfilScreen';
import { Database } from './data/database.js'; // Extensão explicitada para evitar falhas no Snack Web

const Stack = createNativeStackNavigator();

export default function App() {
  
  useEffect(() => {
    Database.init().catch(err => console.log("Erro na inicialização:", err));
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Projetos" component={ProjetosScreen} />
        <Stack.Screen name="Tarefas" component={TarefasScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}