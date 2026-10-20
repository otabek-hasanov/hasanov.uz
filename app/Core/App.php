<?php

namespace App\Core;

final class App
{
    private static ?Request $request = null;

    public static function setRequest(Request $request): void
    {
        self::$request = $request;
    }

    public static function request(): Request
    {
        return self::$request;
    }
}
