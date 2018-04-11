<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPositionToWorkingHours extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('working_hours', function (Blueprint $table) {
            $table->integer('position_id')->references('positions')->on('id')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('working_hours', function (Blueprint $table) {
            $table->removeColumn('position_id');
        });
    }
}
