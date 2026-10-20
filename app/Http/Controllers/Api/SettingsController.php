<?php

namespace App\Http\Controllers\Api;

use App\Core\Request;
use App\Core\Response;
use App\Services\PortfolioService;

final class SettingsController
{
    public function show(Request $request): Response
    {
        $ogImage = PortfolioService::setting('og_image', '');
        return Response::json(['data' => [
            'site_title' => PortfolioService::setting('site_title', []),
            'meta_description' => PortfolioService::setting('meta_description', []),
            'google_analytics_id' => PortfolioService::setting('google_analytics_id', ''),
            'google_site_verification' => PortfolioService::setting('google_site_verification', ''),
            'og_image' => $ogImage ? url($ogImage) : '',
        ]]);
    }
}
