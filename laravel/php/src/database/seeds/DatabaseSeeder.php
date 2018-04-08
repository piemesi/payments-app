<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(\Alakkad\WorldCountriesCities\CitiesSeeder::class);
        $this->call(\Alakkad\WorldCountriesCities\CountriesSeeder::class);
        $this->call(CurrencySeeder::class);
        $this->call(UsersSeeder::class);
        $this->call(WalletSeeder::class);
        $this->call(CurrencyRateSeeder::class);
    }
}
