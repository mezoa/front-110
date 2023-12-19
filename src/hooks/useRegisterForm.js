import { useState } from 'react';
import { axiosInstance } from './axiosinstance';

const useRegisterForm = (initialState) => {
  const [values, setValues] = useState(initialState);

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/api/register', values);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return { values, handleChange, handleSubmit };
};

export default useRegisterForm;
