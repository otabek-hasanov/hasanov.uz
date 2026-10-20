<?php

namespace App\Http\Controllers\Api;

use App\Core\Request;
use App\Core\Response;
use App\Services\PortfolioService;

final class EducationsController
{
    public function index(Request $request): Response
    {
        $rows = PortfolioService::educations();
        foreach ($rows as &$row) {
            if (!empty($row['logo'])) {
                $row['logo'] = url($row['logo']);
            }
        }
        return Response::json(['data' => $rows]);
    }
}
