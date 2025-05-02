<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap the Laravel application...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

// Captura y guarda la solicitud
$request = Request::capture();

// Maneja la solicitud
$response = $app->handle($request);

// Envía la respuesta al navegador
$response->send();

// Termina la aplicación limpiamente
$app->terminate($request, $response);
