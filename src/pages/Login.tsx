import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className='w-full max-w-md'>
      <h1 className='w-full text-[30px] pb-12 font-bold'>Bug/track Tracker Application</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm space-y-6"
      >
        <h2 className="text-2xl font-bold text-slate-800 text-center">Login to your account</h2>
        
        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}

        <input
          type="text"
          placeholder="Username"
          className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-200"
        >
          Login
        </button>
      </form>
      </div>
    </div>
  );
};

export default Login;
