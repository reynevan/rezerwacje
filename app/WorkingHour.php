<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkingHour extends Model
{
    public $fillable = ['start', 'end', 'day', 'position_id', 'open'];

    public function formatTime()
    {
        $this->start = ['hour' => (new \DateTime($this->start))->format('H'), 'minute' => (new \DateTime($this->start))->format('i')];
        $this->end = ['hour' => (new \DateTime($this->end))->format('H'), 'minute' => (new \DateTime($this->end))->format('i')];
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }
}
