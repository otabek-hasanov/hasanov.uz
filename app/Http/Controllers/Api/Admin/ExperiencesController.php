<?php

namespace App\Http\Controllers\Api\Admin;

use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use App\Services\PortfolioService;

final class ExperiencesController
{
    public function index(Request $request): Response
    {
        $rows = Database::table('experiences')->orderBy('sort_order')->get();
        foreach ($rows as &$row) {
            $row['title'] = json_decode($row['title'] ?? '{}', true) ?: [];
            $row['description'] = json_decode($row['description'] ?? '{}', true) ?: [];
        }
        return Response::json(['data' => $rows]);
    }

    private function payload(Request $request): array
    {
        $locales = config('locales.supported');
        $title = [];
        $description = [];
        foreach ($locales as $loc) {
            $title[$loc] = (string) $request->input("title_$loc", '');
            $description[$loc] = (string) $request->input("description_$loc", '');
        }
        return [
            'title' => json_encode($title, JSON_UNESCAPED_UNICODE),
            'company' => (string) $request->input('company', ''),
            'location' => (string) $request->input('location', ''),
            'start_date' => (string) $request->input('start_date', ''),
            'end_date' => (string) $request->input('end_date', ''),
            'description' => json_encode($description, JSON_UNESCAPED_UNICODE),
            'sort_order' => (int) $request->input('sort_order', 0),
        ];
    }

    public function store(Request $request): Response
    {
        $id = Database::table('experiences')->insert($this->payload($request));
        PortfolioService::flushCache();
        return Response::json(['success' => true, 'id' => $id]);
    }

    public function update(Request $request, string $id): Response
    {
        Database::table('experiences')->where('id', '=', (int) $id)->update($this->payload($request));
        PortfolioService::flushCache();
        return Response::json(['success' => true]);
    }

    public function destroy(Request $request, string $id): Response
    {
        Database::table('experiences')->where('id', '=', (int) $id)->delete();
        PortfolioService::flushCache();
        return Response::json(['success' => true]);
    }
}
