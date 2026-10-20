<?php

namespace App\Core;

final class View
{
    private static string $basePath = '';

    public static function setBasePath(string $path): void
    {
        self::$basePath = $path;
    }

    public static function render(string $view, array $data = []): string
    {
        $path = self::$basePath.'/'.str_replace('.', '/', $view).'.php';
        if (!is_file($path)) {
            throw new \RuntimeException("View not found: $view ($path)");
        }
        extract($data, EXTR_SKIP);
        ob_start();
        include $path;
        return ob_get_clean();
    }
}
