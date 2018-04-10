<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStatItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stat_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedBigInteger('transaction_id');
            $table->unsignedBigInteger('stat_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('amount')->default(0);
            $table->unsignedBigInteger('amount_usd')->default(0);
            $table->string('wallet_currency_code', 3)->nullable();
            $table->string('currency_from', 3);
            $table->unsignedBigInteger('wallet_id'); // user wallet_id which enroll/withdraw transaction
            $table->unsignedBigInteger('wallet_from')->nullable();
            $table->string('wallet_from_currency',3)->nullable();
            $table->unsignedBigInteger('user_from');
            $table->string('user_from_name');
            $table->string('user_from_email');
            $table->unsignedBigInteger('user_to');
            $table->string('user_to_name');
            $table->string('user_to_email');
            $table->enum('type', ['deposit', 'transaction'])->default('deposit');
            $table->string('status')->nullable();
            $table->dateTime('confirmed')->nullable();
            $table->dateTime('created_at')->nullable();

            $table->index('stat_id');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stat_items');
    }
}
