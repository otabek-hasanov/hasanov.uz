<?php

require __DIR__.'/cli_bootstrap.php';

use App\Core\Database;

$files = glob(__DIR__.'/migrations/*.sql');
sort($files);

foreach ($files as $file) {
    $sql = file_get_contents($file);
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    foreach ($statements as $statement) {
        Database::connection()->exec($statement);
    }
    echo 'Applied: '.basename($file).PHP_EOL;
}

echo "Migration complete.\n";
