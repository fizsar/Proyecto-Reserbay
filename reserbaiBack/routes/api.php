<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\HorarioController;
use App\Http\Controllers\PersonalController;
use App\Http\Controllers\ServicioController;

// Login y registro
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Obtener usuario autenticado (requiere token de Sanctum)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rutas protegidas por Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Citas
    Route::apiResource('citas', CitaController::class);

    // Clientes
    Route::apiResource('clientes', ClienteController::class);

    // Horarios
    Route::apiResource('horarios', HorarioController::class);

    // Personal
    Route::apiResource('personal', PersonalController::class);

    // Servicios
    Route::apiResource('servicios', ServicioController::class);
});
