import { useState } from 'react';
import Cookies from 'js-cookie';
import { axiosInstance } from './axiosinstance';
const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/login', { email, password });
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