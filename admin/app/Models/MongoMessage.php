<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Model;
use MongoDB\Laravel\Eloquent\Model;

class MongoMessage extends Model
{
    //
    protected $connection = 'mongodb';
    protected $collection = 'messages';
    protected $fillable = [
        'conversation_id',
        'content',
        'sender',
        'emotion',
        'timestamp'
    ];
            // Debug method
    public function getTable()
    {
        \Log::info('Model using collection: ' . $this->collection);
        return $this->collection;
    }
    protected $primaryKey = '_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        '_id' => 'string',
        'conversation_id' => 'string',
    ];
    public function conversation()
    {
        // Đảm bảo foreign key đúng
        return $this->belongsTo(MongoConversation::class, 'conversation_id', '_id');
    }
}
