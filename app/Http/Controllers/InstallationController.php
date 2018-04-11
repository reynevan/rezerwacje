<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

use Validator;
use Hash;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class InstallationController extends Controller
{
    public function createAdmin()
    {
        return view('installation.create_admin');
    }

    public function saveAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'email|required|unique:users',
            'password' => 'required',
            'password_repeat' => 'required'
        ]);

        if ($request->get('password') !== $request->get('password_repeat')) {
            $validator->after(function($validator) {
                $validator->errors()->add('password', trans('messages.different_passwords'));
            });
        }

        if ($validator->fails()) {
            return redirect('instalacja')
                ->withErrors($validator)
                ->withInput();
        }

        $data = $request->only(['first_name', 'last_name', 'email', 'password']);
        $data['role'] = User::ROLE_ADMIN;
        $data['password'] = Hash::make($data['password']);
        $admin = User::create($data);
        $admin->active = true;
        $admin->save();
        echo 'heh';
    }
}
