<?php
/**
 * Created by PhpStorm.
 * User: malgrat
 * Date: 07.04.18
 * Time: 21:37
 */

namespace App\Service\Validator;


class ValidatorErrors extends \Exception
{
    const ERROR_CODE = 601;
    const ERROR_MESSAGE = 'request handling error';

    public function __construct(string $message = "", $code = 0, \Throwable $previous = null)
    {
        parent::__construct($message ?? self::ERROR_MESSAGE, $code ??  self::ERROR_CODE, $previous);
    }
}