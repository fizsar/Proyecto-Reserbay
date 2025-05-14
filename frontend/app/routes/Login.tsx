import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = { email, password };
    console.log('Enviando login: ', data);

    try {
      const response = await fetch('http://localhost:3000/backend/controller/AuthController.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('Respuesta cruda:', result);

      if (response.ok) {
        if (result.user.rol === 'cliente') {
          navigate('/dashboardCliente');
        } else {
          navigate('/dashboardEmpleado');
        }
      } else {
        setErrorMessage(result.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      setErrorMessage('Error de conexión con el servidor');
      console.error('Error al hacer login:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[#121212] px-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1e1e1e] rounded-xl shadow-md p-8 space-y-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-[#1E7E34] dark:text-[#1DE91D] text-center">Iniciar sesión</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#CED4DA] dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-sm text-gray-900 dark:text-gray-100 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E7E34] dark:focus:ring-[#1DE91D]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#CED4DA] dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-sm text-gray-900 dark:text-gray-100 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E7E34] dark:focus:ring-[#1DE91D]"
            />
          </div>

          {errorMessage && (
            <div className="text-sm text-red-600 dark:text-red-400 font-medium">{errorMessage}</div>
          )}

          <button
            type="submit"
            className="w-full bg-[#1E7E34] text-white py-2 px-4 rounded-md hover:bg-[#166427] transition-all dark:bg-[#1DE91D] dark:text-black dark:hover:bg-[#14c314]"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
