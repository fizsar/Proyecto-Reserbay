import React, { useEffect, useState } from 'react';

interface Cita {
  id: number;
  servicio: string;
  fecha: string;
  hora: string;
  estado: string;
}

const DashboardCliente = () => {
  const [nombre, setNombre] = useState('');
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch('http://localhost:3000/backend/controller/AuthController.php?action=checkSession', {
    method: 'GET',
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('Session check response:', data);  // Log de la respuesta de sesión
      if (data.status === 'active') {
        setNombre(data.user.nombre);
        fetchCitas();
      } else {
        window.location.href = '/';
      }
    });
}, []);

const fetchCitas = () => {
  fetch('http://localhost:3000/backend/controller/CitaController.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        action: 'getByUser',
    }),
    credentials: "include",
})
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    return res.json();  // Trata de parsear el JSON de la respuesta
  })
  .then((data) => {
    if (data.status === 'error') {
      console.error('Error en la respuesta:', data.message);
    } else {
      setCitas(data);  // Si los datos son correctos, actualiza el estado
      setLoading(false);
    }
  })
  .catch((error) => {
    console.error('Error al obtener citas:', error);
  });

};





  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#121212] p-8">
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
              className="bg-white dark:bg-[#1e1e1e] p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <p className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Servicio:</strong> {cita.servicio}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Fecha:</strong> {cita.fecha}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Hora:</strong> {cita.hora}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Estado:</strong> {cita.estado}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardCliente;
