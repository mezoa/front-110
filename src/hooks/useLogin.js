import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: 'http://expenseapp.test/api', // Replace with your Laravel backend URL
  });

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      setError(null);

      const accessToken = response.data.access_token;
      Cookies.set('accessToken', accessToken);
      return accessToken;
    } catch (error) {
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;