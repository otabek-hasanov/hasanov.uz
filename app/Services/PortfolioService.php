<?php

namespace App\Services;

use App\Core\Database;
use App\Core\RedisCache;

final class PortfolioService
{
    public static function profile(): array
    {
        return cache_remember('profile', 3600, function () {
            $row = Database::table('profile')->where('id', '=', 1)->first();
            if (!$row) {
                return [];
            }
            $row['title'] = json_decode($row['title'] ?? '{}', true) ?: [];
            $row['bio'] = json_decode($row['bio'] ?? '{}', true) ?: [];
            $row['social'] = json_decode($row['social'] ?? '{}', true) ?: [];
            return $row;
        });
    }

    public static function skills(): array
    {
        return cache_remember('skills', 3600, fn () => Database::table('skills')->orderBy('sort_order')->get());
    }

    public static function experiences(): array
    {
        return cache_remember('experiences', 3600, function () {
            $rows = Database::table('experiences')->orderBy('sort_order')->get();
            foreach ($rows as &$row) {
                $row['title'] = json_decode($row['title'] ?? '{}', true) ?: [];
                $row['description'] = json_decode($row['description'] ?? '{}', true) ?: [];
            }
            return $rows;
        });
    }

    public static function educations(): array
    {
        return cache_remember('educations', 3600, function () {
            $rows = Database::table('educations')->orderBy('sort_order')->get();
            foreach ($rows as &$row) {
                $row['title'] = json_decode($row['title'] ?? '{}', true) ?: [];
            }
            return $rows;
        });
    }

    public static function projects(bool $featuredOnly = false): array
    {
        $key = $featuredOnly ? 'projects_featured' : 'projects_all';
        return cache_remember($key, 3600, function () use ($featuredOnly) {
            $qb = Database::table('projects');
            if ($featuredOnly) {
                $qb->where('is_featured', '=', 1);
            }
            $rows = $qb->orderBy('sort_order')->get();
            foreach ($rows as &$row) {
                $row['title'] = json_decode($row['title'] ?? '{}', true) ?: [];
                $row['summary'] = json_decode($row['summary'] ?? '{}', true) ?: [];
                $row['description'] = json_decode($row['description'] ?? '{}', true) ?: [];
                $row['tags'] = json_decode($row['tags'] ?? '[]', true) ?: [];
                $row['gallery'] = json_decode($row['gallery'] ?? '[]', true) ?: [];
            }
            return $rows;
        });
    }

    public static function projectBySlug(string $slug): ?array
    {
        foreach (self::projects() as $project) {
            if ($project['slug'] === $slug) {
                return $project;
            }
        }
        return null;
    }

    public static function setting(string $key, mixed $default = null): mixed
    {
        $settings = cache_remember('settings', 3600, function () {
            $map = [];
            foreach (Database::table('settings')->get() as $row) {
                $map[$row['key']] = $row['value'];
            }
            return $map;
        });

        $value = $settings[$key] ?? null;
        if ($value === null) {
            return $default;
        }
        $decoded = json_decode($value, true);
        return $decoded !== null ? $decoded : $value;
    }

    public static function flushCache(): void
    {
        RedisCache::flushPrefix('*');
    }
}
