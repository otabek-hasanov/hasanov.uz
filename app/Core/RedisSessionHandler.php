<?php

namespace App\Core;

use Predis\Client;
use SessionHandlerInterface;
use Throwable;

final class RedisSessionHandler implements SessionHandlerInterface
{
    public function __construct(
        private Client $client,
        private int $ttl,
        private string $prefix
    ) {
    }

    public function open(string $path, string $name): bool
    {
        return true;
    }

    public function close(): bool
    {
        return true;
    }

    public function read(string $id): string
    {
        try {
            return (string) $this->client->get($this->prefix.$id);
        } catch (Throwable) {
            return '';
        }
    }

    public function write(string $id, string $data): bool
    {
        try {
            $this->client->setex($this->prefix.$id, $this->ttl, $data);
            return true;
        } catch (Throwable) {
            return false;
        }
    }

    public function destroy(string $id): bool
    {
        try {
            $this->client->del([$this->prefix.$id]);
            return true;
        } catch (Throwable) {
            return false;
        }
    }

    public function gc(int $max_lifetime): int
    {
        return 0;
    }
}
