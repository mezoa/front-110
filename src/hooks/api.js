import { useState, useEffect } from 'react';
import axios from 'axios';

const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const api = axios.create({
      baseURL: 'http://127.0.0.1:8000/api', // Replace with your Laravel backend URL
    });

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/endpoint'); // Replace with your API endpoint
        setData(response.data);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useApi;
