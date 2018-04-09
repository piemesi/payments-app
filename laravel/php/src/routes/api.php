<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/countries', "ApiController@countries")->name('countries');
Route::get('/cities', "ApiController@cities")->name('cities');
Route::get('/currencies', "ApiController@currencies")->name('currencies');

//Route::post('/sign-in', "ApiController@register")->name('sign-in');

Route::post('/currency-rate', "ApiController@currencyRate")->name('currency-rate');
Route::get('/currency-rate', "ApiController@getCurrencyRates")->name('get-currency-rates');
Route::post('/transaction', "ApiController@transaction")->name('transaction');

Route::apiResource('account', 'AccountController');
Route::get('account/{email}/check', 'AccountController@checkUserByEmail')->name('check-user-by-email');