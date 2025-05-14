import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = { email, password };

        console.log('Enviando login:', data);

        try {
            const response = await fetch('http://localhost:3000/backend/controller/AuthController.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            const raw = await response.text(); // leer respuesta sin parsear aún
            console.log('Respuesta cruda:', raw);

            try {
                const result = JSON.parse(raw);

                if (response.ok) {
                    setSuccessMessage('Login exitoso');
                    console.log('Usuario:', result.user);
                } else {
                    setErrorMessage(result.message || 'Error al iniciar sesión');
                }
            } catch (jsonError) {
                setErrorMessage('La respuesta del servidor no es JSON válido');
                console.error('Error de parseo JSON:', jsonError);
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            setErrorMessage('No se pudo conectar al servidor');
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default Login;
