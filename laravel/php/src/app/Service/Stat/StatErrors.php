<?php
/**
 * Created by PhpStorm.
 * User: malgrat
 * Date: 08.04.18
 * Time: 12:23
 */

namespace App\Service\Account;


class AccountErrors extends \Exception
{
    const ERROR_CODE = 1011;
    const ERROR_MESSAGE = 'Account error';

    public function __construct(string $message = "", $code = 0, \Throwable $previous = null)
    {
        parent::__construct($message ?? self::ERROR_MESSAGE, self::ERROR_CODE, $previous);
    }
}