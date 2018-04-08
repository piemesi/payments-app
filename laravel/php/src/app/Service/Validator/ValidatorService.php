<?php

namespace App\Service\Validator;

use App\Service\Account\Models\City;
use App\Service\Account\Models\Country;
use App\Service\ApiMethod\AccountApiMethod;
use App\Service\ApiMethod\CurrencyRateApiMethod;
use App\Service\ApiMethod\TransactionApiMethod;
use App\Service\Currency\Models\Currency;
use App\Service\Transaction\Models\Transaction;
use App\Service\Transaction\TransactionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Created by PhpStorm.
 * User: malgrat
 * Date: 07.04.18
 * Time: 21:00
 */
class ValidatorService implements IValidator
{

//    const CONST_API_METHODS = ''
    const ERRORS_TEXTS_SKIPPED_FIELDS = "No all the fields are presented";
    const ERRORS_TEXTS_CURRENCIES_DIFFERENCE = "currencies should differ";

    const ERRORS_TEXTS_RATE_SHOULD_BE_POSITIVE = "rate shoild be positive";

    const ERRORS_TEXTS_NO_CURRENCY = "there is no such currency code in currencies list";
    const ERRORS_TEXTS_NO_COUNTRY = "there is no such country code in countries list";

    const ERRORS_TEXTS_NO_TYPE_DETERMINED = "Could not determine a type of transaction\n
    for type=DEPOSIT stipulate [%s] field\n
    for type=TRANSACTION between wallets stipulate [%s] field\n";

    private function setDefaultValues(array $defaultValues, array $requestData)
    {
        if (!$defaultValues) return $requestData;

        foreach ($defaultValues as $defaultKey => $defaultValue) {
            $requestData[$defaultKey] = $requestData[$defaultKey] ?? $defaultValue;
        }

        return $requestData;
    }

    private function checkObligatoryFields(array $obligatoryFields = [], array $requestKeys = [])
    {
        $obligatoryFieldsSkip = array_diff($obligatoryFields, $requestKeys);

        if (count($obligatoryFieldsSkip)) {
            $skippedFields = "[" . json_encode($obligatoryFieldsSkip) . "]";
            Log::error(self::ERRORS_TEXTS_SKIPPED_FIELDS, [$obligatoryFieldsSkip]);
            throw new ValidatorErrors(self::ERRORS_TEXTS_SKIPPED_FIELDS . $skippedFields, 602);
        }
    }

    public function check(string $apiMethod, Request $request): array
    {
        $requestData = $request->all();
        switch ($apiMethod) {
            case CurrencyRateApiMethod::getApiMethodName():

                $this->checkObligatoryFields(
                    CurrencyRateApiMethod::METHOD_OBLIGATORY_FIELDS,
                    $request->keys()
                );

                $requestData = $this->setDefaultValues(
                    CurrencyRateApiMethod::METHOD_DEFAULT_VALUES,
                    $requestData
                );

                if ($requestData['currency_to'] === $requestData['currency_from'] || $requestData['currency_from'] === 'USD') {
                    Log::error(self::ERRORS_TEXTS_CURRENCIES_DIFFERENCE);
                    throw new ValidatorErrors(self::ERRORS_TEXTS_CURRENCIES_DIFFERENCE, 611);
                }

                if ($requestData['rate'] <= 0) {
                    Log::error(self::ERRORS_TEXTS_RATE_SHOULD_BE_POSITIVE);
                    throw new ValidatorErrors(self::ERRORS_TEXTS_RATE_SHOULD_BE_POSITIVE, 612);
                }

                break;

            case AccountApiMethod::getApiMethodName():

                $this->checkObligatoryFields(
                    AccountApiMethod::METHOD_OBLIGATORY_FIELDS,
                    $request->keys()
                );

                $requestData = $this->setDefaultValues(
                    AccountApiMethod::METHOD_DEFAULT_VALUES,
                    $requestData
                );

                $currenciesList = Currency::all()->pluck('id','code')->toArray();
                if(!in_array($requestData['currency_code'], array_keys($currenciesList))){
                    Log::error(self::ERRORS_TEXTS_NO_CURRENCY);
                    throw new ValidatorErrors(self::ERRORS_TEXTS_NO_CURRENCY, 621);
                }

                $requestData['currency_id'] = $currenciesList[$requestData['currency_code']];

                $countriesList = Country::all()->pluck('code')->toArray();
                if(!in_array($requestData['country_code'], $countriesList)){
                    Log::error(self::ERRORS_TEXTS_NO_COUNTRY);
                    throw new ValidatorErrors(self::ERRORS_TEXTS_NO_COUNTRY, 622);
                }

                $cityOfCountry = City::find($requestData['city_id']);

                if(!$cityOfCountry || $cityOfCountry->country_code !== $requestData['country_code']) {
                    Log::error(self::ERRORS_TEXTS_NO_COUNTRY);
                    throw new ValidatorErrors(self::ERRORS_TEXTS_NO_COUNTRY, 623);
                }

                $request->validate(['email'=>'email']);


                break;

            case TransactionApiMethod::getApiMethodName():

                $this->checkObligatoryFields(
                    TransactionApiMethod::METHOD_OBLIGATORY_FIELDS,
                    $request->keys()
                );

                $requestData = $this->setDefaultValues(
                    TransactionApiMethod::METHOD_DEFAULT_VALUES,
                    $requestData
                );

                $keysDiffTypeDeposit = array_diff(['currency_from'],$request->keys());
                $keysDiffTypeTransaction = array_diff(['wallet_from'],$request->keys());

                if(count($keysDiffTypeDeposit) && count($keysDiffTypeTransaction)){
                    $msg = sprintf(self::ERRORS_TEXTS_NO_TYPE_DETERMINED, 'currency_from', 'wallet_from');
                    Log::error($msg);
                    throw new ValidatorErrors($msg, 631);
                }

                $requestData['type'] = count($keysDiffTypeDeposit) ?
                    Transaction::TRANSACTION_TYPE_WALLETS_TRANSACTION :
                    Transaction::TRANSACTION_TYPE_DEPOSIT;

                Log::debug('>>>>', [$requestData, $request->all()]);
                break;

        }

        return $requestData;
    }
}