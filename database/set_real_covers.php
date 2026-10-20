<?php

require __DIR__.'/cli_bootstrap.php';

use App\Core\Database;
use App\Services\PortfolioService;

function resizeTo(string $srcPath, string $destPath, int $w, int $h): void
{
    $src = imagecreatefrompng($srcPath);
    $srcW = imagesx($src);
    $srcH = imagesy($src);

    $dst = imagecreatetruecolor($w, $h);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $w, $h, $srcW, $srcH);

    imagewebp($dst, $destPath, 82);
}

$scratch = '/tmp/claude-1019/-var-www-hasanov-uz-usr-data-www-hasanov-uz/cd9b5b27-f2c5-4567-af73-9e9c860d615c/scratchpad';
$root = dirname(__DIR__);
$dir = $root.'/public_assets/uploads/projects';

@unlink($root.'/public_assets/uploads/projects/checkout-uz-cover.png');
@unlink($root.'/public_assets/uploads/projects/smsgram-uz-cover.png');

$checkoutCover = 'public_assets/uploads/projects/checkout-uz-cover.webp';
resizeTo($scratch.'/test-checkout.png', $root.'/'.$checkoutCover, 1200, 750);

$smsgramCover = 'public_assets/uploads/projects/smsgram-uz-cover.webp';
resizeTo($scratch.'/test-smsgram.png', $root.'/'.$smsgramCover, 1200, 750);

Database::table('projects')->where('slug', '=', 'checkout-uz')->update(['cover_image' => $checkoutCover]);
Database::table('projects')->where('slug', '=', 'smsgram-uz')->update(['cover_image' => $smsgramCover]);

PortfolioService::flushCache();
echo "Real screenshot covers set for checkout-uz and smsgram-uz.\n";
