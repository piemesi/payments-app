<?php

namespace App\Service\Transaction\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionConfirmed extends Model
{
    protected $table='transactions_confirmed';

    protected $fillable = [
        'hash',
        'wallet_to',
        'wallet_from',
        'amount_from_update_state',
        'amount_to_update_state',
    ];
}
