<?php

namespace App\Core;

final class Route
{
    private static ?Router $router = null;

    public static function setRouter(Router $router): void
    {
        self::$router = $router;
    }

    public static function get(string $route, array $handler, array $middleware = []): void
    {
        self::$router->get($route, $handler, $middleware);
    }

    public static function post(string $route, array $handler, array $middleware = []): void
    {
        self::$router->post($route, $handler, $middleware);
    }

    public static function put(string $route, array $handler, array $middleware = []): void
    {
        self::$router->put($route, $handler, $middleware);
    }

    public static function delete(string $route, array $handler, array $middleware = []): void
    {
        self::$router->delete($route, $handler, $middleware);
    }

    public static function mount(string $prefix, callable $fn): void
    {
        self::$router->mount($prefix, $fn);
    }

    public static function group(array $middleware, callable $fn): void
    {
        self::$router->group($middleware, $fn);
    }

    public static function set404(array $handler): void
    {
        self::$router->set404($handler);
    }
}
