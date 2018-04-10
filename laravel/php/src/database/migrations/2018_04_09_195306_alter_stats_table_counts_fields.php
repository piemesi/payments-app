<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterStatsTableCountsFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('stats', function (Blueprint $table) {
            $table->unsignedBigInteger('confirmed_amount')->default(0);
            $table->unsignedBigInteger('declined_amount')->default(0);
            $table->unsignedBigInteger('deposit_amount')->default(0);
            $table->unsignedBigInteger('transfered_amount')->default(0);
            $table->unsignedBigInteger('total_amount')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('stats', function (Blueprint $table) {
            $table->dropColumn([
                'confirmed_amount',
                'deposit_amount',
                'declined_amount',
                'transfered_amount',
                'total_amount'
            ]);
        });
    }
}
