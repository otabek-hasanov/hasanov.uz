<?php

namespace App\Http\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Services\PortfolioService;

final class SeoController
{
    public function robots(Request $request): Response
    {
        $base = config('app.url');
        $content = "User-agent: *\n"
            ."Disallow: /admin\n"
            ."Disallow: /storage\n"
            ."Disallow: /api\n"
            ."Allow: /\n\n"
            ."Sitemap: $base/sitemap.xml\n";

        return Response::text($content);
    }

    public function sitemap(Request $request): Response
    {
        $locales = config('locales.supported');
        $default = config('locales.default');
        $projects = PortfolioService::projects();

        $pages = ['', 'projects'];
        foreach ($projects as $project) {
            $pages[] = 'projects/'.$project['slug'];
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'."\n";

        foreach ($pages as $page) {
            foreach ($locales as $locale) {
                $xml .= "  <url>\n    <loc>".e(locale_full_url($locale, $page))."</loc>\n";
                foreach ($locales as $altLocale) {
                    $xml .= "    <xhtml:link rel=\"alternate\" hreflang=\"$altLocale\" href=\"".e(locale_full_url($altLocale, $page))."\" />\n";
                }
                $xml .= "    <xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"".e(locale_full_url($default, $page))."\" />\n";
                $xml .= "    <changefreq>weekly</changefreq>\n  </url>\n";
            }
        }
        $xml .= '</urlset>';

        return Response::xml($xml);
    }

    public function manifest(Request $request): Response
    {
        return Response::json([
            'name' => config('app.name'),
            'short_name' => config('app.name'),
            'start_url' => locale_path(config('locales.default')),
            'display' => 'standalone',
            'background_color' => '#05070d',
            'theme_color' => '#05070d',
            'icons' => [
                ['src' => '/favicon-192.png', 'sizes' => '192x192', 'type' => 'image/png'],
                ['src' => '/favicon-512.png', 'sizes' => '512x512', 'type' => 'image/png'],
            ],
        ]);
    }
}
