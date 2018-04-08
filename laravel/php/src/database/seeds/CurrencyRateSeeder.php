<?php

use Illuminate\Database\Seeder;

class CurrencyRateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('currency_rates')->delete();

        DB::table('currency_rates')->insert([[
            'currency_from' => 'USD',
            'currency_to' => 'USD',
            'rate' => 10000,
            'exponent' => 4,
            'created_at' => \Carbon\Carbon::now(),
            'updated_at' => \Carbon\Carbon::now(),
        ]]);
    }
}
