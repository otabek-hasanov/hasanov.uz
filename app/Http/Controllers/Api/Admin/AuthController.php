<?php

namespace App\Http\Controllers\Api\Admin;

use App\Core\Auth;
use App\Core\Csrf;
use App\Core\RedisCache;
use App\Core\Request;
use App\Core\Response;

final class AuthController
{
    public function me(Request $request): Response
    {
        if (!Auth::check()) {
            return Response::json(['authenticated' => false]);
        }
        $user = Auth::user();
        return Response::json([
            'authenticated' => true,
            'username' => $user['username'] ?? null,
            'csrf_token' => Csrf::token(),
        ]);
    }

    public function login(Request $request): Response
    {
        $ip = $request->ip();
        $attempts = RedisCache::increment('login_attempts:'.$ip, 300);
        if ($attempts > 8) {
            return Response::json(['success' => false, 'message' => "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring."], 429);
        }

        $username = (string) $request->input('username', '');
        $password = (string) $request->input('password', '');

        if ($username !== '' && $password !== '' && Auth::attempt($username, $password)) {
            return Response::json(['success' => true, 'csrf_token' => Csrf::token()]);
        }

        return Response::json(['success' => false, 'message' => "Login yoki parol noto'g'ri."], 422);
    }

    public function logout(Request $request): Response
    {
        Auth::logout();
        return Response::json(['success' => true]);
    }
}
