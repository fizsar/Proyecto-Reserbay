import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';

interface Servicio {
  id: number;
  nombre: string;
}

interface Empleado {
  id: number;
  nombre: string;
}

interface Usuario {
  id: number;
  nombre: string;
  rol: 'cliente' | 'empleado';
}

const ReservaCita = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [servicioId, setServicioId] = useState('');
  const [empleadoId, setEmpleadoId] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState<'error' | 'success' | ''>('');

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

    fetch('http://localhost:3000/backend/controller/ServicioController.php?action=index')
      .then(res => res.json())
      .then(data => setServicios(data));

    fetch('http://localhost:3000/backend/controller/UserController.php?action=empleados')
      .then(res => res.json())
      .then(data => setEmpleados(data));
  }, []);

  useEffect(() => {
    if (fecha && empleadoId) {
      fetch(`http://localhost:3000/backend/controller/CitaController.php?action=horas_disponibles&personal_id=${empleadoId}&fecha=${fecha}`)
        .then(res => res.json())
        .then(data => setHorasDisponibles(data));
    } else {
      setHorasDisponibles([]);
      setHoraSeleccionada('');
    }
  }, [fecha, empleadoId]);

  const getProximosDias = (dias = 7): string[] => {
    const fechas = [];
    const hoy = new Date();
    for (let i = 0; i < dias; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      fechas.push(fecha.toISOString().split('T')[0]);
    }
    return fechas;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!servicioId || !empleadoId || !fecha || !horaSeleccionada || !usuario) {
      setMensaje('Por favor completa todos los campos.');
      setTipoMensaje('error');
      return;
    }

    const formData = {
      action: 'guardar',
      user_id: usuario.id,
      servicio_id: servicioId,
      personal_id: empleadoId,
      fecha,
      hora: horaSeleccionada,
      estado: 'pendiente'
    };

    fetch('http://localhost:3000/backend/controller/CitaController.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setMensaje('✅ Cita reservada correctamente.');
          setTipoMensaje('success');
          setServicioId('');
          setEmpleadoId('');
          setFecha('');
          setHoraSeleccionada('');
          setHorasDisponibles([]);
        } else {
          setMensaje('❌ Error al reservar la cita.');
          setTipoMensaje('error');
        }
      })
      .catch(() => {
        setMensaje('❌ Error en la solicitud.');
        setTipoMensaje('error');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <Navbar rol={usuario?.rol || 'cliente'} />

      <main className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-12 mt-16 mb-24">
        <section className="bg-white dark:bg-gray-900 shadow-lg rounded-3xl p-10">
          <h1 className="text-4xl font-extrabold text-center mb-8 text-indigo-700 dark:text-indigo-400 tracking-wide">
            Reserva tu cita
          </h1>

          {mensaje && (
            <div
              className={`mb-6 text-center px-4 py-3 rounded-lg font-medium text-sm ${
                tipoMensaje === 'error'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400'
                  : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400'
              }`}
            >
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="servicio" className="block mb-2 font-semibold text-lg">
                Servicio
              </label>
              <select
                id="servicio"
                value={servicioId}
                onChange={e => setServicioId(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 p-4 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-400 dark:bg-gray-800 dark:text-gray-100 transition"
              >
                <option value="" disabled>
                  Seleccione un servicio
                </option>
                {servicios.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="empleado" className="block mb-2 font-semibold text-lg">
                Empleado
              </label>
              <select
                id="empleado"
                value={empleadoId}
                onChange={e => setEmpleadoId(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 p-4 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-400 dark:bg-gray-800 dark:text-gray-100 transition"
              >
                <option value="" disabled>
                  Seleccione un empleado
                </option>
                {empleados.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fecha" className="block mb-2 font-semibold text-lg">
                Fecha
              </label>
              <select
                id="fecha"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 p-4 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-400 dark:bg-gray-800 dark:text-gray-100 transition"
              >
                <option value="" disabled>
                  Seleccione una fecha
                </option>
                {getProximosDias().map(f => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {horasDisponibles.length > 0 ? (
              <div>
                <p className="mb-3 font-semibold text-lg">Horas disponibles</p>
                <div className="flex flex-wrap gap-3">
                  {horasDisponibles.map(hora => (
                    <button
                      key={hora}
                      type="button"
                      onClick={() => setHoraSeleccionada(hora)}
                      className={`px-5 py-2 rounded-full border-2 transition font-medium text-lg
                        ${
                          horaSeleccionada === hora
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                            : 'border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                        }
                      `}
                    >
                      {hora.slice(0, 5)}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              fecha &&
              empleadoId && (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-4 italic">
                  No hay horas disponibles para esta fecha y empleado.
                </p>
              )
            )}

            <div className="text-center mt-8">
              <button
                type="submit"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-400 text-white font-semibold text-xl rounded-3xl px-12 py-3 shadow-md transition"
              >
                Reservar Cita
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ReservaCita;
