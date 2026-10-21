<?php

namespace App\Http\Middleware;

use App\Core\Csrf;
use App\Core\MiddlewareInterface;
use App\Core\Request;
use App\Core\Response;

final class VerifyCsrfMiddleware implements MiddlewareInterface
{
    public function handle(Request $request, callable $next): Response
    {
        if (in_array($request->method(), ['POST', 'PUT', 'DELETE'], true)) {
            $token = $request->input('_token') ?? $request->header('X-CSRF-Token');
            if (!Csrf::verify($token)) {
                return Response::json(['message' => 'Invalid CSRF token'], 419);
            }
        }
        return $next($request);
    }
}
