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

Route::group(['prefix' => 'api'], function()
{
    Route::post('authenticate', 'AuthenticateController@authenticate');
    Route::post('slots/sign-up', 'SlotsController@signUp');
    Route::post('sign-up', 'AuthenticateController@signUp');
    Route::patch('profile', 'UsersController@edit');
    Route::get('schedule', 'SlotsController@getSchedule');
    Route::get('stands', 'StandsController@index');
    Route::get('slots/my', 'SlotsController@mySlots');
    Route::get('profile', 'UsersController@myProfile');
    Route::get('queue', 'SlotsController@getQueue');
    Route::get('queue/my', 'SlotsController@getQueueForStand');
    Route::patch('reservations/{reservation}/close', 'SlotsController@closeReservation');
    Route::delete('slots/{slot}', 'SlotsController@removeSlot');
});

Route::get('{any}', function() {
    return view('index');
})->where('any', '.*');