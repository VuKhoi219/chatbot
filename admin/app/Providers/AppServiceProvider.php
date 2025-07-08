<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\MongoMusic;
use App\Observers\MongoMusicObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        MongoMusic::observe(MongoMusicObserver::class);
    }
}
