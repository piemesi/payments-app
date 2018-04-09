<?php

namespace App\Providers;

use App\Service\ApiMethod\StatApiMethod;
use App\Service\Validator\ValidatorService;
use Illuminate\Support\ServiceProvider;

class StatServiceProvider extends ServiceProvider
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
        $this->app->bind(StatApiMethod::class, function ($app) {
            return new StatApiMethod(new ValidatorService());
        });
    }
}
