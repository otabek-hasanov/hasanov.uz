<?php

namespace App\Http\Controllers\Api\Admin;

use App\Core\Database;
use App\Core\Request;
use App\Core\Response;

final class MessagesController
{
    public function index(Request $request): Response
    {
        return Response::json(['data' => Database::table('messages')->orderBy('id', 'DESC')->get()]);
    }

    public function show(Request $request, string $id): Response
    {
        $row = Database::table('messages')->where('id', '=', (int) $id)->first();
        if (!$row) {
            return Response::json(['message' => 'Not found'], 404);
        }
        Database::table('messages')->where('id', '=', (int) $id)->update(['is_read' => 1]);
        $row['is_read'] = 1;
        return Response::json(['data' => $row]);
    }

    public function destroy(Request $request, string $id): Response
    {
        Database::table('messages')->where('id', '=', (int) $id)->delete();
        return Response::json(['success' => true]);
    }
}
