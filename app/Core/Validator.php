<?php

namespace App\Core;

final class Validator
{
    private array $errors = [];

    public static function make(array $data, array $rules): self
    {
        $validator = new self();
        foreach ($rules as $field => $ruleString) {
            $value = $data[$field] ?? null;
            foreach (explode('|', $ruleString) as $rule) {
                [$name, $param] = array_pad(explode(':', $rule, 2), 2, null);
                $validator->applyRule($field, $value, $name, $param);
            }
        }
        return $validator;
    }

    private function applyRule(string $field, mixed $value, string $name, ?string $param): void
    {
        switch ($name) {
            case 'required':
                if ($value === null || $value === '') {
                    $this->errors[$field][] = "$field is required";
                }
                break;
            case 'email':
                if ($value && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $this->errors[$field][] = "$field must be a valid email";
                }
                break;
            case 'max':
                if ($value !== null && $value !== '' && mb_strlen((string) $value) > (int) $param) {
                    $this->errors[$field][] = "$field must not exceed $param characters";
                }
                break;
            case 'min':
                if ($value !== null && $value !== '' && mb_strlen((string) $value) < (int) $param) {
                    $this->errors[$field][] = "$field must be at least $param characters";
                }
                break;
            case 'numeric':
                if ($value !== null && $value !== '' && !is_numeric($value)) {
                    $this->errors[$field][] = "$field must be numeric";
                }
                break;
            case 'url':
                if ($value !== null && $value !== '' && !filter_var($value, FILTER_VALIDATE_URL)) {
                    $this->errors[$field][] = "$field must be a valid URL";
                }
                break;
        }
    }

    public function fails(): bool
    {
        return !empty($this->errors);
    }

    public function errors(): array
    {
        return $this->errors;
    }

    public function firstError(): ?string
    {
        foreach ($this->errors as $fieldErrors) {
            return $fieldErrors[0] ?? null;
        }
        return null;
    }
}
