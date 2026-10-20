<?php

namespace App\Core;

final class Upload
{
    private const MIME_MAP = [
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'webp' => 'image/webp',
        'gif' => 'image/gif',
        'pdf' => 'application/pdf',
    ];

    public static function store(array $file, string $subdir, array $allowedExt, int $maxBytes): ?string
    {
        if (!isset($file['tmp_name'], $file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
            return null;
        }
        if (($file['size'] ?? 0) > $maxBytes || ($file['size'] ?? 0) <= 0) {
            return null;
        }

        $ext = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $allowedExt, true)) {
            return null;
        }

        if (isset(self::MIME_MAP[$ext])) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime = finfo_file($finfo, $file['tmp_name']);
            finfo_close($finfo);
            if ($mime !== self::MIME_MAP[$ext]) {
                return null;
            }
        }

        $dir = public_asset_path('uploads/'.$subdir);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $filename = bin2hex(random_bytes(16)).'.'.$ext;
        $destination = $dir.'/'.$filename;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            return null;
        }

        return 'public_assets/uploads/'.$subdir.'/'.$filename;
    }
}
