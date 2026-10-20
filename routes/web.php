<?php

use App\Core\Route;
use App\Http\Controllers\Api\NotFoundController;
use App\Http\Controllers\SeoController;

Route::get('/robots.txt', [SeoController::class, 'robots']);
Route::get('/sitemap.xml', [SeoController::class, 'sitemap']);
Route::get('/manifest.json', [SeoController::class, 'manifest']);

Route::set404([NotFoundController::class, 'handle']);
