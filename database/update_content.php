<?php

require __DIR__.'/cli_bootstrap.php';

use App\Core\Database;
use App\Services\PortfolioService;

function j(array $data): string
{
    return json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function makeCover(string $title, string $subtitle, string $accentHex): string
{
    $w = 1200;
    $h = 750;
    $img = imagecreatetruecolor($w, $h);
    [$ar, $ag, $ab] = sscanf($accentHex, '#%02x%02x%02x');

    for ($y = 0; $y < $h; $y++) {
        $ratio = $y / ($h - 1);
        $r = (int) (5 + (10 - 5) * $ratio);
        $g = (int) (7 + (14 - 7) * $ratio);
        $b = (int) (13 + (26 - 13) * $ratio);
        $color = imagecolorallocate($img, $r, $g, $b);
        imageline($img, 0, $y, $w, $y, $color);
    }

    $steps = 14;
    for ($i = $steps; $i >= 1; $i--) {
        $alpha = 118 - (int) ((118 - 70) * (1 - $i / $steps));
        $size = (int) (1100 * ($i / $steps));
        $glow = imagecolorallocatealpha($img, $ar, $ag, $ab, $alpha);
        imagefilledellipse($img, (int) ($w * 0.86), (int) ($h * 0.1), $size, $size, $glow);
    }

    $accent = imagecolorallocate($img, $ar, $ag, $ab);
    imagefilledrectangle($img, 70, 70, 74, 130, $accent);

    $white = imagecolorallocate($img, 255, 255, 255);
    $muted = imagecolorallocate($img, 148, 163, 184);

    imagestring($img, 5, 70, 140, strtoupper($subtitle), $muted);

    $lines = explode("\n", wordwrap($title, 22, "\n", true));
    $y = 190;
    foreach ($lines as $line) {
        imagestring($img, 5, 70, $y, $line, $white);
        $y += 26;
    }

    for ($i = 0; $i < 40; $i++) {
        $x = random_int(0, $w);
        $y = random_int(0, $h);
        $dot = imagecolorallocatealpha($img, 255, 255, 255, random_int(100, 120));
        imagesetpixel($img, $x, $y, $dot);
    }

    ob_start();
    imagepng($img);
    return ob_get_clean();
}

$root = dirname(__DIR__);
$dir = $root.'/public_assets/uploads/projects';
if (!is_dir($dir)) {
    mkdir($dir, 0755, true);
}

$checkoutCover = 'public_assets/uploads/projects/checkout-uz-cover.png';
file_put_contents($root.'/'.$checkoutCover, makeCover('Checkout.uz', 'Payment Gateway', '#3b82f6'));

$smsgramCover = 'public_assets/uploads/projects/smsgram-uz-cover.png';
file_put_contents($root.'/'.$smsgramCover, makeCover('SMSGram', 'Bulk SMS Platform', '#22d3ee'));

Database::table('profile')->where('id', '=', 1)->update([
    'name' => 'Otabek Hasanov',
    'email' => 'contact@hasanov.uz',
    'phone' => '+998 99 016 10 53',
    'location' => 'Tashkent, Uzbekistan',
    'social' => j([
        'github' => 'https://github.com/otabek-hasanov',
        'linkedin' => 'https://www.linkedin.com/in/otabek-hasanov/',
        'telegram' => 'https://t.me/stoyishi',
        'instagram' => 'https://instagram.com/otabekhde',
    ]),
]);
echo "Profile updated.\n";

$skills = [
    ['name' => 'PHP', 'icon' => 'php', 'percent' => 92, 'sort_order' => 1],
    ['name' => 'JavaScript', 'icon' => 'javascript', 'percent' => 88, 'sort_order' => 2],
    ['name' => 'Node.js', 'icon' => 'nodejs', 'percent' => 85, 'sort_order' => 3],
    ['name' => 'React', 'icon' => 'react', 'percent' => 80, 'sort_order' => 4],
    ['name' => 'Tailwind CSS', 'icon' => 'tailwind', 'percent' => 90, 'sort_order' => 5],
    ['name' => 'MySQL', 'icon' => 'mysql', 'percent' => 88, 'sort_order' => 6],
    ['name' => 'PostgreSQL', 'icon' => 'postgresql', 'percent' => 78, 'sort_order' => 7],
    ['name' => 'MongoDB', 'icon' => 'mongodb', 'percent' => 75, 'sort_order' => 8],
    ['name' => 'Redis', 'icon' => 'redis', 'percent' => 75, 'sort_order' => 9],
    ['name' => 'Git', 'icon' => 'git', 'percent' => 85, 'sort_order' => 10],
    ['name' => 'Telegram API', 'icon' => 'telegram', 'percent' => 85, 'sort_order' => 11],
    ['name' => 'Payments API', 'icon' => 'payments', 'percent' => 82, 'sort_order' => 12],
];
Database::statement('DELETE FROM skills');
foreach ($skills as $skill) {
    Database::table('skills')->insert($skill);
}
echo "Skills refreshed (".count($skills).").\n";

$projects = [
    [
        'slug' => 'checkout-uz',
        'title' => j([
            'uz' => "Checkout.uz — Milliy to'lov shlyuzi",
            'ru' => 'Checkout.uz — Национальный платёжный шлюз',
            'en' => 'Checkout.uz — National Payment Gateway',
        ]),
        'summary' => j([
            'uz' => "Payme, Click, Uzcard va Humo'ni bitta shlyuzga birlashtirgan to'lov agregatori.",
            'ru' => 'Платёжный агрегатор, объединяющий Payme, Click, Uzcard и Humo в единый шлюз.',
            'en' => 'A payment aggregator unifying Payme, Click, Uzcard and Humo into a single gateway.',
        ]),
        'description' => j([
            'uz' => "Checkout.uz — O'zbekistondagi bizneslar uchun yagona to'lov shlyuzi. Payme, Click, Uzcard va Humo kabi barcha mahalliy to'lov usullarini bitta JSON API va PHP SDK orqali ulash imkonini beradi. Real vaqtda webhook bildirishnomalari, tranzaksiyalar statistikasi va daromad grafiklari bilan boshqaruv paneli, MD5 va SSL shifrlash orqali xavfsizlik, hamda Telegram bot integratsiyasi mavjud. Sayt o'zbek, rus, tojik va ingliz tillarini qo'llab-quvvatlaydi.",
            'ru' => 'Checkout.uz — единый платёжный шлюз для бизнеса в Узбекистане. Объединяет Payme, Click, Uzcard и Humo через единый JSON API и PHP SDK. Реализованы webhook-уведомления в реальном времени, панель аналитики с графиками доходов, защита данных через MD5 и SSL, а также интеграция с Telegram-ботом. Поддерживаются узбекский, русский, таджикский и английский языки.',
            'en' => "Checkout.uz is a unified payment gateway for businesses in Uzbekistan. It consolidates Payme, Click, Uzcard and Humo behind a single JSON API and PHP SDK, with real-time webhook notifications, a revenue analytics dashboard, MD5/SSL-secured transactions and Telegram bot integration. The platform supports Uzbek, Russian, Tajik and English.",
        ]),
        'cover_image' => $checkoutCover,
        'gallery' => j([]),
        'tags' => j(['PHP', 'REST API', 'Payment Gateway', 'Webhook', 'MySQL']),
        'demo_url' => 'https://checkout.uz',
        'repo_url' => '',
        'is_featured' => 1,
        'sort_order' => 1,
    ],
    [
        'slug' => 'smsgram-uz',
        'title' => j([
            'uz' => 'SMSGram — Ommaviy SMS platformasi',
            'ru' => 'SMSGram — Платформа массовых SMS',
            'en' => 'SMSGram — Bulk SMS Platform',
        ]),
        'summary' => j([
            'uz' => "O'zbekiston bizneslari uchun tezkor, Redis asosidagi ommaviy SMS yuborish xizmati.",
            'ru' => 'Быстрый сервис массовой SMS-рассылки на базе Redis для бизнеса в Узбекистане.',
            'en' => 'A fast, Redis-powered bulk SMS service built for businesses in Uzbekistan.',
        ]),
        'description' => j([
            'uz' => "SMSGram — minglab mijozlarga tezkor SMS yuborish uchun qurilgan platforma. Redis navbat tizimi orqali yuqori tezlikda xabar yetkazadi, REST API orqali oson integratsiya, shablon asosidagi xabarlar va spamni oldini olish uchun oldindan tasdiqlash jarayoni mavjud. OTP tasdiqlash, buyurtma bildirishnomalari, moliyaviy ogohlantirishlar va marketing kampaniyalari uchun ishlatiladi. Click, Payme va Uzcard/Humo orqali to'lov qilish imkoniyati bor.",
            'ru' => 'SMSGram — платформа для быстрой отправки SMS тысячам клиентов. Использует очередь на базе Redis для высокой скорости доставки, простой REST API для интеграции, шаблонные сообщения с предварительным одобрением для защиты от спама. Применяется для OTP-подтверждений, уведомлений о заказах, финансовых оповещений и маркетинговых кампаний. Оплата через Click, Payme и Uzcard/Humo.',
            'en' => 'SMSGram is a platform for sending bulk SMS to thousands of customers quickly. It uses a Redis-backed queue for high-speed delivery, a simple REST API for integration, and template-based messages with a pre-approval process to prevent spam. Used for OTP verification, order notifications, financial alerts and marketing campaigns, with payment via Click, Payme and Uzcard/Humo.',
        ]),
        'cover_image' => $smsgramCover,
        'gallery' => j([]),
        'tags' => j(['PHP', 'Redis', 'REST API', 'SMS Gateway']),
        'demo_url' => 'https://smsgram.uz',
        'repo_url' => '',
        'is_featured' => 1,
        'sort_order' => 2,
    ],
];

foreach ($projects as $project) {
    $existing = Database::table('projects')->where('slug', '=', $project['slug'])->first();
    if ($existing) {
        Database::table('projects')->where('id', '=', $existing['id'])->update($project);
        echo "Updated project: {$project['slug']}\n";
    } else {
        Database::table('projects')->insert($project);
        echo "Inserted project: {$project['slug']}\n";
    }
}

Database::table('projects')->where('slug', '=', 'portfolio-website')->update(['sort_order' => 3]);

PortfolioService::flushCache();
echo "Cache flushed. Done.\n";
