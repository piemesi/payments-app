<?php

namespace App\Service\Transaction\Models;

use App\Service\Account\Models\Wallet;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable =[
      'wallet_to',
      'wallet_from',
      'hash',
      'type',
      'currency_from',
      'currency_to',
      'amount_to',
      'amount_from',
      'amount_usd',
      'currency_rates_val',
      'confirmed',
    ];

    const TRANSACTION_STATUS_PROCESSING = 'processing',
        TRANSACTION_STATUS_CONFIRMED = 'confirmed',
        TRANSACTION_STATUS_DECLINED = 'declined';

    const TRANSACTION_TYPE_DEPOSIT = 'deposit',
        TRANSACTION_TYPE_WALLETS_TRANSACTION = 'transaction';

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function walletFrom()
    {
        return $this->belongsTo(Wallet::class, 'wallet_from');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function walletTo()
    {
        return $this->belongsTo(Wallet::class, 'wallet_to');
    }

}
