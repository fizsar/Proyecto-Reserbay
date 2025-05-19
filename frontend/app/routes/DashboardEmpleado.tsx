import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';

interface Cita {
  id: number;
  servicio: string;
  fecha: string;
  hora: string;
  estado: string;
  cliente: string; // Nombre del cliente
}

const DashboardEmpleado = () => {
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<'cliente' | 'personal'>('personal');
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión y rol
    fetch('http://localhost:3000/backend/controller/AuthController.php?action=checkSession', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'active' && data.user.rol === 'personal') {
          setNombre(data.user.nombre);
          setRol('personal');
          fetchCitas();
        } else {
          window.location.href = '/';
        }
      });
  }, []);

  const fetchCitas = () => {
    fetch('http://localhost:3000/backend/controller/CitaController.php?action=getByEmpleado', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && Array.isArray(data.citas)) {
          setCitas(data.citas);
        } else if (Array.isArray(data)) {
          setCitas(data);
        } else {
          setCitas([]);
          console.error('Respuesta inesperada:', data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar citas:', error);
        setLoading(false);
      });
  };

  const actualizarEstado = (id: number, nuevoEstado: 'aceptada' | 'cancelada') => {
    fetch('http://localhost:3000/backend/controller/CitaController.php?action=cambiarEstado', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, estado: nuevoEstado }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'updated') {
          setCitas(prev =>
            prev.map(cita => (cita.id === id ? { ...cita, estado: nuevoEstado } : cita))
          );
        } else {
          alert('Error al actualizar el estado.');
        }
      })
      .catch(() => alert('Error en la solicitud.'));
  };

  return (
    <>
      <Navbar rol={rol} />

      <div className="pt-24 min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 p-8 transition-colors duration-500">
        <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-8 tracking-wide">
          ¡Hola, {nombre}!
        </h1>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Tus citas:</h2>

        {loading ? (
          <p>Cargando citas...</p>
        ) : Array.isArray(citas) && citas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {citas.map(cita => (
              <div
                key={cita.id}
                className={`
                  p-6 rounded-2xl shadow-lg border flex flex-col justify-between transition hover:shadow-xl
                  ${
                    cita.estado === 'aceptada'
                      ? 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-700 text-green-900 dark:text-green-300'
                      : cita.estado === 'cancelada'
                      ? 'bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-700 text-red-900 dark:text-red-300'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
                  }
                `}
              >
                <div>
                  <p className="text-lg font-semibold mb-1">Servicio: {cita.servicio}</p>
                  <p className="text-sm mb-1">Cliente: {cita.cliente}</p>
                  <p className="text-sm mb-1">Fecha: {cita.fecha}</p>
                  <p className="text-sm mb-1">Hora: {cita.hora}</p>
                  <p className="text-sm">
                    Estado: {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                  </p>
                </div>

                {cita.estado === 'pendiente' && (
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={() => actualizarEstado(cita.id, 'aceptada')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => actualizarEstado(cita.id, 'cancelada')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Denegar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No tienes citas asignadas.</p>
        )}
      </div>
    </>
  );
};

export default DashboardEmpleado;
