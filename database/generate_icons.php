<?php

function makeIcon(int $size): string
{
    $img = imagecreatetruecolor($size, $size);
    imagesavealpha($img, true);
    $transparent = imagecolorallocatealpha($img, 0, 0, 0, 127);
    imagefill($img, 0, 0, $transparent);

    $bgTop = imagecolorallocate($img, 34, 197, 94);
    $bgBottom = imagecolorallocate($img, 22, 163, 74);
    for ($y = 0; $y < $size; $y++) {
        $ratio = $y / max(1, $size - 1);
        $r = (int) (34 + (22 - 34) * $ratio);
        $g = (int) (197 + (163 - 197) * $ratio);
        $b = (int) (94 + (74 - 94) * $ratio);
        $color = imagecolorallocate($img, $r, $g, $b);
        imageline($img, 0, $y, $size, $y, $color);
    }

    $radius = (int) ($size * 0.22);
    imagefilledrectangle($img, 0, 0, $size, $size, IMG_COLOR_TRANSPARENT);
    $mask = imagecreatetruecolor($size, $size);
    imagesavealpha($mask, true);
    imagefill($mask, 0, 0, imagecolorallocatealpha($mask, 0, 0, 0, 127));
    $white = imagecolorallocate($mask, 255, 255, 255);
    imagefilledrectangle($mask, $radius, 0, $size - $radius, $size, $white);
    imagefilledrectangle($mask, 0, $radius, $size, $size - $radius, $white);
    imagefilledellipse($mask, $radius, $radius, $radius * 2, $radius * 2, $white);
    imagefilledellipse($mask, $size - $radius, $radius, $radius * 2, $radius * 2, $white);
    imagefilledellipse($mask, $radius, $size - $radius, $radius * 2, $radius * 2, $white);
    imagefilledellipse($mask, $size - $radius, $size - $radius, $radius * 2, $radius * 2, $white);

    $final = imagecreatetruecolor($size, $size);
    imagesavealpha($final, true);
    imagefill($final, 0, 0, imagecolorallocatealpha($final, 0, 0, 0, 127));
    for ($x = 0; $x < $size; $x++) {
        for ($y = 0; $y < $size; $y++) {
            $maskPixel = imagecolorat($mask, $x, $y);
            if (($maskPixel & 0xFFFFFF) !== 0) {
                $srcColor = imagecolorat($img, $x, $y);
                imagesetpixel($final, $x, $y, $srcColor);
            }
        }
    }

    $fontSize = (int) ($size * 0.5);
    $white2 = imagecolorallocate($final, 255, 255, 255);
    $text = 'H';
    $font = __DIR__.'/../public_assets/fonts/none.ttf';
    $bbox = imagettfbbox($fontSize, 0, $font, $text) ?: null;
    if (is_file($font) && $bbox) {
        $tx = ($size - ($bbox[2] - $bbox[0])) / 2 - $bbox[0];
        $ty = ($size - ($bbox[1] - $bbox[7])) / 2 - $bbox[7];
        imagettftext($final, $fontSize, 0, (int) $tx, (int) $ty, $white2, $font, $text);
    } else {
        imagestring($final, 5, (int) ($size / 2 - 4), (int) ($size / 2 - 7), 'H', $white2);
    }

    ob_start();
    imagepng($final);
    return ob_get_clean();
}

function makeIco(string $png32): string
{
    $count = 1;
    $header = pack('vvv', 0, 1, $count);
    $size = strlen($png32);
    $entry = pack('CCCCvvVV', 32, 32, 0, 0, 1, 32, $size, 6 + 16);
    return $header.$entry.$png32;
}

$root = dirname(__DIR__);

file_put_contents($root.'/favicon-32.png', makeIcon(32));
file_put_contents($root.'/favicon-192.png', makeIcon(192));
file_put_contents($root.'/favicon-512.png', makeIcon(512));
file_put_contents($root.'/favicon.ico', makeIco(file_get_contents($root.'/favicon-32.png')));

echo "Icons generated.\n";
