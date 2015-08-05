<?php namespace App\Http\Controllers;

use App\Server;

class VehicleController extends Controller
{
    public function getAllVehicles (Request $request)
    {

        $request = \Symfony\Component\HttpFoundation\Request::createFromGlobals();

        $data = json_decode($request->getContent(), true);

        $serverid = $data->server;

        $server = Server::where('serverid', '=', $serverid)->firstOrFail();

        $app['config']['database.redis.default.host'] = $server->redisip;
        $app['config']['database.redis.default.port'] = $server->redisport;
        $app['config']['database.redis.default.database'] = $server->database;
        $app['config']['database.redis.default.password'] = $server->password;


        $redis = Redis::connection();

        $vehicleData = '[';

        $vehicles = $redis->keys('Vehicle:'. $server->redisinstance . ':*');

        foreach($vehicles as $op) {

            $vehicleD = $redis->get($op);

            if($vehicleD != '[]'){

                if($vehicleData == '['){
                    $vehicleData = $vehicleData . '["'.$op.'",'.$vehicleD .']';
                }else{
                    $vehicleData = $vehicleData . ',["'.$op.'",'.$vehicleD .']';
                }
            }
        }

        $vehicleData = $vehicleData . ']';


        echo str_replace("<null>", "[]", $vehicleData);


    }

}