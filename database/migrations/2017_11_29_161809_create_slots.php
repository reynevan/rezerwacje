<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSlots extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('slots', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->integer('week');
            $table->integer('year');
            $table->integer('day');
            $table->integer('position_id')->references('id')->on('positions')->onDelete('cascade');
            $table->time('time');
            $table->text('details')->nullable();
            $table->integer('day_index');
            $table->boolean('closed');
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
        Schema::drop('slots');
    }
}
