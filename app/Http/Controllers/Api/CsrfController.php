<?php

namespace App\Http\Controllers\Api;

use App\Core\Csrf;
use App\Core\Request;
use App\Core\Response;

final class CsrfController
{
    public function show(Request $request): Response
    {
        return Response::json(['token' => Csrf::token()]);
    }
}
