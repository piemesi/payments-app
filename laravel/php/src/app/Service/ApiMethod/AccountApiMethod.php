<?php
/**
 * Created by PhpStorm.
 * User: malgrat
 * Date: 07.04.18
 * Time: 21:20
 */

namespace App\Service\ApiMethod;

use App\Service\Account\AccountService;
use App\Service\Account\Models\Wallet;

class AccountApiMethod extends ApiMethodService
{
    const CONST_METHOD_NAME = 'create-account';
    const METHOD_OBLIGATORY_FIELDS = [
        'name', 'country_code', 'city_id', 'currency_code', 'email', 'password'
    ];

    static public function getApiMethodName(): string
    {
        return static::CONST_METHOD_NAME;
    }

    protected function setService()
    {
        $this->service = new AccountService();
    }

    public function process(array $requestData)
    {
        $this->service->createAccount($requestData);
    }
}