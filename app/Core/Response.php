<?php

namespace App\Core;

final class Response
{
    private int $status = 200;
    private array $headers = [];
    private string $content = '';
    private bool $isFile = false;
    private string $filePath = '';

    public static function make(string $content = '', int $status = 200): self
    {
        $response = new self();
        $response->content = $content;
        $response->status = $status;
        $response->headers['Content-Type'] = 'text/html; charset=utf-8';
        return $response;
    }

    public static function json(array $data, int $status = 200): self
    {
        $response = new self();
        $response->status = $status;
        $response->headers['Content-Type'] = 'application/json; charset=utf-8';
        $response->content = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return $response;
    }

    public static function redirect(string $to, int $status = 302): self
    {
        $response = new self();
        $response->status = $status;
        $response->headers['Location'] = $to;
        return $response;
    }

    public static function xml(string $content, int $status = 200): self
    {
        $response = new self();
        $response->status = $status;
        $response->headers['Content-Type'] = 'application/xml; charset=utf-8';
        $response->content = $content;
        return $response;
    }

    public static function text(string $content, int $status = 200): self
    {
        $response = new self();
        $response->status = $status;
        $response->headers['Content-Type'] = 'text/plain; charset=utf-8';
        $response->content = $content;
        return $response;
    }

    public static function download(string $absolutePath, string $filename): self
    {
        $response = new self();
        $response->isFile = true;
        $response->filePath = $absolutePath;
        $response->headers['Content-Type'] = 'application/octet-stream';
        $response->headers['Content-Disposition'] = 'attachment; filename="'.$filename.'"';
        $response->headers['Content-Length'] = (string) filesize($absolutePath);
        return $response;
    }

    public function header(string $key, string $value): self
    {
        $this->headers[$key] = $value;
        return $this;
    }

    public function status(int $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function send(): void
    {
        http_response_code($this->status);
        foreach ($this->headers as $key => $value) {
            header("$key: $value");
        }
        if ($this->isFile) {
            readfile($this->filePath);
            return;
        }
        echo $this->content;
    }
}
