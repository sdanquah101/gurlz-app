// Local storage keys
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user'
} as const;

export const storage = {
  setToken: (token: string) => localStorage.setItem(STORAGE_KEYS.TOKEN, token),
  getToken: () => localStorage.getItem(STORAGE_KEYS.TOKEN),
  removeToken: () => localStorage.removeItem(STORAGE_KEYS.TOKEN),
  
  setUser: (user: any) => localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
  getUser: () => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  removeUser: () => localStorage.removeItem(STORAGE_KEYS.USER),
  
  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};