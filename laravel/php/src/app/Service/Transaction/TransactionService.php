<?php

namespace App\Service\Transaction;

use App\Jobs\ConfirmTransactionJob;
use App\Providers\AccountServiceProvider;
use App\Service\Account\AccountService;
use App\Service\Account\Models\Wallet;
use App\Service\ApiMethod\AccountApiMethod;
use App\Service\Convertor\ConvertorService;
use App\Service\Currency\Models\Currency;
use App\Service\Transaction\Models\Transaction;
use App\Service\Transaction\Models\TransactionConfirmed;
use App\Service\Validator\ValidatorErrors;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;


/**
 * Created by PhpStorm.
 * User: malgrat
 * Date: 07.04.18
 * Time: 20:58
 */
class TransactionService
{

    const DEFAULT_SYSTEM_WALLET_ID = 1;

    const ERROR_MSG_CURRENCY_CONVERTOR = 'Convert service error. Seems we do not have necessary currency rates [%s,%s]';

    /**
     * @var Wallet
     */
    protected $walletTo = null;

    /**
     * @var Wallet
     */
    protected $walletFrom = null;

    /**
     * @var AccountService
     */
    protected $account = null;

    public function __construct()
    {
        $this->convertor = new ConvertorService();
        $this->account = new AccountService();
    }

    /**
     * Create a hash of transaction (primitive one) - just does not allow more than one similar transaction per minute
     *
     * @param $requestData
     * @return string
     */
    private function createHash($requestData)
    {
        return md5(json_encode($requestData) . Carbon::now()->toDayDateTimeString());
    }

    private function checkTransactionExists($hash)
    {
        if (Transaction::where(['hash' => $hash])->count()) {
            throw new ValidatorErrors(sprintf('We already have such transaction [%s]',
                $hash), 723);
        }
    }

    private function setWalletTo(array $requestData)
    {
        $this->walletTo = Wallet::find($requestData['wallet_to']);

        if (!$this->walletTo) throw new ValidatorErrors(sprintf('We have not found such wallet by id [%d]',
            $requestData['wallet_to']), 721);
    }

    private function setWalletFrom(array $requestData)
    {
        $this->walletFrom = Wallet::find($requestData['wallet_from']);

        if (!$this->walletFrom) throw new ValidatorErrors(sprintf('We have not found such wallet by id [%d]',
            $requestData['wallet_from']), 722);
    }

    public function createTransaction(array $requestData)
    {
        $this->setWalletTo($requestData);

        $requestData['hash'] = $this->createHash($requestData);
        $this->checkTransactionExists($requestData['hash']);

        if ($requestData['type'] === Transaction::TRANSACTION_TYPE_DEPOSIT) {
            $this->processDepositTransaction($requestData);
        } else {
            $this->setWalletFrom($requestData);
            $this->processWalletsTransaction($requestData);
        }
        Log::debug('>>!!!!!!!>>', [$requestData]);
    }

    /**
     * @param Wallet $wallet
     * @param array $requestData
     * @return array|null
     * @throws ValidatorErrors
     */
    private function getAmountTo(Wallet $wallet, array $requestData)
    {
        Log::debug('444444', [$requestData]);
        if ($wallet->currency->code === $requestData['currency_from'])
            return [$requestData['amount_from'], $requestData['amount_from']];

        Log::debug('5555555555', [$requestData]);
        $convertedValues = $this->convertor->convert(
            $requestData['amount_from'],
            $requestData['currency_from'],
            $wallet->currency->code
        );

        if (!$convertedValues) throw new ValidatorErrors(sprintf(self::ERROR_MSG_CURRENCY_CONVERTOR, $requestData['currency_from'],
            $wallet->currency->code), 724);

        return $convertedValues;
    }

    private function processDepositTransaction(array $requestData)
    {

        $transaction = new Transaction();
        $transaction->fill($requestData);

        $transaction->currency_to = $this->walletTo->currency->code;

        $transaction->wallet_from = self::DEFAULT_SYSTEM_WALLET_ID;
        list($transaction->amount_usd, $transaction->amount_to, $transaction->currency_rates_val) = $this->getAmountTo($this->walletTo, $transaction->toArray());

        Log::debug('77777777777', [$transaction, $requestData]);
        $transaction->save();

        if (!$transaction->id) throw new ValidatorErrors('Error while storing transaction into DB', 725);

        $this->dispatchConfirmTransactionJob($requestData['hash']);

    }

    private function dispatchConfirmTransactionJob(string $hash)
    {
        Log::info('Dispatching Job for confirm transaction for', [$hash]);
        ConfirmTransactionJob::dispatch($hash);
        Log::info('Dispatched for', [$hash]);
    }

    private function processWalletsTransaction(array $requestData)
    {
        $transaction = new Transaction();
        $transaction->fill($requestData);

        $transaction->currency_to = $this->walletTo->currency->code;
        $transaction->currency_from = $this->walletFrom->currency->code;
        Log::info('1111', [$transaction]);


        list($transaction->amount_usd, $transaction->amount_to,  $transaction->currency_rates_val) = $this->getAmountTo($this->walletTo,
            $transaction->toArray());


        Log::debug('999999999', [$transaction, $requestData]);
        $transaction->save();

        if (!$transaction->id) throw new ValidatorErrors('Error while storing transaction into DB', 727);

        $this->dispatchConfirmTransactionJob($requestData['hash']);
    }

    private function checkTransactionType(string $type)
    {
        if (!in_array($type, [Transaction::TRANSACTION_TYPE_DEPOSIT, Transaction::TRANSACTION_TYPE_WALLETS_TRANSACTION]))
            throw new ValidatorErrors('Unknown Transaction Type!', 728);
    }

    public function confirmTransaction(Transaction $transaction)
    {
        Log::debug('Confirming transaction..', [$transaction->toArray()]);
        $confirmedTransaction = new TransactionConfirmed();

        $this->checkTransactionType($transaction->type);

        if ($transaction->type === Transaction::TRANSACTION_TYPE_DEPOSIT) {
            $wallet = $this->account->enrollAmount($transaction->wallet_to, $transaction->amount_to);

            $confirmedTransaction->fill($transaction->toArray());
            $confirmedTransaction->amount_to_update_state = $wallet->amount;
            $confirmedTransaction->amount_from_update_state = 0; // @toDo nullable
            $confirmedTransaction->save();
            Log::debug('$confirmedTransaction', [$confirmedTransaction]);

        } else {
            $walletOut = $this->account->enrollAmount($transaction->wallet_from, $transaction->amount_from, true);
            $walletIn = $this->account->enrollAmount($transaction->wallet_to, $transaction->amount_to);

            $confirmedTransaction->fill($transaction->toArray());
            $confirmedTransaction->amount_to_update_state = $walletIn->amount;
            $confirmedTransaction->amount_from_update_state = $walletOut->amount;
            $confirmedTransaction->save();
        }

        $transaction->confirmed = Carbon::now();
        $transaction->status = Transaction::TRANSACTION_STATUS_CONFIRMED;
        $transaction->save();

        Log::debug('Transaction confirmed', [$transaction->id, $confirmedTransaction->id]);
    }

}