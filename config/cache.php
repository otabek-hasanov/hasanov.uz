<?php

return [
    'driver' => env('CACHE_DRIVER', 'redis'),
    'prefix' => env('CACHE_PREFIX', 'hasanov_cache'),
    'ttl' => (int) env('CACHE_TTL', 3600),
];
