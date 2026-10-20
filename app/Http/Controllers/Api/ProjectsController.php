<?php

namespace App\Http\Controllers\Api;

use App\Core\Request;
use App\Core\Response;
use App\Services\PortfolioService;

final class ProjectsController
{
    private function resolveImages(array $project): array
    {
        if (!empty($project['cover_image'])) {
            $project['cover_image'] = url($project['cover_image']);
        }
        if (!empty($project['gallery'])) {
            $project['gallery'] = array_map(fn ($img) => url($img), $project['gallery']);
        }
        return $project;
    }

    public function index(Request $request): Response
    {
        $featuredOnly = $request->query('featured') === '1';
        $projects = PortfolioService::projects($featuredOnly);
        $projects = array_map([$this, 'resolveImages'], $projects);
        return Response::json(['data' => $projects]);
    }

    public function show(Request $request, string $slug): Response
    {
        $project = PortfolioService::projectBySlug($slug);
        if (!$project) {
            return Response::json(['message' => 'Not found'], 404);
        }
        return Response::json(['data' => $this->resolveImages($project)]);
    }
}
