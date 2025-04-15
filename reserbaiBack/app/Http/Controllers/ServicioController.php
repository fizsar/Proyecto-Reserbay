<?php

namespace App\Http\Controllers;

use App\Models\Servicio;
use Illuminate\Http\Request;

class ServicioController extends Controller
{
    public function index()
    {
        return $this->success(Servicio::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string',
            'duracion' => 'required|integer',
            'precio' => 'required|numeric',
        ]);

        $servicio = Servicio::create($validated);

        return $this->success($servicio, 201);
    }

    public function update(Request $request, $id)
    {
        $servicio = Servicio::findOrFail($id);

        $servicio->update($request->only(['nombre', 'duracion', 'precio']));

        return $this->success($servicio);
    }

    public function destroy($id)
    {
        Servicio::destroy($id);
        return $this->success('Servicio eliminado');
    }
}
