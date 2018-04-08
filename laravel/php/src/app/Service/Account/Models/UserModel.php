<?php
/**
 * Created by PhpStorm.
 * User: malgrat
 * Date: 08.04.18
 * Time: 0:14
 */

namespace App\Service\Account\Models;


use App\User;

class UserModel extends User
{

    protected $table = 'users';

    protected $fillable = [
        'name', 'email', 'password', 'city_id',
    ];


}