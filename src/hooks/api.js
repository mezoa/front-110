import { useState, useEffect } from 'react';
import { api } from './axiosinstance';

const useApi = (deps) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log(data);

  useEffect(() => {

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/user');
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