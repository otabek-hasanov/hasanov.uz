<?php

namespace App\Http\Controllers\Api\Admin;

use App\Core\Database;
use App\Core\Request;
use App\Core\Response;

final class DashboardController
{
    public function show(Request $request): Response
    {
        return Response::json(['data' => [
            'projects_count' => Database::table('projects')->count(),
            'skills_count' => Database::table('skills')->count(),
            'messages_count' => Database::table('messages')->count(),
            'unread_count' => Database::table('messages')->where('is_read', '=', 0)->count(),
        ]]);
    }
}
