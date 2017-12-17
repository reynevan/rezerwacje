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

    public static function error($message = '', $code = 400)
    {
        return response(self::buildResponse([], self::STATUS_ERROR, $message), $code);
    }

    public static function validationError($errors)
    {
        return response(self::buildResponse([], self::STATUS_ERROR, '', $errors), \Illuminate\Http\Response::HTTP_FORBIDDEN);
    }

    public static function notFound($message)
    {
        return response(self::buildResponse([], self::STATUS_ERROR, $message), \Illuminate\Http\Response::HTTP_NOT_FOUND);
    }

    public static function authError($message)
    {
        return response(self::buildResponse([], self::STATUS_ERROR, $message), \Illuminate\Http\Response::HTTP_UNAUTHORIZED);
    }

    public static function generalError()
    {
        return response(self::buildResponse([], self::STATUS_ERROR, trans('messages.general_error')), \Illuminate\Http\Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    private static function buildResponse($data, $status, $message, $errors = [])
    {
        return [
            'success' => $status === self::STATUS_SUCCESS,
            'data' => $data,
            'message' => $message,
            'errors' => $errors
        ];
    }
}