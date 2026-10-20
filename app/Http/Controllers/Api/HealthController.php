<?php

namespace App\Http\Controllers\Api;

use App\Core\Request;
use App\Core\Response;

final class HealthController
{
    public function index(Request $request): Response
    {
        return Response::json(['status' => 'ok', 'time' => date('c')]);
    }
}
