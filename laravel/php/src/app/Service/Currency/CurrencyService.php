<?php

namespace App\Service\Currency;


/**
 * Created by PhpStorm.
 * User: malgrat
 * Date: 07.04.18
 * Time: 20:58
 */
class CurrencyService
{
    public function updateCurrencyRate(array $requestData)
    {
        $currencyRate = new Models\CurrencyRate();
        $currencyRate->fill($requestData);
        $currencyRate->save();
    }

}