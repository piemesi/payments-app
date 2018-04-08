<?php
/**
 * Created by PhpStorm.
 * User: malgrat
 * Date: 08.04.18
 * Time: 12:06
 */

namespace App\Jobs;


class JobErrors extends \Exception
{
    const ERROR_CODE = 1001;
    const ERROR_MESSAGE = 'Processing Job error';

    public function __construct(string $message = "", $code = 0, \Throwable $previous = null)
    {
        parent::__construct($message ?? self::ERROR_MESSAGE, $code ?? self::ERROR_CODE, $previous);
    }
}