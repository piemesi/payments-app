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
            $table->unsignedBigInteger('stat_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('total_sum'); // ? stats
            $table->unsignedBigInteger('amount');
            $table->unsignedBigInteger('amount_usd');
            $table->string('currency_code', 3);
            $table->unsignedBigInteger('wallet_id'); // user wallet_id which enroll/withdraw transaction
            $table->unsignedBigInteger('wallet_from');
            $table->unsignedBigInteger('user_from');
            $table->string('user_from_name');
            $table->string('user_from_email');
            $table->enum('type', ['deposit', 'transaction'])->default('deposit');
            $table->string('status')->nullable();
            $table->dateTime('confirmed')->nullable();
            $table->dateTime('craeted_at')->nullable();

            $table->index('stat_id');

//            $table->foreign('stat_id')->reference('id')->on('stats')
//                ->onUpdate('cascade')->onDelete('cascade');


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
