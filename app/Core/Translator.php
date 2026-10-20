<?php

namespace App\Core;

final class Translator
{
    private static array $strings = [];
    private static string $locale = 'uz';

    public static function setLocale(string $locale): void
    {
        self::$locale = $locale;
        if (!isset(self::$strings[$locale])) {
            $path = base_path("resources/lang/$locale/app.php");
            self::$strings[$locale] = is_file($path) ? require $path : [];
        }
    }

    public static function locale(): string
    {
        return self::$locale;
    }

    public static function get(string $key, array $replace = []): string
    {
        $value = self::$strings[self::$locale][$key] ?? $key;
        foreach ($replace as $k => $v) {
            $value = str_replace(":$k", (string) $v, $value);
        }
        return $value;
    }
}
