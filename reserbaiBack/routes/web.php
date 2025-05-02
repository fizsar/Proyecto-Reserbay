<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return 'Hola desde web.php';
});

// Ruta para que Sanctum configure la cookie de CSRF
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf_cookie' => csrf_token()]);
});
