<?php

namespace App\Jobs;

use App\Service\Stat\Models\Stat;
use App\Service\Stat\StatService;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;

class CSVTask implements ShouldQueue
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

    /**
     * @var Stat
     */
    protected $stat;

    /**
     * CSVTask constructor.
     * @param Stat $stat
     */
    public function __construct(Stat $stat)
    {
        $this->stat = $stat;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Log::debug("starting handling CSV task...");
        try{
            $statService = new StatService();
            $statService->prepareCSV($this->stat);
        }catch (\Exception $exception) {
            Log::error("error handling CSV task...",[
                $exception->getMessage(),
                $exception->getLine()
            ]);
        }
    }
}
