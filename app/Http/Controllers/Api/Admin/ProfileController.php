<?php

namespace App\Http\Controllers\Api\Admin;

use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use App\Core\Upload;
use App\Services\PortfolioService;

final class ProfileController
{
    public function show(Request $request): Response
    {
        $profile = PortfolioService::profile();
        if (!empty($profile['avatar'])) {
            $profile['avatar'] = url($profile['avatar']);
        }
        if (!empty($profile['resume_path'])) {
            $profile['resume_path'] = url($profile['resume_path']);
        }
        return Response::json(['data' => $profile]);
    }

    public function update(Request $request): Response
    {
        $locales = config('locales.supported');
        $title = [];
        $bio = [];
        foreach ($locales as $loc) {
            $title[$loc] = (string) $request->input("title_$loc", '');
            $bio[$loc] = (string) $request->input("bio_$loc", '');
        }

        $data = [
            'name' => (string) $request->input('name', ''),
            'title' => json_encode($title, JSON_UNESCAPED_UNICODE),
            'bio' => json_encode($bio, JSON_UNESCAPED_UNICODE),
            'email' => (string) $request->input('email', ''),
            'phone' => (string) $request->input('phone', ''),
            'location' => (string) $request->input('location', ''),
            'years_experience' => (int) $request->input('years_experience', 0),
            'projects_done' => (int) $request->input('projects_done', 0),
            'happy_clients' => (int) $request->input('happy_clients', 0),
            'social' => json_encode([
                'github' => (string) $request->input('github', ''),
                'linkedin' => (string) $request->input('linkedin', ''),
                'telegram' => (string) $request->input('telegram', ''),
                'instagram' => (string) $request->input('instagram', ''),
            ], JSON_UNESCAPED_UNICODE),
        ];

        $avatar = $request->file('avatar');
        if ($avatar) {
            $path = Upload::store($avatar, 'profile', ['jpg', 'jpeg', 'png', 'webp'], 4 * 1024 * 1024);
            if ($path) {
                $data['avatar'] = $path;
            }
        }

        $resume = $request->file('resume');
        if ($resume) {
            $path = Upload::store($resume, 'resume', ['pdf'], 8 * 1024 * 1024);
            if ($path) {
                $data['resume_path'] = $path;
            }
        }

        Database::table('profile')->where('id', '=', 1)->update($data);
        PortfolioService::flushCache();

        return Response::json(['success' => true]);
    }
}
