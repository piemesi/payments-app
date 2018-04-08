<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->string('hash');
            $table->char('currency_from', 3);
            $table->char('currency_to', 3);
            $table->unsignedBigInteger('wallet_from')->default(0);
            $table->unsignedBigInteger('wallet_to');
            $table->unsignedBigInteger('amount_from');
            $table->unsignedBigInteger('amount_to');
            $table->unsignedBigInteger('amount_usd');
            $table->string('currency_rates_val', 10)->nullable();
            $table->enum('type', ['deposit', 'transaction'])->default('deposit');
            $table->enum('status', ['processing', 'confirmed', 'declined'])->default('processing');
            $table->dateTime('confirmed')->nullable();

            $table->index('hash');
            $table->index('confirmed');
            $table->index('status');
            $table->index('type');
            $table->index('created_at');
            $table->index('wallet_from')->nullable();
            $table->index('wallet_to');

            $table->index(['wallet_from','confirmed']);
            $table->index(['wallet_to','confirmed']);

            $table->foreign('currency_from')->references('code')->on('currencies')
                ->onUpdate('cascade');
            $table->foreign('currency_to')->references('code')->on('currencies')
                ->onUpdate('cascade');

            $table->foreign('wallet_from')->references('id')->on('wallets')
                ->onUpdate('cascade');
            $table->foreign('wallet_to')->references('id')->on('wallets')
                ->onUpdate('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transactions');
    }
}
