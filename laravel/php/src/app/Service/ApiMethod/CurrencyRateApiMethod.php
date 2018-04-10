<?php
/**
 * Created by PhpStorm.
 * User: malgrat
 * Date: 07.04.18
 * Time: 21:20
 */

namespace App\Service\ApiMethod;

use App\Service\Currency\CurrencyService;

class CurrencyRateApiMethod extends ApiMethodService
{
    const CONST_METHOD_NAME = 'currency-rate';
    const METHOD_OBLIGATORY_FIELDS = ['currency_from', 'rate'];
    const METHOD_DEFAULT_VALUES = [
        'currency_to' => 'USD',
        'exponent' => 4
    ];

    static public function getApiMethodName(): string
    {
        return static::CONST_METHOD_NAME;
    }

    protected function setService()
    {
        $this->service = new CurrencyService();
    }

    public function process(array $requestData)
    {
        $this->service->updateCurrencyRate($requestData);
    }
}