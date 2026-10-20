<?php

namespace App\Http\Middleware;

use App\Core\Auth;
use App\Core\MiddlewareInterface;
use App\Core\Request;
use App\Core\Response;

final class AuthMiddleware implements MiddlewareInterface
{
    public function handle(Request $request, callable $next): Response
    {
        if (!Auth::check()) {
            if ($request->wantsJson()) {
                return Response::json(['message' => 'Unauthenticated'], 401);
            }
            return Response::redirect('/admin/login');
        }
        return $next($request);
    }
}
