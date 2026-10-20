<?php

namespace App\Core;

final class Auth
{
    private const SESSION_KEY = 'admin_id';

    public static function attempt(string $username, string $password): bool
    {
        $admin = Database::table('admins')->where('username', '=', $username)->first();
        if ($admin && password_verify($password, $admin['password'])) {
            session_regenerate_id(true);
            $_SESSION[self::SESSION_KEY] = (int) $admin['id'];
            return true;
        }
        return false;
    }

    public static function check(): bool
    {
        return isset($_SESSION[self::SESSION_KEY]);
    }

    public static function id(): ?int
    {
        return $_SESSION[self::SESSION_KEY] ?? null;
    }

    public static function user(): ?array
    {
        $id = self::id();
        if (!$id) {
            return null;
        }
        return Database::table('admins')->where('id', '=', $id)->first();
    }

    public static function logout(): void
    {
        unset($_SESSION[self::SESSION_KEY]);
        session_regenerate_id(true);
    }
}
