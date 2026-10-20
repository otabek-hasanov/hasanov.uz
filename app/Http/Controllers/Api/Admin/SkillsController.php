<?php

namespace App\Http\Controllers\Api\Admin;

use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use App\Services\PortfolioService;

final class SkillsController
{
    public function index(Request $request): Response
    {
        return Response::json(['data' => Database::table('skills')->orderBy('sort_order')->get()]);
    }

    private function payload(Request $request): array
    {
        return [
            'name' => (string) $request->input('name', ''),
            'icon' => (string) $request->input('icon', ''),
            'percent' => max(0, min(100, (int) $request->input('percent', 80))),
            'sort_order' => (int) $request->input('sort_order', 0),
        ];
    }

    public function store(Request $request): Response
    {
        $id = Database::table('skills')->insert($this->payload($request));
        PortfolioService::flushCache();
        return Response::json(['success' => true, 'id' => $id]);
    }

    public function update(Request $request, string $id): Response
    {
        Database::table('skills')->where('id', '=', (int) $id)->update($this->payload($request));
        PortfolioService::flushCache();
        return Response::json(['success' => true]);
    }

    public function destroy(Request $request, string $id): Response
    {
        Database::table('skills')->where('id', '=', (int) $id)->delete();
        PortfolioService::flushCache();
        return Response::json(['success' => true]);
    }
}
