import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Obtener el CSRF token de Laravel
    axios.get('http://localhost:8000/csrf-token')
      .then(response => {
        // Configurar Axios para enviar el token CSRF
        axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data.csrf_token;
      })
      .catch(error => {
        console.error('Error al obtener el CSRF token:', error);
      });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/login', { email, password });

      const token = response.data.token;
      localStorage.setItem('token', token);

      alert('Login correcto');
    } catch (error) {
      console.error('Error en login:', error);
      alert('Login fallido');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;
