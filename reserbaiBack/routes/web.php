<?php

use Illuminate\Support\Facades\Route;
require base_path('routes/api.php');
Route::get('/', function () {
    return 'Hola desde 24  web.php';
});
Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});


