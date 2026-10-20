<?php

use App\Core\App;
use App\Core\Config;
use App\Core\RedisCache;
use App\Core\RedisSessionHandler;
use App\Core\Request;

require BASE_PATH.'/vendor/autoload.php';
require BASE_PATH.'/app/Support/helpers.php';
require BASE_PATH.'/app/Support/locale_helpers.php';

$dotenv = Dotenv\Dotenv::createImmutable(BASE_PATH);
$dotenv->safeLoad();

Config::load(BASE_PATH.'/config');

date_default_timezone_set(Config::get('app.timezone', 'UTC'));

error_reporting(E_ALL);
ini_set('display_errors', Config::get('app.debug') ? '1' : '0');
ini_set('log_errors', '1');
ini_set('error_log', storage_path('logs/php-error.log'));

$lifetimeSeconds = (int) Config::get('session.lifetime', 120) * 60;

session_name(Config::get('session.prefix', 'hasanov_session'));
session_set_cookie_params([
    'lifetime' => $lifetimeSeconds,
    'path' => '/',
    'domain' => '',
    'secure' => !empty($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Lax',
]);

if (Config::get('session.driver') === 'redis') {
    $redisClient = RedisCache::raw();
    if ($redisClient) {
        session_set_save_handler(new RedisSessionHandler(
            $redisClient,
            $lifetimeSeconds,
            Config::get('session.prefix').':sess:'
        ));
    } else {
        session_save_path(storage_path('sessions'));
    }
} else {
    session_save_path(storage_path('sessions'));
}

ini_set('session.gc_maxlifetime', (string) $lifetimeSeconds);
session_start();

$request = new Request();
App::setRequest($request);

return $request;
