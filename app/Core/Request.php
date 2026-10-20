<?php

namespace App\Core;

final class Request
{
    public readonly string $method;
    public readonly string $uri;
    public readonly string $path;
    private array $query;
    private array $body;
    private array $server;
    private array $files;

    public function __construct()
    {
        $this->server = $_SERVER;
        $this->method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $this->uri = $uri;
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';
        $path = rawurldecode($path);
        $this->path = $path === '' ? '/' : $path;
        $this->query = $_GET;
        $this->files = $_FILES;

        $contentType = $this->server['CONTENT_TYPE'] ?? '';
        if (str_contains($contentType, 'application/json')) {
            $raw = file_get_contents('php://input');
            $decoded = json_decode($raw, true);
            $this->body = is_array($decoded) ? $decoded : [];
        } else {
            $this->body = $_POST;
        }
    }

    public function input(string $key, mixed $default = null): mixed
    {
        return $this->body[$key] ?? $this->query[$key] ?? $default;
    }

    public function all(): array
    {
        return array_merge($this->query, $this->body);
    }

    public function only(array $keys): array
    {
        $all = $this->all();
        return array_intersect_key($all, array_flip($keys));
    }

    public function query(string $key, mixed $default = null): mixed
    {
        return $this->query[$key] ?? $default;
    }

    public function method(): string
    {
        return $this->method;
    }

    public function isMethod(string $method): bool
    {
        return strtoupper($method) === $this->method;
    }

    public function file(string $key): ?array
    {
        $file = $this->files[$key] ?? null;
        if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
            return null;
        }
        return $file;
    }

    public function header(string $key): ?string
    {
        $normalized = 'HTTP_'.str_replace('-', '_', strtoupper($key));
        return $this->server[$normalized] ?? null;
    }

    public function ip(): string
    {
        return $this->server['REMOTE_ADDR'] ?? '0.0.0.0';
    }

    public function isAjax(): bool
    {
        return strtolower($this->header('X-Requested-With') ?? '') === 'xmlhttprequest';
    }

    public function wantsJson(): bool
    {
        $accept = $this->header('Accept') ?? '';
        return $this->isAjax() || str_contains($accept, 'application/json');
    }

    public function path(): string
    {
        return $this->path;
    }

    public function isSecure(): bool
    {
        return !empty($this->server['HTTPS']) || ($this->header('X-Forwarded-Proto') === 'https');
    }

    public function fullUrl(): string
    {
        $scheme = $this->isSecure() ? 'https' : 'http';
        $host = $this->server['HTTP_HOST'] ?? 'localhost';
        return "$scheme://$host{$this->uri}";
    }
}
