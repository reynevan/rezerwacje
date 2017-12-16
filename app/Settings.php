<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    const SLOT_LENGTH_DEFAULT = 15;

    public $fillable = ['slot_length'];

    public static function get()
    {
        $settings = Settings::first();
        if (!$settings) {
            $settings = Settings::create(
                ['slot_length' => self::SLOT_LENGTH_DEFAULT]
            );
        }

        return $settings;
    }

    public function getSlotLength()
    {
        return $this->slot_length ? $this->slot_length : self::SLOT_LENGTH_DEFAULT;
    }
}
