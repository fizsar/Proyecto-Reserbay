import React, { useState, useEffect } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Asegúrate de obtener el token CSRF al cargar el componente
  useEffect(() => {
    const getCsrfToken = async () => {
      const response = await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include', // Esto asegura que las cookies se envíen
      });

      if (!response.ok) {
        console.error('Error al obtener CSRF Token');
      }
    };

    getCsrfToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Obtener el token CSRF
    const csrfToken = document.cookie.split('XSRF-TOKEN=')[1]?.split(';')[0];

    if (!csrfToken) {
      setError('No CSRF token found');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include', // Asegurarse de que las cookies se envíen
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud de login');
      }

      const data = await response.json();

      if (data.success) {
        console.log('Login exitoso');
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Hubo un problema con el login');
    }
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;
