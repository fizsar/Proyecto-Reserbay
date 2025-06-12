import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';

interface Usuario {
    id: number;
    nombre: string;
    rol: 'cliente' | 'personal';
}

const NuevoServicio = () => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [nombre, setNombre] = useState('');
    const [duracion, setDuracion] = useState('');
    const [precio, setPrecio] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(true);

    // ✅ Verificar sesión
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

    const handleGuardar = async () => {
        if (!nombre || !duracion || !precio) {
            setMensaje('⚠️ Rellena todos los campos.');
            return;
        }

        const data = { nombre, duracion, precio };

        try {
            const response = await fetch(
                'http://localhost:3000/backend/controller/ServicioController.php?action=guardar',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            if (result.status === 'success') {
                setMensaje('✅ Servicio creado correctamente.');
                setNombre('');
                setDuracion('');
                setPrecio('');
            } else {
                setMensaje('❌ Error al guardar el servicio.');
            }
        } catch (error) {
            setMensaje('❌ Error de red.');
        }
    };

    if (loading) {
        return (
            <div className="pt-24 min-h-screen flex justify-center items-center text-indigo-600 dark:text-indigo-400">
                <p>Cargando sesión...</p>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <Navbar rol={usuario?.rol || 'cliente'} />

            <div className="max-w-xl mx-auto bg-white dark:bg-[#1e1e1e] p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-700 space-y-4">
                <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6 text-center">
                    Añadir nuevo servicio
                </h1>

                <div className="max-w-xl bg-white dark:bg-[#1e1e1e] p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-700 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Nombre del servicio
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Duración (minutos)
                        </label>
                        <input
                            type="number"
                            value={duracion}
                            onChange={e => setDuracion(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Precio (€)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={precio}
                            onChange={e => setPrecio(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                        />
                    </div>

                    {mensaje && (
                        <p className="text-sm text-center text-indigo-600 dark:text-indigo-400 mt-2">{mensaje}</p>
                    )}

                    <button
                        onClick={handleGuardar}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
                    >
                        Guardar Servicio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NuevoServicio;
