<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Stand extends Model
{
    protected $visible = [
        'id',
        'name',
        'description',
        'user'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
