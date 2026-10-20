<?php

namespace App\Services;

use App\Core\Database;
use App\Core\RedisCache;
use App\Core\Validator;

final class ContactService
{
    public static function validate(array $data): Validator
    {
        return Validator::make($data, [
            'name' => 'required|max:160',
            'email' => 'required|email|max:160',
            'subject' => 'max:255',
            'message' => 'required|min:5|max:5000',
        ]);
    }

    public static function isRateLimited(string $ip): bool
    {
        $count = RedisCache::increment('contact_throttle:'.$ip, 3600);
        return $count > 5;
    }

    public static function store(array $data, string $ip): int
    {
        return Database::table('messages')->insert([
            'name' => $data['name'],
            'email' => $data['email'],
            'subject' => $data['subject'] ?? '',
            'message' => $data['message'],
            'ip' => $ip,
        ]);
    }
}
