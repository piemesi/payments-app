<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWalletsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('wallets', function (Blueprint $table) {
            $table->unsignedBigInteger('id', true);
            $table->unsignedBigInteger('user_id');
            $table->integer('currency_id');
            $table->unsignedBigInteger('amount')->default(0);
            $table->timestamps();

            $table->index('user_id');

            $table->foreign('user_id')->references('id')->on('users')
                ->onUpdate('cascade');
            $table->foreign('currency_id')->references('id')->on('currencies')
                ->onUpdate('cascade');

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('wallets');
    }
}
