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
    // Verificar si hay sesión activa
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
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          email,
          password,
          rol: 'personal',
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

      setMensaje('Empleado registrado con éxito');
      setNombre('');
      setEmail('');
      setPassword('');
      setConfirmarPassword('');
    } catch (error) {
      console.error(error);
      setMensaje('Error de conexión con el servidor');
    }
  };

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div>
      <Navbar rol="personal" />
      <div className="p-6 max-w-md mx-auto mt-20">
        <h2 className="text-2xl mb-4">Registrar nuevo empleado</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            className="p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="p-2 border rounded"
          />
          <input
            type={verPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="p-2 border rounded"
          />
          <input
            type={verPassword ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            value={confirmarPassword}
            onChange={e => setConfirmarPassword(e.target.value)}
            required
            className="p-2 border rounded"
          />
          <label className="text-sm">
            <input
              type="checkbox"
              checked={verPassword}
              onChange={() => setVerPassword(!verPassword)}
              className="mr-2"
            />
            Mostrar contraseña
          </label>
          <button type="submit" className="bg-indigo-600 text-white py-2 rounded">
            Registrar
          </button>
        </form>
        {mensaje && <p className="mt-4 text-red-600">{mensaje}</p>}
      </div>
    </div>
  );
};

export default AltaEmpleado;
