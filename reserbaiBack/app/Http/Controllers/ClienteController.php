<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Cita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClienteController extends Controller
{
    public function index()
    {
        return response()->json(Auth::user());
    }

    public function actualizar(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'nombre' => 'string|max:255',
            'email' => 'email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6',
        ]);

        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        /** @var \App\Models\User $user */
        $user->update($data);

        return response()->json($user);
    }

    public function citas()
    {
        return response()->json(Auth::user()->citas); // Relación de Eloquent
    }
}
