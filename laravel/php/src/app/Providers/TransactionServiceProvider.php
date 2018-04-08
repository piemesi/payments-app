<?php

namespace App\Providers;

use App\Service\ApiMethod\TransactionApiMethod;
use App\Service\Validator\ValidatorService;
use Illuminate\Support\ServiceProvider;

class TransactionServiceProvider extends ServiceProvider
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
        $this->app->bind(TransactionApiMethod::class, function ($app) {
            return new TransactionApiMethod(new ValidatorService());
        });
    }
}
