<?php

define('BASE_PATH', __DIR__);

$request = require BASE_PATH.'/bootstrap/app.php';

use App\Core\Route;
use App\Core\Router;

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');

$router = new Router();
Route::setRouter($router);

require BASE_PATH.'/routes/web.php';
require BASE_PATH.'/routes/api.php';

$router->run();
