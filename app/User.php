<?php

namespace App;

use Faker\Provider\DateTime;
use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

class User extends Model implements AuthenticatableContract,
                                    AuthorizableContract,
                                    CanResetPasswordContract
{
    use Authenticatable, Authorizable, CanResetPassword;

    const ROLE_STUDENT = 1;
    const ROLE_POSITION_EMPLOYEE = 2;
    const ROLE_ADMIN = 3;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['first_name', 'last_name', 'index_number', 'phone', 'email', 'password', 'role', 'activation_token'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token', 'activation_token'];

    public function slots()
    {
        return $this->hasMany(Slot::class);
    }

    public function isPositionEmployee()
    {
        return $this->role === self::ROLE_POSITION_EMPLOYEE;
    }

    public static function getEmployees()
    {
        return User::where('role', self::ROLE_POSITION_EMPLOYEE)->get();
    }

    public function positions()
    {
        return $this->belongsToMany(Position::class, 'positions_users', 'user_id', 'position_id');
    }

    public function doesBelongTo(Position $position)
    {
        return PositionsUser::where('position_id', $position->id)->where('user_id', $this->id)->count() > 0;
    }
}
