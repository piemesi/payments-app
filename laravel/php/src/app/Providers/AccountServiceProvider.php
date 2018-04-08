<?php

namespace App\Providers;

use App\Service\ApiMethod\AccountApiMethod;
use App\Service\Validator\ValidatorService;
use Illuminate\Support\ServiceProvider;

class AccountServiceProvider extends ServiceProvider
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
        $this->app->bind(AccountApiMethod::class, function ($app) {
            return new AccountApiMethod(new ValidatorService());
        });
    }
}
