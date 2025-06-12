import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';

interface Cita {
  id: number;
  servicio: string;
  fecha: string;
  hora: string;
  estado: string;
  precio: number;
  empleado: string;
}

const DashboardCliente = () => {
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<'cliente' | 'personal'>('cliente');
  const [citasFuturas, setCitasFuturas] = useState<Cita[]>([]);
  const [citasPasadas, setCitasPasadas] = useState<Cita[]>([]);
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
        separarCitas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener citas:', error);
        setLoading(false);
      });
  };

  const separarCitas = (citas: Cita[]) => {
    const hoy = new Date();
    const futuras: Cita[] = [];
    const pasadas: Cita[] = [];

    citas.forEach((cita) => {
      const fechaHora = new Date(`${cita.fecha}T${cita.hora}`);
      if (cita.estado.toLowerCase() === 'cancelada' || fechaHora < hoy) {
        pasadas.push(cita);
      } else {
        futuras.push(cita);
      }
    });

    setCitasFuturas(futuras);
    setCitasPasadas(pasadas);
  };

  const eliminarCita = (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta cita?')) return;

    fetch(`http://localhost:3000/backend/controller/CitaController.php?action=eliminar&id=${id}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'deleted') {
          setCitasFuturas((prev) => prev.filter((c) => c.id !== id));
        } else {
          alert('❌ Error al eliminar la cita.');
        }
      })
      .catch(() => {
        alert('❌ Error en la solicitud.');
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

  const renderCitas = (citas: Cita[], tipo: 'futuras' | 'pasadas') =>
    citas.length === 0 ? (
      <p className="text-center text-gray-500 dark:text-gray-400 italic mt-4">
        No tienes citas {tipo === 'futuras' ? 'programadas' : 'pasadas'}.
      </p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {citas.map((cita) => (
          <div
            key={cita.id}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-between transition hover:shadow-xl"
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
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Precio:</strong> {parseFloat(cita.precio as any).toFixed(2)}€
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Empleado:</strong> {cita.empleado}
              </p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getEstadoColor(
                  cita.estado
                )}`}
              >
                <span className="mr-2 text-xl">{getEstadoIcono(cita.estado)}</span>
                {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
              </span>

              {tipo === 'futuras' && (
                <button
                  onClick={() => eliminarCita(cita.id)}
                  className="text-red-600 hover:text-red-800 dark:hover:text-red-400 transition text-xl"
                  title="Eliminar cita"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <>
      <Navbar rol={rol} />
      <div className="pt-24 min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 p-8 transition-colors duration-500">
        <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-8 tracking-wide">
          ¡Hola, {nombre}!
        </h1>

        {loading ? (
          <div className="text-center text-indigo-600 dark:text-indigo-400">
            <p className="text-lg">Cargando citas...</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Citas futuras:</h2>
            {renderCitas(citasFuturas, 'futuras')}

            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-10 mb-4">Citas pasadas:</h2>
            {renderCitas(citasPasadas, 'pasadas')}
          </>
        )}
      </div>
    </>
  );
};

export default DashboardCliente;
