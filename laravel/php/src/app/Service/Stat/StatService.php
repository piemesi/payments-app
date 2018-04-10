<?php

namespace App\Service\Stat;

use App\Jobs\CSVTask;
use App\Service\Account\AccountService;
use App\Service\Stat\Models\Stat;
use App\Service\Stat\Models\StatItem;
use App\Service\Transaction\Models\Transaction;
use App\Service\Validator\HashHelper;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use League\Csv\Writer;
use League\Csv\Reader;

/**
 * Created by PhpStorm.
 * User: malgrat
 * Date: 07.04.18
 * Time: 20:58
 */
class StatService
{

    const CACHE_STAT_RESPONSE = 'STAT_RESPONSE_';
    const CHECK_CACHE = false;

    protected $csvPath;

    protected $account;

    public function __construct()
    {
        $this->account = new AccountService();
        $this->csvPath = config('app.csvpath');
    }

    /**
     * To prevent caching for data in future - for which can appear new transactions
     * @param $requestData
     * @return bool
     */
    private function checkCanStoreCache($requestData)
    {
        $dateTo = Carbon::createFromFormat('Y-m-d', $requestData['date_to']);
        return $dateTo->lt(Carbon::now()->addDays(-2));
    }


    private function checkHasData(array $requestData, bool $csv = false)
    {
        $cacheKey = self::CACHE_STAT_RESPONSE . $requestData['date_from'] . $requestData['date_to'] . $requestData['email'];
        if ($cacheResponse = Cache::get($cacheKey)) {
            Log::debug('We got prepared STAT response from cache');

            return $cacheResponse;
        }

        $preparedStat = Stat::where([
            'date_from' => $requestData['date_from'],
            'date_to' => $requestData['date_to'],
            'email' => $requestData['email'],
        ])->first();


        if ($preparedStat) {
            Log::debug('We found prepared STAT', [$preparedStat->id]);
            $statItems = StatItem::where(['stat_id' => $preparedStat->id])->get()->toArray();

            return $this->getResponse($requestData, $preparedStat, $statItems, $csv);
        }

        return null;
    }

