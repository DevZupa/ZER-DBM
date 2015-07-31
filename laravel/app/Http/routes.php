<?php

Route::get('/', function () {
    return view('welcome');
});

Route::post('register', 'AuthenticateController@register');

Route::get('register', 'AuthenticateController@register');


Route::post('login', 'AuthenticateController@authenticate');
//Route::post('/logout',['middleware' => 'token', 'AuthenticateController@logout']);