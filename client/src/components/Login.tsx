import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import Input from './ui/Input';
import { login } from '../services/api';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await login(username, password);
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Matchmaker Login</h2>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 w-full"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full"
        />
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </div>
  );
};

export default Login;