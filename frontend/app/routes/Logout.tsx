// Logout.tsx
import React, { useEffect } from 'react';

const Logout = () => {
  useEffect(() => {
    fetch('http://localhost:3000/backend/controller/AuthController.php?action=logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then(() => {
        window.location.href = '/'; // Redirige a página principal o login
      })
      .catch(() => {
        alert('Error al cerrar sesión.');
      });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-700 dark:text-gray-300">Cerrando sesión...</p>
    </div>
  );
};

export default Logout;
