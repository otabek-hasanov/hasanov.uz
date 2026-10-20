<?php

namespace App\Core;

use Bramus\Router\Router as BramusRouter;

final class Router
{
    private BramusRouter $router;
    private array $groupMiddleware = [];

    public function __construct()
    {
        $this->router = new BramusRouter();
    }

    public function group(array $middleware, callable $fn): void
    {
        $previous = $this->groupMiddleware;
        $this->groupMiddleware = [...$previous, ...$middleware];
        $fn();
        $this->groupMiddleware = $previous;
    }

    public function mount(string $prefix, callable $fn): void
    {
        $this->router->mount($prefix, $fn);
    }

    public function get(string $route, array $handler, array $middleware = []): void
    {
        $this->addRoute('GET', $route, $handler, $middleware);
    }

    public function post(string $route, array $handler, array $middleware = []): void
    {
        $this->addRoute('POST', $route, $handler, $middleware);
    }

    public function put(string $route, array $handler, array $middleware = []): void
    {
        $this->addRoute('PUT', $route, $handler, $middleware);
    }

    public function delete(string $route, array $handler, array $middleware = []): void
    {
        $this->addRoute('DELETE', $route, $handler, $middleware);
    }

    private function addRoute(string $method, string $route, array $handler, array $middleware): void
    {
        $all = [...$this->groupMiddleware, ...$middleware];
        $this->router->match($method, $route, function (...$params) use ($handler, $all) {
            $request = App::request();

            $core = function (Request $req) use ($handler, $params) {
                [$class, $methodName] = $handler;
                $controller = new $class();
                $response = $controller->$methodName($req, ...$params);
                return $response instanceof Response ? $response : Response::make((string) $response);
            };

            $pipeline = array_reduce(
                array_reverse($all),
                function (callable $next, string $middlewareClass) {
                    return function (Request $req) use ($middlewareClass, $next) {
                        $instance = new $middlewareClass();
                        return $instance->handle($req, $next);
                    };
                },
                $core
            );

            $pipeline($request)->send();
        });
    }

    public function set404(array $handler): void
    {
        $this->router->set404(function () use ($handler) {
            [$class, $methodName] = $handler;
            $controller = new $class();
            $response = $controller->$methodName(App::request());
            ($response instanceof Response ? $response : Response::make((string) $response, 404))->send();
        });
    }

    public function run(): void
    {
        $this->router->run();
    }
}
