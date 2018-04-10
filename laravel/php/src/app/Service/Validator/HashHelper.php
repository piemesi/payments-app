<?php
/**
 * Created by PhpStorm.
 * User: malgrat
 * Date: 09.04.18
 * Time: 22:27
 */

namespace App\Service\Validator;


use Carbon\Carbon;

class HashHelper
{
    static public function generateHash($requestData)
    {
        return md5(json_encode($requestData) . Carbon::now()->toDayDateTimeString());
    }
}