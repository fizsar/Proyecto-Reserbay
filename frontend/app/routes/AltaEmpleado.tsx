import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavBar';

const AltaEmpleado = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/backend/controller/AuthController.php?action=checkSession', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'active') {
          setUsuario(data.user);
        } else {
          window.location.href = '/';
        }
      });
  }, []);

  const validarEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) return setMensaje('El nombre es obligatorio');
    if (!email.trim() || !validarEmail(email)) return setMensaje('Email no válido');
    if (password.length < 6) return setMensaje('Contraseña mínima 6 caracteres');
    if (password !== confirmarPassword) return setMensaje('Las contraseñas no coinciden');

    try {
      const res = await fetch('http://localhost:3000/backend/controller/UserController.php?action=guardar', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, rol: 'personal' }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 && data.error?.includes('email')) {
          return setMensaje('El correo ya está registrado');
        }
        return setMensaje('Error: ' + (data.error || 'No se pudo registrar'));
      }

      setMensaje('✅ Empleado registrado con éxito');
      setNombre('');
      setEmail('');
      setPassword('');
      setConfirmarPassword('');
    } catch {
      setMensaje('❌ Error de conexión con el servidor');
    }
  };

  if (!usuario) return <p className="text-center mt-20 text-gray-700 dark:text-gray-200">Cargando...</p>;

  return (
    <div className="pt-24 min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <Navbar rol="personal" />
      <div className="max-w-xl mx-auto bg-white dark:bg-[#1e1e1e] p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-700 space-y-4">
        <h2 className="text-3xl font-bold mb-4 text-center text-indigo-600 dark:text-indigo-400">
          Registrar nuevo empleado
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
          <input
            type={verPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
          <input
            type={verPassword ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            value={confirmarPassword}
            onChange={e => setConfirmarPassword(e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
          <label className="text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={verPassword}
              onChange={() => setVerPassword(!verPassword)}
              className="mr-2"
            />
            Mostrar contraseña
          </label>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Registrar
          </button>
        </form>

        {mensaje && (
          <p className="mt-2 text-center text-sm text-indigo-600 dark:text-indigo-400">{mensaje}</p>
        )}
      </div>
    </div>
  );
};

export default AltaEmpleado;
