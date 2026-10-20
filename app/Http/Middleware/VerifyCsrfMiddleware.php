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
                if ($request->wantsJson()) {
                    return Response::json(['message' => 'Invalid CSRF token'], 419);
                }
                return Response::make('Session expired, please go back and try again.', 419);
            }
        }
        return $next($request);
    }
}
