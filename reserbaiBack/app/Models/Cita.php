<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    use HasFactory;

    // Los campos que se pueden asignar masivamente
    protected $fillable = [
        'user_id',       // Cliente que hace la cita
        'servicio_id',   // Servicio solicitado
        'personal_id',   // Personal asignado
        'fecha',         // Fecha de la cita
        'hora',          // Hora de la cita
        'estado',        // Estado de la cita (pendiente, aceptada, cancelada)
    ];

    // Relación: Una cita pertenece a un cliente (User)
    public function cliente()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relación: Una cita pertenece a un personal (User)
    public function personal()
    {
        return $this->belongsTo(User::class, 'personal_id');
    }

    // Relación: Una cita pertenece a un servicio
    public function servicio()
    {
        return $this->belongsTo(Servicio::class);
    }
}
