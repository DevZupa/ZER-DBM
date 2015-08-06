<?php namespace App\Http\Controllers;

use App\Server;
use Illuminate\Http\Request;
use Redis;

class ServerController extends Controller
{
    public function getAllServers (Request $request)
    {
        return response()->json(Server::all());
    }

    public function addServer (Request $request) {

        $server = new Server;

        $server->name = $request->name;
        $server->ip = $request->ip;
        $server->port = $request->port;
        $server->redisip = $request->redisip;
        $server->redisport = $request->redisport;
        $server->redispassword = $request->redispassword;
        $server->map = $request->map;
        $server->redisinstace = $request->redisinstace;
        $server->redisdb = $request->redisdb;

        $server->save();
    }

    public function editServer (Request $request) {

        $serverid = $request->id;

        $server = Server::where('id',$serverid)->first();

        $server->name = $request->name;
        $server->ip = $request->ip;
        $server->port = $request->port;
        $server->redisip = $request->redisip;
        $server->redisport = $request->redisport;
        $server->redispassword = $request->redispassword;
        $server->map = $request->map;
        $server->redisinstace = $request->redisinstace;
        $server->redisdb = $request->redisdb;

        $server->save();
    }
}