<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use Illuminate\Http\Request;

class CitaController extends Controller
{
    public function index()
    {
        return $this->success(Cita::with(['user', 'servicio'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'servicio_id' => 'required|exists:servicios,id',
            'personal_id' => 'required|exists:users,id',
            'fecha' => 'required|date',
            'hora' => 'required',
        ]);

        $cita = Cita::create($validated);

        return $this->success($cita, 201);
    }

    public function updateEstado(Request $request, $id)
    {
        $cita = Cita::findOrFail($id);
        $estado = $request->validate([
            'estado' => 'required|in:pendiente,aceptada,cancelada'
        ])['estado'];

        $cita->estado = $estado;
        $cita->save();

        return $this->success($cita);
    }

    public function destroy($id)
    {
        Cita::destroy($id);
        return $this->success('Cita eliminada');
    }
}
