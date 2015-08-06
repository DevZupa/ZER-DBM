<?php

Route::get('/', function () {
    return view('welcome');
});


Route::post('vehicle/all', 'VehicleController@getAllVehicles');
Route::post('vehicle', 'VehicleController@getVehicleById');


Route::post('auth/login', 'AuthenticateController@authenticate');
Route::post('auth/register', 'AuthenticateController@register');
Route::get('auth/createadmin', 'AuthenticateController@createAdmin');


Route::post('server/all', 'ServerController@getAllServers');
Route::post('server/new', 'ServerController@addServer');
Route::post('server/edit', 'ServerController@newServer');




//Route::post('/logout',['middleware' => 'token', 'AuthenticateController@logout']);