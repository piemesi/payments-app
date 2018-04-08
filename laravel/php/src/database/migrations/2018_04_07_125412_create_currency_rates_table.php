<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCurrencyRatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('currency_rates', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->string('currency_from', 3);
            $table->string('currency_to', 3);
            $table->enum('source', ['CUSTOM','CBR','FOREX'])->default('CUSTOM');
            $table->unsignedBigInteger('rate')->default(0);
            $table->unsignedTinyInteger('exponent')->default(0);
            $table->timestamps();

            $table->index(['currency_from', 'currency_to', 'created_at'])->unique();
            $table->foreign('currency_from')->references('code')->on('currencies')
                ->onUpdate('cascade');
            $table->foreign('currency_to')->references('code')->on('currencies')
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
        Schema::dropIfExists('currency_rates');
    }
}
