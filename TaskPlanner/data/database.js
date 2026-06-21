import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@TaskPlanner:users';
const LOGGED_USER_KEY = '@TaskPlanner:logged_user';

export const Database = {
  // Inicialização (Garante que a chave de utilizadores existe)
  init: async () => {
    try {
      const users = await AsyncStorage.getItem(USERS_KEY);
      if (!users) {
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify([]));
      }
    } catch (e) {
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify([]));
    }
  },

  // Procura a lista de utilizadores garantindo que retorna um Array válido
  getUsers: async () => {
    try {
      const users = await AsyncStorage.getItem(USERS_KEY);
      if (!users) return [];
      const parsed = JSON.parse(users);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  },

  saveUser: async (email, senha) => {
    const users = await Database.getUsers();
    users.push({ email, senha });
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  setLoggedUser: async (email) => {
    await AsyncStorage.setItem(LOGGED_USER_KEY, email);
  },

  getLoggedUser: async () => {
    return await AsyncStorage.getItem(LOGGED_USER_KEY) || '';
  },

  clearLoggedUser: async () => {
    await AsyncStorage.removeItem(LOGGED_USER_KEY);
  },

  // Projetos vinculados unicamente ao e-mail do utilizador logado
  getProjetos: async () => {
    const email = await Database.getLoggedUser();
    if (!email) return [];
    try {
      const p = await AsyncStorage.getItem(`@TaskPlanner:projects:${email}`);
      if (!p) return [];
      const parsed = JSON.parse(p);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  },

  saveProjetos: async (projetos) => {
    const email = await Database.getLoggedUser();
    if (!email) return;
    await AsyncStorage.setItem(`@TaskPlanner:projects:${email}`, JSON.stringify(projetos));
  },

  // Tarefas vinculadas unicamente ao e-mail do utilizador logado
  getTarefas: async () => {
    const email = await Database.getLoggedUser();
    if (!email) return [];
    try {
      const t = await AsyncStorage.getItem(`@TaskPlanner:tasks:${email}`);
      if (!t) return [];
      const parsed = JSON.parse(t);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  },

  saveTarefas: async (tarefas) => {
    const email = await Database.getLoggedUser();
    if (!email) return;
    await AsyncStorage.setItem(`@TaskPlanner:tasks:${email}`, JSON.stringify(tarefas));
  }
};