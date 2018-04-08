<?php

use Illuminate\Database\Seeder;

class WalletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('wallets')->delete();

        DB::table('wallets')->insert([[
            'user_id' => 0,
            'currency_id' => 1,
            'amount' => 0,
        ]]);
    }
}
