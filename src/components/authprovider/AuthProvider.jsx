import React, { createContext, useState } from 'react';
import useLogin from '../../hooks/useLogin';
import useApi from '../../hooks/api';
import Loading from '../buttons/loading';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { login } = useLogin();
  const { data: user, loading, error } = useApi([isAuthenticated]);
  console.log(user);
  const authenticate = async (email, password) => {
    const result = await login(email, password);
    if (result) {
      setIsAuthenticated(true);
    }
  };
  if (loading) {
    return <div><Loading/></div>;
  }
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;