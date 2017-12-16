<?php

namespace App\Http;


class Response
{
    const STATUS_SUCCESS = 1;
    const STATUS_ERROR = 2;

    public static function success($data = [], $message = '', $code = 200)
    {
        return response(self::buildResponse($data, self::STATUS_SUCCESS, $message), $code);
    }

    public static function error($data = [], $message = '', $code = 400)
    {
        return response(self::buildResponse($data, self::STATUS_ERROR, $message), $code);
    }

    public static function notFound($message)
    {
        return response(self::buildResponse([], self::STATUS_ERROR, $message), \Illuminate\Http\Response::HTTP_NOT_FOUND);
    }

    private static function buildResponse($data, $status, $message)
    {
        return [
            'success' => $status === self::STATUS_SUCCESS,
            'data' => $data,
            'message' => $message
        ];
    }
}