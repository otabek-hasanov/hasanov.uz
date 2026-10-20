<?php

return [
    'driver' => env('SESSION_DRIVER', 'redis'),
    'lifetime' => (int) env('SESSION_LIFETIME', 120),
    'prefix' => env('SESSION_PREFIX', 'hasanov_session'),
];
