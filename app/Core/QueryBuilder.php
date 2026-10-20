<?php

namespace App\Core;

use PDO;

final class QueryBuilder
{
    private array $wheres = [];
    private array $bindings = [];
    private ?string $orderBy = null;
    private ?int $limitN = null;
    private int $offsetN = 0;
    private int $whereCounter = 0;

    public function __construct(private PDO $pdo, private string $table)
    {
    }

    private function quoteColumn(string $column): string
    {
        return '`'.str_replace('`', '', $column).'`';
    }

    public function where(string $column, string $operator, mixed $value): self
    {
        $placeholder = ':w'.$this->whereCounter++;
        $this->wheres[] = $this->quoteColumn($column)." $operator $placeholder";
        $this->bindings[$placeholder] = $value;
        return $this;
    }

    public function whereIn(string $column, array $values): self
    {
        if (empty($values)) {
            $this->wheres[] = '1 = 0';
            return $this;
        }
        $placeholders = [];
        foreach ($values as $value) {
            $ph = ':w'.$this->whereCounter++;
            $placeholders[] = $ph;
            $this->bindings[$ph] = $value;
        }
        $this->wheres[] = $this->quoteColumn($column).' IN ('.implode(',', $placeholders).')';
        return $this;
    }

    public function orderBy(string $column, string $direction = 'ASC'): self
    {
        $this->orderBy = $this->quoteColumn($column).' '.(strtoupper($direction) === 'DESC' ? 'DESC' : 'ASC');
        return $this;
    }

    public function limit(int $limit, int $offset = 0): self
    {
        $this->limitN = $limit;
        $this->offsetN = $offset;
        return $this;
    }

    private function whereSql(): string
    {
        return $this->wheres ? ' WHERE '.implode(' AND ', $this->wheres) : '';
    }

    public function get(string $columns = '*'): array
    {
        $sql = "SELECT $columns FROM {$this->table}".$this->whereSql();
        if ($this->orderBy) {
            $sql .= " ORDER BY {$this->orderBy}";
        }
        if ($this->limitN !== null) {
            $sql .= " LIMIT {$this->limitN} OFFSET {$this->offsetN}";
        }
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($this->bindings);
        return $stmt->fetchAll();
    }

    public function first(): ?array
    {
        $this->limit(1, $this->offsetN);
        $rows = $this->get();
        return $rows[0] ?? null;
    }

    public function count(): int
    {
        $sql = "SELECT COUNT(*) AS c FROM {$this->table}".$this->whereSql();
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($this->bindings);
        return (int) ($stmt->fetch()['c'] ?? 0);
    }

    public function insert(array $data): int
    {
        $columns = array_keys($data);
        $quoted = array_map(fn ($c) => $this->quoteColumn($c), $columns);
        $placeholders = array_map(fn ($c) => ":i_$c", $columns);
        $sql = "INSERT INTO {$this->table} (".implode(',', $quoted).') VALUES ('.implode(',', $placeholders).')';
        $bind = [];
        foreach ($data as $key => $value) {
            $bind[":i_$key"] = $value;
        }
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($bind);
        return (int) $this->pdo->lastInsertId();
    }

    public function update(array $data): int
    {
        $sets = [];
        $bind = $this->bindings;
        foreach ($data as $key => $value) {
            $ph = ":u_$key";
            $sets[] = $this->quoteColumn($key)." = $ph";
            $bind[$ph] = $value;
        }
        $sql = "UPDATE {$this->table} SET ".implode(',', $sets).$this->whereSql();
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($bind);
        return $stmt->rowCount();
    }

    public function delete(): int
    {
        $sql = "DELETE FROM {$this->table}".$this->whereSql();
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($this->bindings);
        return $stmt->rowCount();
    }
}
