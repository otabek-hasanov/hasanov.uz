<?php

namespace App\Http\Controllers\Api;

use App\Core\Request;
use App\Core\Response;
use App\Core\Translator;
use App\Services\ContactService;

final class ContactApiController
{
    public function store(Request $request): Response
    {
        $locale = (string) $request->input('locale', config('locales.default'));
        Translator::setLocale(in_array($locale, config('locales.supported'), true) ? $locale : config('locales.default'));

        $data = $request->only(['name', 'email', 'subject', 'message']);
        $validator = ContactService::validate($data);

        if ($validator->fails()) {
            return Response::json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        if (ContactService::isRateLimited($request->ip())) {
            return Response::json(['success' => false, 'message' => t('contact.rate_limited')], 429);
        }

        ContactService::store($data, $request->ip());

        return Response::json(['success' => true, 'message' => t('contact.success')]);
    }
}
