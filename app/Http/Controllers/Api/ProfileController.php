<?php

namespace App\Http\Controllers\Api;

use App\Core\Request;
use App\Core\Response;
use App\Services\PortfolioService;

final class ProfileController
{
    public function show(Request $request): Response
    {
        $profile = PortfolioService::profile();
        unset($profile['id']);
        if (!empty($profile['avatar'])) {
            $profile['avatar'] = url($profile['avatar']);
        }
        if (!empty($profile['resume_path'])) {
            $profile['has_resume'] = true;
            unset($profile['resume_path']);
        } else {
            $profile['has_resume'] = false;
        }
        return Response::json(['data' => $profile]);
    }
}
