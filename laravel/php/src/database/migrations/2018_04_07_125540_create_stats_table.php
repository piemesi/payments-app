<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stats', function (Blueprint $table) {
            $table->unsignedBigInteger('id', true);
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('requested_by');
            $table->string('csv_path')->nullable();
            $table->date('date_from')->nullable();
            $table->date('date_to')->nullable();
            $table->unsignedTinyInteger('ready')->default(0);
            $table->unsignedBigInteger('total_sum')->default(0); // общая сумма переводов в usd
            $table->json('wallets_data')->nullable(); // сводные данные по кошелкам пользвоателя
            $table->json('users_data')->nullable(); // сводные данные по данным других пользователей, кто сколько перевел
            $table->string('name');
            $table->string('email');

            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')
                ->onUpdate('cascade');
            $table->foreign('requested_by')->references('id')->on('users')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stats');
    }
}
