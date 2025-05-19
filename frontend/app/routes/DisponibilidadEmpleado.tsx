import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavBar';

const horasDisponibles = Array.from({ length: 12 }, (_, i) =>
  `${(9 + i).toString().padStart(2, '0')}:00`
);

interface Usuario {
  id: number;
  nombre: string;
  rol: 'cliente' | 'personal';
}

const DisponibilidadEmpleado = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [disponibilidad, setDisponibilidad] = useState<{ [fecha: string]: string[] }>({});
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtener sesión
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
      })
      .catch(() => {
        window.location.href = '/';
      })
      .finally(() => setLoading(false));
  }, []);

  // Obtener horas ocupadas del backend
  useEffect(() => {
    if (!fechaSeleccionada || !usuario) return;

    fetch(
      `http://localhost:3000/backend/controller/HorarioController.php?action=obtenerPorEmpleadoYDia&empleado_id=${usuario.id}&fecha=${fechaSeleccionada}`,
      { credentials: 'include' }
    )
      .then(res => res.json())
      .then(data => {
        const ocupadas = data.map((bloque: any) => bloque.hora_inicio);
        setHorasOcupadas(ocupadas);
      })
      .catch(() => {
        setHorasOcupadas([]);
      });
  }, [fechaSeleccionada, usuario]);

  const toggleHora = (hora: string) => {
    if (!fechaSeleccionada) return;

    setDisponibilidad(prev => {
      const horasActuales = prev[fechaSeleccionada] || [];
      const yaSeleccionada = horasActuales.includes(hora);
      const nuevasHoras = yaSeleccionada
        ? horasActuales.filter(h => h !== hora)
        : [...horasActuales, hora].sort();
      return { ...prev, [fechaSeleccionada]: nuevasHoras };
    });
  };

  const guardarDisponibilidad = () => {
    if (!fechaSeleccionada || !disponibilidad[fechaSeleccionada]?.length) {
      alert('Selecciona una fecha y al menos una hora.');
      return;
    }

    if (!usuario) {
      alert('Usuario no identificado.');
      return;
    }

    const peticiones = disponibilidad[fechaSeleccionada].map(hora => ({
      user_id: usuario.id,
      fecha: fechaSeleccionada,
      hora_inicio: hora,
      hora_fin: `${(parseInt(hora.slice(0, 2)) + 1).toString().padStart(2, '0')}:00`,
    }));

    fetch('http://localhost:3000/backend/controller/HorarioController.php?action=guardar', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(peticiones),
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          alert('✅ Disponibilidad guardada correctamente.');
          setDisponibilidad(prev => ({ ...prev, [fechaSeleccionada]: [] }));
          // Refrescar las horas ocupadas
          setHorasOcupadas(prev => [...prev, ...peticiones.map(p => p.hora_inicio)]);
        } else {
          alert(`❌ Error: ${data.error || 'al guardar la disponibilidad.'}`);
        }
      })
      .catch(() => alert('❌ Error en la solicitud.'));
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex justify-center items-center text-indigo-600 dark:text-indigo-400">
        <p>Cargando datos de usuario...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <Navbar rol={usuario?.rol || 'cliente'} />

      <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
        Selecciona tu disponibilidad
      </h1>

      <div className="mb-6">
        <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">
          Selecciona una fecha:
        </label>
        <input
          type="date"
          value={fechaSeleccionada}
          onChange={e => setFechaSeleccionada(e.target.value)}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>

      {fechaSeleccionada && (
        <>
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Horas disponibles para {fechaSeleccionada}
          </h2>

          <div className="flex flex-wrap gap-2 mb-2">
            {horasDisponibles
              .filter(hora => !horasOcupadas.includes(hora)) // Oculta horas ocupadas
              .map(hora => {
                const seleccionada = disponibilidad[fechaSeleccionada]?.includes(hora);
                return (
                  <button
                    key={hora}
                    onClick={() => toggleHora(hora)}
                    className={`px-4 py-2 rounded-lg border transition
                      ${
                        seleccionada
                          ? 'bg-indigo-600 text-white border-indigo-700'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    {hora}
                  </button>
                );
              })}
          </div>

          {disponibilidad[fechaSeleccionada]?.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Horas seleccionadas: {disponibilidad[fechaSeleccionada].join(', ')}
            </div>
          )}
        </>
      )}

      <button
        onClick={guardarDisponibilidad}
        className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg"
      >
        Guardar disponibilidad
      </button>
    </div>
  );
};

export default DisponibilidadEmpleado;
