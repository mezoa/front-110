import { useState } from 'react';
import { axiosInstance } from './axiosinstance';

const useRegisterForm = (initialState) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  //Input Validation
  const validate = (values) => {
    let errors = {};
    if (!values.name) {
      errors.name = 'Name is required';
    }
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password needs to be 6 characters or more';
    }
    return errors;
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(validate(values));
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axiosInstance.post('/api/register', values);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return { values, handleChange, handleSubmit, errors };
};

export default useRegisterForm;