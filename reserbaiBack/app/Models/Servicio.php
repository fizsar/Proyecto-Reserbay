<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    use HasFactory;

    // Los campos que se pueden asignar masivamente
    protected $fillable = [
        'nombre',   // Nombre del servicio
        'duracion', // Duración en minutos
        'precio',   // Precio del servicio
    ];

    // Relación: Un servicio puede tener muchas citas
    public function citas()
    {
        return $this->hasMany(Cita::class);
    }
}
