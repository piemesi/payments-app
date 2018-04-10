<?php
/**
 * Created by PhpStorm.
 * User: malgrat
 * Date: 07.04.18
 * Time: 21:20
 */

namespace App\Service\ApiMethod;

use App\Service\Stat\Models\Stat;
use App\Service\Stat\StatService;
use App\Service\Account\Models\UserModel;

class StatApiMethod extends ApiMethodService
{
    const CONST_METHOD_NAME = 'stats';
    const METHOD_OBLIGATORY_FIELDS = [];

    static public function getApiMethodName(): string
    {
        return static::CONST_METHOD_NAME;
    }

    protected function setService()
    {
        $this->service = new StatService();
    }

    public function process(array $requestData)
    {
        $this->serviceResponse = $this->service->report($requestData);
    }

    public function getAccountByUser(UserModel $userModel)
    {
        return $this->service->getAccountByUser($userModel);
    }

    public function prepareCSV(Stat $stat)
    {
        $this->service->prepareCSV($stat);
    }
}