<?php

namespace App\Http\Controllers\Api;

use App\Core\Request;
use App\Core\Response;
use App\Services\PortfolioService;

final class ResumeController
{
    public function download(Request $request): Response
    {
        $profile = PortfolioService::profile();
        $path = $profile['resume_path'] ?? '';

        if (!$path || !is_file(base_path($path))) {
            return Response::json(['message' => 'Resume not available'], 404);
        }

        $ext = pathinfo($path, PATHINFO_EXTENSION) ?: 'pdf';
        return Response::download(base_path($path), 'resume-hasanov.'.$ext);
    }
}
