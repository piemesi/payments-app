<?php
/**
 * Created by PhpStorm.
 * User: malgrat
 * Date: 07.04.18
 * Time: 21:20
 */

namespace App\Service\ApiMethod;

use App\Service\Transaction\Models\Transaction;
use App\Service\Transaction\TransactionService;
use App\Service\Validator\ValidatorService;

class TransactionApiMethod extends ApiMethodService
{
    const CONST_METHOD_NAME = 'create-transaction';
    const METHOD_OBLIGATORY_FIELDS = [
        'wallet_to', 'amount_from'
    ];

    static public function getApiMethodName(): string
    {
        return static::CONST_METHOD_NAME;
    }

    protected function setService()
    {
        $this->service = new TransactionService();
    }

    public function process(array $requestData)
    {
        $this->service->createTransaction($requestData);
    }

    public function confirmTransaction(Transaction $transaction)
    {
        $this->service->confirmTransaction($transaction);
    }
}