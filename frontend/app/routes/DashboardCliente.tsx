// DashboardCliente.tsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';

interface Cita {
  id: number;
  servicio: string;
  fecha: string;
  hora: string;
  estado: string;
}

const DashboardCliente = () => {
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<'cliente' | 'empleado'>('cliente');
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/backend/controller/AuthController.php?action=checkSession', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'active') {
          setNombre(data.user.nombre);
          setRol(data.user.rol);
          fetchCitas();
        } else {
          window.location.href = '/';
        }
      });
  }, []);

  const fetchCitas = () => {
    fetch('http://localhost:3000/backend/controller/CitaController.php?action=getByUser', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setCitas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener citas:', error);
      });
  };

  const getBorderColor = (estado: string) => {
    if (estado.toLowerCase() === 'cancelada') return 'border-l-4 border-red-500';
    if (estado.toLowerCase() === 'pendiente') return 'border-l-4 border-gray-700';
    if (estado.toLowerCase() === 'aceptada') return 'border-l-4 border-blue-500';
    return 'border-l-4 border-gray-300'; // Por si no se encuentra el estado
  };

  const getTextColor = (estado: string) => {
    if (estado.toLowerCase() === 'cancelada') return 'text-red-500';
    if (estado.toLowerCase() === 'pendiente') return 'text-gray-700';
    if (estado.toLowerCase() === 'aceptada') return 'text-blue-500';
    return 'text-gray-500'; // Por si no se encuentra el estado
  };

  return (
    <>
      <Navbar rol={rol} />

      <div className="pt-20 min-h-screen bg-gray-100 dark:bg-[#121212] p-8">
        <h1 className="text-2xl font-bold text-[#1E7E34] dark:text-[#1DE91D] mb-6">
          Bienvenido, {nombre}
        </h1>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Tus citas agendadas:</h2>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Cargando citas...</p>
        ) : citas.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No tienes citas programadas.</p>
        ) : (
          <div className="space-y-4">
            {citas.map((cita) => (
              <div
                key={cita.id}
                className={`bg-white dark:bg-[#1e1e1e] p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${getBorderColor(
                  cita.estado
                )}`}
              >
                <p className="text-sm text-gray-700 dark:text-gray-200"><strong>Servicio:</strong> {cita.servicio}</p>
                <p className="text-sm text-gray-700 dark:text-gray-200"><strong>Fecha:</strong> {cita.fecha}</p>
                <p className="text-sm text-gray-700 dark:text-gray-200"><strong>Hora:</strong> {cita.hora}</p>
                <p className={`text-sm font-semibold ${getTextColor(cita.estado)}`}>
                  <strong>Estado:</strong> {cita.estado}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardCliente;
