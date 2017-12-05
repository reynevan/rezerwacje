<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Slot extends Model
{

    protected $fillable = ['year', 'week', 'day', 'time', 'stand_id', 'details', 'day_index'];

    protected $hidden = ['created_at' , 'updated_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function stand()
    {
        return $this->belongsTo(Stand::class);
    }

    public function addReservationNumberColumn()
    {
        $index = str_pad($this->day_index, 3, '0', STR_PAD_LEFT);
        $reservationNumber = $this->stand_id . '/' . $this->week . $this->day . '/' . $index;
        $this->setAttribute('reservation_number', $reservationNumber);

        return $this;
    }

    public function formatTime()
    {
        $this->time = date("H:i", strtotime($this->time));
        return $this;
    }

    public function addActiveColumn()
    {
        $this->active = $this->time <= (new \DateTime())->format('H:i');
        return $this;
    }

}
