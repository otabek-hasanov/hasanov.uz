<?php

namespace App\Http\Controllers\Api;

use App\Core\Request;
use App\Core\Response;
use App\Services\PortfolioService;

final class SkillsController
{
    public function index(Request $request): Response
    {
        return Response::json(['data' => PortfolioService::skills()]);
    }
}
