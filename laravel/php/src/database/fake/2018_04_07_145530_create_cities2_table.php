<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCities2Table extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cities2', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('title');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('country_id');

            $table->timestamps();

            $table->index('country_id');

            $table->foreign('country_id')->references('id')->on('countries')
                ->onUpdate('cascade');
            $table->foreign('user_id')->references('id')->on('users')
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
        Schema::dropIfExists('cities2');
    }
}
