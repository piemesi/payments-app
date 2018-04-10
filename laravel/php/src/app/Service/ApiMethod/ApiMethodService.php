<?php
/**
 * Created by PhpStorm.
 * User: malgrat
 * Date: 07.04.18
 * Time: 21:12
 */

namespace App\Service\ApiMethod;

use App\Service\Validator\ValidatorService;
use App\Service\Validator\ValidatorErrors;
use Illuminate\Http\Request;

abstract class ApiMethodService
{
    /**
     * Обязательные поля, которые должны быть в методе апи
     */
    const METHOD_OBLIGATORY_FIELDS = [];

    /**
     * Значения по умолчанию для полей, если не переданы в запросе
     */
    const METHOD_DEFAULT_VALUES = [];

    protected $validator;
    protected $service = null;

    /**
     * @var null
     */
    private $status = null;
    private $case = null;

    protected $requestData = [];
    /**
     * @var string
     */
    private $message = '';

    /**
     * @var null
     */
    protected $serviceResponse = null;

    function __construct(ValidatorService $validator)
    {
        $this->validator = $validator;
        $this->setService();
    }

    /**
     * Check the validation of the request fields
     * @param Request $request
     * @param array $params
     * @return bool
     */
    public function validateRequest(Request $request, array  $params = []): bool
    {
        try {
            $this->requestData = $this->validator->check(static::getApiMethodName(), $request, $params);
            return true;
        } catch (ValidatorErrors $validatorErrors) {
            $this->status = 'error';
            $this->case = 'validation';
            $this->message = $validatorErrors->getMessage();
        } catch (\Exception $exception) {
            $this->status = 'error';
            $this->case = 'validation';
            $this->message = $exception->getMessage();
        }

        return false;
    }

    abstract public function process(array $requestData);

    public function processRequest()
    {
        try {
            $this->process($this->requestData);
            $this->status = 'success';
            $this->message = $this->serviceResponse;
            return true;
        } catch (ValidatorErrors $validatorErrors) {
            $this->status = 'error';
            $this->case = 'process';
            $this->message =  $validatorErrors->getMessage();
        } catch (\Exception $exception) {
            $this->status = 'error';
            $this->case = 'process';
            $this->message = $exception->getMessage();
        }catch (\Throwable $exception) {
            $this->status = 'fatal';
            $this->case = 'process';
            $this->message = $exception->getMessage();
        }

        return false;
    }

    public function getStatus()
    {
        return $this->status;
    }

    public function getCase()
    {
        return $this->case;
    }

    public function getMessage()
    {
        return $this->message;
    }

    abstract static public function getApiMethodName(): string;

    abstract protected function setService();

}