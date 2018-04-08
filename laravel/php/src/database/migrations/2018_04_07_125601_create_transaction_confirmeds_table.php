<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransactionConfirmedsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions_confirmed', function (Blueprint $table) {
            $table->increments('id');
            $table->string('hash');
            $table->unsignedBigInteger('wallet_from');
            $table->unsignedBigInteger('wallet_to');
            $table->unsignedBigInteger('amount_from_update_state')->nullable();
            $table->unsignedBigInteger('amount_to_update_state');
            $table->timestamps();

            $table->index('hash');

            $table->foreign('wallet_from')->references('id')->on('wallets')
                ->onUpdate('cascade');
            $table->foreign('wallet_to')->references('id')->on('wallets')
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
        Schema::dropIfExists('transactions_confirmed');
    }
}
