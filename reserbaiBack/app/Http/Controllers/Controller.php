<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;

abstract class Controller
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected function success($data, $status = 200)
    {
        return response()->json(['data' => $data], $status);
    }

    protected function error($message, $status = 400)    
    {
        return response()->json(['error'], $status);
    }
}
