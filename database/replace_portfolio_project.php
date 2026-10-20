<?php

require __DIR__.'/cli_bootstrap.php';

use App\Core\Database;
use App\Services\PortfolioService;

function j(array $data): string
{
    return json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function resizeToWebp(string $srcPath, string $destPath, int $w, int $h): void
{
    $src = imagecreatefrompng($srcPath);
    $srcW = imagesx($src);
    $srcH = imagesy($src);

    $dst = imagecreatetruecolor($w, $h);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $w, $h, $srcW, $srcH);

    imagewebp($dst, $destPath, 82);
}

$root = dirname(__DIR__);
$scratch = '/tmp/claude-1019/-var-www-hasanov-uz-usr-data-www-hasanov-uz/cd9b5b27-f2c5-4567-af73-9e9c860d615c/scratchpad';

// Remove old sample project (files + DB row)
$old = Database::table('projects')->where('slug', '=', 'portfolio-website')->first();
if ($old) {
    if (!empty($old['cover_image'])) {
        @unlink($root.'/'.$old['cover_image']);
    }
    Database::table('projects')->where('id', '=', $old['id'])->delete();
    echo "Removed old project: portfolio-website\n";
}

$cover = 'public_assets/uploads/projects/smmpanel-uz-cover.webp';
resizeToWebp($scratch.'/test-smmpanel.png', $root.'/'.$cover, 1200, 750);

$data = [
    'slug' => 'smmpanel-uz',
    'title' => j([
        'uz' => 'SMMPanel.uz — SMM xizmatlari paneli',
        'ru' => 'SMMPanel.uz — Панель SMM-услуг',
        'en' => 'SMMPanel.uz — SMM Services Panel',
    ]),
    'summary' => j([
        'uz' => "Instagram, Telegram, TikTok va YouTube uchun avtomatik SMM xizmatlari platformasi.",
        'ru' => 'Платформа автоматических SMM-услуг для Instagram, Telegram, TikTok и YouTube.',
        'en' => 'An automated SMM services platform for Instagram, Telegram, TikTok and YouTube.',
    ]),
    'description' => j([
        'uz' => "SMMPanel.uz — O'zbekistondagi tezkor SMM panel bo'lib, Instagram, Telegram, TikTok, YouTube va boshqa tarmoqlar uchun obunachi, layk va ko'rishlar sotib olish imkonini beradi. Buyurtmalar bir necha daqiqada avtomatik bajariladi, narxlar 1000 ta uchun 17 so'mdan boshlanadi. Bot va saytlarga ulash uchun REST API, Uzcard/Humo/Payme/Click/Visa/Mastercard/USDT orqali to'lov, 24/7 qo'llab-quvvatlash va bajarilmagan buyurtmalar uchun avtomatik qaytarish mavjud.",
        'ru' => 'SMMPanel.uz — быстрая SMM-панель в Узбекистане, позволяющая покупать подписчиков, лайки и просмотры для Instagram, Telegram, TikTok, YouTube и других платформ. Заказы выполняются автоматически за несколько минут, цены начинаются от 17 сумов за 1000 единиц. Есть REST API для ботов и сайтов, оплата через Uzcard/Humo/Payme/Click/Visa/Mastercard/USDT, поддержка 24/7 и автоматический возврат за невыполненные заказы.',
        'en' => "SMMPanel.uz is a fast SMM panel in Uzbekistan that lets users buy followers, likes and views for Instagram, Telegram, TikTok, YouTube and other networks. Orders are processed automatically within minutes, with prices starting from 17 som per 1000 units. It offers a REST API for bots and websites, payment via Uzcard/Humo/Payme/Click/Visa/Mastercard/USDT, 24/7 support and automatic refunds for incomplete orders.",
    ]),
    'cover_image' => $cover,
    'gallery' => j([]),
    'tags' => j(['PHP', 'REST API', 'SMM', 'Payment Gateway']),
    'demo_url' => 'https://smmpanel.uz',
    'repo_url' => '',
    'is_featured' => 1,
    'sort_order' => 3,
];

$existing = Database::table('projects')->where('slug', '=', 'smmpanel-uz')->first();
if ($existing) {
    Database::table('projects')->where('id', '=', $existing['id'])->update($data);
    echo "Updated project: smmpanel-uz\n";
} else {
    Database::table('projects')->insert($data);
    echo "Inserted project: smmpanel-uz\n";
}

PortfolioService::flushCache();
echo "Done.\n";