    public function report(array $requestData)
    {
        $csv = $requestData['csv'] ?? false;

        if ($resp = $this->checkHasData($requestData, $csv)) {
            Log::debug('We get from cache');
            return $resp;
        }

        $account = $this->account->getAccountByEmail($requestData['email']);
        $userWalletsIds = array_column($account['wallets'], 'id');

        $transactions = Transaction::whereBetween(
            'created_at',
            [
                $requestData['date_from'],
                $requestData['date_to']
            ]
        )->where(function ($query) use ($userWalletsIds) {
            $query->whereIn('wallet_to', $userWalletsIds)
                ->orWhereIn('wallet_from', $userWalletsIds);
        })->with([
            'walletFrom.user',
            'walletTo.user',
            'walletTo.currency',
            'walletFrom.currency'
        ])->get()->toArray();

        $stat = new Stat();
        $stat->date_from = $requestData['date_from'];
        $stat->date_to = $requestData['date_to'];
        $stat->user_id = $account['id'];
        $stat->requested_by = 1;
        $stat->name = $account['name'];
        $stat->email = $account['email'];

        $stat->save();


        $walletsTotalIncome = [];
        $walletsTotalIncomeUSD = [];
        $walletsTotalOutcome = [];
        $walletsTotalOutcomeUSD = [];
        $reportItems = [];
        $totalTransactionsAmount = 0;
        $confirmedTransactionsAmount = 0;
        $declinedTransactionsAmount = 0;
        $transferedTransactionsAmount = 0;
        $depositsTransactionsAmount = 0;

        foreach ($transactions as $transaction) {
            $totalTransactionsAmount++;
            $reportItem = [
                'transaction_id' => $transaction['id'],
                'user_id' => $account['id'],
                'amount' => $transaction['amount_to'],
                'amount_usd' => $transaction['amount_usd'],
                'stat_id' => $stat->id,
                'wallet_from' => $transaction['wallet_from']['id'],
                'currency_from' => $transaction['currency_from'],
                'user_from' => $transaction['wallet_from']['user_id'],
                'user_from_name' => $transaction['wallet_from']['user']['name'],
                'user_from_email' => $transaction['wallet_from']['user']['email'],
                'user_to' => $transaction['wallet_to']['user_id'],
                'user_to_name' => $transaction['wallet_to']['user']['name'],
                'user_to_email' => $transaction['wallet_to']['user']['email'],
                'type' => $transaction['type'],
                'status' => $transaction['status'],
                'confirmed' => $transaction['confirmed'],
                'created_at' => $transaction['created_at'],
                'wallet_currency_code' => $transaction['wallet_to']['currency']['code'],
                'wallet_from_currency' => $transaction['wallet_from']['currency']['code'],
                'wallet_id' => $transaction['wallet_to']['id'],
            ];
            if (in_array($transaction['status'], [Transaction::TRANSACTION_STATUS_DECLINED,
                Transaction::TRANSACTION_STATUS_PROCESSING])) {

                if ($transaction['status'] === Transaction::TRANSACTION_STATUS_DECLINED) $declinedTransactionsAmount++;
                $reportItems[] = $reportItem;

                continue;
            }

            $confirmedTransactionsAmount++;

            if ($transaction['type'] === Transaction::TRANSACTION_TYPE_DEPOSIT) {
                $wId = $transaction['wallet_to']['id'];
                $walletsTotalIncome[$wId][] = $transaction['amount_to'];
                $walletsTotalIncomeUSD[$wId][] = $transaction['amount_usd'];

                $reportItem['wallet_currency_code'] = $transaction['wallet_to']['currency']['code'];
                $reportItem['wallet_id'] = $transaction['wallet_to']['id'];

                $reportItem['wallet_from'] = null;
                $reportItem['wallet_from_currency'] = null;

                $reportItems[] = $reportItem;
                $depositsTransactionsAmount++;
            }

            if ($transaction['type'] === Transaction::TRANSACTION_TYPE_WALLETS_TRANSACTION) {
                $reportItem['wallet_from'] = $transaction['wallet_from']['id'];
                $reportItem['wallet_from_currency'] = $transaction['wallet_from']['currency']['code'];

                $wId = $transaction['wallet_from']['id'];
                if (in_array($wId, $userWalletsIds)) {
                    $walletsTotalOutcome[$wId][] = $transaction['amount_from'];
                    $walletsTotalOutcomeUSD[$wId][] = $transaction['amount_usd'];

                    $reportItem['wallet_currency_code'] = $transaction['wallet_from']['currency']['code'];
                    $reportItem['wallet_id'] = $transaction['wallet_from']['id'];

                    $reportItems[] = $reportItem;
                }

                $wId = $transaction['wallet_to']['id'];
                if (in_array($wId, $userWalletsIds)) {
                    $walletsTotalIncome[$wId][] = $transaction['amount_to'];
                    $walletsTotalIncomeUSD[$wId][] = $transaction['amount_usd'];

                    $reportItem['wallet_currency_code'] = $transaction['wallet_to']['currency']['code'];
                    $reportItem['wallet_id'] = $transaction['wallet_to']['id'];

                    $reportItems[] = $reportItem;
                }

                $transferedTransactionsAmount++;
            }
        }

        $walletsGeneralData = [];
        $totalSaldoUSD = 0;
        foreach ($userWalletsIds as $wId) {
            $totalIncome = isset($walletsTotalIncome[$wId]) ? array_sum($walletsTotalIncome[$wId]) : 0;
            $totalOutcome = isset($walletsTotalOutcome[$wId]) ? array_sum($walletsTotalOutcome[$wId]) : 0;
            $totalIncomeUSD = isset($walletsTotalIncomeUSD[$wId]) ? array_sum($walletsTotalIncomeUSD[$wId]) : 0;
            $totalOutcomeUSD = isset($walletsTotalOutcomeUSD[$wId]) ? array_sum($walletsTotalOutcomeUSD[$wId]) : 0;

            $saldoUSD = $totalIncomeUSD - $totalOutcomeUSD;
            $totalSaldoUSD += $saldoUSD;
            $walletsGeneralData[$wId] = [
                'wallet_id' => $wId,
                'total_income' => $totalIncome,
                'total_outcome' => $totalOutcome,
                'total_income_usd' => $totalIncomeUSD,
                'total_outcome_usd' => $totalOutcomeUSD,
                'saldo' => $totalIncome - $totalOutcome,
                'saldo_usd' => $saldoUSD,
            ];
        }


        StatItem::insert($reportItems);

        $stat->total_sum = $totalSaldoUSD;
        $stat->wallets_data = json_encode($walletsGeneralData);
        $stat->confirmed_amount = $confirmedTransactionsAmount;
        $stat->deposit_amount = $depositsTransactionsAmount;
        $stat->transfered_amount = $transferedTransactionsAmount;
        $stat->declined_amount = $declinedTransactionsAmount;
        $stat->total_amount = $totalTransactionsAmount;

        $stat->save();

        return $this->getResponse($requestData, $stat, $reportItems, $csv);
    }

    private function getResponse($requestData, $stat, $item, $csv)
    {
        $response = [
            'stat' => $stat->toArray(),
            'stat_items' => $item
        ];

//        if ($csv) {
//            $this->exportCSV($stat);
//        }

        # Set the Job task
        CSVTask::dispatch($stat)->delay(Carbon::now()->addSecond());

        $cacheKey = self::CACHE_STAT_RESPONSE . $requestData['date_from'] . $requestData['date_to'] . $requestData['email'];

        if ($this->checkCanStoreCache($requestData))
            Cache::put($cacheKey, $response, Carbon::now()->addHour());

        return $response;
    }

    public function prepareCSV(Stat $stat)
    {
        $statItems = StatItem::where(['stat_id' => $stat->id])->get()->toArray();
        $csv = Writer::createFromFileObject(new \SplTempFileObject());
        $csv->insertAll($statItems);
        $content = $csv->getContent();
        $path = str_replace('/', DIRECTORY_SEPARATOR, $this->csvPath) . DIRECTORY_SEPARATOR . $stat->id . '.csv';
//        $path = DIRECTORY_SEPARATOR. 'app'. DIRECTORY_SEPARATOR.'storage'. DIRECTORY_SEPARATOR   . $stat->id . '.csv';
        Log::debug('csvpath', [$path]);
        file_put_contents($path, $content);

        $stat->csv_path = $path;
        $stat->ready = Carbon::now();

        $stat->save();
    }

    /**
     * @param Stat $stat
     * @throws StatErrors
     */
    public function exportCSV(Stat $stat)
    {

        if (!$stat->csv_path) {
            throw new StatErrors('We have not prepared CSV file!');
        }

        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Description: File Transfer');
        header('Content-Disposition: attachment; filename="name-for-your-file.csv"');

        $reader = Reader::createFromPath($stat->csv_path);
        $reader->output("stat_{$stat->id}.csv");
        die;

    }

}