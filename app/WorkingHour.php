<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkingHour extends Model
{
    public $fillable = ['start', 'end', 'day'];

    public function formatTime()
    {
        $this->start = (new \DateTime($this->start))->format('H:i');
        $this->end = (new \DateTime($this->end))->format('H:i');
    }
}
