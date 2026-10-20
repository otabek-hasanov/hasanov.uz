<?php

function l(array $field, ?string $locale = null): string
{
    $locale = $locale ?? current_locale();
    if (isset($field[$locale]) && $field[$locale] !== '') {
        return $field[$locale];
    }
    $default = config('locales.default');
    if (isset($field[$default]) && $field[$default] !== '') {
        return $field[$default];
    }
    foreach ($field as $value) {
        if ($value !== '') {
            return $value;
        }
    }
    return '';
}
