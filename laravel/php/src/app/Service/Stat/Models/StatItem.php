<?php

namespace App\Service\Stat\Models;

use Illuminate\Database\Eloquent\Model;

class StatItem extends Model
{
    protected $table = 'stat_items';

    protected $fillable = [
        "transaction_id",
        "user_id",
        "amount",
        "amount_usd",
        "wallet_from",
        "currency_from",
        "user_from",
        "user_from_name",
        "user_from_email",
        "user_to",
        "user_to_name",
        "user_to_email",
        "type",
        "status",
        "confirmed",
        "created_at",
        "wallet_from_currency",
        "wallet_currency_code",
        "wallet_id",
    ];
}
