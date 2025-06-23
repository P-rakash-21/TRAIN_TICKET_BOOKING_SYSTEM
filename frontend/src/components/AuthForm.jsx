import React, { useState } from 'react';
import { API } from '../utils/api';

export default function AuthForm({ setToken, view, setView, setMessage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleRegister = async () => {
    await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });
    setMessage('Registered successfully. Please login.');
  };

  const handleLogin = async () => {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setMessage('');
    } else {
      setMessage('Login failed. Please check credentials.');
    }
  };

  return (
    <div>
      <h2>{view === 'login' ? 'Login' : 'Register'}</h2>
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      {view === 'register' && (
        <select onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      )}
      <button onClick={view === 'login' ? handleLogin : handleRegister}>
        {view === 'login' ? 'Login' : 'Register'}
      </button>
      <p onClick={() => setView(view === 'login' ? 'register' : 'login')}>
        {view === 'login' ? 'New user? Register' : 'Already registered? Login'}
      </p>
    </div>
  );
}
