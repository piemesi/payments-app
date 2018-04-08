<?php

namespace App\Providers;

use App\Service\Validator\ValidatorService;
use App\Service\ApiMethod\CurrencyRateApiMethod;
use Illuminate\Support\ServiceProvider;

class CurrencyServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(CurrencyRateApiMethod::class, function ($app) {
            return new CurrencyRateApiMethod(new ValidatorService());
        });
    }
}
