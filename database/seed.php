<?php

require __DIR__.'/cli_bootstrap.php';

use App\Core\Database;

$adminUser = $argv[1] ?? 'admin';
$adminPass = $argv[2] ?? null;

if (!$adminPass) {
    fwrite(STDERR, "Usage: php seed.php <username> <password>\n");
    exit(1);
}

function j(array $data): string
{
    return json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

$existingAdmin = Database::table('admins')->where('username', '=', $adminUser)->first();
if (!$existingAdmin) {
    Database::table('admins')->insert([
        'username' => $adminUser,
        'password' => password_hash($adminPass, PASSWORD_BCRYPT),
    ]);
    echo "Admin user created: $adminUser\n";
} else {
    Database::table('admins')->where('id', '=', $existingAdmin['id'])->update([
        'password' => password_hash($adminPass, PASSWORD_BCRYPT),
    ]);
    echo "Admin password updated: $adminUser\n";
}

$profile = Database::table('profile')->where('id', '=', 1)->first();
if (!$profile) {
    Database::table('profile')->insert([
        'id' => 1,
        'name' => 'Hasanov',
        'title' => j([
            'uz' => "Full-Stack Dasturchi",
            'ru' => "Full-Stack Разработчик",
            'en' => "Full-Stack Developer",
        ]),
        'bio' => j([
            'uz' => "Men zamonaviy, tez va ishonchli veb-ilovalar yarataman. PHP, JavaScript va zamonaviy freymvorklar bilan ishlab, g'oyalarni ishlaydigan mahsulotga aylantiraman.",
            'ru' => "Я создаю современные, быстрые и надёжные веб-приложения. Работаю с PHP, JavaScript и современными фреймворками, превращая идеи в работающий продукт.",
            'en' => "I build modern, fast and reliable web applications. I work with PHP, JavaScript and modern frameworks to turn ideas into working products.",
        ]),
        'email' => 'admin@hasanov.uz',
        'phone' => '+998 90 000 00 00',
        'location' => 'Tashkent, Uzbekistan',
        'years_experience' => 3,
        'projects_done' => 12,
        'happy_clients' => 8,
        'social' => j([
            'github' => 'https://github.com/',
            'linkedin' => 'https://linkedin.com/',
            'telegram' => 'https://t.me/',
            'instagram' => 'https://instagram.com/',
        ]),
    ]);
    echo "Profile seeded.\n";
}

if (Database::table('skills')->count() === 0) {
    $skills = [
        ['name' => 'PHP', 'icon' => 'php', 'percent' => 92, 'sort_order' => 1],
        ['name' => 'JavaScript', 'icon' => 'javascript', 'percent' => 88, 'sort_order' => 2],
        ['name' => 'MySQL', 'icon' => 'mysql', 'percent' => 85, 'sort_order' => 3],
        ['name' => 'Tailwind CSS', 'icon' => 'tailwind', 'percent' => 90, 'sort_order' => 4],
        ['name' => 'Redis', 'icon' => 'redis', 'percent' => 75, 'sort_order' => 5],
        ['name' => 'Git', 'icon' => 'git', 'percent' => 88, 'sort_order' => 6],
    ];
    foreach ($skills as $skill) {
        Database::table('skills')->insert($skill);
    }
    echo "Skills seeded.\n";
}

if (Database::table('experiences')->count() === 0) {
    Database::table('experiences')->insert([
        'title' => j(['uz' => 'Full-Stack Dasturchi', 'ru' => 'Full-Stack Разработчик', 'en' => 'Full-Stack Developer']),
        'company' => 'Freelance',
        'location' => 'Tashkent, Uzbekistan',
        'start_date' => '2023-01',
        'end_date' => '',
        'description' => j([
            'uz' => 'Mijozlar uchun veb-saytlar va veb-ilovalar ishlab chiqish, backend va frontend arxitekturasini loyihalash.',
            'ru' => 'Разработка веб-сайтов и веб-приложений для клиентов, проектирование backend и frontend архитектуры.',
            'en' => 'Building websites and web applications for clients, designing backend and frontend architecture.',
        ]),
        'sort_order' => 1,
    ]);
    echo "Experience seeded.\n";
}

if (Database::table('educations')->count() === 0) {
    Database::table('educations')->insert([
        'title' => j(['uz' => 'Kompyuter fanlari', 'ru' => 'Компьютерные науки', 'en' => 'Computer Science']),
        'institution' => 'Tashkent University',
        'start_date' => '2019',
        'end_date' => '2023',
        'sort_order' => 1,
    ]);
    echo "Education seeded.\n";
}

if (Database::table('projects')->count() === 0) {
    Database::table('projects')->insert([
        'slug' => 'portfolio-website',
        'title' => j(['uz' => 'Portfolio sayt', 'ru' => 'Портфолио сайт', 'en' => 'Portfolio Website']),
        'summary' => j([
            'uz' => 'Zamonaviy, interaktiv va tez portfolio sayt.',
            'ru' => 'Современный, интерактивный и быстрый сайт-портфолио.',
            'en' => 'A modern, interactive and fast portfolio website.',
        ]),
        'description' => j([
            'uz' => 'PHP, MySQL, Redis va Tailwind CSS asosida qurilgan, ko\'p tilli, SEO uchun optimallashtirilgan shaxsiy portfolio sayt.',
            'ru' => 'Персональный сайт-портфолио на PHP, MySQL, Redis и Tailwind CSS, многоязычный и оптимизированный для SEO.',
            'en' => 'A personal portfolio site built with PHP, MySQL, Redis and Tailwind CSS, multilingual and SEO optimized.',
        ]),
        'cover_image' => '',
        'gallery' => j([]),
        'tags' => j(['PHP', 'MySQL', 'Redis', 'Tailwind CSS']),
        'demo_url' => 'https://hasanov.uz',
        'repo_url' => '',
        'is_featured' => 1,
        'sort_order' => 1,
    ]);
    echo "Sample project seeded.\n";
}

$settings = [
    'site_title' => j(['uz' => 'Hasanov.uz — Portfolio', 'ru' => 'Hasanov.uz — Портфолио', 'en' => 'Hasanov.uz — Portfolio']),
    'meta_description' => j([
        'uz' => 'Full-stack dasturchi Hasanov portfolio sayti. Loyihalar, tajriba va bog\'lanish uchun ma\'lumotlar.',
        'ru' => 'Портфолио full-stack разработчика Hasanov. Проекты, опыт и контактная информация.',
        'en' => 'Portfolio of full-stack developer Hasanov. Projects, experience and contact information.',
    ]),
    'og_image' => '',
    'google_analytics_id' => '',
    'google_site_verification' => '',
];

foreach ($settings as $key => $value) {
    $exists = Database::table('settings')->where('key', '=', $key)->first();
    if (!$exists) {
        Database::table('settings')->insert(['key' => $key, 'value' => $value]);
    }
}
echo "Settings seeded.\n";

echo "Seeding complete.\n";
