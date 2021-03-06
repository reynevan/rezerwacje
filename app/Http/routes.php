<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('index');
});

Route::get('instalacja', 'InstallationController@createAdmin');
Route::post('instalacja', 'InstallationController@saveAdmin');

Route::group(['prefix' => 'api'], function () {

    Route::post('authenticate', 'AuthenticateController@authenticate');
    Route::post('/users/verify', 'AuthenticateController@verify');
    Route::post('slots/sign-up', 'SlotsController@signUp');
    Route::post('sign-up', 'AuthenticateController@signUp');
    Route::post('forgot-password', 'AuthenticateController@recoverPassword');
    Route::post('reset-password', 'AuthenticateController@resetPassword');
    Route::patch('profile', 'UsersController@edit');
    Route::get('schedule', 'SlotsController@getSchedule');
    Route::get('positions', 'PositionsController@index');
    Route::get('slots/my', 'SlotsController@mySlots');
    Route::get('profile', 'UsersController@myProfile');
    Route::get('queue', 'SlotsController@getQueue');
    Route::patch('reservations/{reservation}/close', 'SlotsController@closeReservation');
    Route::delete('slots/{slot}', 'SlotsController@removeSlot');

    Route::group(['prefix' => 'admin'], function () {
        Route::post('settings', 'AdminController@saveSettings');
        Route::post('employees', 'AdminController@addEmployee');
        Route::patch('employees/{user}', 'AdminController@editEmployee');
        Route::get('employees', 'AdminController@viewEmployees');
        Route::delete('employees/{user}', 'AdminController@removeEmployee');

        Route::get('positions', 'AdminController@viewPositions');
        Route::post('positions', 'AdminController@createPosition');
        Route::delete('positions/{position}', 'AdminController@removePosition');
        Route::patch('positions/{position}', 'AdminController@editPosition');

        Route::get('settings', 'AdminController@viewSettings');

        Route::get('users', 'AdminController@viewUsers');
        Route::delete('users/{user}', 'AdminController@removeUser');
    });

    Route::group(['prefix' => 'employee'], function () {
        Route::get('positions/my', 'EmployeesController@myPositions');
        Route::get('queue/my', 'EmployeesController@getQueueForPosition');
    });
});

Route::get('{any}', function () {
    return view('index');
})->where('any', '.*');