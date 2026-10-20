<?php

require __DIR__.'/cli_bootstrap.php';

use App\Core\Database;
use App\Services\PortfolioService;

function j(array $data): string
{
    return json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

$bio = j([
    'uz' => "Men zamonaviy, tez va ishonchli veb-ilovalar yarataman. PHP, Node.js va zamonaviy freymvorklar bilan ishlab, g'oyalarni ishlaydigan mahsulotga aylantiraman.",
    'ru' => 'Я создаю современные, быстрые и надёжные веб-приложения. Работаю с PHP, Node.js и современными фреймворками, превращая идеи в работающий продукт.',
    'en' => 'I build modern, fast and reliable web applications. I work with PHP, Node.js and modern frameworks to turn ideas into working products.',
]);

Database::table('profile')->where('id', '=', 1)->update(['bio' => $bio]);
PortfolioService::flushCache();
echo "Bio updated.\n";
