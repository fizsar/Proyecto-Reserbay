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
        setLoading(false);
      });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'cancelada':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
      case 'pendiente':
        return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400';
      case 'aceptada':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getEstadoIcono = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'cancelada':
        return '❌';
      case 'pendiente':
        return '⏳';
      case 'aceptada':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  return (
    <>
      <Navbar rol={rol} />

      <div className="pt-24 min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 p-8 transition-colors duration-500">
        <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-8 tracking-wide">
          ¡Hola, {nombre}!
        </h1>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Tus citas agendadas:</h2>

        {loading ? (
          <div className="flex justify-center items-center space-x-2 text-indigo-600 dark:text-indigo-400">
            <svg
              className="animate-spin h-6 w-6 mr-3 text-indigo-600 dark:text-indigo-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span className="text-lg font-medium">Cargando citas...</span>
          </div>
        ) : citas.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 italic mt-8">
            No tienes citas programadas.
          </p>
        ) : (
          <div className="space-y-6">
            {citas.map((cita) => (
              <div
                key={cita.id}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex justify-between items-center transition hover:shadow-xl"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {cita.servicio}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Fecha:</strong> {cita.fecha}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Hora:</strong> {cita.hora}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getEstadoColor(
                    cita.estado
                  )}`}
                  title={`Estado: ${cita.estado}`}
                >
                  <span className="mr-2 text-xl">{getEstadoIcono(cita.estado)}</span>
                  {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardCliente;
