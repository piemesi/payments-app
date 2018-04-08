<?php

namespace App\Service\Currency\Models;

use Illuminate\Database\Eloquent\Model;

class CurrencyRate extends Model
{
    protected $fillable = [
        'currency_from',
        'currency_to',
        'source',
        'rate',
        'exponent',
    ];

}
