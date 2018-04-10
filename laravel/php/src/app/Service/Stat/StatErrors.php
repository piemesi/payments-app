<?php

namespace App\Service\Stat;


class StatErrors extends \Exception
{
    const ERROR_CODE = 1211;
    const ERROR_MESSAGE = 'Stat error';

    public function __construct(string $message = "", $code = 0, \Throwable $previous = null)
    {
        parent::__construct($message ?? self::ERROR_MESSAGE, $code ??self::ERROR_CODE, $previous);
    }
}