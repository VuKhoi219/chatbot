<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class MongoUser extends Model
{
    //
    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'name',
        'email',
        'hashedPassword',
        'age',
        'gender',
        'role',
    ];
    // Debug method
    public function getTable()
    {
        \Log::info('Model using collection: ' . $this->collection);
        return $this->collection;
    }
    // Sử dụng mutator thay vì boot() cho đơn giản hơn
    public function setHashedPasswordAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['hashedPassword'] = password_hash($value, PASSWORD_BCRYPT, ['cost' => 10]);
        }
    }

    // Hoặc nếu muốn dùng boot() method
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (isset($user->hashedPassword) && !empty($user->hashedPassword)) {
                $user->hashedPassword = password_hash($user->hashedPassword, PASSWORD_BCRYPT, ['cost' => 10]);
            }
        });

        static::updating(function ($user) {
            if ($user->isDirty('hashedPassword') && !empty($user->hashedPassword)) {
                $user->hashedPassword = password_hash($user->hashedPassword, PASSWORD_BCRYPT, ['cost' => 10]);
            }
        });
    }
    public function conversations()
    {
        return $this->hasMany(Conversation::class, 'user_id');
    }
}
