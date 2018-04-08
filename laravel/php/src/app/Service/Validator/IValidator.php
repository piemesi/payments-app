<?php
/**
 * Created by PhpStorm.
 * User: malgrat
 * Date: 07.04.18
 * Time: 21:08
 */

namespace App\Service\Validator;


use Illuminate\Http\Request;

interface IValidator
{
    public function check(string $apiMethod, Request $request);
}