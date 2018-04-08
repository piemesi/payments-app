<?php

namespace App\Http\Controllers;

use App\Service\ApiMethod\Currency;
use App\Service\ApiMethod\CurrencyRateApiMethod;
use App\Service\ApiMethod\TransactionApiMethod;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    public function currencyRate(CurrencyRateApiMethod $currency, Request $request)
    {
        if ($currency->validateRequest($request)) {
            $currency->processRequest();
        }

        return response()->json([
            'status' => $currency->getStatus(),
            'case' => $currency->getCase(),
            'message' => $currency->getMessage()
        ]);
    }

    public function transaction(TransactionApiMethod $transactionApiMethod, Request $request)
    {
        print_r('>>>>>>..');
        if ($transactionApiMethod->validateRequest($request)) {
            $transactionApiMethod->processRequest();
        }

        return response()->json([
            'status' => $transactionApiMethod->getStatus(),
            'case' => $transactionApiMethod->getCase(),
            'message' => $transactionApiMethod->getMessage()
        ]);
    }
}
