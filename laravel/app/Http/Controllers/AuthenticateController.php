<?php

namespace App\Http\Controllers;

use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\User;
use \Illuminate\Http\Request;
use \Illuminate\Http\Response;

class AuthenticateController extends Controller
{
    public function authenticate(Request $request)
    {
        // grab credentials from the request
        $credentials = $request->only('name', 'password');

        try {
            // attempt to verify the credentials and create a token for the user
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            // something went wrong whilst attempting to encode the token
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        // all good so return the token
        return response()->json(compact('token'));
    }

    public function register(Request $request) {
        // grab credentials from the request
        $credentials = $request->only('email', 'password','name');
        try {
            $user = User::create($credentials);
        } catch (\Exception $e) {
            return response()->json(['error' => 'User already exists.'], Response::HTTP_CONFLICT);
        }

        return response()->json(array('success'=>'true', 'message' => 'User created'));
    }


    public function createAdmin(Request $request) {
        $admin = new User;

        $admin->name = 'admin';
        $admin->password = 'zupa';
        $admin->email = 'admin@mail.com';

        $admin->save();

        return response()->json(array('success'=>'true', 'message' => 'Admin created'));
    }

    public function logout(Request $request) {
        // grab credentials from the request
        $credentials = $request->only('email', 'password');

        try {
            $token = JWTAuth::attempt($credentials);
        } catch (JWTException $e) {

        }
    }
}