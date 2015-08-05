<?php

Route::get('/', function () {
    return view('welcome');
});

Route::post('register', 'AuthenticateController@register');

Route::get('register', 'AuthenticateController@register');

Route::get('createadmin', 'AuthenticateController@createAdmin');

Route::get('vehicles', 'VehicleController@getAllVehicles');
Route::get('vehicle', 'VehicleController@getVehicleById');

Route::post('login', 'AuthenticateController@authenticate');



//Route::post('/logout',['middleware' => 'token', 'AuthenticateController@logout']);