<?php

define('BASE_PATH', dirname(__DIR__));

require BASE_PATH.'/vendor/autoload.php';
require BASE_PATH.'/app/Support/helpers.php';

$dotenv = Dotenv\Dotenv::createImmutable(BASE_PATH);
$dotenv->safeLoad();

App\Core\Config::load(BASE_PATH.'/config');
