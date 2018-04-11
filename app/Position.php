<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    protected $visible = [
        'id',
        'name',
        'description',
        'users',
        'checked',
        'reservations',
        'working_hours'
    ];

    protected $fillable = [
        'name',
        'description'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'positions_users', 'position_id', 'user_id');
    }

    public function working_hours()
    {
        return $this->hasMany(WorkingHour::class);
    }
}
