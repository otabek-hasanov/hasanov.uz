<?php

namespace App\Http\Controllers\Api\Admin;

use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use App\Services\PortfolioService;

final class EducationsController
{
    public function index(Request $request): Response
    {
        $rows = Database::table('educations')->orderBy('sort_order')->get();
        foreach ($rows as &$row) {
            $row['title'] = json_decode($row['title'] ?? '{}', true) ?: [];
        }
        return Response::json(['data' => $rows]);
    }

    private function payload(Request $request): array
    {
        $locales = config('locales.supported');
        $title = [];
        foreach ($locales as $loc) {
            $title[$loc] = (string) $request->input("title_$loc", '');
        }
        return [
            'title' => json_encode($title, JSON_UNESCAPED_UNICODE),
            'institution' => (string) $request->input('institution', ''),
            'logo' => (string) $request->input('logo', ''),
            'start_date' => (string) $request->input('start_date', ''),
            'end_date' => (string) $request->input('end_date', ''),
            'sort_order' => (int) $request->input('sort_order', 0),
        ];
    }

    public function store(Request $request): Response
    {
        $id = Database::table('educations')->insert($this->payload($request));
        PortfolioService::flushCache();
        return Response::json(['success' => true, 'id' => $id]);
    }

    public function update(Request $request, string $id): Response
    {
        Database::table('educations')->where('id', '=', (int) $id)->update($this->payload($request));
        PortfolioService::flushCache();
        return Response::json(['success' => true]);
    }

    public function destroy(Request $request, string $id): Response
    {
        Database::table('educations')->where('id', '=', (int) $id)->delete();
        PortfolioService::flushCache();
        return Response::json(['success' => true]);
    }
}
