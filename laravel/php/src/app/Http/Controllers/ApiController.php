<?php

namespace App\Http\Controllers;

use App\Service\Account\Models\City;
use App\Service\Account\Models\Country;
use App\Service\ApiMethod\CurrencyRateApiMethod;
use App\Service\ApiMethod\TransactionApiMethod;
use App\Service\Convertor\ConvertorService;
use App\Service\Currency\Models\Currency;
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
            'response' => $currency->getMessage()
        ]);
    }

    public function transaction(TransactionApiMethod $transactionApiMethod, Request $request)
    {
        if ($transactionApiMethod->validateRequest($request)) {
            $transactionApiMethod->processRequest();
        }

        return response()->json([
            'status' => $transactionApiMethod->getStatus(),
            'case' => $transactionApiMethod->getCase(),
            'response' => $transactionApiMethod->getMessage()
        ]);
    }

    public function countries()
    {
        $countries = Country::all()->toArray();

        return response()->json([
            'status' => 'success',
            'response' => array_column($countries, 'name', 'code')
        ]);

    }

    public function cities()
    {
        $cities = City::all()->toArray();
        
        return response()->json([
            'status' => 'success',
            'response' => $cities
        ]);
    }

    public function currencies()
    {
        $currencies = Currency::all()->toArray();

        return response()->json([
            'status' => 'success',
            'response' => array_column($currencies, 'code', 'id')
        ]);
    }

    public function getCurrencyRates()
    {
        $convertor = new ConvertorService();

        return response()->json([
            'status' => 'success',
            'response' => $convertor->getLastRates()
        ]);
    }
}
