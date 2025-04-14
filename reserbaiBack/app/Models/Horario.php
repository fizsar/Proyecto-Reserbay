<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Horario extends Model
{
    use HasFactory;

    // Los campos que se pueden asignar masivamente
    protected $fillable = [
        'user_id',      // Relacionado con User (personal)
        'dia_semana',   // Día de la semana (lunes, martes, ...)
        'hora_inicio',  // Hora de inicio del turno
        'hora_fin',     // Hora de fin del turno
    ];

    // Relación: Horario pertenece a un User (personal)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
