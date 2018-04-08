<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('currencies')->delete();

        DB::table('currencies')->insert([[
            'code' => 'RUB',
            'code_number' => 643,
        ],[
            'code' => 'EUR',
            'code_number' => 978,
        ],[
            'code' => 'USD',
            'code_number' => 840,
        ],[
            'code' => 'GBP',
            'code_number' => 826,
        ],[
            'code' => 'JPY',
            'code_number' => 392,
        ],[
            'code' => 'CHF',
            'code_number' => 756,
        ],[
            'code' => 'CNY',
            'code_number' => 757,
        ]]);
    }
}
