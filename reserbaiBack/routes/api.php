<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\HorarioController;
use App\Http\Controllers\PersonalController;
use App\Http\Controllers\ServicioController;
use Illuminate\Http\Request;  // Asegúrate de importar la clase Request

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


// Rutas para Auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rutas para Citas
Route::get('/citas', [CitaController::class, 'index']);
Route::post('/citas', [CitaController::class, 'store']);
Route::get('/citas/{id}', [CitaController::class, 'show']);
Route::put('/citas/{id}', [CitaController::class, 'update']);
Route::delete('/citas/{id}', [CitaController::class, 'destroy']);

// Rutas para Clientes
Route::get('/clientes', [ClienteController::class, 'index']);
Route::post('/clientes', [ClienteController::class, 'store']);
Route::get('/clientes/{id}', [ClienteController::class, 'show']);
Route::put('/clientes/{id}', [ClienteController::class, 'update']);
Route::delete('/clientes/{id}', [ClienteController::class, 'destroy']);

// Rutas para Horarios
Route::get('/horarios', [HorarioController::class, 'index']);
Route::post('/horarios', [HorarioController::class, 'store']);
Route::get('/horarios/{id}', [HorarioController::class, 'show']);
Route::put('/horarios/{id}', [HorarioController::class, 'update']);
Route::delete('/horarios/{id}', [HorarioController::class, 'destroy']);

// Rutas para Personal
Route::get('/personal', [PersonalController::class, 'index']);
Route::post('/personal', [PersonalController::class, 'store']);
Route::get('/personal/{id}', [PersonalController::class, 'show']);
Route::put('/personal/{id}', [PersonalController::class, 'update']);
Route::delete('/personal/{id}', [PersonalController::class, 'destroy']);

// Rutas para Servicios
Route::get('/servicios', [ServicioController::class, 'index']);
Route::post('/servicios', [ServicioController::class, 'store']);
Route::get('/servicios/{id}', [ServicioController::class, 'show']);
Route::put('/servicios/{id}', [ServicioController::class, 'update']);
Route::delete('/servicios/{id}', [ServicioController::class, 'destroy']);
