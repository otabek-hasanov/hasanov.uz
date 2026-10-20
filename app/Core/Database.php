<?php

namespace App\Core;

use PDO;

final class Database
{
    private static ?PDO $pdo = null;

    public static function connection(): PDO
    {
        if (self::$pdo === null) {
            $host = Config::get('database.host');
            $port = Config::get('database.port');
            $db = Config::get('database.database');
            $charset = Config::get('database.charset', 'utf8mb4');
            $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
            self::$pdo = new PDO($dsn, Config::get('database.username'), Config::get('database.password'), [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        }
        return self::$pdo;
    }

    public static function table(string $table): QueryBuilder
    {
        return new QueryBuilder(self::connection(), $table);
    }

    public static function statement(string $sql, array $bindings = []): \PDOStatement
    {
        $stmt = self::connection()->prepare($sql);
        $stmt->execute($bindings);
        return $stmt;
    }

    public static function lastInsertId(): string
    {
        return self::connection()->lastInsertId();
    }
}
