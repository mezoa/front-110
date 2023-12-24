import { useState } from 'react';
import Cookies from 'js-cookie';
import { axiosInstance } from './axiosinstance';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //Input Validation
  const validate = (email, password) => {
    let errors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    return errors;
  };

  const login = async (email, password) => {
    const errors = validate(email, password);
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return null;
    }

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