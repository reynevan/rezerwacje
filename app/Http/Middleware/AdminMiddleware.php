<?php

namespace App\Http\Middleware;

use App\User;
use Closure;
use JWTAuth;

class AdminMiddleware
{
    /**
     * Run the request filter.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = JWTAuth::parseToken()->authenticate();
        if (!$user || $user->role !== User::ROLE_ADMIN) {
            return [
                'error' => trans('auth_error')
            ];
        }

        return $next($request);
    }

}