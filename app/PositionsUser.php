<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PositionsUser extends Model
{
    protected $fillable = ['user_id', 'position_id'];
}
