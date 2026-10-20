<?php

namespace App\Core;

use Predis\Client;
use Throwable;

final class RedisCache
{
    private static ?Client $client = null;
    private static bool $attempted = false;
    private static bool $available = false;

    public static function raw(): ?Client
    {
        if (!self::$attempted) {
            self::$attempted = true;
            try {
                $client = new Client([
                    'scheme' => 'tcp',
                    'host' => Config::get('redis.host'),
                    'port' => Config::get('redis.port'),
                    'password' => Config::get('redis.password'),
                    'database' => Config::get('redis.database', 0),
                    'timeout' => 1.0,
                ]);
                $client->connect();
                self::$client = $client;
                self::$available = true;
            } catch (Throwable) {
                self::$available = false;
            }
        }
        return self::$available ? self::$client : null;
    }

    public static function remember(string $key, int $ttl, callable $callback): mixed
    {
        $client = self::raw();
        $fullKey = Config::get('cache.prefix').':'.$key;
        if ($client) {
            try {
                $cached = $client->get($fullKey);
                if ($cached !== null) {
                    return unserialize($cached);
                }
            } catch (Throwable) {
            }
        }
        $value = $callback();
        if ($client) {
            try {
                $client->setex($fullKey, $ttl, serialize($value));
            } catch (Throwable) {
            }
        }
        return $value;
    }

    public static function forget(string $key): void
    {
        $client = self::raw();
        if (!$client) {
            return;
        }
        try {
            $client->del([Config::get('cache.prefix').':'.$key]);
        } catch (Throwable) {
        }
    }

    public static function flushPrefix(string $pattern): void
    {
        $client = self::raw();
        if (!$client) {
            return;
        }
        try {
            $keys = $client->keys(Config::get('cache.prefix').':'.$pattern);
            if ($keys) {
                $client->del($keys);
            }
        } catch (Throwable) {
        }
    }

    public static function increment(string $key, int $ttl): int
    {
        $client = self::raw();
        $fullKey = Config::get('cache.prefix').':'.$key;
        if (!$client) {
            return 0;
        }
        try {
            $value = $client->incr($fullKey);
            if ($value === 1) {
                $client->expire($fullKey, $ttl);
            }
            return (int) $value;
        } catch (Throwable) {
            return 0;
        }
    }
}
