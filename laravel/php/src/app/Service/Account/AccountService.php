<?php

namespace App\Service\Account;

use App\Service\Validator\ValidatorErrors;
use Illuminate\Support\Facades\Log;


/**
 * Created by PhpStorm.
 * User: malgrat
 * Date: 07.04.18
 * Time: 20:58
 */
class AccountService
{
    const MAX_WALLETS_PER_USER = 5;
    const FORBID_NEGATIVE_WALLET_AMOUNT = true;

    public function createAccount(array $requestData)
    {
        $userAccount = Models\UserModel::firstOrCreate(['email' => $requestData['email']], $requestData);
        if ($userAccount->name !== $requestData['name'] ||
            $userAccount->country_code !== $requestData['country_code'] ||
            $userAccount->city_id !== $requestData['city_id']
        ) {
            $userAccount->fill($requestData);
            $userAccount->save();
        }

        $this->checkWalletsCountPerUser($userAccount->id);

        Models\Wallet::firstOrCreate([
            'user_id' => $userAccount->id,
            'currency_id' => $requestData['currency_id'],
        ], $requestData);
    }

    private function checkWalletsCountPerUser(int $userId)
    {
        $walletsCount = Models\Wallet::where(['user_id' => $userId])->count();
        if ($walletsCount > self::MAX_WALLETS_PER_USER)
            throw new ValidatorErrors(sprintf('Reached max amount of wallets for user [%d]',
                self::MAX_WALLETS_PER_USER), 711);
    }

    /**
     * Enroll/withdraw sum on account
     *
     * @param int $walletId
     * @param int $amount
     * @throws AccountErrors
     */
    public function enrollAmount(int $walletId, int $amount, bool $withdraw = false)
    {
        if ($withdraw) {
            $amount *= -1;
        }

        Log::debug('enrolling sum for Wallet', [$walletId, $amount]);
        $wallet = Models\Wallet::find($walletId);

        if (!$wallet) throw new AccountErrors(sprintf('Not such wallet [%d]', $walletId), 1012);

        $wallet->amount += $amount;

        if (self::FORBID_NEGATIVE_WALLET_AMOUNT && $wallet->amount < 0) throw new AccountErrors(
            sprintf('Negative amount on wallet [%d] is not allowed! now [%d]', $wallet->id, $wallet->amount - $amount), 1013);

        $wallet->save();
        Log::debug('Successfully enrolled');

        return $wallet;
    }

}