<?php

namespace App\Service\Convertor;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ConvertorService
{
    protected $lastRates = [];

    public function __construct()
    {
        $lastRates = DB::select("
                SELECT *
                FROM (
                    SELECT id, exponent, currency_from, created_at, currency_to, rate,
                    rank() OVER (PARTITION BY currency_from ORDER BY created_at DESC) AS r
                FROM currency_rates
                WHERE created_at IS NOT NULL
                ) AS dt
                WHERE r = 1");

        foreach ($lastRates as $key => $value) {
            $this->lastRates[$value->currency_from] = $value;
        }

        Log::debug('LR', [$this->lastRates]);
    }

    public function convert($amount, $from, $to)
    {
        Log::debug("Begin converting... ", [$from, $to, $amount]);
        if (!isset($this->lastRates[$from]) || !isset($this->lastRates[$to])) return null;

        $USDEquivalent = ($amount / ($this->lastRates[$from]->rate / pow(10, $this->lastRates[$from]->exponent)));
        $TOEquivalent = $USDEquivalent * ($this->lastRates[$to]->rate / pow(10, $this->lastRates[$to]->exponent));

        Log::debug(" converted =   ", [$USDEquivalent, $TOEquivalent, round($amount / $TOEquivalent, 2)]);
        return [(int)$USDEquivalent, (int)$TOEquivalent, round($amount / $TOEquivalent, 2)];
        // @toDo проверить с учетом расчета экспаненты отличной от 4х (при сохранении в currency_rates - курс указан в целых с указанием экспоненты - pow(10, exponnet*-1);
    }

    public function getLastRates()
    {
        return $this->lastRates;
    }
}