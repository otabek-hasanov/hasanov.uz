<?php

namespace App\Http\Controllers\Api\Admin;

use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use App\Core\Upload;
use App\Services\PortfolioService;

final class ProjectsController
{
    public function index(Request $request): Response
    {
        $rows = Database::table('projects')->orderBy('sort_order')->get();
        foreach ($rows as &$row) {
            $row['title'] = json_decode($row['title'] ?? '{}', true) ?: [];
            if (!empty($row['cover_image'])) {
                $row['cover_image'] = url($row['cover_image']);
            }
        }
        return Response::json(['data' => $rows]);
    }

    public function show(Request $request, string $id): Response
    {
        $row = Database::table('projects')->where('id', '=', (int) $id)->first();
        if (!$row) {
            return Response::json(['message' => 'Not found'], 404);
        }
        $row['title'] = json_decode($row['title'] ?? '{}', true) ?: [];
        $row['summary'] = json_decode($row['summary'] ?? '{}', true) ?: [];
        $row['description'] = json_decode($row['description'] ?? '{}', true) ?: [];
        $row['tags'] = json_decode($row['tags'] ?? '[]', true) ?: [];
        $row['gallery_urls'] = array_map(fn ($img) => url($img), json_decode($row['gallery'] ?? '[]', true) ?: []);
        if (!empty($row['cover_image'])) {
            $row['cover_image'] = url($row['cover_image']);
        }
        return Response::json(['data' => $row]);
    }

    private function payload(Request $request): array
    {
        $locales = config('locales.supported');
        $title = [];
        $summary = [];
        $description = [];
        foreach ($locales as $loc) {
            $title[$loc] = (string) $request->input("title_$loc", '');
            $summary[$loc] = (string) $request->input("summary_$loc", '');
            $description[$loc] = (string) $request->input("description_$loc", '');
        }

        $tagsRaw = (string) $request->input('tags', '');
        $tags = array_values(array_filter(array_map('trim', explode(',', $tagsRaw))));

        return [
            'title' => json_encode($title, JSON_UNESCAPED_UNICODE),
            'summary' => json_encode($summary, JSON_UNESCAPED_UNICODE),
            'description' => json_encode($description, JSON_UNESCAPED_UNICODE),
            'tags' => json_encode($tags, JSON_UNESCAPED_UNICODE),
            'demo_url' => (string) $request->input('demo_url', ''),
            'repo_url' => (string) $request->input('repo_url', ''),
            'is_featured' => $request->input('is_featured') ? 1 : 0,
            'sort_order' => (int) $request->input('sort_order', 0),
        ];
    }

    private function slugify(string $text): string
    {
        $slug = strtolower(trim($text));
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?? '';
        $slug = trim($slug, '-');
        return $slug !== '' ? $slug : bin2hex(random_bytes(4));
    }

    private function collectGallery(): array
    {
        $files = $_FILES['gallery'] ?? null;
        $gallery = [];
        if ($files && is_array($files['name'] ?? null)) {
            foreach ($files['name'] as $i => $name) {
                if (($files['error'][$i] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
                    continue;
                }
                $single = [
                    'name' => $files['name'][$i],
                    'type' => $files['type'][$i],
                    'tmp_name' => $files['tmp_name'][$i],
                    'error' => $files['error'][$i],
                    'size' => $files['size'][$i],
                ];
                $path = Upload::store($single, 'projects', ['jpg', 'jpeg', 'png', 'webp'], 5 * 1024 * 1024);
                if ($path) {
                    $gallery[] = $path;
                }
            }
        }
        return $gallery;
    }

    public function store(Request $request): Response
    {
        $data = $this->payload($request);

        $slugInput = (string) $request->input('slug', '');
        $slug = $this->slugify($slugInput !== '' ? $slugInput : (string) $request->input('title_uz', ''));
        if (Database::table('projects')->where('slug', '=', $slug)->first()) {
            $slug .= '-'.bin2hex(random_bytes(3));
        }
        $data['slug'] = $slug;

        $cover = $request->file('cover_image');
        if ($cover) {
            $path = Upload::store($cover, 'projects', ['jpg', 'jpeg', 'png', 'webp'], 5 * 1024 * 1024);
            if ($path) {
                $data['cover_image'] = $path;
            }
        }

        $data['gallery'] = json_encode($this->collectGallery());

        $id = Database::table('projects')->insert($data);
        PortfolioService::flushCache();
        return Response::json(['success' => true, 'id' => $id, 'slug' => $slug]);
    }

    public function update(Request $request, string $id): Response
    {
        $data = $this->payload($request);

        $cover = $request->file('cover_image');
        if ($cover) {
            $path = Upload::store($cover, 'projects', ['jpg', 'jpeg', 'png', 'webp'], 5 * 1024 * 1024);
            if ($path) {
                $data['cover_image'] = $path;
            }
        }

        $gallery = $this->collectGallery();
        if ($gallery) {
            $data['gallery'] = json_encode($gallery);
        }

        Database::table('projects')->where('id', '=', (int) $id)->update($data);
        PortfolioService::flushCache();
        return Response::json(['success' => true]);
    }

    public function destroy(Request $request, string $id): Response
    {
        Database::table('projects')->where('id', '=', (int) $id)->delete();
        PortfolioService::flushCache();
        return Response::json(['success' => true]);
    }
}
