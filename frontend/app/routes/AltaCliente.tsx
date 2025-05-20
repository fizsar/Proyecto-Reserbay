import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Navbar from '~/components/NavBar';

const AltaCliente = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const validarEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setMensaje('El nombre es obligatorio');
      return;
    }

    if (!email.trim() || !validarEmail(email)) {
      setMensaje('Debes ingresar un email válido');
      return;
    }

    if (password.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmarPassword) {
      setMensaje('Las contraseñas no coinciden');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/backend/controller/UserController.php?action=guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nombre,
          email,
          password,
          rol: 'cliente',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 && data.error?.includes('email')) {
          setMensaje('El correo ya está registrado');
        } else {
          setMensaje('Error: ' + (data.error || 'No se pudo registrar'));
        }
        return;
      }

      const loginRes = await fetch('http://localhost:3000/backend/controller/AuthController.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (loginRes.ok) {
        navigate('/dashboardCliente');
      } else {
        setMensaje('Registro exitoso, pero no se pudo iniciar sesión automáticamente.');
      }
    } catch (error) {
      console.error(error);
      setMensaje('Error de conexión con el servidor');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[#121212] px-4">
        <Navbar />
      <div className="w-full max-w-md bg-white dark:bg-[#1e1e1e] rounded-xl shadow-md p-8 space-y-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-[#1E7E34] dark:text-[#1DE91D] text-center">
          Crear cuenta de cliente
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border border-[#CED4DA] dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-sm text-gray-900 dark:text-gray-100 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E7E34] dark:focus:ring-[#1DE91D]"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-[#CED4DA] dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-sm text-gray-900 dark:text-gray-100 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E7E34] dark:focus:ring-[#1DE91D]"
          />
          <input
            type={verPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-[#CED4DA] dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-sm text-gray-900 dark:text-gray-100 rounded-md px-4 py-2"
          />
          <input
            type={verPassword ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            required
            className="w-full border border-[#CED4DA] dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-sm text-gray-900 dark:text-gray-100 rounded-md px-4 py-2"
          />

          <label className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <input
              type="checkbox"
              checked={verPassword}
              onChange={() => setVerPassword(!verPassword)}
            />
            Mostrar contraseña
          </label>

          {mensaje && (
            <div className="text-sm text-red-600 dark:text-red-400 font-medium">{mensaje}</div>
          )}

          <button
            type="submit"
            className="w-full bg-[#1E7E34] text-white py-2 px-4 rounded-md hover:bg-[#166427] transition-all dark:bg-[#1DE91D] dark:text-black dark:hover:bg-[#14c314]"
          >
            Registrar cliente
          </button>
        </form>

        <button
          onClick={() => navigate('/')}
          className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-all"
        >
          Volver al login
        </button>
      </div>
    </div>
  );
};

export default AltaCliente;
