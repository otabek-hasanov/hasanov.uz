<?php

use App\Core\Route;
use App\Http\Controllers\Api\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\EducationsController as AdminEducationsController;
use App\Http\Controllers\Api\Admin\ExperiencesController as AdminExperiencesController;
use App\Http\Controllers\Api\Admin\MessagesController as AdminMessagesController;
use App\Http\Controllers\Api\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Api\Admin\ProjectsController as AdminProjectsController;
use App\Http\Controllers\Api\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\Api\Admin\SkillsController as AdminSkillsController;
use App\Http\Controllers\Api\ContactApiController;
use App\Http\Controllers\Api\CsrfController;
use App\Http\Controllers\Api\EducationsController;
use App\Http\Controllers\Api\ExperiencesController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProjectsController;
use App\Http\Controllers\Api\ResumeController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\SkillsController;
use App\Http\Middleware\AuthMiddleware;
use App\Http\Middleware\VerifyCsrfMiddleware;

Route::mount('/api', function () {
    Route::get('/health', [HealthController::class, 'index']);
    Route::get('/csrf', [CsrfController::class, 'show']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::get('/skills', [SkillsController::class, 'index']);
    Route::get('/experiences', [ExperiencesController::class, 'index']);
    Route::get('/educations', [EducationsController::class, 'index']);
    Route::get('/projects', [ProjectsController::class, 'index']);
    Route::get('/projects/([a-z0-9\-]+)', [ProjectsController::class, 'show']);
    Route::get('/settings', [SettingsController::class, 'show']);
    Route::get('/resume', [ResumeController::class, 'download']);
    Route::post('/contact', [ContactApiController::class, 'store'], [VerifyCsrfMiddleware::class]);

    // --- Admin ---
    Route::post('/admin/login', [AdminAuthController::class, 'login']);
    Route::post('/admin/logout', [AdminAuthController::class, 'logout'], [AuthMiddleware::class]);
    Route::get('/admin/me', [AdminAuthController::class, 'me']);

    Route::get('/admin/dashboard', [AdminDashboardController::class, 'show'], [AuthMiddleware::class]);

    Route::get('/admin/profile', [AdminProfileController::class, 'show'], [AuthMiddleware::class]);
    Route::post('/admin/profile', [AdminProfileController::class, 'update'], [AuthMiddleware::class, VerifyCsrfMiddleware::class]);

    Route::get('/admin/skills', [AdminSkillsController::class, 'index'], [AuthMiddleware::class]);
    Route::post('/admin/skills', [AdminSkillsController::class, 'store'], [AuthMiddleware::class, VerifyCsrfMiddleware::class]);
    Route::post('/admin/skills/(\d+)', [AdminSkillsController::class, 'update'], [AuthMiddleware::class, VerifyCsrfMiddleware::class]);
    Route::delete('/admin/skills/(\d+)', [AdminSkillsController::class, 'destroy'], [AuthMiddleware::class, VerifyCsrfMiddleware::class]);

    Route::get('/admin/experiences', [AdminExperiencesController::class, 'index'], [AuthMiddleware::class]);
    Route::post('/admin/experiences', [AdminExperiencesController::class, 'store'], [AuthMiddleware::class, VerifyCsrfMiddleware::class]);
    Route::post('/admin/experiences/(\d+)', [AdminExperiencesController::class, 'update'], [AuthMiddleware::class, VerifyCsrfMiddleware::class]);
    Route::delete('/admin/experiences/(\d+)', [AdminExperiencesController::class, 'destroy'], [AuthMiddleware::class, VerifyCsrfMiddleware::class]);

    Route::get('/admin/educations', [AdminEducationsController::class, 'index'], [AuthMiddleware::class]);
    Route::post('/admin/educations', [AdminEducationsController::class, 'store'], [AuthMiddleware::class, VerifyCsrfMiddleware::class]);
    Route::post('/admin/educations/(\d+)', [AdminEducationsController::class, 'update'], [AuthMiddleware::class, VerifyCsrfMiddleware::class]);
    Route::delete('/admin/educations/(\d+)', [AdminEducationsController::class, 'destroy'], [AuthMiddleware::class, VerifyCsrfMiddleware::class]);

    Route::get('/admin/projects', [AdminProjectsController::class, 'index'], [AuthMiddleware::class]);
    Route::get('/admin/projects/(\d+)', [AdminProjectsController::class, 'show'], [AuthMiddleware::class]);
    Route::post('/admin/projects', [AdminProjectsController::class, 'store'], [AuthMiddleware::class, VerifyCsrfMiddleware::class]);
    Route::post('/admin/projects/(\d+)', [AdminProjectsController::class, 'update'], [AuthMiddleware::class, VerifyCsrfMiddleware::class]);
    Route::delete('/admin/projects/(\d+)', [AdminProjectsController::class, 'destroy'], [AuthMiddleware::class, VerifyCsrfMiddleware::class]);

    Route::get('/admin/messages', [AdminMessagesController::class, 'index'], [AuthMiddleware::class]);
    Route::get('/admin/messages/(\d+)', [AdminMessagesController::class, 'show'], [AuthMiddleware::class]);
    Route::delete('/admin/messages/(\d+)', [AdminMessagesController::class, 'destroy'], [AuthMiddleware::class, VerifyCsrfMiddleware::class]);

    Route::get('/admin/settings', [AdminSettingsController::class, 'show'], [AuthMiddleware::class]);
    Route::post('/admin/settings', [AdminSettingsController::class, 'update'], [AuthMiddleware::class, VerifyCsrfMiddleware::class]);
});
