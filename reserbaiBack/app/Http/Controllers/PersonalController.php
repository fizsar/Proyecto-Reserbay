<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PersonalController extends Controller
{
    public function citasAsignadas()
    {
        $citas = Cita::where('personal_id', Auth::id())->get();
        return response()->json($citas);
    }

    public function cambiarEstado(Request $request, $id)
    {
        $cita = Cita::where('personal_id', Auth::id())->findOrFail($id);

        $request->validate([
            'estado' => 'required|in:aceptada,cancelada',
        ]);

        $cita->estado = $request->estado;
        $cita->save();

        return response()->json($cita);
    }
}
