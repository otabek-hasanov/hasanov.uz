<?php

namespace App\Http\Controllers\Api;

use App\Core\Request;
use App\Core\Response;

final class NotFoundController
{
    public function handle(Request $request): Response
    {
        return Response::json(['message' => 'Not found'], 404);
    }
}
