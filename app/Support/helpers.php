<?php

use App\Core\App;
use App\Core\Auth;
use App\Core\Config;
use App\Core\Csrf;
use App\Core\RedisCache;
use App\Core\Response;
use App\Core\Translator;
use App\Core\View;

function base_path(string $path = ''): string
{
    return BASE_PATH.($path ? '/'.ltrim($path, '/') : '');
}

function storage_path(string $path = ''): string
{
    return base_path('storage'.($path ? '/'.ltrim($path, '/') : ''));
}

function public_asset_path(string $path = ''): string
{
    return base_path('public_assets'.($path ? '/'.ltrim($path, '/') : ''));
}

function env(string $key, mixed $default = null): mixed
{
    $value = $_ENV[$key] ?? getenv($key);
    if ($value === false || $value === null) {
        return $default;
    }
    if (is_string($value)) {
        $lower = strtolower($value);
        if ($lower === 'true') {
            return true;
        }
        if ($lower === 'false') {
            return false;
        }
        if ($lower === 'null') {
            return null;
        }
    }
    return $value;
}

function config(string $key, mixed $default = null): mixed
{
    return Config::get($key, $default);
}

function asset(string $path): string
{
    $path = ltrim($path, '/');
    $full = public_asset_path($path);
    $version = is_file($full) ? filemtime($full) : time();
    return '/public_assets/'.$path.'?v='.$version;
}

function url(string $path = ''): string
{
    $base = config('app.url');
    return $base.'/'.ltrim($path, '/');
}

function t(string $key, array $replace = []): string
{
    return Translator::get($key, $replace);
}

function current_locale(): string
{
    return Translator::locale();
}

function view(string $name, array $data = [], ?string $layout = 'layouts.app'): Response
{
    $content = View::render($name, $data);
    if ($layout) {
        $html = View::render($layout, [...$data, 'content' => $content]);
    } else {
        $html = $content;
    }
    return Response::make($html);
}

function partial(string $name, array $data = []): string
{
    return View::render($name, $data);
}

function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function redirect(string $to, int $status = 302): Response
{
    return Response::redirect($to, $status);
}

function csrf_token(): string
{
    return Csrf::token();
}

function csrf_field(): string
{
    return '<input type="hidden" name="_token" value="'.e(csrf_token()).'">';
}

function flash(string $key, mixed $value = null): mixed
{
    if ($value !== null) {
        $_SESSION['_flash'][$key] = $value;
        return null;
    }
    $data = $_SESSION['_flash'][$key] ?? null;
    unset($_SESSION['_flash'][$key]);
    return $data;
}

function is_authenticated(): bool
{
    return Auth::check();
}

function cache_remember(string $key, int $ttl, callable $callback): mixed
{
    return RedisCache::remember($key, $ttl, $callback);
}

function locale_path(string $locale, string $path = ''): string
{
    $path = trim($path, '/');
    return $path === '' ? "/$locale" : "/$locale/$path";
}

function locale_full_url(string $locale, string $path = ''): string
{
    return rtrim(config('app.url'), '/').locale_path($locale, $path);
}
