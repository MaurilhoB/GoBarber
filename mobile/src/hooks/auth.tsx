import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';

interface ISignInCredentials {
  email: string;
  password: string;
}

interface IUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface IAuthState {
  token: string;
  user: IUser;
}

interface IAuthContextData {
  user: IUser;
  loading: boolean;
  signIn(credentials: ISignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: IUser): Promise<void>;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<IAuthState>({} as IAuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorage = async () => {
      const [[, token], [, user]] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      if (user && token) {
        setData({ token, user: JSON.parse(user) });
      }

      api.defaults.headers.authorization = `Bearer ${token}`;

      setLoading(false);
    };
    loadStorage();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);

    api.defaults.headers.authorization = `Bearer ${token}`;
    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);
    api.defaults.headers.authorization = null;
    setData({} as IAuthState);
  }, []);

  const updateUser = useCallback(async (user: IUser) => {
    await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));
    setData({
      ...data,
      user,
    });
  }, []);
  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth should be used inside AuthProvider');
  }

  return context;
};
