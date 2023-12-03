import React from 'react';
import LoginForm from '../Components/Forms/Authentication forms/LoginForm';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuth } from '../common/contexts/authContext';
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleLogin = (username: string, password: string) => {
    const requestData = {
      username: username,
      password: password,
    };

    axios
      .post('/v1/login', requestData)
      .then((response) => {
        const token = response.data.token;
        // Set the token as an HTTP-only cookie
        Cookies.set('token', token, { expires: 1, secure: false, sameSite: 'none' });

        // Set the user as authenticated using the context
        login(token);
        navigate("/dashboard")
      })
      .catch((error) => {
        console.error('Authentication error:', error);
      });
  };

  return (
    <div className="">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default Login;
