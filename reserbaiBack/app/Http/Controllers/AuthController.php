<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Validación de los datos del registro
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'rol' => 'required|in:cliente,personal',
        ]);

        // Crear un nuevo usuario en la base de datos
        $user = User::create([
            'nombre' => $validated['nombre'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'rol' => $validated['rol'],
        ]);

        // Retornar una respuesta de éxito con el usuario creado
        return $this->success($user, 201);
    }

    public function login(Request $request)
    {
        // Validación de la entrada
        $validated = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validated->fails()) {
            return $this->error('Faltan campos requeridos o son inválidos', 400);
        }

        // Intentar autenticar al usuario
        if (!Auth::attempt($request->only('email', 'password'))) {
            // Si las credenciales no son correctas
            return $this->error('Credenciales incorrectas', 401);
        }

        // Obtener el usuario autenticado
        $user = Auth::user();

        /** @var \App\Models\User $user */
        // Crear el token de autenticación
        $token = $user->createToken('auth_token')->plainTextToken;

        // Retornar una respuesta de éxito con el usuario y el token generado
        return $this->success([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        // Eliminar todos los tokens del usuario para cerrar sesión
        $request->user()->tokens()->delete();

        // Retornar una respuesta de éxito
        return $this->success('Sesión cerrada correctamente');
    }

    // Método de éxito genérico (puedes personalizar la respuesta de éxito)
    protected function success($data, $status = 200)
    {
        return response()->json([
            'status' => 'success',
            'data' => $data,
        ], $status);
    }

    // Método de error genérico (puedes personalizar la respuesta de error)
    protected function error($message, $status = 400)
    {
        return response()->json([
            'status' => 'error',
            'message' => $message,
        ], $status);
    }
}
