<?php

require __DIR__.'/cli_bootstrap.php';

use App\Core\Database;
use App\Services\PortfolioService;

function j(array $data): string
{
    return json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

$data = [
    'title' => j([
        'uz' => 'Full-Stack dasturlash',
        'ru' => 'Full-Stack разработка',
        'en' => 'Full-Stack Development',
    ]),
    'institution' => "Najot Ta'lim",
    'logo' => 'public_assets/images/institutions/najot-talim.svg',
    'start_date' => '2026',
    'end_date' => '2027',
    'sort_order' => 1,
];

$existing = Database::table('educations')->where('institution', '=', "Najot Ta'lim")->first();
if ($existing) {
    Database::table('educations')->where('id', '=', $existing['id'])->update($data);
    echo "Updated education: Najot Ta'lim\n";
} else {
    Database::table('educations')->insert($data);
    echo "Inserted education: Najot Ta'lim\n";
}

// Keep the earlier generic placeholder from first bottom from showing alongside the real one.
Database::table('educations')->where('institution', '=', 'Tashkent University')->delete();

PortfolioService::flushCache();
echo "Done.\n";
