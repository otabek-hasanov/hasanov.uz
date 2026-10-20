<?php

namespace App\Http\Controllers\Api\Admin;

use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use App\Services\PortfolioService;

final class SettingsController
{
    public function show(Request $request): Response
    {
        return Response::json(['data' => [
            'site_title' => PortfolioService::setting('site_title', []),
            'meta_description' => PortfolioService::setting('meta_description', []),
            'google_analytics_id' => PortfolioService::setting('google_analytics_id', ''),
            'google_site_verification' => PortfolioService::setting('google_site_verification', ''),
        ]]);
    }

    public function update(Request $request): Response
    {
        $locales = config('locales.supported');
        $siteTitle = [];
        $metaDescription = [];
        foreach ($locales as $loc) {
            $siteTitle[$loc] = (string) $request->input("site_title_$loc", '');
            $metaDescription[$loc] = (string) $request->input("meta_description_$loc", '');
        }

        $this->save('site_title', json_encode($siteTitle, JSON_UNESCAPED_UNICODE));
        $this->save('meta_description', json_encode($metaDescription, JSON_UNESCAPED_UNICODE));
        $this->save('google_analytics_id', (string) $request->input('google_analytics_id', ''));
        $this->save('google_site_verification', (string) $request->input('google_site_verification', ''));

        PortfolioService::flushCache();
        return Response::json(['success' => true]);
    }

    private function save(string $key, string $value): void
    {
        $existing = Database::table('settings')->where('key', '=', $key)->first();
        if ($existing) {
            Database::table('settings')->where('key', '=', $key)->update(['value' => $value]);
        } else {
            Database::table('settings')->insert(['key' => $key, 'value' => $value]);
        }
    }
}
