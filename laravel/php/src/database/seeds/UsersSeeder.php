<?php

use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->delete();

        DB::table('users')->insert([[
            'name' => 'default admin',
            'id' => 0,
            'email' => 'admin@admin.ru',
            'password' => 123456,
            'city_id' => 3580,
        ]]);
    }
}
