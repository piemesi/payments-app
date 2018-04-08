<?php

namespace App\Jobs;

use App\Service\Account\AccountErrors;
use App\Service\ApiMethod\TransactionApiMethod;
use App\Service\Transaction\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ConfirmTransactionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of seconds the job can run before timing out.
     *
     * @var int
     */
    public $timeout = 20;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 5;

    protected $transactionHash;

    /**
     * Create a new job instance.
     *
     * @param string $hash
     */
    public function __construct(string $hash)
    {
        $this->transactionHash = $hash;
    }

    /**
     * Execute the job.
     * @param TransactionApiMethod $transactionApiMethod
     * @return bool
     * @throws JobErrors
     */
    public function handle(TransactionApiMethod $transactionApiMethod)
    {
        DB::beginTransaction();
        try {

            $transaction = Transaction::where(['hash' => $this->transactionHash])->first();
            if (!$transaction) {
                Log::info('Nothing to process in transaction', [$this->transactionHash]);
                return true;
            }

            $transactionApiMethod->confirmTransaction($transaction);
            DB::commit();
            Log::info('Confirm transaction Job successfully done');
        } catch (AccountErrors $accountErrors) {
            Log::warning('Account error while handling confirm transaction Job', [
                $accountErrors->getMessage(),
                $accountErrors->getCode(),
                $accountErrors->getLine()
            ]);
            DB::rollBack();

            $transaction = Transaction::where(['hash' => $this->transactionHash])->first();
            $transaction->status = Transaction::TRANSACTION_STATUS_DECLINED;
            $transaction->save(); // @toDo to optimize

            Log::info('We decline transaction no funds enough', [$transaction->id]);
            return true;

        } catch (\Exception $exception) {
            Log::error('Error while handling confirm transaction Job', [
                $exception->getMessage(),
                $exception->getCode(),
                $exception->getLine()
            ]);

            DB::rollBack();

            throw new JobErrors();
        }
    }
}
