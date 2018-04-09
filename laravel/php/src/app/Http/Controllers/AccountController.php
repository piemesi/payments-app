<?php

namespace App\Http\Controllers;

use App\Service\Account\Models\UserModel;
use App\Service\Account\Models\Wallet;
use App\Service\ApiMethod\AccountApiMethod;
use App\User;
use Illuminate\Http\Request;

class AccountController extends Controller
{

    protected $wallet;

    public function __construct(Wallet $wallet)
    {
        $this->wallet = $wallet;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = UserModel::with('wallets')->get();



        return response()->json([
            'status' => 'success',
            'response' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param AccountApiMethod $account
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(AccountApiMethod $account, Request $request)
    {
        if ($account->validateRequest($request)) {
            $account->processRequest();
        }

        return response()->json([
            'status' => $account->getStatus(),
            'case' => $account->getCase(),
            'response' => $account->getMessage()
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\User $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {

    }

    /**
     * Temporary method for pseudo auth (we need just email)
     * @param AccountApiMethod $account
     * @param Request $request
     * @param $email
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkUserByEmail(AccountApiMethod $account, Request $request, $email)
    {
        $user = UserModel::where(['email' => $email])->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'response' => 'No such user by email'
            ]);
        }

        return response()->json([
            'status' => 'success',
            'response' => $account->getAccountByUser($user)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\User $user
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\User $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\User $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        //
    }
}
