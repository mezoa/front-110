import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie' // You can use js-cookie or any other library to read cookies

const useApi = (deps) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log(data);

  useEffect(() => {
    const api = axios.create({
      baseURL: 'http://expenseapp.test/api',
      headers: {
        Authorization: `Bearer ${Cookies.get('accessToken')}`, // Replace 'token' with the name of your cookie
      },
    });

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/user');
        setData(response.data);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, deps);

  return { data, loading, error };
};

export default useApi;